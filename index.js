var JumbleMaps = {
  registerMap: function (name, map) {
    this[name] = map;
  }
};

function Map(name) {
  this.name = name;
  this.$map = {};
}

Map.prototype.addProperty = function (name, type, typename) {
  this.$map[name] = {
    type: type || 'plain',
    ref: typename || 'string'
  };
};

function convert(type, value, defaultValue) {
  switch (type) {
  case 'string':
    return '' + (value || defaultValue);
  case 'int':
    return (value === '') ? (defaultValue || undefined) : parseInt(value, 10);
  case 'float':
    return (value === '') ? (defaultValue || undefined) : parseFloat(value);
  case 'bool':
    return value || (defaultValue || false);
  }
}

function serializeObject(map) {
  return function (obj) {
    var prop, output = '',
      fields = [];
    for (prop in map.$map) {
      if (map.$map[prop].type === 'plain') {
        fields.push(obj[prop]);
      } else {
        fields.push(serializeObject(obj[prop], JumbleMaps[map.$map[prop]].ref));
      }
    }
    output += fields.join(',');
    return '{' + output + '}';
  }
}

function deserializeObject(map) {
  return function (input) {
    var prop, obj = '',
      fields = [];
    for (prop in map.$map) {
      if (map.$map[prop].type === 'plain') {
        output[prop] = obj
      }
    }
  }
}


var testMap = new Map('person');
testMap.addProperty('name');
testMap.addProperty('age');

var p = {
    name: 'joe',
    age: 21
  },
  serializePerson = serializeObject(testMap);
console.log(serializePerson(p));
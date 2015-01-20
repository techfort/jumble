module.exports = (function () {
  // shortcut method
  var c = String.fromCharCode;

  // registry of maps
  var JumbleMaps = {
    registerMap: function (map) {
      this[map.name] = map;
    }
  };

  // Map constructor containing a name and the map itself
  function Map(name) {
    this.name = name;
    this.$map = {};
  }

  // allows to expose direct chaining of .addProperty calls after instantiation
  function createMap(name) {
    return new Map(name);
  }

  // adds a property to the map
  /**
   * addProperty - adds a property to the map
   * @param name {string} name of the property
   * @param type {string} defines whether the property is a plain value (including an array)
   * @param ref {string} can be one of string|int|float|bool|array|objectarray
   */
  Map.prototype.addProperty = function (name, type, ref) {
    this.$map[name] = {
      type: type || 'plain',
      ref: ref || 'string'
    };
    return this;
  };

  function convertField(type, value, map) {
    switch (type) {
    case 'array':
      return value.join(c(0x0004));
    case 'objectarray':
      return serializeArray(map)(value);
    case 'string':
      return value ? ('' + value) : undefined;
    case 'int':
      return (value === '') ? undefined : parseInt(value, 10);
    case 'float':
      return (value === '') ? undefined : parseFloat(value);
    case 'bool':
      return value || false;
    }
  }

  function deserializeField(type, value, map) {
    switch (type) {
    case 'array':
      return value.split(c(0x0004));
    case 'objectarray':
      var output = '',
        deserializer = deserializeObject(map);
      return deserializeArray(deserializer(value));
    case 'string':
      return value ? ('' + value) : defaultValue || undefined;
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
      var prop,
        fields = [];
      for (prop in map.$map) {
        if (map.$map[prop].type === 'plain') {
          fields.push(obj ? convertField(map.$map[prop].ref, obj[prop]) || '' : undefined);
        } else {
          fields.push(serializeObject(JumbleMaps[prop])(obj[prop]));
        }
      }
      return fields.join(c(0x0003));
    }
  }

  function deserializeObject(map) {
    return function (input) {
      var fields = input.split(c(0x0003)),
        prop,
        obj = {};

      for (prop in map.$map) {
        if (map.$map[prop].type === 'plain') {
          var field = fields.shift();
          obj[prop] = deserializeField(map.$map[prop].ref, field);
        } else {
          obj[prop] = deserializeObject(JumbleMaps[prop])(fields.join(c(0x0003)));
        }
      }
      return obj;
    }
  }

  function serializeArray(serializer) {
    return function (array) {
      var output = [];
      array.forEach(function (obj) {
        output.push(serializer(obj));
      });
      return output.join(c(0x0005));
    };
  }

  function deserializeArray(deserialize) {
    return function (input) {
      var objects = input.split(c(0x0005)),
        result = [];
      objects.forEach(function (obj) {
        result.push(deserialize(obj));
      });
      return result;
    }
  }

  return {
    maps: JumbleMaps,
    createMap: createMap,
    serializeObject: serializeObject,
    serializeArray: serializeArray,
    deserializeObject: deserializeObject
  };
})();
var jumble = require('./index');

var addressMap = jumble.createMap('address')
  .addProperty('country')
  .addProperty('city')
  .addProperty('street');


var personMap = jumble.createMap('person')
  .addProperty('name')
  .addProperty('active', 'plain', 'bool')
  .addProperty('age', 'plain', 'int')
  .addProperty('numbers', 'plain', 'array')
  .addProperty('address', 'map', addressMap);

jumble.maps.registerMap(personMap);
jumble.maps.registerMap(addressMap);

var p = {
    name: 'joe',
    active: true,
    age: 21,
    numbers: ['0876936712', '0879064505'],
    address: {
      country: 'ireland',
      city: 'cork',
      street: 'boreenmanna road'
    }
  },
  q = {
    name: 'rowena',
    active: true,
    age: 21,
    numbers: ['0876936712', '0879064505'],
    address: {
      country: 'ireland',
      city: 'cork',
      street: 'boreenmanna road'
    }
  },
  serializePerson = jumble.serializeObject(personMap),
  deserializePerson = jumble.deserializeObject(personMap),
  serializePersonArray = jumble.serializeArray(serializePerson);

console.log(serializePerson(p));
console.log(deserializePerson(serializePerson(p)));
console.log('comparing a 5 elements array:');
var jumble1 = serializePersonArray([p, q, p, p, q]).length,
  json1 = JSON.stringify([p, q, p, p, q]).length;
console.log('Jumble: ', jumble1);
console.log('JSON: ', json1);
console.log('Ratio: ', (json1 / jumble1 * 100).toFixed(2) + '%');
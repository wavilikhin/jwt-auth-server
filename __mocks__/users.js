const { hashSync } = require('bcryptjs');
module.exports = [
  { id: 1, name: 'Jeka', password: hashSync('test', 1234) },
  { id: 2, name: 'Sanek', password: hashSync('test', 5678) },
  { id: 3, name: 'Leha', password: hashSync('test', 9012) },
];

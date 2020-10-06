const { hashSync } = require('bcryptjs');
module.exports = [
  { id: 1, name: 'Jeka', password: hashSync(1234) },
  { id: 2, name: 'Sanek', password: hashSync(5678) },
  { id: 3, name: 'Leha', password: hashSync(9012) },
];

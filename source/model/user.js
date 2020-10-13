const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  id: { type: 'String', required: true },
  email: { type: 'String', required: true },
  password: { type: 'String', required: true },
});
const User = mongoose.model('User', userSchema);
module.exports = User;

// TODO: https://habr.com/ru/company/ruvds/blog/457860/
//  Убрать стравнения в методы схемы

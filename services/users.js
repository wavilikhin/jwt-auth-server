const users = require('../__mocks__/users');

exports.list = async () => {
  return users;
};

exports.find = async (key, value) => {
  const result = [];

  users.forEach((user) => {
    if (user[key] && user[key] === value) {
      result.push(user);
    }
  });

  return result;
};

exports.update = async (key, value, newValue) => {
  const entry = await find(key, value);

  if (entry) {
    Object.assign(entry, newValue);
  }
};

module.exports = {
  find,
  update,
  list,
};

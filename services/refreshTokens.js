const tokens = require('../__mocks__/refreshTokens');

exports.find = async (key, value) => {
  const result = [];

  tokens.forEach((token) => {
    if (token[key] && token[key] === value) {
      result.push(token);
    }
  });

  return result;
};

exports.add = async (entry) => {
  tokens.push(entry);
};

exports.remove = async (key, value) => {
  tokens.filter((token) => !token[key] === value);
};

module.exports = {
  find,
  add,
  remove,
};

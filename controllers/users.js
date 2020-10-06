const { find, list } = require('../services/users');

exports.listUsers = async (req, res) => {
  const users = await list();
  res.status(200).json(users);
};

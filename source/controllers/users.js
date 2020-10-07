const User = require('../model/user');

async function listUsers(req, res) {
  const users = await User.find({}).lean();
  return res.status(200).json(users);
}

async function findUser(req, res) {
  const { id } = req.params;
  const user = await User.findOne({ user_id: id }).lean();
  return res.status(200).json(user);
}

module.exports = { listUsers, findUser };

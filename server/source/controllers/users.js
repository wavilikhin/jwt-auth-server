const { User } = require(`../model/user`);

const { ErrorResponse } = require(`../helpers/errorResponse`);

async function listUsers(req, res) {
  const users = await User.find({}).lean();
  return res.status(200).json(users);
}

async function findUser(req, res, next) {
  const { id } = req.params;
  const user = await User.findOne({ id }).lean();

  if (!user) return next(new ErrorResponse(`NoEnt`, 404));

  return res.status(200).json(user);
}

module.exports = { listUsers, findUser };

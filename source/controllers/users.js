const User = require('../model/user');
const RefreshToken = require('../model/refreshTokens');

const ErrorResponse = require('../helpers/errorResponse');

async function listUsers(req, res) {
  const users = await User.find({}).lean();
  return res.status(200).json(users);
}

async function findUser(req, res, next) {
  const { id } = req.params;
  const user = await User.findOne({ user_id: id }).lean();

  if (!user) next(new ErrorResponse(`NoEnt`, 404));

  return res.status(200).json(user);
}

async function logOut(req, res) {
  const { id } = req.user;

  const refreshTokens = await RefreshToken.find({ user_id: id });

  if (refreshTokens) {
    console.log(refreshTokens.length);
    refreshTokens.forEach(async (token) => {
      await token.remove();
    });
  }

  return res.sendStatus(200);
}

module.exports = { listUsers, findUser, logOut };

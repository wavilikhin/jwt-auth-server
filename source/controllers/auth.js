const accessTokenSecret = require('../../config/jwt.config');
const RefreshToken = require('../model/refreshTokens');
const User = require('../model/user');

const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { compareSync } = require('bcryptjs');

async function issueTokenPair(userId) {
  const newRefreshToken = uuid();

  await new RefreshToken({
    user_id: userId,
    refresh_token: newRefreshToken,
  }).save();

  return {
    token: jwt.sign({ id: userId }, accessTokenSecret),
    refreshToken: newRefreshToken,
  };
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  await new User({
    id: 2,
    email: email,
    password: password,
  }).save();

  const user = await User.findOne({ email }).lean();

  console.log(user, password);
  // TODO: Test with compare sync
  if (!user || !password === user.password) {
    const error = new Error();
    error.status = 403;
    throw error;
  }

  const tokenPair = await issueTokenPair(user.id);

  return res.status(200).json(tokenPair);
}

module.exports = { loginUser };

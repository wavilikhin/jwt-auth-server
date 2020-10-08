const accessTokenSecret = require('../../config/jwt.config');
const RefreshToken = require('../model/refreshTokens');
const User = require('../model/user');

const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { compareSync, hashSync } = require('bcryptjs');

const validateEmail = require('../helpers/validateEmail');

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

async function signinUser(req, res) {
  const { email, password, confirmedPassword } = req.body;

  if (!email || !password || !confirmedPassword) {
    console.log('1');
    return res.sendStatus(403);
  }

  if (!validateEmail(email)) {
    console.log('2');
    return res.sendStatus(403);
  }

  const user = await User.findOne({ email }).lean();

  if (user) {
    console.log('3');
    return res.sendStatus(403);
  }

  if (!password === confirmedPassword) {
    console.log('4');
    return res.sendStatus(403);
  }

  const newUser = {
    id: uuid(),
    email,
    password: hashSync(password, 8),
  };

  await new User(newUser).save();

  return res.sendStatus(201);
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.sendStatus(403);
  }

  if (!validateEmail(email)) {
    return res.sendStatus(403);
  }

  const user = await User.findOne({ email }).lean();
  console.log(user);

  if (!user || !compareSync(password, user.password)) {
    // const error = new Error();
    // error.status = 403;
    // throw error;
    return res.sendStatus(404);
  }

  const tokenPair = await issueTokenPair(user.id);

  return res.status(200).json(tokenPair);
}

module.exports = { loginUser, signinUser };

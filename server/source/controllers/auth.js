const { accessTokenSecret, options } = require('../../config/jwt.config');
const RefreshToken = require('../model/refreshTokens');
const User = require('../model/user');

const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { compareSync, hashSync } = require('bcryptjs');

const { validateEmail } = require('../helpers/validateEmail');
const { ErrorResponse } = require('../helpers/errorResponse');

async function issueTokenPair(userId) {
  const newRefreshToken = uuid();

  await new RefreshToken({
    user_id: userId,
    refresh_token: newRefreshToken,
  }).save();

  return {
    token: jwt.sign({ id: userId }, accessTokenSecret, options),
    refreshToken: newRefreshToken,
  };
}

async function signinUser(req, res, next) {
  const { email, password, confirmedPassword } = req.body;

  if (!email || !password || !confirmedPassword) {
    return next(new ErrorResponse());
  }

  if (!validateEmail(email)) {
    return next(new ErrorResponse());
  }

  const user = await User.findOne({ email }).lean();

  if (user) {
    return next(new ErrorResponse());
  }

  if (!password === confirmedPassword) {
    return next(new ErrorResponse());
  }

  const newUser = {
    id: uuid(),
    email,
    password: hashSync(password, 8),
  };

  await new User(newUser).save();

  return res.sendStatus(201);
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse());
  }

  if (!validateEmail(email)) {
    return next(new ErrorResponse());
  }

  const user = await User.findOne({ email }).lean();

  if (!user || !compareSync(password, user.password)) {
    return next(new ErrorResponse('NoEnt', 404));
  }

  const tokenPair = await issueTokenPair(user.id);

  return res.status(200).json(tokenPair);
}

async function refresh(req, res, next) {
  const { refreshToken } = req.body;

  const dbToken = await RefreshToken.findOne({ refresh_token: refreshToken });

  if (!dbToken) {
    return next(new ErrorResponse('NoEnt', 404));
  }

  const tokenPair = await issueTokenPair(dbToken.user_id);
  await dbToken.remove();

  return res.status(200).json(tokenPair);
}

async function logOut(req, res) {
  const { id } = req.user;

  const refreshTokens = await RefreshToken.find({ user_id: id });

  if (refreshTokens) {
    refreshTokens.forEach(async (token) => {
      await token.remove();
    });
  }

  return res.sendStatus(200);
}

module.exports = { loginUser, signinUser, refresh, logOut };

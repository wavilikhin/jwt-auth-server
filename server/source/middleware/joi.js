const Joi = require(`joi`);
const { assert } = require(`joi`);
const { ErrorResponse } = require(`../helpers/errorResponse`);

const { signInSchema, logInSchema, refreshSchema } = require(`../model/joi`);

function assertSignIn(req, res, next) {
  try {
    assert(req.body, signInSchema);
  } catch (error) {
    next(new ErrorResponse(`JoiError`, 403));
  }
  next();
}
function assertLogIn(req, res, next) {
  try {
    assert(req.body, logInSchema);
  } catch (error) {
    next(new ErrorResponse(`JoiError`, 403));
  }
  next();
}
function assertRefresh(req, res, next) {
  try {
    assert(req.body, refreshSchema);
  } catch (error) {
    next(new ErrorResponse(`JoiError`, 403));
  }
  next();
}
function assertFindOne(req, res, next) {
  try {
    assert(req.params.id, Joi.string().guid());
  } catch (error) {
    next(new ErrorResponse(`JoiError`, 403));
  }
  next();
}

function assertLogOut(req, res, next) {
  try {
    assert(req.user.id, Joi.string().guid());
  } catch (error) {
    next(new ErrorResponse(`JoiError`, 403));
  }
  next();
}

module.exports = {
  assertSignIn,
  assertLogIn,
  assertRefresh,
  assertFindOne,
  assertLogOut,
};

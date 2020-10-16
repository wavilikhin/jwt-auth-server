const Joi = require('joi');
const ErrorResponse = require('./errorsHandler');

const signInSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'ru'] },
  }),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  confirmedPassword: Joi.ref('password'),
}).with('password', 'confirmedPassword');

function assertSignIn(err, req, res, next, schema) {
  try {
    Joi.assert(req.body, schema);
  } catch (error) {
    return next(new ErrorResponse());
  }
}

module.exports = { assertSignIn };

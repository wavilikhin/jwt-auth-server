const Joi = require('joi');

const signInSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'ru'] },
  }),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  confirmedPassword: Joi.ref('password'),
}).with('password', 'confirmedPassword');

const logInSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'ru'] },
  }),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().guid(),
});

module.exports = { signInSchema, logInSchema, refreshSchema };

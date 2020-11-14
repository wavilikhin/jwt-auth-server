const { assert } = require(`joi`);
const { ErrorResponse } = require(`../helpers/errorResponse`);

const validate = (schema) => (req, res, next) => {
  try {
    assert(req.body, schema);
  } catch (error) {
    next(new ErrorResponse(`JoiError`, 403));
  }
  next();
};

module.exports = {
  validate,
};

const { User } = require(`../model/user`);
const { ErrorResponse } = require(`../helpers/errorResponse`);

const check = (object) => async (req, res, next) => {
  if (!req.user) next(new ErrorResponse(`PermissionDenied`, 401));

  const user = await User.findOne({ id: req.user.id });

  if (!user) {
    return next(new ErrorResponse(`PermissionDenied`, 401));
  }

  const permissionNames = Object.keys(object);

  permissionNames.forEach((name) => {
    // eslint-disable-next-line security/detect-object-injection
    if (!user[name] || user[name] !== object[name]) {
      return next(new ErrorResponse(`PermissionDenied`, 401));
    }
  });

  next();
};

module.exports = check;

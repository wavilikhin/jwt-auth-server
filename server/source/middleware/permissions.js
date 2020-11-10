const User = require(`../model/user`);
const { ErrorResponse } = require(`../helpers/errorResponse`);

const check = async (err, req, res, next, array) => {
  if (!req.User) next(new ErrorResponse(`NoPermissions`, 401));

  const user = await User.findOne({ id: req.user.id });

  array.forEach((obj) => {
    const permissionName = Object.keys(obj)[0];
    const permissionValue = Object.values(obj)[0];

    if (user[permissionName] !== permissionValue)
      next(new ErrorResponse(`NoPermissions`, 401));
  });
};

module.exports = check;

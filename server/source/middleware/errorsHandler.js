const writeLog = require(`./logger`);
const errorsHandler = (err, req, res, next) => {
  writeLog(err);

  switch (err.name) {
    case `CridentialsError`:
      next(res.sendStatus(err.statusCode || 403));
      break;

    case `UnauthorizedError`:
      next(res.sendStatus(err.statusCode || 401));
      break;

    case `NoEnt`:
      next(res.sendStatus(err.statusCode || 404));
      break;

    case `JoiError`:
      next(res.sendStatus(err.statusCode || 403));
      break;

    case `CorsError`:
      next(res.sendStatus(err.statusCode || 500));
      break;

    case `PermissionDenied`:
      next(res.sendStatus(err.statusCode || 401));
      break;

    default:
      next(res.sendStatus(500));
  }
};

module.exports = errorsHandler;

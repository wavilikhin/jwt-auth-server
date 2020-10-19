const errorsHandler = (err, req, res, next) => {
  console.log(err);
  switch (err.name) {
    case 'CridentialsError':
      res.sendStatus(err.statusCode || 403);
      break;

    case 'UnauthorizedError':
      res.sendStatus(err.statusCode || 401);
      break;

    case 'NoEnt':
      res.sendStatus(err.statusCode || 404);
      break;

    case 'JoiError':
      res.sendStatus(err.statusCode || 403);
      break;

    case 'CorsError':
      res.sendStatus(err.statusCode || 500);
      break;

    default:
      res.sendStatus(500);
  }
};

module.exports = errorsHandler;

const errorsHandler = (err, req, res, next) => {
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

    default:
      res.sendStatus(500);
  }
};

module.exports = errorsHandler;

require(`dotenv`).config();

const PORT = process.env.PORT;

function createApp() {
  const express = require(`express`);
  const app = express();
  const helmet = require(`helmet`);
  const morgan = require(`morgan`);
  const jwtAuthStrategy = require(`express-jwt`);
  const guard = require(`express-jwt-permissions`)();
  const errorsHandler = require(`./source/middleware/errorsHandler`);

  process.env.NODE_ENV === `test`
    ? ``
    : app.use(process.env.MODE === `dev` ? morgan(`dev`) : morgan(`combined`));

  app.use(helmet());

  app.get(`/`, (req, res) => {
    res.sendStatus(200);
  });

  app.use(`/auth`, require(`./source/routes/auth/auth`));
  app.use(
    jwtAuthStrategy({
      secret: require(`./config/jwt.config`).accessTokenSecret,
      algorithms: [`HS256`],
    })
  );
  guard.check([`admin`]);
  app.use(`/users`, require(`./source/routes/users/users`));
  app.use(errorsHandler);

  return app;
}

// TODO: Подумать что делать с uncaught exeptions
process.on(`uncaughtException`, (err) => {
  console.log(err);
});

if (!module.parent) {
  createApp().listen(PORT);
  const mongoose = require(`mongoose`);
  const mongoConfig = require(`./config/mongo.config`);

  mongoose.connect(mongoConfig.url, mongoConfig.options);
}

module.exports = createApp;

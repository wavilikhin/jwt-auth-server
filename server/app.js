require(`dotenv`).config();

const express = require('express');
const app = express();

const PORT = process.env.PORT;

const mongoose = require('mongoose');
const mongoConfig = require('./config/mongo.config');

const swaggerJsDoc = require('swagger-jsdoc');

const helmet = require('helmet');
const morgan = require('morgan');
const jwtAuthStrategy = require('express-jwt');
const errorsHandler = require('./source/middleware/errorsHandler');

mongoose.connect(mongoConfig.url, mongoConfig.options);

app.listen(PORT);

app.use(process.env.MODE === 'dev' ? morgan('dev') : morgan('combined'));
app.use(helmet());

app.use('/auth', require('./source/routes/auth/auth'));
app.use(
  jwtAuthStrategy({
    secret: require('./config/jwt.config').accessTokenSecret,
    algorithms: ['HS256'],
  })
);

app.use('/users', require('./source/routes/users/users'));
app.use(errorsHandler);

require(`dotenv`).config();

const express = require('express');
const app = express();

const PORT = process.env.PORT;

const mongoose = require('mongoose');
const mongoConfig = require('./config/mongo.config');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwtAuthStrategy = require('express-jwt');
const errorsHandler = require('./source/middleware/errorsHandler');

const ErrorResponse = require('./source/helpers/errorResponse');

mongoose.connect(mongoConfig.url, mongoConfig.options);

// TODO: Посомтреть авторизацию\сброс пароля через почту
app.listen(PORT);

// TODO: Разобраться с CORS
// const whitelist = ['http://172.19.0.1:49810'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new ErrorResponse('CorsError', 500));
//     }
//   },
// };

app.use(process.env.MODE === 'dev' ? morgan('dev') : morgan('combined'));
app.use(helmet());
// app.use(cors(corsOptions));
app.use('/auth', require('./source/routes/auth/auth'));
app.use(
  jwtAuthStrategy({
    secret: require('./config/jwt.config').accessTokenSecret,
    algorithms: ['HS256'],
  })
);
//  TODO: Зачекать мидлваре для админки:
// https://github.com/MichielDeMey/express-jwt-permissions
app.use('/users', require('./source/routes/users/users'));
app.use(errorsHandler);

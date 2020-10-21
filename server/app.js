require(`dotenv`).config();

// const https = require('https');
const fs = require('fs');

const express = require('express');
const app = express();

// const options = {
//   key: fs.readFileSync('/srv/www/keys/my-site-key.pem'),
//   cert: fs.readFileSync('/srv/www/keys/chain.pem'),
// };

// const whitelist = require('./config/cors.config');
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

const PORT = process.env.PORT;

const cors = require('cors');
const mongoose = require('mongoose');
const mongoConfig = require('./config/mongo.config');

const swaggerJsDoc = require('swagger-jsdoc');

const helmet = require('helmet');
const morgan = require('morgan');
const jwtAuthStrategy = require('express-jwt');
const guard = require('express-jwt-permissions')();
const errorsHandler = require('./source/middleware/errorsHandler');

mongoose.connect(mongoConfig.url, mongoConfig.options);

app.listen(PORT);
// https.createServer(options, app).listen(PORT);
app.use(process.env.MODE === 'dev' ? morgan('dev') : morgan('combined'));
// app.use(cors(corsOptions));
app.use(helmet());
app.use('/auth', require('./source/routes/auth/auth'));
app.use(
  jwtAuthStrategy({
    secret: require('./config/jwt.config').accessTokenSecret,
    algorithms: ['HS256'],
  })
);
guard.check(['admin']);
app.use('/users', require('./source/routes/users/users'));
app.use(errorsHandler);

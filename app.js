require(`dotenv`).config();

const express = require('express');
const app = express();

const PORT = process.env.PORT;

const mongoose = require('mongoose');
const mongoConfig = require('./config/mongo.config');

mongoose.connect(mongoConfig.url, mongoConfig.options);

app.listen(PORT, () => {});

app.use('/users', require('./source/routes/users/users'));
app.use('/auth', require('./source/routes/auth/auth'));

// TODO: 2. User recieves 401 on expired token
// TODO: 3. User can update access token using refresh token
// TODO: 4. User can use refresh token only once
// TODO: 5. Refresh tokens becomes invalid on logout
// TODO: 6. Multiple refresh tokens are valid

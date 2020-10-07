const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
// const jwtMiddleware = require('express-jwt');

const { loginUser } = require('../../controllers/auth');

router.post('/login', bodyParser.json(), loginUser);

module.exports = router;

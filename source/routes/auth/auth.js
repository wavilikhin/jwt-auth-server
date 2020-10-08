const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
// const jwtMiddleware = require('express-jwt');

const { loginUser, signinUser } = require('../../controllers/auth');

router.post('/login', bodyParser.json(), loginUser);
router.post('/signin', bodyParser.json(), signinUser);

module.exports = router;

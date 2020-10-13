const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const { loginUser, signinUser, refresh } = require('../../controllers/auth');

router.post('/login', bodyParser.json(), loginUser);
router.post('/signin', bodyParser.json(), signinUser);
router.post('/refresh', bodyParser.json(), refresh);

module.exports = router;

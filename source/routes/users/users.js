const express = require('express');
const router = express.Router();

const { listUsers, findUser } = require('../../controllers/users');

router.get(`/`, listUsers);

router.get(`/:id`, findUser);

module.exports = router;

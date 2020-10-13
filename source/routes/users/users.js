const express = require('express');
const router = express.Router();

const { listUsers, findUser, logOut } = require('../../controllers/users');

router.get(`/`, listUsers);

router.get(`/:id`, findUser);

router.patch('/logout', logOut);

module.exports = router;

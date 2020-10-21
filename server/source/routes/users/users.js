const express = require('express');
const router = express.Router();

const { listUsers, findUser, logOut } = require('../../controllers/users');

const guard = require('express-jwt-permissions')();
const { assertFindOne } = require('../../middleware/joi');

/**
 * @swagger
 *
 * /users/:
 *  get:
 *    summary: Get a list of all users
 *    security:
 *    - BearerAuth: []
 *    responses:
 *      '401':
 *        description: Provided Authorization Bearer Token in invalid
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 */
router.get(`/`, guard.check(['admin']), listUsers);

/**
 * @swagger
 *
 * /users/{id}:
 *  get:
 *    summary: Get a list of all users
 *    security:
 *    - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: Requested user's uuid
 *    responses:
 *      '401':
 *        description: Provided Authorization Bearer Token is invalid
 *      '404':
 *        description: User with provided id doesn't exists
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                id:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                __v:
 *                  type: string
 */
router.get(`/:id`, guard.check(['admin']), assertFindOne, findUser);

module.exports = router;

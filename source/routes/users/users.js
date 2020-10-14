const express = require('express');
const router = express.Router();

const { listUsers, findUser, logOut } = require('../../controllers/users');

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
router.get(`/`, listUsers);

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
router.get(`/:id`, findUser);

/**
 * @swagger
 *
 * /users/logout:
 *  pathc:
 *    summary: Logs user out
 *    security:
 *    - BearerAuth: []
 *    responses:
 *      '401':
 *        description: Provided Authorization Bearer Token is invalid
 *      '200':
 *        description: OK
 */
router.patch('/logout', logOut);

module.exports = router;

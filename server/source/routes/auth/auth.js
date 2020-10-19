const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const { loginUser, signinUser, refresh } = require('../../controllers/auth');

const {
  assertSignIn,
  assertLogIn,
  assertRefresh,
} = require('../../middleware/joi');

/**
 * @swagger
 * /auth/signin:
 *  post:
 *    summary: Creates new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *              confirmedPassword:
 *                type: string
 *                required: true
 *    responses:
 *      '201':
 *        description: Provided cridential are valid, user successfully created.
 *      '403':
 *        description: Provided cridentials are invalid
 */
router.post('/signin', bodyParser.json(), assertSignIn, signinUser);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Logs user in
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *    responses:
 *      '200':
 *        description: Provided cridential are valid, user successfully logged in.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                refreshToken:
 *                  type: string
 *      '403':
 *        description: Provided cridentials are invalid
 *      '404':
 *        description: User with provided email doesn't exists
 */

router.post('/login', bodyParser.json(), assertLogIn, loginUser);
/**
 * @swagger
 * /auth/refresh:
 *  post:
 *    summary: Updates access token using provided refresh token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              refreshToken:
 *                type: string
 *                required: true
 *    responses:
 *      '200':
 *        description: Provided refresh token is valid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                refreshToken:
 *                  type: string
 *      '404':
 *        description: Provided refresh token is invalid
 */
router.post('/refresh', bodyParser.json(), assertRefresh, refresh);

module.exports = router;

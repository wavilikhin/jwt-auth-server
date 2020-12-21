const express = require(`express`);
const router = express.Router();

const { confirmEmail } = require(`../../controllers/confirmation`);

/**
 * @swagger
 * /confirmation/{JWTtoken} :
 *  get:
 *    summary: Confirms user's email
 * 		parameters:
 *      - in: path
 *        name: jwt
 *        schema:
 *          type: guid
 *          required: true
 *          description: JWT token with user's ID signed with secret
 *    responses:
 *      '201':
 *        description: JWT token is valid, email confirmed. User can now login
 *      '403':
 *        description: JWT token is either inavlid or expired
 */
router.get(`/:JWTtoken`, confirmEmail);

module.exports = router;

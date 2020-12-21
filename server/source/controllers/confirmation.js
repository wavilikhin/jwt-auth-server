const jwt = require(`jsonwebtoken`);
const { ErrorResponse } = require(`../helpers/errorResponse`);
const { secret } = require(`../../config/mailer.config`);
const { User } = require(`../model/user`);

async function confirmEmail(req, res, next) {
	const { JWTtoken } = req.params;

	if (!JWTtoken) return next(new ErrorResponse(`NoEnt`, 404));

	try {
		const { id } = jwt.verify(JWTtoken, secret);

		await User.findOneAndUpdate({ id }, { isConfirmed: true });
		return res.sendStatus(200);
	} catch (error) {
		// eslint-disable-next-line no-unused-expressions
		process.env.NODE_ENV === `dev` ? console.error(error) : ``;

		if (error.name === `TokenExpiredError`)
			return next(new ErrorResponse(`CridentialsError`, 403));

		return next(new ErrorResponse());
	}
}

module.exports = { confirmEmail };

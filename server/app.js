require(`dotenv`).config();

const PORT = process.env.PORT;
const mongoose = require(`mongoose`);
const mongoConfig = require(`./config/mongo.config`);
const writeLog = require(`./source/middleware/logger`);

function createApp() {
	const express = require(`express`);
	const app = express();
	const helmet = require(`helmet`);
	const morgan = require(`morgan`);
	const jwtAuthStrategy = require(`express-jwt`);
	const check = require(`./source/middleware/permissions`);
	const errorsHandler = require(`./source/middleware/errorsHandler`);

	switch (process.env.NODE_ENV) {
		case `dev`:
			app.use(morgan(`dev`));
			break;
		case `test`:
			break;
		default:
			app.use(morgan(`combined`));
			break;
	}

	app.use(helmet());

	app.get(`/`, (req, res) => {
		res.sendStatus(200);
	});
	app.use(
		`/confirmation`,
		require(`./source/routes/confirmation/confirmation`),
	);
	app.use(`/auth`, require(`./source/routes/auth/auth`));
	app.use(
		jwtAuthStrategy({
			secret: require(`./config/jwt.config`).accessTokenSecret,
			algorithms: [`HS256`],
		}),
	);
	app.use(check({ admin: true }));
	app.use(`/users`, require(`./source/routes/users/users`));
	app.use(errorsHandler);

	return app;
}

process.on(`uncaughtException`, (err) => {
	console.error(`UNCAUGHT EXCEPTION: \n${err.stack}`);
	writeLog(err);
});

if (!module.parent) {
	createApp().listen(PORT);

	mongoose.connect(mongoConfig.url, mongoConfig.options);
}

module.exports = createApp;

// var transporter = nodemailer.createTransport({
// 	host: "smtp.yandex.ru",
// 	port: 465,
// 	secure: true,
// 	auth: {
// 		user: "noreply@arvr.sberlabs.com",
// 		pass: "llqkykghaommkotp",
// 	},
// });

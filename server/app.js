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
	// eslint-disable-next-line no-process-exit
	process.exit(1);
});

if (!module.parent) {
	// eslint-disable-next-line no-inner-declarations
	async function handleShutdown(expressApp, mongooseInstance) {
		await mongooseInstance.disconnect();
		await expressApp.close();
	}

	const app = createApp().listen(PORT);

	mongoose.connect(mongoConfig.url, mongoConfig.options);

	process.on(`SIGTERM`, () => {
		handleShutdown(app, mongoose);
	});

	process.on(`SIGINT`, () => {
		handleShutdown(app, mongoose);
	});
}

module.exports = createApp;

setTimeout(() => {
	throw new Error(`test`);
}, 5000);

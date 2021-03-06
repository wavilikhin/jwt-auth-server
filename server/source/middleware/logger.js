const fs = require(`fs`);
const logsPath = `${__dirname}/../../logs`;

/* eslint-disable */
function writeLog(error) {
	let errorLog;
	process.env.NODE_ENV === `production`
		? (errorLog = `\n[${new Date(Date.now())}] - ${error.name}: ${
				error.message
		  } :: ${error.stack}`)
		: (errorLog = `\n${error.name}: ${error.message}`);

	fs.writeFileSync(`${logsPath}/error.log`, errorLog, { flag: `a+` });
}

module.exports = writeLog;

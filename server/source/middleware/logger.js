const fs = require(`fs`);
const logsPath = `${__dirname}/../../logs`;

function writeLog(error) {
  const errorLog = `\n[${new Date(Date.now())}] - ${error.name}: ${
    error.message
  } :: ${error.stack}`;

  fs.writeFileSync(`${logsPath}/error.log`, errorLog, { flag: `a+` });
}

module.exports = writeLog;

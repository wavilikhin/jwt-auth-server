const test = require(`ava`);
const writeLog = require(`../../middleware/logger`);

const fs = require(`fs`);
const { promisify } = require(`util`);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const logsPath = `${__dirname}/../../../logs`;

const errorLog = `\nError: TestError`;

test(`Middleware for writing logs works well`, async (t) => {
  await unlink(`${logsPath}/error.log`);

  const error = new Error(`TestError`);
  writeLog(error);

  const logs = await readFile(`${logsPath}/error.log`, `utf8`);

  t.deepEqual(logs, errorLog);
});

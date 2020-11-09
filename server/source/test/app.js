const test = require(`ava`);
const createApp = require(`../../app.js`);
const request = require(`supertest`);
const app = request(createApp());

test(`App works`, async (t) => {
  const res = await app.get(`/`);
  t.is(res.status, 200);
});

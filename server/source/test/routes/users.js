const test = require(`ava`);
const request = require(`supertest`);
const { before, beforeEach, afterEach, after } = require(`../utils`);

const createApp = require(`../../../app`);
const app = request(createApp());

const { issueTokenPair } = require(`../../controllers/auth`);
const { v4: uuid } = require(`uuid`);

test.before(before);
test.beforeEach(beforeEach);
test.afterEach(afterEach);

test.serial(`User get 401 on accessing routes for admins`, async (t) => {
  const loginRequest = await app.post(`/auth/login`).send({
    email: `fake@mail.com`,
    password: `fakepass123`,
  });

  const userAccessToken = loginRequest.body.token;

  const adminRouteRequest = await app
    .get(`/users`)
    .set(`Authorization`, `Bearer ${userAccessToken}`);

  t.is(adminRouteRequest.status, 401);
  t.deepEqual(adminRouteRequest.body, {});
});

test.serial(
  `Admin can't access admin routes without valid access token`,
  async (t) => {
    const loginRequest = await app.post(`/auth/login`).send({
      email: `admin@mail.com`,
      password: `fakepass123`,
    });

    const userAccessToken = Array.from(loginRequest.body.token)
      .reverse()
      .join();

    const adminRouteRequest = await app
      .get(`/users`)
      .set(`Authorization`, `Bearer ${userAccessToken}`);

    t.is(adminRouteRequest.status, 401);
    t.deepEqual(adminRouteRequest.body, {});
  }
);

test.serial(
  `Admin can access admin routes with valid access token`,
  async (t) => {
    const loginRequest = await app.post(`/auth/login`).send({
      email: `admin@mail.com`,
      password: `fakepass123`,
    });

    const userAccessToken = loginRequest.body.token;

    const adminRouteRequest = await app
      .get(`/users`)
      .set(`Authorization`, `Bearer ${userAccessToken}`);

    t.is(adminRouteRequest.status, 200);
    t.deepEqual(!!adminRouteRequest.body, true);
  }
);

test.serial(`User recieves 401 on expired token`, async (t) => {
  const newTokenPair = await issueTokenPair(123, { expiresIn: `100ms` });

  const listUsersRequest = await app
    .get(`/users`)
    .set(`Authorization`, `Bearer ${newTokenPair.token}`);

  t.is(listUsersRequest.status, 401);
  t.deepEqual(listUsersRequest.body, {});
});

test.serial(`Find user by id request works well`, async (t) => {
  const loginRequest = await app.post(`/auth/login`).send({
    email: `admin@mail.com`,
    password: `fakepass123`,
  });

  const userAccessToken = loginRequest.body.token;

  const usersList = await app
    .get(`/users`)
    .set(`Authorization`, `Bearer ${userAccessToken}`);

  const userId = usersList.body[0].id;

  const adminRouteRequest = await app
    .get(`/users/${userId}`)
    .set(`Authorization`, `Bearer ${userAccessToken}`)
    .set(`Accept`, `application/json`);

  t.is(adminRouteRequest.status, 200);
  t.deepEqual(!!adminRouteRequest.body, true);
});

test.serial(`Find by id request returns 404 on invalid id`, async (t) => {
  const loginRequest = await app.post(`/auth/login`).send({
    email: `admin@mail.com`,
    password: `fakepass123`,
  });

  const userAccessToken = loginRequest.body.token;

  const userId = uuid();

  const adminRouteRequest = await app
    .get(`/users/${userId}`)
    .set(`Authorization`, `Bearer ${userAccessToken}`)
    .set(`Accept`, `application/json`);

  t.is(adminRouteRequest.status, 404);
  t.deepEqual(adminRouteRequest.body, {});
});

test.after(after);

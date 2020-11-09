const test = require(`ava`);
const request = require(`supertest`);
const { before, beforeEach, afterEach, after } = require(`../utils`);

const createApp = require(`../../../app`);
const app = request(createApp());

const { User } = require(`../../model/user`);
const { issueTokenPair } = require(`../../controllers/auth`);

test.before(before);
test.beforeEach(beforeEach);
test.afterEach(afterEach);

test.serial(`User can successfuly sign in`, async (t) => {
  const signinResponse = await app.post(`/auth/signin`).send({
    email: `test@mail.com`,
    password: `fake123`,
    confirmedPassword: `fake123`,
  });

  t.is(signinResponse.status, 201);

  const newUser = await User.find({ email: `test@mail.com` });

  t.is(!!newUser, true);
});

test.serial(`User can't sign in with same email twice`, async (t) => {
  await app.post(`/auth/signin`).send({
    email: `test@mail.com`,
    password: `fake123`,
    confirmedPassword: `fake123`,
  });

  const secondSigninResponse = await app.post(`/auth/signin`).send({
    email: `test@mail.com`,
    password: `fake123`,
    confirmedPassword: `fake123`,
  });

  t.is(secondSigninResponse.status, 403);
});

test.serial(`User can successfuly log in`, async (t) => {
  const loginRequest = await app.post(`/auth/login`).send({
    email: `fake@mail.com`,
    password: `fakepass123`,
  });

  t.is(!!loginRequest.body.token, true);
  t.is(!!loginRequest.body.refreshToken, true);

  t.is(loginRequest.status, 200);
});

test.serial(`User gets 403 on invalid cridentials`, async (t) => {
  const badEmailLoginRequest = await app.post(`/auth/login`).send({
    email: `deepfake@mail.com`,
    password: `fakepass123`,
  });

  const badPasswordLoginRequest = await app.post(`/auth/login`).send({
    email: `fake@mail.com`,
    password: `fakepASS`,
  });

  t.is(badEmailLoginRequest.status, 403);
  t.is(badPasswordLoginRequest.status, 403);
});

test.serial(`User can get new access token using refresh token`, async (t) => {
  const loginRequest = await app.post(`/auth/login`).send({
    email: `fake@mail.com`,
    password: `fakepass123`,
  });

  const refreshToken = loginRequest.body.refreshToken;

  const updateAccessTokenRequest = await app
    .post(`/auth/refresh`)
    .set(`Content-Type`, `application/json`)
    .send({ refreshToken });

  t.is(updateAccessTokenRequest.status, 200);
  t.is(!!updateAccessTokenRequest.body.token, true);
  t.is(!!updateAccessTokenRequest.body.refreshToken, true);
});

test.serial(`User gets 404 on invalid refresh token`, async (t) => {
  const refreshToken = `64b46b8d-bf12-4ef1-9395-7ad48f257ef2`;

  const updateAccessTokenRequest = await app
    .post(`/auth/refresh`)
    .set(`Content-Type`, `application/json`)
    .send({ refreshToken });

  t.is(updateAccessTokenRequest.status, 404);
});

test.serial(`Refresh tokens becomes invalid on logout`, async (t) => {
  const loginRequest = await app.post(`/auth/login`).send({
    email: `fake@mail.com`,
    password: `fakepass123`,
  });

  const accessToken = loginRequest.body.token;
  const refreshToken = loginRequest.body.refreshToken;

  const logOutRequest = await app
    .patch(`/auth/logout`)
    .set(`Authorization`, `Bearer ${accessToken}`);

  t.is(logOutRequest.status, 200);

  const refreshAccessToken = await app.post(`/auth/refresh`).send({
    refreshToken,
  });

  t.is(refreshAccessToken.status, 404);
});

test.serial(`Multiple refresh tokens are valid`, async (t) => {
  const firstLoginRequest = await app.post(`/auth/login`).send({
    email: `fake@mail.com`,
    password: `fakepass123`,
  });
  const firstRefreshToken = firstLoginRequest.body.refreshToken;

  const secondLoginRequest = await app.post(`/auth/login`).send({
    email: `fakeish@mail.com`,
    password: `fakepass123`,
  });
  const secondRefreshToken = secondLoginRequest.body.refreshToken;

  const firstRefreshRequest = await app.post('/auth/refresh').send({
    refreshToken: firstRefreshToken,
  });
  t.is(firstRefreshRequest.status, 200);
  t.is(!!firstRefreshRequest.body.token, true);
  t.is(!!firstRefreshRequest.body.refreshToken, true);

  const secondRefreshRequest = await app.post('/auth/refresh').send({
    refreshToken: secondRefreshToken,
  });
  t.is(secondRefreshRequest.status, 200);
  t.is(!!secondRefreshRequest.body.token, true);
  t.is(!!secondRefreshRequest.body.refreshToken, true);
});

test.serial(`User can use refresh token only once`, async (t) => {
  const loginRequest = await app.post(`/auth/login`).send({
    email: `fake@mail.com`,
    password: `fakepass123`,
  });
  const refreshToken = loginRequest.body.refreshToken;

  const firstRefreshRequest = await app.post(`/auth/refresh`).send({
    refreshToken,
  });

  t.is(firstRefreshRequest.status, 200);
  t.is(!!firstRefreshRequest.body.token, true);
  t.is(!!firstRefreshRequest.body.refreshToken, true);

  const secondRefreshRequest = await app.post(`/auth/refresh`).send({
    refreshToken,
  });

  t.is(secondRefreshRequest.status, 404);
});

// users
test.serial(
  `User get 401 on list all users request without valid access token`,
  async (t) => {
    const newTokenPair = await issueTokenPair(1234);
    const invalidToken = Array.from(newTokenPair.token).reverse().toString();

    const listRequest = await app
      .get(`/users`)
      .set(`Authorization`, `Bearer ${invalidToken}`);

    t.is(listRequest.status, 401);
  }
);

test.serial(
  `List all users request works well with correct access token`,
  async (t) => {
    const newTokenPair = await issueTokenPair(1234);

    const listRequest = await app
      .get(`/users`)
      .set(`Authorization`, `Bearer ${newTokenPair.token}`);

    t.is(listRequest.status, 200);
    t.is(!!listRequest.body.length, true);
    t.is(listRequest.body.length, 2);
  }
);

test.serial(`User recieves 401 on expired token`, async (t) => {
  const newTokenPair = await issueTokenPair(123, { expiresIn: `500ms` });

  const listUsersRequest = await app
    .get(`/users`)
    .set(`Authorization`, `Bearer ${newTokenPair.token}`);

  t.is(listUsersRequest.status, 401);
});

test.serial(`Find user by id request works well`, async (t) => {
  const newTokenPair = await issueTokenPair(1234);

  const listRequest = await app
    .get(`/users`)
    .set(`Authorization`, `Bearer ${newTokenPair.token}`);

  const user_id = listRequest.body[0].id;

  const findByIdRequest = await app
    .get(`/users/${user_id}`)
    .set(`Authorization`, `Bearer ${newTokenPair.token}`)
    .set(`Accept`, `application/json`);

  t.is(findByIdRequest.status, 200);
  t.is(!!findByIdRequest.body, true);
  t.like(listRequest.body[0], findByIdRequest.body);
});

test.serial(`Find by id request returns 404 on invalid id`, async (t) => {
  const newTokenPair = await issueTokenPair(1234);

  const listRequest = await app
    .get(`/users`)
    .set(`Authorization`, `Bearer ${newTokenPair.token}`);
  const invalid_id = Array.from(listRequest.body[0].id).reverse().join(``);

  const findByIdRequest = await app
    .get(`/users/${invalid_id}`)
    .set(`Authorization`, `Bearer ${newTokenPair.token}`)
    .set(`Accept`, `application/json`);

  t.is(findByIdRequest.status, 403);
  t.deepEqual(findByIdRequest.body, {});
});
test.todo(`Route is only accessable for admins`);

test.after(after);

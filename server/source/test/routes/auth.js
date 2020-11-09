const test = require(`ava`);
const request = require(`supertest`);
const { before, beforeEach, afterEach, after } = require(`../utils`);

const createApp = require(`../../../app`);
const app = request(createApp());

const { User } = require(`../../model/user`);
const { issueTokenPair } = require('../../controllers/auth');

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

test.serial(`User recieves 401 on expired token`, async (t) => {
  const tokenPair = await issueTokenPair(12, 1000);
  console.log(tokenPair);
});

test.todo(`Check guard for admin`);
test.todo(`User can use refresh token only once`);
test.todo(`Refresh tokens becomes invalid on logout`);
test.todo(`Multiple refresh tokens are valid`);

test.after(after);

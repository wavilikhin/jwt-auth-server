const test = require(`ava`);
const request = require(`supertest`);
const { before, beforeEach, afterEach, after } = require(`../utils`);

const createApp = require(`../../../app`);
const app = request(createApp());

const { User } = require(`../../model/user`);

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

test.serial(
	`User can't successfuly log in without confirming an email`,
	async (t) => {
		const loginRequest = await app.post(`/auth/login`).send({
			email: `fake@mail.com`,
			password: `fakepass123`,
		});

		t.is(loginRequest.status, 401);
	},
);

test.serial(`User with confirmed email can successfuly log in`, async (t) => {
	const loginRequest = await app.post(`/auth/login`).send({
		email: `confirmed@mail.com`,
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
		email: `confirmed@mail.com`,
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

test.serial(`User can successfuly logout`, async (t) => {
	const loginRequest = await app.post(`/auth/login`).send({
		email: `confirmed@mail.com`,
		password: `fakepass123`,
	});

	const accessToken = loginRequest.body.token;

	const logOutRequest = await app
		.patch(`/auth/logout`)
		.set(`Authorization`, `Bearer ${accessToken}`);

	t.is(logOutRequest.status, 200);
});

test.serial(`Refresh tokens becomes invalid on logout`, async (t) => {
	const loginRequest = await app.post(`/auth/login`).send({
		email: `confirmed@mail.com`,
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
		email: `confirmed@mail.com`,
		password: `fakepass123`,
	});
	const firstRefreshToken = firstLoginRequest.body.refreshToken;

	const secondLoginRequest = await app.post(`/auth/login`).send({
		email: `confirmish@mail.com`,
		password: `fakepass123`,
	});
	const secondRefreshToken = secondLoginRequest.body.refreshToken;

	const firstRefreshRequest = await app.post(`/auth/refresh`).send({
		refreshToken: firstRefreshToken,
	});
	t.is(firstRefreshRequest.status, 200);
	t.is(!!firstRefreshRequest.body.token, true);
	t.is(!!firstRefreshRequest.body.refreshToken, true);

	const secondRefreshRequest = await app.post(`/auth/refresh`).send({
		refreshToken: secondRefreshToken,
	});
	t.is(secondRefreshRequest.status, 200);
	t.is(!!secondRefreshRequest.body.token, true);
	t.is(!!secondRefreshRequest.body.refreshToken, true);
});

test.serial(`User can use refresh token only once`, async (t) => {
	const loginRequest = await app.post(`/auth/login`).send({
		email: `confirmed@mail.com`,
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

test.after(after);

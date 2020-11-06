const test = require('ava');
const request = require('supertest');

const mongoose = require('mongoose');
const User = require('../../model/user');
const mongoConfig = require('../../../config/mongo.config');

const createApp = require('../../../app');
const app = request(createApp());

const { hashSync } = require('bcryptjs');
const { v4: uuid } = require('uuid');

test.before(() => {
  console.log('BEFORE');
  mongoose.connect(mongoConfig.testUrl, mongoConfig.options);
});

test.beforeEach(async () => {
  console.log('BEFORE EACH');

  const newUser = {
    id: uuid(),
    email: 'fake@mail.com',
    password: hashSync('fakepass123', 8),
  };

  console.log('NEW USER\n', newUser);

  await new User(newUser).save();

  console.log('USER SAVED');
});

test.serial('User can successfuly sign in', async (t) => {
  const signinResponse = await app.post('/auth/signin').send({
    email: 'test@mail.com',
    password: 'fake123',
    confirmedPassword: 'fake123',
  });
  t.is(signinResponse.status, 201);
});

test.todo('User can successfuly log in');
test.todo('User gets 403 on invalid cridentials');
test.todo('User recieves 401 on expired token');
test.todo('User can get new access token using refresh token');
test.todo('User gets 404 on invalid refresh token');
test.todo('User can use refresh token only once');
test.todo('Refresh tokens becomes invalid on logout');
test.todo('Multiple refresh tokens are valid');

// test.afterEach.always(async () => await User.deleteMany());

test.after.always(async () => {
  mongoose.disconnect();
});

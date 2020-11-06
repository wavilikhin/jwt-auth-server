const test = require('ava');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../../model/user');
const app = require('../../../app');

const { hashSync } = require('bcryptjs');
const { v4: uuid } = require('uuid');

const App = request(app);
const mongod = new MongoMemoryServer();

test.before(async () => {
  mongoose.connect(await mongod.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

test.beforeEach(async () => {
  const user1 = new User({
    id: uuid(),
    email: 'fakeOne@mail.com',
    password: hashSync('fakepass123', 8),
  });
  const user2 = new User({
    id: uuid(),
    email: 'fakeTwo@mail.com',
    password: hashSync('fakepass123', 8),
  });
  const user3 = new User({
    id: uuid(),
    email: 'fakeThree@mail.com',
    password: hashSync('fakepass123', 8),
  });
  const user4 = new User({
    id: uuid(),
    email: 'fakeFour@mail.com',
    password: hashSync('fakepass123', 8),
  });
  const user5 = new User({
    id: uuid(),
    email: 'fakeFive@mail.com',
    password: hashSync('fakepass123', 8),
  });

  await user1.save();
  await user2.save();
  await user3.save();
  await user4.save();
  await user5.save();
});

test.afterEach.always(async () => await User.deleteMany());

test.after.always(async (t) => {
  mongoose.disconnect();
  mongod.stop();
});

test.serial('passes serially', (t) => {
  t.pass();
});

// test.serial('Test for test', async (t) => {
//   const response = await App.get('/test');
//   t.is(response.status, 200);
//   t.truthy(typeof response.body.success === 'boolean');
//   t.is(response.body.success, true);
// });

// test.serial('User can successfuly sign in', async (t) => {
//   const signinResponse = await App.post('/auth/signin').send({
//     email: 'test@mail.com',
//     password: 'fake123',
//     confirmedPassword: 'fake123',
//   });
//   t.is(signinResponse.status, 201);
// });

test.todo('User can successfuly log in');
test.todo('User gets 403 on invalid cridentials');
test.todo('User recieves 401 on expired token');
test.todo('User can get new access token using refresh token');
test.todo('User gets 404 on invalid refresh token');
test.todo('User can use refresh token only once');
test.todo('Refresh tokens becomes invalid on logout');
test.todo('Multiple refresh tokens are valid');

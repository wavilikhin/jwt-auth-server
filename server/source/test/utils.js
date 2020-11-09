const { MongoMemoryServer } = require(`mongodb-memory-server`);
const mongoose = require(`mongoose`);
const mongoConfig = require(`../../config/mongo.config`);
const { User } = require(`../model/user`);
const createApp = require(`../../app`);

const mongod = new MongoMemoryServer();
const app = createApp();

const { hashSync } = require(`bcryptjs`);
const { v4: uuid } = require(`uuid`);

async function before() {
  await mongoose.connect(await mongod.getUri(), mongoConfig.options);
}

async function beforeEach(t) {
  const newUser = {
    id: uuid(),
    email: `fake@mail.com`,
    password: hashSync(`fakepass123`, 8),
  };

  const newerUser = {
    id: uuid(),
    email: `fakeish@mail.com`,
    password: hashSync(`fakepass123`, 8),
  };

  await new User(newUser).save();
  await new User(newerUser).save();

  t.context.app = app;
}

async function afterEach() {
  await User.deleteMany({});
}

async function after() {
  await mongoose.disconnect();
  mongod.stop();
}

module.exports = { before, beforeEach, afterEach, after };

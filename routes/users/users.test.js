const requset = require('supertest');
const app = require('../../app');

describe('Users route test suit', () => {
  it('Should list all users', async () => {
    const res = await requset(app).get('/users/');

    expect(res.statusCode).toBe(200);
  });
});

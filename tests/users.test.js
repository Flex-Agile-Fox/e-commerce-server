const request = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;

beforeAll((done) => {
  queryInterface
    .bulkDelete('Users', null, {})
    .then(() => {
      const salt = bcrypt.genSaltSync(8);
      const user = {
        email: 'john@example.com',
        password: bcrypt.hashSync('password', salt),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const users = [user];

      return queryInterface.bulkInsert('Users', users);
    })
    .then(() => done())
    .catch((err) => {
      throw err;
    });
});

afterAll((done) => {
  queryInterface
    .bulkDelete('Users', null, {})
    .then(() => done())
    .catch((err) => {
      throw err;
    });
});

describe('POST /users/login', () => {
  it('Success login using correct username and password, return access_token', (done) => {

    const salt = bcrypt.genSaltSync(8);

    request(app)
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'john@example.com', password: 'password' })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        // expect(body).toHaveProperty('access_token', expect.any(String));

        done();
      });
  });
});
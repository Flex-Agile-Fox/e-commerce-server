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
        role: 'admin',
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

    request(app)
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'john@example.com', password: 'password' })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('access_token', expect.any(String));

        done();
      });
  });

  it('Fail login if email exist in database but wrong password, return error message', (done) => {
    request(app)
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'john@example.com', password: 'passwords' })
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Wrong email or password');
        
        done();
        
      });
  });

  it('Fail login if email not exist in database, return error message', (done) => {
    request(app)
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'johno@example.com', password: 'password' })
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('User Not Found');
        
        done();
        
      });
  });

  it('Fail login if email and password empty, return error message', (done) => {
    request(app)
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({ email: '', password: '' })
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Email or Password cannot be empty');
        
        done();
        
      });
  });

});
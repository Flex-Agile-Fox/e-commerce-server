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

// REGISTER
describe('POST /users/login', () => {
  it('Success register, return success message', (done) => {

    request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email: 'jane@example.com', password: 'password', role:'customer' })
      .then(({ body, status }) => {
        expect(status).toBe(201);
        expect(body).toHaveProperty('message', expect.any(String));
        expect(body.message).toContain('User registered successfully');

        done();
      });
  });

  it('Fail register if email already exist in database, return error message', (done) => {
    request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email: 'john@example.com', password: 'password', role: 'admin' })
      .then(({ body, status }) => {
        expect(status).toBe(409);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Email address already in use');
        
        done();
        
      });
  });

  it('Fail register if fill invalid email address, password less than 6 characters or empty field, return error message', (done) => {
    request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email: 'john', password: 'pass', role: '' })
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Invalid email address');
        expect(body.errorMessages).toContain('Password must be at least 6 characters');
        expect(body.errorMessages).toContain('Role must not be empty');
        
        done();
        
      });
  });

});

// LOGIN
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
        expect(body.errorMessages).toContain('User not found');
        
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
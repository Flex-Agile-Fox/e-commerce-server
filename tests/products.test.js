const request = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, User } = require('../models');
const { queryInterface } = sequelize;
const salt = bcrypt.genSaltSync(8);

const admin = {
  email: 'john@example.com',
  password: bcrypt.hashSync('password', salt),
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
};

const customer = {
  email: 'jane@example.com',
  password: bcrypt.hashSync('password', salt),
  role: 'customer',
  createdAt: new Date(),
  updatedAt: new Date()
};

beforeAll((done) => {
  queryInterface
    .bulkDelete('Users', null, {})
    .then(() => {
      return queryInterface.bulkDelete("Products", null, {});
    })
    .then(() => {
      const users = [admin, customer];

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
    .then(() => {
			return queryInterface.bulkDelete("Products", null, {});
		})
    .then(() => done())
    .catch((err) => {
      throw err;
    });
});

describe('POST /products', () => {
  it('Success add product, return product data)', (done) => {
    User.findOne({ where: { email: admin.email } })
      .then((user) => {
        const access_token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        
        request(app)
          .post('/products')
          .set('Content-Type', 'application/json')
          .set("access_token", access_token)
          .send({ 
            name: 'celana', 
            image_url: 'http://celanaurl.com',
            price: 30000,
            stock: 200
          })
          .then(({ body, status }) => {
            expect(status).toBe(201);
            expect(body).toHaveProperty('data', expect.any(Object));
            expect(body.data).toHaveProperty('id', expect.any(Number));
            expect(body.data).toHaveProperty('name', expect.any(String));
            expect(body.data).toHaveProperty('image_url', expect.any(String));
            expect(body.data).toHaveProperty('price', expect.any(Number));
            expect(body.data).toHaveProperty('stock', expect.any(Number));
            expect(body.data).toHaveProperty('UserId', expect.any(Number));
    
            done();
          });
      })
      .catch((err) => console.log(err));
  });

  it('Fail add product if not provide access token, return error message', (done) => {
    User.findOne({ where: { email: admin.email } })
      .then(() => {
        request(app)
          .post('/products')
          .set('Content-Type', 'application/json')
          .send({ 
            name: 'celana', 
            image_url: 'http://celanaurl.com',
            price: 30000,
            stock: 200
          })
          .then(({ body, status }) => {
            expect(status).toBe(401);
            expect(body).toHaveProperty('errorMessages', expect.any(Array));
            expect(body.errorMessages).toContain('Missing access token');
    
            done();
          });
      })
      .catch((err) => console.log(err));
  });

  it('Fail add product if provide access token but not belong to admin role, return error message', (done) => {
    User.findOne({ where: { email: customer.email } })
      .then((user) => {
        const access_token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

        request(app)
          .post('/products')
          .set('Content-Type', 'application/json')
          .set("access_token", access_token)
          .send({ 
            name: 'celana', 
            image_url: 'http://celanaurl.com',
            price: 30000,
            stock: 200
          })
          .then(({ body, status }) => {
            expect(status).toBe(401);
            expect(body).toHaveProperty('errorMessages', expect.any(Array));
            expect(body.errorMessages).toContain('Only admin can add product');
    
            done();
          });
      })
      .catch((err) => console.log(err));
  });


});
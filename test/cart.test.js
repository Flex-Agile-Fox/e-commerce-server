const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');

//setup customer
const user = {
  id: 1,
  name: 'User',
  email: 'userakun@mail.com',
  password: bcrypt.hashSync('userakun', 8),
  role: 'customer',
  createdAt: new Date(),
  updatedAt: new Date(),
};

//access_token
const access_token = jwt.sign({ id: 1, role: 'customer' }, JWT_SECRET);

//setup product
const products = [
  {
    id: 1,
    name: 'Sepatu',
    image_url: 'google.com/Sepatu.jpg',
    price: 490000,
    stock: 1,
    category: 'formal',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Sandal',
    image_url: 'google.com/sandal.jpg',
    price: 15000,
    stock: 10,
    category: 'casual',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Nike',
    image_url: 'google.com/sandal3.jpg',
    price: 4000000,
    stock: 3,
    category: 'sports',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

beforeAll((done) => {
  queryInterface
    .bulkDelete('Users', null, {})
    .then(() => {
      return queryInterface.bulkDelete('Products', null, {});
    })
    .then(() => {
      return queryInterface.bulkDelete('Carts', null, {});
    })
    .then(() => {
      const customer = [user];
      return queryInterface.bulkInsert('Users', customer);
    })
    .then(() => {
      return queryInterface.bulkInsert('Products', products);
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
      return queryInterface.bulkDelete('Products', null, {});
    })
    .then(() => {
      return queryInterface.bulkDelete('Carts', null, {});
    })
    .then(() => done())
    .catch((err) => {
      throw err;
    });
});

// ------------------- POST
describe('Add product to Cart: POST /carts/:id', () => {
  it('success add product to cart, return result code 201 and data Cart', (done) => {
    request(app)
      .post(`/carts/${products[0].id}`)
      .set({
        'Content-Type': 'application/json',
        access_token: access_token,
      })
      .then(({ status, body }) => {
        expect(status).toBe(201);
        expect(body).toHaveProperty('data');
        done();
      });
  });

  it('fail add product to cart when not set access_token, return result code 401 and error message', (done) => {
    request(app)
      .post(`/carts/${products[1].id}`)
      .set('Content-Type', 'application/json')
      .then(({ status, body }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('missing access token');
        done();
      });
  });

  it('fail add new product to cart when exceed the stock, return result code 400 and error message', (done) => {
    request(app)
      .post(`/carts/${products[0].id}`)
      .set({
        'Content-Type': 'application/json',
        access_token: access_token,
      })
      .then(({ status, body }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('quantity exceed stock');
        done();
      });
  });
});

// ------------------- GET
describe('Get all product that added to cart: GET /carts', () => {
  it('success get all products in cart, return code 200 and data cart in array', (done) => {
    request(app)
      .get('/carts')
      .set({
        'Content-Type': 'application/json',
        access_token: access_token,
      })
      .then(({ status, body }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('data', expect.any(Array));
        done();
      });
  });
});

// ------------------- PUT
describe('Increase quantity of product that has been added to cart: PUT /increase/:id', () => {
  it('success increase quantity of product in cart, return status 200 and increased qty data cart', (done) => {
    request(app)
      .put(`/carts/increase/${products[1].id}`)
      .set({
        'Content-Type': 'application/json',
        access_token: access_token,
      })
      .then(({ status, body }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('data');
        expect(body.data.qty).toBe(2);
        done();
      });
  });

  it('fail to increase quantity when exceed the stock, return status 400 and error message', (done) => {
    request(app)
      .put(`/carts/increase/${products[0].id}`)
      .set({
        'Content-Type': 'application/json',
        access_token: access_token,
      })
      .then(({ status, body }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('quantity exceed stock');
        done();
      });
  });
});

describe('Decrease quantity of product that has been added to cart: PUT /decrease/:id', () => {
  it('success decrease quantity of product in cart, return status 200 and decreased qty data cart', (done) => {
    request(app)
      .put(`/carts/decrease/${products[1].id}`)
      .set({
        'Content-Type': 'application/json',
        access_token: access_token,
      })
      .then(({ status, body }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('data');
        expect(body.data.qty).toBe(1);
        done();
      });
  });

  it('fail to decrease quantity when exceed the minimum quantity, return status 400 and error message', (done) => {
    request(app)
      .put(`/carts/increase/${products[1].id}`)
      .set({
        'Content-Type': 'application/json',
        access_token: access_token,
      })
      .then(({ status, body }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('cannot exceed minimum quantity');
        done();
      });
  });
});

// ------------------- PUT
describe('Delete cart by cart id: DELETE /carts/:id', () => {
  it('success delete cart by cart id, return code 200 and success message', (done) => {
    request(app)
      .post(`/carts/${products[2].id}`)
      .delete(`/products/${products[2].id}`)
      .set({
        'Content-Type': 'application/json',
        access_token: admin_access_token,
      })
      .then(({ status, body }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain(
          'product has been removed from cart list'
        );
        done();
      });
  });

  it('fail delete product in cart due to missing access_token, return code 401 and error message', (done) => {
    request(app)
      .delete(`/carts/${products[1].id}`)
      .set({
        'Content-Type': 'application/json',
      })
      .then(({ status, body }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('missing access token');
      });
  });
});

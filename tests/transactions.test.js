const request = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, User, Product, Transaction } = require('../models');
const { queryInterface } = sequelize;
const salt = bcrypt.genSaltSync(8);

const admin = {
  id: 1,
  email: 'john@example.com',
  password: bcrypt.hashSync('password', salt),
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const customer = {
  id: 2,
  email: 'jane@example.com',
  password: bcrypt.hashSync('password', salt),
  role: 'customer',
  createdAt: new Date(),
  updatedAt: new Date()
};

const product = {
  id: 1,
  name: 'kaos', 
  image_url: 'http://kaosimg.com',
  category: 't-shirt',
  price: 100000,
  stock: 50,
  UserId: admin.id,
  createdAt: new Date(),
  updatedAt: new Date()
};

const transaction = {
  productId: 1,
  status: 'cart',
  quantity: 2,
  total_price: 4000
};

const transactionNull = {
  productId: null,
  status: '',
  quantity: null,
  total_price: null
};

const transactionMin = {
  productId: 1,
  status: 'cart',
  quantity: -1,
  total_price: -2
};

const transactionFalse = {
  productId: 1,
  status: 'cart',
  quantity: false,
  total_price: false
};

const tokenCustomer = jwt.sign({ id: customer.id, role: customer.role }, process.env.JWT_SECRET);
let newTransaction

beforeAll((done) => {
  queryInterface
    .bulkDelete('Users', null, {})
    .then(() => {
      return queryInterface.bulkDelete("Products", null, {});
    })
    .then(() => {
      return queryInterface.bulkDelete("Transactions", null, {});
    })
    .then(() => {
      const users = [admin, customer];
      return queryInterface.bulkInsert('Users', users);
    })
    .then(() => {
      const products = [product];
      return queryInterface.bulkInsert('Products', products);
    })
    .then(() => {
      return Transaction.create({
        UserId: 2,
        ProductId: 1,
        status: 'cart',
        quantity: 1,
        total_price: 2000
      })
    })
    .then((transaction) => {
      newTransaction = transaction
      done()
    })
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
    .then(() => {
			return queryInterface.bulkDelete("Transactions", null, {});
		})
    .then(() => done())
    .catch((err) => {
      throw err;
    });
});

// CREATE
describe('POST /transactions', () => {

  it('Success add transaction, return transaction data)', (done) => {
    request(app)
      .post('/transactions')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .send(transaction)
      .then(({ body, status }) => {
        expect(status).toBe(201);
        expect(body).toHaveProperty('data', expect.any(Object));
        expect(body.data).toHaveProperty('id', expect.any(Number));
        expect(body.data).toHaveProperty('UserId', expect.any(Number));
        expect(body.data).toHaveProperty('ProductId', expect.any(Number));
        expect(body.data).toHaveProperty('status', expect.any(String));
        expect(body.data).toHaveProperty('quantity', expect.any(Number));
        expect(body.data).toHaveProperty('total_price', expect.any(Number));

        done();
      });
  });

  it('Fail add transaction if not provide access token, return error message', (done) => {
    request(app)
      .post('/transactions')
      .set('Content-Type', 'application/json')
      .send(transaction)
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Missing access token');

        done();
      });
  });

  it('Fail add transaction if required field empty or null, return error message', (done) => {
    request(app)
      .post('/transactions')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .send(transactionNull)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Product Id must not be null');
        expect(body.errorMessages).toContain('Status must not be empty');
        expect(body.errorMessages).toContain('Quantity must not be null');
        expect(body.errorMessages).toContain('Total price must not be null');

        done();
      });
  });

  it('Fail add transaction if fill negative quantity or total price number, return error message', (done) => {
    request(app)
      .post('/transactions')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .send(transactionMin)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Quantity cannot be negative');
        expect(body.errorMessages).toContain('Total price cannot be negative');

        done();
      });
  });

  it('Fail add transaction if fill wrong data type, return error message', (done) => {
    request(app)
      .post('/transactions')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .send(transactionFalse)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Quantity must be integer');
        expect(body.errorMessages).toContain('Total price must be integer');

        done();
      });
  });
});


// READ
describe('GET /transactions', () => {
  it('Success display list transaction, return list transaction data)', (done) => {
    request(app)
      .get('/transactions')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('data', expect.any(Array));
        expect(body.data[0]).toHaveProperty('id', expect.any(Number));
        expect(body.data[0]).toHaveProperty('UserId', expect.any(Number));
        expect(body.data[0]).toHaveProperty('ProductId', expect.any(Number));
        expect(body.data[0]).toHaveProperty('status', expect.any(String));
        expect(body.data[0]).toHaveProperty('quantity', expect.any(Number));
        expect(body.data[0]).toHaveProperty('total_price', expect.any(Number));

        done();
      });
  })

  it('Fail display list transaction if not provide access token, return error message', (done) => {
    request(app)
      .get('/transactions')
      .set('Content-Type', 'application/json')
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Missing access token');

        done();
      });
  });

});


// UPDATE
describe('PUT /transactions/:id', () => {
  it('Success update transaction, return transaction data)', (done) => {
    request(app)
      .put(`/transactions/${newTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .send(transaction)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('data', expect.any(Object));
        expect(body.data).toHaveProperty('id', expect.any(Number));
        expect(body.data).toHaveProperty('UserId', expect.any(Number));
        expect(body.data).toHaveProperty('ProductId', expect.any(Number));
        expect(body.data).toHaveProperty('status', expect.any(String));
        expect(body.data).toHaveProperty('quantity', expect.any(Number));
        expect(body.data).toHaveProperty('total_price', expect.any(Number));

        done();
      });
  })

  it('Fail update transaction if not provide access token, return error message', (done) => {
    request(app)
      .put(`/transactions/${newTransaction.id}`)
      .set('Content-Type', 'application/json')
      .send(transaction)
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Missing access token');

        done();
      });
  });

  it('Fail update transaction if fill negative quantity or total price number, return error message)', (done) => {
    request(app)
      .put(`/transactions/${newTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .send(transactionMin)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Quantity cannot be negative');
        expect(body.errorMessages).toContain('Total price cannot be negative');

        done();
      });
  })

  it('Fail update transaction if fill wrong data type, return error message)', (done) => {
    request(app)
      .put(`/transactions/${newTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .send(transactionFalse)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Quantity must be integer');
        expect(body.errorMessages).toContain('Total price must be integer');

        done();
      });
  })

});


// DELETE
describe('DELETE /transactions/:id', () => {
  it('Success delete transaction, return success delete message)', (done) => {
    request(app)
      .delete(`/transactions/${newTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('message', expect.any(String));
        expect(body.message).toContain('Cart success to delete');

        done();
      });
  })

  it('Fail delete transaction if not provide access token, return error message', (done) => {
    request(app)
      .delete(`/transactions/${newTransaction.id}`)
      .set('Content-Type', 'application/json')
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Missing access token');

        done();
      });
  });

});
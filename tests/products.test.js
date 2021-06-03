const request = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, User, Product } = require('../models');
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
  name: 'celana', 
  image_url: 'http://celanaurl.com',
  price: 30000,
  stock: 200
};

const productNull = {
  name: '', 
  image_url: '',
  price: null,
  stock: null
};

const productMin = {
  name: 'celana', 
  image_url: 'http://celanaurl.com',
  price: -1,
  stock: -2
};

const productFalse = {
  name: 'celana', 
  image_url: 'http://celanaurl.com',
  price: "price",
  stock: "stock"
};

const tokenAdmin = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET);
const tokenCustomer = jwt.sign({ id: customer.id, role: customer.role }, process.env.JWT_SECRET);
let newProduct

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
    .then(() => {
      return Product.create({
        name: 'celana',
        image_url: 'http://celanaurl.com',
        price: 100000,
        stock: 50,
        UserId: admin.id
      })
    })
    .then((product) => {
      newProduct = product
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
    .then(() => done())
    .catch((err) => {
      throw err;
    });
});

// CREATE
describe('POST /products', () => {

  it('Success add product, return product data)', (done) => {
    request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenAdmin)
      .send(product)
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
  });

  it('Fail add product if not provide access token, return error message', (done) => {
    request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .send(product)
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Missing access token');

        done();
      });
  });

  it('Fail add product if provide access token but not belong to admin role, return error message', (done) => {
    request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .send(product)
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Only admin can add, update and delete product');

        done();
      });
  });

  it('Fail add product if required field empty, return error message', (done) => {
    request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenAdmin)
      .send(productNull)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Name must not be empty');
        expect(body.errorMessages).toContain('Image url must not be empty');
        expect(body.errorMessages).toContain('Invalid url');
        expect(body.errorMessages).toContain('Price must not be null');
        expect(body.errorMessages).toContain('Stock must not be null');

        done();
      });
  });

  it('Fail add product if fill negative price or stock number, return error message', (done) => {
    request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenAdmin)
      .send(productMin)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Price cannot be negative');
        expect(body.errorMessages).toContain('Stock cannot be negative');

        done();
      });
  });

  it('Fail add product if fill wrong data type, return error message', (done) => {
    request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenAdmin)
      .send(productFalse)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Price must be integer');
        expect(body.errorMessages).toContain('Stock must be integer');

        done();
      });
  });
});


// READ
describe('GET /products', () => {
  it('Success display list product, return list product data)', (done) => {
    request(app)
      .get('/products')
      .set('Content-Type', 'application/json')
      .set("access_token", tokenAdmin)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('data', expect.any(Array));
        expect(body.data[0]).toHaveProperty('id', expect.any(Number));
        expect(body.data[0]).toHaveProperty('name', expect.any(String));
        expect(body.data[0]).toHaveProperty('image_url', expect.any(String));
        expect(body.data[0]).toHaveProperty('price', expect.any(Number));
        expect(body.data[0]).toHaveProperty('stock', expect.any(Number));
        expect(body.data[0]).toHaveProperty('UserId', expect.any(Number));

        done();
      });
  })

  it('Fail display list product if not provide access token, return error message', (done) => {
    request(app)
      .get('/products')
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
describe('PUT /products/:id', () => {
  it('Success update product, return product data)', (done) => {
    request(app)
      .put(`/products/${newProduct.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenAdmin)
      .send(product)
      .then(({ body, status }) => {
        expect(status).toBe(200);
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

  it('Fail update product if not provide access token, return error message', (done) => {
    request(app)
      .put(`/products/${newProduct.id}`)
      .set('Content-Type', 'application/json')
      .send(product)
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Missing access token');

        done();
      });
  });

  it('Fail update product if provide access token but not belong to admin role, return error message', (done) => {
    request(app)
      .put(`/products/${newProduct.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .send(product)
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Only admin can add, update and delete product');

        done();
      });
  });

  it('Fail update product if fill negative price or stock number, return error message)', (done) => {
    request(app)
      .put(`/products/${newProduct.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenAdmin)
      .send(productMin)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Price cannot be negative');
        expect(body.errorMessages).toContain('Stock cannot be negative');

        done();
      });
  })

  it('Fail update product if fill wrong data type, return error message)', (done) => {
    request(app)
      .put(`/products/${newProduct.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenAdmin)
      .send(productFalse)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Price must be integer');
        expect(body.errorMessages).toContain('Stock must be integer');

        done();
      });
  })

});


// DELETE
describe('DELETE /products/:id', () => {
  it('Success delete product, return success delete message)', (done) => {
    request(app)
      .delete(`/products/${newProduct.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenAdmin)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty('message', expect.any(String));
        expect(body.message).toContain('Product success to delete');

        done();
      });
  })

  it('Fail delete product if not provide access token, return error message', (done) => {
    request(app)
      .delete(`/products/${newProduct.id}`)
      .set('Content-Type', 'application/json')
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Missing access token');

        done();
      });
  });

  it('Fail delete product if provide access token but not belong to admin role, return error message', (done) => {
    request(app)
      .delete(`/products/${newProduct.id}`)
      .set('Content-Type', 'application/json')
      .set("access_token", tokenCustomer)
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty('errorMessages', expect.any(Array));
        expect(body.errorMessages).toContain('Only admin can add, update and delete product');

        done();
      });
  });

});





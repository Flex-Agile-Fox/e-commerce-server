const request = require('supertest');
const app = require('../app');
const { sequelize, User, Product } = require('../models');
const { queryInterface } = sequelize;
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(8);
const admin = {
	id: 1,
	name: 'Admin',
	email: 'admin@mail.com',
	password: bcrypt.hashSync('akunadmin', salt),
	role: 'admin',
	createdAt: new Date(),
	updatedAt: new Date(),
};
const admin_access_token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET);

const user = {
	id: 2,
	name: 'User',
	email: 'user@mail.com',
	password: bcrypt.hashSync('akunuser', salt),
	role: 'customer',
	createdAt: new Date(),
	updatedAt: new Date(),
};
const user_access_token = jwt.sign({ id: 2, role: 'customer' }, JWT_SECRET);

const newProduct = {
	name: 'Sepatu',
	image_url: 'google.com/Sepatu.jpg',
	price: 490000,
	stock: 5,
	category: 'Men',
};
const newProduct2 = {
	id: 2,
	name: 'Sandal',
	image_url: 'google.com/sandal.jpg',
	price: 15000,
	stock: 10,
	category: 'Kids',
	createdAt: new Date(),
	updatedAt: new Date(),
};
const newProduct3 = {
	id: 3,
	name: 'Sandal3',
	image_url: 'google.com/sandal3.jpg',
	price: 13000,
	stock: 11,
	category: 'Kids',
	createdAt: new Date(),
	updatedAt: new Date(),
};

beforeAll((done) => {
	queryInterface
		.bulkDelete('Users', null, {})
		.then(() => {
			return queryInterface.bulkDelete('Products', null, {});
		})
		.then(() => {
			const users = [admin, user];
			return queryInterface.bulkInsert('Users', users);
		})
		.then(() => {
			const products = [newProduct2, newProduct3];
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
		.then(() => done())
		.catch((err) => {
			throw err;
		});
});

// -----------------------------------POST
describe('Add new product: POST /products', () => {
	it('success add new product using admin account, return result code 201 and data new product', (done) => {
		request(app)
			.post('/products')
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.send(newProduct)
			.then(({ status, body }) => {
				expect(status).toBe(201);
				expect(body).toHaveProperty('data');
				done();
			});
	});

	it('fail add new product when not set access_token, return result code 401 and error message', (done) => {
		request(app)
			.post('/products')
			.set('Content-Type', 'application/json')
			.send(newProduct)
			.then(({ status, body }) => {
				expect(status).toBe(401);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain('missing access token');
				done();
			});
	});

	it('fail add new product when set access_token but not admin, return result 400 and error message', (done) => {
		request(app)
			.post('/products')
			.set({
				'Content-Type': 'application/json',
				access_token: user_access_token,
			})
			.send(newProduct)
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain('only admin that authorized');
				done();
			});
	});

	it('fail to add new product when required data field not filled; return status code 400 and error messages', (done) => {
		request(app)
			.post('/products')
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.send({
				name: '',
				image_url: '',
				price: null,
				stock: null,
				category: '',
			})
			.then(({ status, body }) => {
				const errMessage = [
					'product name cannot be empty string',
					'product image url must not be empty string',
					'price must not be null',
					'stock must not be null',
					'product category must not be empty string',
				];
				expect(status).toBe(400);
				expect(body).toHaveProperty(
					'message',
					expect.arrayContaining(errMessage)
				);
				done();
			});
	});

	it('fail to add new product if input stock minus, stock at least must be 1; return status code 400 and error message', (done) => {
		request(app)
			.post('/products')
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.send({
				name: newProduct.name,
				image_url: newProduct.image_url,
				price: newProduct.price,
				stock: -1,
				category: newProduct.category,
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain('stock at least must be 1');
				done();
			});
	});

	it('fail to add new product if input price minus; return status code 400 and error message', (done) => {
		request(app)
			.post('/products')
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.send({
				name: newProduct.name,
				image_url: newProduct.image_url,
				price: -2,
				stock: newProduct.stock,
				category: newProduct.category,
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain('price at least must be 1');
				done();
			});
	});

	it('fail add product due to input string in price or stock; return status code 400 and error message', (done) => {
		request(app)
			.post('/products')
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.send({
				name: newProduct.name,
				image_url: newProduct.image_url,
				price: 'Rp490.000',
				stock: 'empat',
				category: newProduct.category,
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain(
					'please input only numeric in price field'
				);
				expect(body.message).toContain(
					'please input only numeric in stock field'
				);
				done();
			});
	});
});

//--------------------------GET
describe('Get all product: GET /products', () => {
	it('success get all available products in database with admin account, return code 200 and data product', (done) => {
		request(app)
			.get('/products')
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.then(({ status, body }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty('data', expect.any(Array));
				done();
			});
	});

	it('success get all available products in database with customer account, return code 200 and data product', (done) => {
		request(app)
			.get('/products')
			.set({
				'Content-Type': 'application/json',
				access_token: user_access_token,
			})
			.then(({ status, body }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty('data', expect.any(Array));
				done();
			});
	});
});

//-------------------GET :id
describe('Get product by id: GET /products/:id', () => {
	it('success get detail product by product Id using admin account, return code 200 and the product data', (done) => {
		request(app)
			.get(`/products/${newProduct2.id}`)
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.then(({ status, body }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty('data', expect.any(Object));
				done();
			});
	});

	it('success get detail product by product Id using customer account, return code 200 and the product data', (done) => {
		request(app)
			.get(`/products/${newProduct2.id}`)
			.set({
				'Content-Type': 'application/json',
				access_token: user_access_token,
			})
			.then(({ status, body }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty('data', expect.any(Object));
				done();
			});
	});
});

//----------------------------PUT
describe('Edit a product: PUT /products/:id', () => {
	it('success edit detail of product :id with admin account, return code 200 and object data', (done) => {
		request(app)
			.put(`/products/${newProduct2.id}`)
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.send({
				name: 'sandal swallow',
				image_url: 'http://sandal',
				price: 17000,
				stock: 3,
				category: 'kids',
			})
			.then(({ status, body }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty('data', expect.any(Object));
				done();
			});
	});

	it('fail edit detail of product :id due to not admin access_token; return code 400 and error message', (done) => {
		request(app)
			.put(`/products/${newProduct2.id}`)
			.set({
				'Content-Type': 'application/json',
				access_token: user_access_token,
			})
			.send({
				name: 'sandal swallow',
				image_url: 'http://sandal',
				price: 17000,
				stock: 3,
				category: 'kids',
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain('only admin that authorized');
				done();
			});
	});

	it('fail edit detail product due to stock and/or price value is minus; return code 400 and error message', (done) => {
		request(app)
			.put(`/products/${newProduct2.id}`)
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.send({
				name: 'sandal swallow',
				image_url: 'http://sandal',
				price: -17000,
				stock: -3,
				category: 'kids',
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain('price at least must be 1');
				expect(body.message).toContain('stock at least must be 1');
				done();
			});
	});

	it('fail edit detail product due to input string data type in price and stock field; return code 400 and error message', (done) => {
		request(app)
			.put(`/products/${newProduct2.id}`)
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.send({
				name: 'sandal swallow',
				image_url: 'http://sandal',
				price: 'a',
				stock: 'a',
				category: 'kids',
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain(
					'please input only numeric in price field'
				);
				expect(body.message).toContain(
					'please input only numeric in stock field'
				);
				done();
			});
	});
});

//-------------------DELETE
describe('Delete a product: DELETE /products/:id', () => {
	it('success delete product of product :id, return code 200', (done) => {
		request(app)
			.delete(`/products/${newProduct2.id}`)
			.set({
				'Content-Type': 'application/json',
				access_token: admin_access_token,
			})
			.then(({ status, body }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain('product has been deleted');
				done();
			});
	});

	it('fail delete product due to missing access_token, return code 401 and error message', (done) => {
		request(app)
			.delete(`/products/${newProduct3.id}`)
			.set({
				'Content-Type': 'application/json',
			})
			.then(({ status, body }) => {
				expect(status).toBe(401);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain('missing access token');
				done();
			});
	});

	it('fail delete product due to set customer access_token, return code 400 and error message', (done) => {
		request(app)
			.delete(`/products/${newProduct3.id}`)
			.set({
				'Content-Type': 'application/json',
				access_token: user_access_token,
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty('message');
				expect(body.message).toContain('only admin that authorized');
				done();
			});
	});
});

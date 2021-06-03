const request = require('supertest');
const app = require('../app');
const { sequelize, User, Product } = require('../models');
const { queryInterface } = sequelize;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(8);
const admin = {
	name: 'Admin',
	email: 'admin@mail.com',
	password: bcrypt.hashSync('akunadmin', salt),
	role: 'admin',
	createdAt: new Date(),
	updatedAt: new Date(),
};

const user = {
	name: 'User',
	email: 'user@mail.com',
	password: bcrypt.hashSync('akunuser', salt),
	role: 'customer',
	createdAt: new Date(),
	updatedAt: new Date(),
};

const newProduct = {
	name: 'Sepatu',
	image_url: 'google.com/Sepatu.jpg',
	price: 490000,
	stock: 5,
	category: ['Sport', 'Men'],
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

describe('Add new product: POST /products', () => {
	it('success add new product using admin account, return result code 200 and data new product', (done) => {
		User.findOne({ where: { emailAdmin } }).then((user) => {
			const access_token = jwt.sign(
				{ id: user.id, role: user.role },
				procss.env.JWT_SECRET
			);
			request(app)
				.post('/products')
				.set({ 'Content-Type': 'application/json', access_token })
				.send(newProduct)
				.then(({ status, body }) => {
					expect(status).toBe(200);
					expect(body).toHaveProperty('data');
					done();
				});
		});
	});

	it('fail add new product when not set access_token, return result code 401 and error message', (done) => {
		request(app)
			.post('/products')
			.set('Content-Type', 'application/json')
			.send(newProduct)
			.then(({ status, body }) => {
				expect(status).toBe(401);
				expect(body.message).toContain('missing access token');
			});
	});

	it('fail add new product when set access_token but not admin, return result 400 and error message', (done) => {
		User.findOne({ where: { emailUser } }).then((user) => {
			const access_token = jwt.sign(
				{ id: user.id, role: user.role },
				process.env.JWT_SECRET
			);
			request(app)
				.post('/products')
				.set({ 'Content-Type': 'application/json', access_token })
				.send(newProduct)
				.then(({ status, body }) => {
					expect(status).toBe(400);
					expect(body.message).toContain('only admin that authorized');
				});
		});
	});

	it('fail to add new product when required data field not filled; return status code 400 and error messages', (done) => {
		User.findOne({ where: { emailAdmin } }).then((user) => {
			const access_token = jwt.sign(
				{ id: user.id, role: user.role },
				procss.env.JWT_SECRET
			);
			request(app)
				.post('/products')
				.set({ 'Content-Type': 'application/json', access_token })
				.send({
					name: '',
					image_url: '',
					price: null,
					stock: null,
					category: '',
				})
				.then(({ status, body }) => {
					const errMessage = [
						'please input product name',
						'please input product image',
						'price must not be null',
						'stock must not be null',
						'please select at least one category of product',
					];
					expect(status).toBe(400);
					expect(body).toHaveProperty(
						'message',
						expect.arrayContaining(errMessage)
					);
					done();
				});
		});
	});

	it('fail to add new product if input stock minus, stock at least must be 1; return status code 400 and error message', (done) => {
		User.findOne({ where: { emailAdmin } }).then((user) => {
			const access_token = jwt.sign(
				{ id: user.id, role: user.role },
				procss.env.JWT_SECRET
			);
			request(app)
				.post('/products')
				.set({ 'Content-Type': 'application/json', access_token })
				.send({
					name: 'Sepatu',
					image_url: 'google.com/Sepatu.jpg',
					price: 490000,
					stock: -1,
					category: ['Sport', 'Men'],
				})
				.then(({ status, body }) => {
					expect(status).toBe(400);
					expect(body.message).toContain('stock at least must be 1');
					done();
				});
		});
	});

	it('fail to add new product if input price minus; return status code 400 and error message', (done) => {
		User.findOne({ where: { emailAdmin } }).then((user) => {
			const access_token = jwt.sign(
				{ id: user.id, role: user.role },
				procss.env.JWT_SECRET
			);
			request(app)
				.post('/products')
				.set({ 'Content-Type': 'application/json', access_token })
				.send({
					name: 'Sepatu',
					image_url: 'google.com/Sepatu.jpg',
					price: -2,
					stock: 2,
					category: ['Sport', 'Men'],
				})
				.then(({ status, body }) => {
					expect(status).toBe(400);
					expect(body.message).toContain(
						'can not input price with minus number'
					);
					done();
				});
		});
	});

	it('fail add product due to input string in price or stock; return status code 400 and error message', (done) => {
		User.findOne({ where: { emailAdmin } }).then((user) => {
			const access_token = jwt.sign(
				{ id: user.id, role: user.role },
				procss.env.JWT_SECRET
			);
			request(app)
				.post('/products')
				.set({ 'Content-Type': 'application/json', access_token })
				.send({
					name: 'Sepatu',
					image_url: 'google.com/Sepatu.jpg',
					price: 'Rp490.000',
					stock: 'empat',
					category: ['Sport', 'Men'],
				})
				.then(({ status, body }) => {
					expect(status).toBe(400);
					expect(body.message).toContain(
						'please input only number in price and stock field'
					);
					done();
				});
		});
	});
});

describe('Get all product: GET /products', () => {
	it('success get all available products in database, return code 200 and data product', (done) => {
		request(app)
			.get('/products')
			.set('Content-Type', 'application/json')
			.then(({ status, body }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty('data');
				done();
			});
	});
});

describe('Get product by id: GET /products/:id', () => {
	it('success get detail product by product Id, return code 200 and the product data', (done) => {
		request(app)
			.get('/products/:id')
			.set('Content-Type', 'application/json')
			.then((response) => {
				expect(response.status).toBe(200);
				done();
			});
	});
});

describe('Edit a product: PUT /products/:id', () => {
	describe('Success edit product', () => {
		it('success edit detail of product :id, return code 200', (done) => {
			request(app)
				.put('/products/:id')
				.set('Content-Type', 'application/json')
				.then((response) => {
					expect(response.status).toBe(200);
					done();
				});
		});
	});
});

describe('Delete a product: DELETE /products/:id', () => {
	describe('Success delete product', () => {
		it('success delete product of product :id, return code 200', (done) => {
			request(app)
				.delete('/products/:id')
				.set('Content-Type', 'application/json')
				.then((response) => {
					expect(response.status).toBe(200);
					done();
				});
		});
	});
});

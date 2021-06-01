const request = require('supertest');
const app = require('../app');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;

// beforeAll((done) => {
// 	queryInterface
// 		.bulkDelete('Users', null, {})
// 		.then(() => {
// 			const salt = bcrypt.genSaltSync(10);
// 			const user = {
// 				email: 'dummy1@gmail.com',
// 				password: bcrypt.hashSync('password123', salt),
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 			};
// 			const users = [user];

// 			return queryInterface.bulkInsert('Users', users);
// 		})
// 		.then(() => done())
// 		.catch((err) => {
// 			throw err;
// 		});
// });

// afterAll((done) => {
// 	queryInterface
// 		.bulkDelete('Users', null, {})
// 		.then(() => done())
// 		.catch((err) => {
// 			throw err;
// 		});
// });

describe('POST /users/register', () => {
	describe('Success register', () => {
		it('success register with fresh and valid email/password; return status code 201, and access_token and user property', (done) => {
			request(app)
				.post('/users/register')
				.set('Content-Type', 'application/json')
				.send({
					name: 'Dummy',
					email: 'dummy@gmail.com',
					password: 'password123',
					role: 'customer',
				})
				.then(({ status, body }) => {
					expect(status).toBe(201);
					expect(body).toHaveProperty('access_token', expect.any(String));
					expect(body).toHaveProperty('user');
					done();
				});
		});
	});

	describe('Error register', () => {
		it('error register due to email must be unique; return status code 409, and error message', (done) => {
			request(app)
				.post('/users/register')
				.set('Content-Type', 'application/json')
				.send({
					name: 'Dummy',
					email: 'dummy@gmail.com',
					password: 'password123',
					role: 'customer',
				})
				.then(({ status, body }) => {
					expect(status).toBe(409);
					expect(body).toHaveProperty('message', 'email has been used');
					done();
				});
		});

		it('error register due to name is empty; return status code 400, and error message', (done) => {
			request(app)
				.post('/users/register')
				.set('Content-Type', 'application/json')
				.send({
					name: '',
					email: 'dummy1@gmail.com',
					password: 'password123',
					role: 'customer',
				})
				.then(({ status, body }) => {
					expect(status).toBe(400);
					expect(body).toHaveProperty('message', 'please input your name');
					done();
				});
		});

		it('error register due to email is empty; return status code 400, and error message', (done) => {
			request(app)
				.post('/users/register')
				.set('Content-Type', 'application/json')
				.send({
					name: 'Dummy1',
					email: '',
					password: 'password123',
					role: 'customer',
				})
				.then(({ status, body }) => {
					expect(status).toBe(400);
					expect(body).toHaveProperty(
						'message',
						'please input your mail address'
					);
					done();
				});
		});

		it('error register due to password is empty; return status code 400, and error message', (done) => {
			request(app)
				.post('/users/register')
				.set('Content-Type', 'application/json')
				.send({
					name: 'Dummy1',
					email: 'dummy1@gmail.com',
					password: '',
					role: 'customer',
				})
				.then(({ status, body }) => {
					expect(status).toBe(400);
					expect(body).toHaveProperty('message', 'please input your password');
					done();
				});
		});

		it('error register due to role is empty; return status code 400, and error message', (done) => {
			request(app)
				.post('/users/register')
				.set('Content-Type', 'application/json')
				.send({
					name: 'Dummy1',
					email: 'dummy@gmail.com',
					password: 'password123',
					role: '',
				})
				.then(({ status, body }) => {
					expect(status).toBe(400);
					expect(body).toHaveProperty('message', 'role must not be empty');
					done();
				});
		});
	});
});

describe('POST /users/login', () => {
	describe('Success login', () => {
		it('success login with registered account, return status code 200', (done) => {
			request(app)
				.post('/users/login')
				.set('Content-Type', 'application/json')
				.send({ email: 'dummy1@gmail.com', password: 'password123' })
				.then((response) => {
					expect(response.status).toBe(200);
					done();
				});
		});
	});

	// it('fail login with invalid email/password, return status code 401', (done) => {
	// 	request(app)
	// 		.post('/users/login')
	// 		.set('Content-Type', 'application/json')
	// 		.send({ email: 'dummy@mail.com', password: 'password' })
	// 		.then((response) => {
	// 			expect(response.status).toBe('401');
	// 			done();
	// 		});
	// });
});

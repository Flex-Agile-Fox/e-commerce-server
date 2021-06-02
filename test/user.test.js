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

	it('fail register due to email must be unique; return status code 409, and error message', (done) => {
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

	it('fail register due to name is empty; return status code 400, and error message', (done) => {
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

	it('fail register due to email is empty; return status code 400, and error message', (done) => {
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

	it('fail register due to password is empty; return status code 400, and error message', (done) => {
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

	it('fail register due to role is empty; return status code 400, and error message', (done) => {
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

	it('fail register due to name, email, password, and role is empty; return status 400, and error message', (done) => {
		request(app)
			.post('/users/register')
			.set('Content-Type', 'application/json')
			.send({
				name: '',
				email: '',
				password: '',
				role: '',
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty('message', 'please input your name');
				expect(body).toHaveProperty(
					'message',
					'please input your mail address'
				);
				expect(body).toHaveProperty('message', 'please input your password');
				expect(body).toHaveProperty('message', 'role must not be empty');
				done();
			});
	});

	it('fail register due to invalid email account validation; return status 400, and error message', (done) => {
		request(app)
			.post('/users/register')
			.set('Content-Type', 'application/json')
			.send({
				name: 'Dummy1',
				email: 'dummy.com',
				password: 'dummy123',
				role: 'customer',
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty(
					'message',
					'please input valid mail address'
				);
				done();
			});
	});

	it('fail register due to password length validation; return status 400, and error message', (done) => {
		request(app)
			.post('/users/register')
			.set('Content-Type', 'application/json')
			.send({
				name: 'Dummy1',
				email: 'dummy1@gmail.com',
				password: '123',
				role: 'customer',
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty(
					'message',
					'password at least must be 6 characters'
				);
				done();
			});
	});

	it('fail register due to name length validation; return status 400, and error message', (done) => {
		request(app)
			.post('/users/register')
			.set('Content-Type', 'application/json')
			.send({
				name: 'Oz',
				email: 'dummy1@gmail.com',
				password: 'dummy123',
				role: 'customer',
			})
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty(
					'message',
					'name at least must be 3 characters'
				);
				done();
			});
	});
});

describe('POST /users/login', () => {
	it('success login with registered account, return status code 200, access_token and user property', (done) => {
		request(app)
			.post('/users/login')
			.set('Content-Type', 'application/json')
			.send({ email: 'dummy1@gmail.com', password: 'password123' })
			.then(({ status, body }) => {
				expect(status).toBe(200);
				expect(body).toHaveProperty('access_token', expect.any(String));
				expect(body).toHaveProperty('user');
				done();
			});
	});

	it('fail login due to email not found; return status code 401, and error message', (done) => {
		request(app)
			.post('/users/login')
			.set('Content-Type', 'application/json')
			.send({ email: 'dummy2@gmail.com', password: 'password1234' })
			.then(({ status, body }) => {
				expect(status).toBe(401);
				expect(body).toHaveProperty('message', 'wrong email or password');
				done();
			});
	});

	it('fail login due to wrong password; email and password not match; return status code 401, and error message', (done) => {
		request(app)
			.post('/users/login')
			.set('Content-Type', 'application/json')
			.send({ email: 'dummy1@gmail.com', password: 'password' })
			.then(({ status, body }) => {
				expect(status).toBe(401);
				expect(body).toHaveProperty('message', 'wrong email or password');
				done();
			});
	});

	it('fail login due to email and password empty; return status code 400, and error message', (done) => {
		request(app)
			.post('/users/login')
			.set('Content-Type', 'application/json')
			.send({ email: '', password: '' })
			.then(({ status, body }) => {
				expect(status).toBe(400);
				expect(body).toHaveProperty(
					'message',
					'please input your email and password'
				);
				done();
			});
	});
});

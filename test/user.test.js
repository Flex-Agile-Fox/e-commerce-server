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
	it('success register with fresh and valid email/password, return status code 201', (done) => {
		request(app)
			.post('/users/register')
			.set('Content-Type', 'application/json')
			.send({
				email: 'dummy@gmail.com',
				password: 'password123',
				role: 'customer',
			})
			.then((response) => {
				expect(response.status).toBe(201);
				done();
			});
	});

	// it('fail register with fresh but invalid email/password, return status code 400', (done) => {
	// 	request(app)
	// 		.post('/users/register')
	// 		.set('Content-Type', 'application/json')
	// 		.send({ email: 'dummy.com', password: '123' })
	// 		.then((response) => {
	// 			expect(response.status).toBe('400');
	// 			done();
	// 		});
	// });
});

describe('POST /users/login', () => {
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

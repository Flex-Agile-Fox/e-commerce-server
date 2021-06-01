const request = require('supertest');
const app = require('../app');

describe('POST /users/login', () => {
	it('success login using account with role admin, return status code 200', (done) => {
		request(app)
			.post('/users/login')
			.set('Content-Type', 'application/json')
			.send({ email: 'admin@mail.com', password: 'akunadmin' })
			.then((response) => {
				const { status, body } = response;
				expect(status).toBe(200);
				done();
			});
	});

	// 	it('fail login using account with role admin, if email/password not match return status code 401', (done) => {
	// 		request(app)
	// 			.post('/users/login')
	// 			.set('Content-Type', 'application/json')
	// 			.send({ email: 'admin@mail.com', password: 'password' })
	// 			.then((response) => {
	// 				expect(response.status).toBe('401');
	// 				done();
	// 			});
	// 	});
});

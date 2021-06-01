const request = require('supertest');
const app = require('../app');

describe('POST /users/login', () => {
	describe('Success login admin account', () => {
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
	});

	describe('Error login admin account', () => {});
});

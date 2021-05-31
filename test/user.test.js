const request = reqire('supertest');
const app = require('../app');

describe('POST /users/login', () => {
	it('success login using account with role admin, return access_token', (done) => {
		request(app)
			.post('/users/login')
			.set('Content-Type', 'application/json')
			.send({ email: 'admin@mail.com', password: 'akunadmin' })
			.then((response) => {
				console.log(response);
				const { status, body } = response;
				expect(status).toBe('200');
				done();
			});
	});
});

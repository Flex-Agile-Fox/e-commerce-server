const request = require('supertest');
const app = require('../app');

describe('POST /products', () => {
	it('success add new product, return result code 200', (done) => {
		request(app)
			.post('/products')
			.set('Content-Type', 'application/json')
			.send({
				name: 'Nike',
				image_url: '',
				price: 490000,
				stock: 5,
				category: ['Sport', 'Men'],
			})
			.then((response) => {
				expect(response.status).toBe(200);
				done();
			});
	});
});

describe('GET /products', () => {
	it('success get all available products in database, return code 200', (done) => {
		request(app)
			.get('/products')
			.set('Content-Type', 'application/json')
			.then((response) => {
				expect(response.status).toBe(200);
				done();
			});
	});
});

describe('GET /products/:id', () => {
	it('success get detail product by product Id, return code 200', (done) => {
		request(app)
			.get('/products/:id')
			.set('Content-Type', 'application/json')
			.then((response) => {
				expect(response.status).toBe(200);
				done();
			});
	});
});

describe('PUT /products/:id', () => {
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

describe('DELETE /products/:id', () => {
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

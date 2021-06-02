const request = require('supertest')
const app = require('../app')


describe('GET /product', () => {
    it('Berhasil get data semua Produk', (done) => {
        request(app)
            .get('/product')
            .set('Content-Type', 'application/json')
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});

describe('GET /product/:id', () => {
    it('Berhasil get detail data produk', (done) => {
        request(app)
            .get('/product/:id')
            .set('Content-Type', 'application/json')
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});


// =================== POST PRODUK
// tambah data produk
describe('POST /product', () => {
    it('Berhasil tambah Produk', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .send({ 
                name: 'buku', 
                image_url: '', 
                price: 123456, 
                stock: 1, 
                category:'new',
            })
            .then((response) => {
                expect(response.status).toBe(201);
                done();
            });
    });
});

// ERORR POST data produk kosong
describe('POST /product', () => {
    it('error, data tidak boleh kosong', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .send({ 
                name: '', 
                image_url: '', 
                price: 0, 
                stock: 0, 
                category: '',
            })
            .then((response) => {
                expect(response.status).toBe(201);
                done();
            });
    });
});

// ERORR POST data stok produk di input minus
describe('POST /product', () => {
    it('error, data tidak boleh kosong', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .send({ 
                name: '', 
                image_url: '', 
                price: 0, 
                stock: -3, 
                category: '',
            })
            .then((response) => {
                expect(response.status).toBe(201);
                done();
            });
    });
});

// ERORR POST data price produk diisi minus
describe('POST /product', () => {
    it('error, data tidak boleh kosong', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .send({ 
                name: '', 
                image_url: '', 
                price: -1000, 
                stock: 0, 
                category: '',
            })
            .then((response) => {
                expect(response.status).toBe(201);
                done();
            });
    });
});

// ERORR POST data price dan stok produk di isi tipe data string
describe('POST /product', () => {
    it('error, data tidak boleh kosong', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .send({ 
                name: '', 
                image_url: '', 
                price: '30000', 
                stock: '10', 
                category: '',
            })
            .then((response) => {
                expect(response.status).toBe(201);
                done();
            });
    });
});

// =================== POST PRODUK END



// =================== PUT PRODUK
// Update data produk
describe('PUT /product/:id', () => {
    it('Berhasil detail data produk', (done) => {
        request(app)
            .put('/product/:id')
            .set('Content-Type', 'application/json')
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: 100, 
                stock: 20, 
                category: 'art',
            })
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});

// ERORR PUT data stok di isi minus
describe('PUT /product/:id', () => {
    it('Berhasil detail data produk', (done) => {
        request(app)
            .put('/product/:id')
            .set('Content-Type', 'application/json')
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: 100, 
                stock: -20, 
                category: 'art',
            })
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});

// ERORR PUT data price di isi minus
describe('PUT /product/:id', () => {
    it('Berhasil detail data produk', (done) => {
        request(app)
            .put('/product/:id')
            .set('Content-Type', 'application/json')
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: -100, 
                stock: 20, 
                category: 'art',
            })
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});

// ERORR PUT data price dan stok produk di isi tipe data string
describe('PUT /product/:id', () => {
    it('Berhasil detail data produk', (done) => {
        request(app)
            .put('/product/:id')
            .set('Content-Type', 'application/json')
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: '100', 
                stock: '20', 
                category: 'art',
            })
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});

// =================== PUT PRODUK END




describe('DELETE /product', () => {
    it('Berhasil detail data produk', (done) => {
        request(app)
            .delete('/product/:id')
            .set('Content-Type', 'application/json')
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});
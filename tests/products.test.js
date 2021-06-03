const request = require('supertest')
const app = require('../app')
const { sequelize, User } = require('../models');
const { queryInterface } = sequelize;
const jwt = require('jsonwebtoken')

const userAdmin = {
    id: 1,
    name: "admin",
    email:"admin@mail.com",
    password: "admin",
    role: "admin"
}

const access_token_admin = jwt.sign(
    {
        id: userAdmin.id,
        name: userAdmin.name, 
        email:userAdmin.email, 
        role: userAdmin.role
    }, process.env.JWT_SECREAT)

afterAll((done) => {
	queryInterface
		.bulkDelete("Products", null, {})
		.then(() => done())
		.catch((err) => {
			throw err;
		});
});

// =================== GET PRODUK

describe('GET /product', () => {
    it('SUCCESS: Berhasil get data semua Produk', (done) => {
        request(app)
            .get('/product')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .then(({ body, status }) => {
                expect(status).toBe(200);
                expect(body).toHaveProperty("success", true);
                done();
            });
    });  

});

// =================== GET PRODUK END



// =================== POST PRODUK

describe('POST /product', () => {
    it('SUCCESS: Berhasil tambah Produk', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({
                name: "buku gambar",
                image_url: "test.jpg",
                price: 555,
                stock: 777
            })
            .then(({ body, status }) => {
                expect(status).toBe(201);
                expect(body).toHaveProperty("success", true);
                done();
            });
    });

    it('ERROR: Tidak menyertakan access_token', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            // .set('access_token', access_token)
            .send({
                name: "buku gambar",
                image_url: "test.jpg",
                price: 555,
                stock: 777
            })
            .then(({ body, status }) => {
                expect(status).toBe(401);
                expect(body).toHaveProperty("success", false);
                done();
            });
    });

    it('ERROR: name, image_url, price, stock tidak boleh kosong', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({
                name: "",
                image_url: "",
                price: "",
                stock: ""
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("success", false);
                done();
            });
    });

    it('ERROR: stock di isi angka minus', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({
                name: "buku gambar",
                image_url: "test.jpg",
                price: 555,
                stock: -1
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("success", false);
                done();
            });
    });

    it('ERROR: price di isi angka minus', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({
                name: "buku gambar",
                image_url: "test.jpg",
                price: -1,
                stock: 32
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("success", false);
                done();
            });
    });

    it('ERROR: price dan stock diisi string', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({
                name: "buku gambar",
                image_url: "test.jpg",
                price: "uhuk uhuk",
                stock: "test"
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("success", false);
                done();
            });
    });

});

// =================== POST PRODUK END



// =================== PUT PRODUK

describe('PUT /product/:id', () => {
    it('SUCCESS: Berhasil update data produk berdasarkan parameter', (done) => {
        request(app)
            .put('/product/1')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: 100, 
                stock: 20
            })
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });

    it('ERROR: tidak menyertakan access_token', (done) => {
        request(app)
            .put('/product/1')
            .set('Content-Type', 'application/json')
            // .set('access_token', access_token)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: 888, 
                stock: 20
            })
            .then((response) => {
                expect(response.status).toBe(401);
                done();
            });
    });

    it('ERROR: stock diisi angka minus', (done) => {
        request(app)
            .put('/product/1')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: 888, 
                stock: -1
            })
            .then((response) => {
                expect(response.status).toBe(400);
                done();
            });
    });

    it('ERROR: price diisi angka minus', (done) => {
        request(app)
            .put('/product/1')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: -8, 
                stock: 120
            })
            .then((response) => {
                expect(response.status).toBe(400);
                done();
            });
    });

    it('ERROR: field (price dan stok) diisi tipe data yang tidak sesuai (string)', (done) => {
        request(app)
            .put('/product/1')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: "harusnynya integer", 
                stock: "harusnynya integer"
            })
            .then((response) => {
                expect(response.status).toBe(400);
                done();
            });
    });

});

// =================== PUT PRODUK END



// =================== DELETE PRODUK

describe('DELETE /product/:id', () => {
    it('SUCCESS: Berhasil delete data produk berdasarkan id', (done) => {
        request(app)
            .delete('/product/1')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });

    it('ERROR: tidak menyertakan access_token', (done) => {
        request(app)
            .delete('/product/1')
            .set('Content-Type', 'application/json')
            // .set('access_token', access_token)
            .then((response) => {
                expect(response.status).toBe(401);
                done();
            }); 
    });

});

// =================== DELETE PRODUK END

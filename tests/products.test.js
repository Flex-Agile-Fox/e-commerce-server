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

const userCustomer = {
    id: 2,
    name: "erick",
    email:"erick@mail.com",
    password: "123456",
    role: "customer"
}

const access_token_customer = jwt.sign(
    {
        id: userCustomer.id,
        name: userCustomer.name, 
        email:userCustomer.email, 
        role: userCustomer.role
    }, process.env.JWT_SECREAT)


// =================== GET PRODUK

describe('GET /product', () => {
    it('SUCCESS GET PRODUCT: Berhasil get data semua Produk', (done) => {
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
    
    it('ERROR GET PRODUCT: access_token bukan admin', (done) => {
        request(app)
            .get('/product')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .then(({ body, status }) => {
                // console.log(body.errMsg[0]," MANTAP!! ini GETTERRESDS ==================================================================")
                expect(status).toBe(401);
                expect(body).toHaveProperty("success", false);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Anda tidak punya akses. silahkan hubungi admin")
                done();
            });
    });

});

// =================== GET PRODUK END


// =================== POST PRODUK
let idProduct
describe('POST /product', () => {
    it('SUCCESS POST PRODUCT: Berhasil tambah Produk', (done) => {
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
                idProduct = parseInt(body.data.id)
                expect(status).toBe(201);
                expect(body).toHaveProperty("success", true);
                done();
            });
    });


    it('ERROR POST PRODUCT: access_token bukan admin', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .send({
                name: "buku gambar",
                image_url: "test.jpg",
                price: 555,
                stock: 777
            })
            .then(({ body, status }) => {
                expect(status).toBe(401);
                expect(body).toHaveProperty("success", false);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Anda tidak punya akses. silahkan hubungi admin")
                done();
            });
    });


    it('ERROR POST PRODUCT: Tidak menyertakan access_token', (done) => {
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
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Access token tidak ditemukan")
                done();
            });
    });

    it('ERROR POST PRODUCT: name, image_url, price, stock tidak boleh kosong', (done) => {
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
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Nama tidak boleh kosong")
                done();
            });
    });

    it('ERROR POST PRODUCT: stock di isi angka minus', (done) => {
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
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Stock tidak boleh minus")
                done();
            });
    });

    it('ERROR POST PRODUCT: price di isi angka minus', (done) => {
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
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Price tidak boleh minus")
                done();
            });
    });

    it('ERROR POST PRODUCT: price dan stock diisi string', (done) => {
        request(app)
            .post('/product')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({
                name: "buku gambar",
                image_url: "test.jpg",
                price: "abs",
                stock: "fsldkj"
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("success", false);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Price harus di isi angka")
                done();
            });
    });

});

// =================== POST PRODUK END


// =================== GET DETAIL PRODUK

describe('GET /product/:id', () => {
    it('SUCCESS GET DETAIL PRODUCT: Berhasil get detail Produk', (done) => {
        request(app)
            .get(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .then(({ body, status }) => {
                expect(status).toBe(200);
                expect(body).toHaveProperty("success", true);
                done();
            });
    });
    
    it('ERROR GET DETAIL PRODUCT: access_token bukan admin', (done) => {
        request(app)
            .get(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .then(({ body, status }) => {
                // console.log(body.errMsg[0]," MANTAP!! ini GETTERRESDS ==================================================================")
                expect(status).toBe(401);
                expect(body).toHaveProperty("success", false);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Anda tidak punya akses. silahkan hubungi admin")
                done();
            });
    });

});

// =================== GET DETAIL PRODUK END


// =================== PUT PRODUK

describe('PUT /product/:id', () => {
    it('SUCCESS PUT PRODUCT: Berhasil update data produk berdasarkan parameter', (done) => {
        request(app)
            .put(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: 100, 
                stock: 20
            })
            .then(({ body, status }) => {
                expect(status).toBe(200);
                done();
            });
    });

    it('ERROR PUT PRODUCT: token bukan milik admin', (done) => {
        request(app)
            .put(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: 100, 
                stock: 20
            })
            .then(({ body, status }) => {
                expect(status).toBe(401);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Anda tidak punya akses. silahkan hubungi admin")
                done();
            });
    });

    it('ERROR PUT PRODUCT: tidak menyertakan access_token', (done) => {
        request(app)
            .put(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            // .set('access_token', access_token)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: 888, 
                stock: 20
            })
            .then(({ body, status }) => {
                expect(status).toBe(401);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Access token tidak ditemukan")
                done();
            });
    });

    it('ERROR PUT PRODUCT: stock diisi angka minus', (done) => {
        request(app)
            .put(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: 888, 
                stock: -1
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Stock tidak boleh minus")
                done();
            });
    });

    it('ERROR PUT PRODUCT: price diisi angka minus', (done) => {
        request(app)
            .put(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: -8, 
                stock: 120
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Price tidak boleh minus")
                done();
            });
    });

    it('ERROR PUT PRODUCT: field (price dan stok) diisi tipe data yang tidak sesuai (string)', (done) => {
        request(app)
            .put(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .send({ 
                name: 'tempat pensil', 
                image_url: 'tempat_pensil.jpg', 
                price: "harusnynya integer", 
                stock: "harusnynya integer"
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Price harus di isi angka")
                done();
            });
    });

});

// =================== PUT PRODUK END


// =================== DELETE PRODUK

describe('DELETE /product/:id', () => {
    it('SUCCESS DELETE PRODUCT: Berhasil delete data produk berdasarkan id', (done) => {
        request(app)
            .delete(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_admin)
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });

    it('ERROR DELETE PRODUCT: access_Token bukan milik admin', (done) => {
        request(app)
            .delete(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .then(({ body, status }) => { 
                expect(status).toBe(401);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Anda tidak punya akses. silahkan hubungi admin")
                done();
            });
    });

    it('ERROR DELETE PRODUCT: tidak menyertakan access_token', (done) => {
        request(app)
            .delete(`/product/${idProduct}`)
            .set('Content-Type', 'application/json')
            // .set('access_token', access_token)
            .then(({ body, status }) => {
                expect(status).toBe(401);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Access token tidak ditemukan")
                done();
            }); 
    });

});

// =================== DELETE PRODUK END


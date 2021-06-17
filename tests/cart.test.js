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


// POST PRODUCT
let idProduct
let idCart
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
});


// =================== GET CART

describe('GET /cart', () => {
    it('SUCCESS GET CART: Berhasil get data semua Cart', (done) => {
        request(app)
            .get('/cart')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .then(({ body, status }) => {
                expect(status).toBe(200);
                expect(body).toHaveProperty("success", true);
                done();
            });
    });

    it('ERROR GET CART: Tidak menyertakan access_token', (done) => {
        request(app)
            .get('/cart')
            .set('Content-Type', 'application/json')
            // .set('access_token', access_token_customer)
            .then(({ body, status }) => {
                expect(status).toBe(401);
                expect(body).toHaveProperty("success", false);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Access token tidak ditemukan")
                done();
            });
    });

});

// =================== GET CART END

// =================== POST CART
describe('POST /cart', () => {
    it('SUCCESS POST CART: Berhasil tambah Produk', (done) => {
        request(app)
            .post('/cart')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .send({
                UserId: 2,
                ProductId: idProduct,
                qty: 4,
                price: 7000
            })
            .then(({ body, status }) => {
                idCart = parseInt(body.data.id)
                expect(status).toBe(201);
                expect(body).toHaveProperty("success", true);
                done();
            });
    });


    it('ERROR POST CART: Tidak menyertakan access_token', (done) => {
        request(app)
            .post('/cart')
            .set('Content-Type', 'application/json')
            // .set('access_token', access_token_customer)
            .send({
                UserId: 2,
                ProductId: idProduct,
                qty: 4,
                price: 7000
            })
            .then(({ body, status }) => {
                expect(status).toBe(401);
                expect(body).toHaveProperty("success", false);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Access token tidak ditemukan")
                done();
            });
    });


    
    it('ERROR POST CART: qty dan price tidak boleh string', (done) => {
        request(app)
            .post('/cart')
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .send({
                UserId: 2,
                ProductId: idProduct,
                qty: "hello",
                price: "hello"
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("success", false);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("qty harus di isi angka")
                done();
            });
    });

    
});

describe('PUT /cart/:id', () => {
    it('SUCCESS PUT CART: Berhasil update data cart berdasarkan parameter', (done) => {
        request(app)
            .put(`/cart/${idCart}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .send({
                UserId: 2,
                ProductId: idProduct,
                qty: 2,
                price: 7000
            })
            .then(({ body, status }) => {
                expect(status).toBe(200);
                done();
            });
    });

    it('Error PUT CART: tidak menyertakan access_token', (done) => {
        request(app)
            .put(`/cart/${idCart}`)
            .set('Content-Type', 'application/json')
            // .set('access_token', access_token_customer)
            .send({
                UserId: 2,
                ProductId: idProduct,
                qty: 2,
                price: 7000
            })
            .then(({ body, status }) => {
                expect(status).toBe(401);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("Access token tidak ditemukan")
                done();
            });
    });

    it('ERROR PUT CART: qty dan price tidak boleh string', (done) => {
        request(app)
            .put(`/cart/${idCart}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .send({
                UserId: 2,
                ProductId: idProduct,
                qty: "hello",
                price: "hello"
            })
            .then(({ body, status }) => {
                expect(status).toBe(400);
                expect(body).toHaveProperty("success", false);
                expect(body).toHaveProperty("errMsg");
                expect(body.errMsg).toContain("qty harus di isi angka")
                done();
            });
    });
});


describe('DELETE /cart/:id', () => {
    it('SUCCESS DELETE CART: Berhasil delete data cart berdasarkan id', (done) => {
        request(app)
            .delete(`/cart/${idCart}`)
            .set('Content-Type', 'application/json')
            .set('access_token', access_token_customer)
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });

    it('ERROR DELETE CART: tidak menyertakan access_token', (done) => {
        request(app)
            .delete(`/cart/${idCart}`)
            .set('Content-Type', 'application/json')
            // .set('access_token', access_token_customer)
            .then((response) => {
                expect(response.status).toBe(401);
                done();
            });
    });
});
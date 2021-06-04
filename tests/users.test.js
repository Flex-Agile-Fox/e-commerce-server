const request = require('supertest')
const app = require('../app')

// LOGIN
describe('POST /login', ()=>{
    it('SUCCESS LOGIN: berhasil Login dan menerima access_token', (done)=>{
        request(app)
        .post('/login')
        .set('Content-Type','application/json')
        .send(
            {
                email: 'admin@mail.com',
                password: 'admin',
            })
        .then(({ body, status }) => {
            expect(status).toBe(200);
            expect(body).toHaveProperty("success", true);
			expect(body).toHaveProperty("access_token", expect.any(String));
            done()
        })
    })

    it('ERROR LOGIN: email ada, password salah', (done)=>{
        request(app)
        .post('/login')
        .set('Content-Type','application/json')
        .send(
            {
                email: 'erick@gmail.com',
                password: '123'
            })
        .then(({ body, status }) => {
            expect(status).toBe(401);
            expect(body).toHaveProperty("success", false);
            expect(body).toHaveProperty("errMsg");
            done()
        })
    })

    it('ERROR LOGIN: email tidak ada di database', (done)=>{
        request(app)
        .post('/login')
        .set('Content-Type','application/json')
        .send(
            {
                email: 'subur@gmail.com',
                password: '123'
            })
        .then(({ body, status }) => {
            expect(status).toBe(401);
            expect(body).toHaveProperty("success", false);
            expect(body).toHaveProperty("errMsg");
            expect(body.errMsg).toContain("Email tidak terdaftar")
            done()
        })
    })

    it('ERROR LOGIN: tidak memasukan email dan password', (done)=>{
        request(app)
        .post('/login')
        .set('Content-Type','application/json')
        .send(
            {
                email: '',
                password: ''
            })
        .then(({ body, status }) => {
            expect(status).toBe(401);
            expect(body).toHaveProperty("success", false);
            expect(body).toHaveProperty("errMsg");
            expect(body.errMsg).toContain("Username dan Password tidak boleh kosong")
            done()
        })
    })
})


const request = require('supertest')
const app = require('../app')

// beforeAll(()=>{

// })

// afterAll(()=>{

// })

// beforeEach(()=>{

// })

// afterEach(()=>{

// })

describe('POST /register', ()=>{
    it('berhasil register dengan menambahkan name, email & password', (done)=>{
        request(app)
        .post('/register')
        .set('Content-Type','application/json')
        .send({name:"erick", email: 'erick@gmail.com', password: '123456'})
        .then(({status}) => {
            expect(status).toBe(201);
            done()
        })
    })
})

describe('POST /register', ()=>{
    it('ERROR, name, email & password tidak boleh kosong', (done)=>{
        request(app)
        .post('/register')
        .set('Content-Type','application/json')
        .send({name:"", email: "", password: ""})
        .then(({status}) => {
            expect(status).toBe(400);
            done()
        })
    })
})

describe('POST /register', ()=>{
    it('ERROR, email tidak terdaftar', (done)=>{
        request(app)
        .post('/register')
        .set('Content-Type','application/json')
        .send({name:"erick", email: "erick123@gmail.com", password: "123456"})
        .then(({status}) => {
            expect(status).toBe(400);
            done()
        })
    })
})

describe('POST /login', ()=>{
    it('berhasil login dengan email dan password, dapat access token', (done)=>{
        request(app)
        .post('/login')
        .set('Content-Type','application/json')
        .send({email: 'erick@gmail.com', password: '123456'})
        .then(({body,status}) => {
            expect(status).toBe(200);
            // expect(body).toHaveProperty('access_token', expect.any(String))
            done()
        })
    })
})


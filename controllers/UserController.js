const {User , Product} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
const sendEmail = require('../helpers/sendEmail')
// const nodemailer = require('nodemailer');

class UserController{
    static register(req,res,next){
        const {name,email,password,role} = req.body
        User.create({name,email,password,role})
        .then((user) => {
            // call function send Email in helpers
            sendEmail(user.email)
            res.status(201).json({success:true, message:"Anda berhasil register.."})
        }).catch((err) => {
            next(err)
        });
    }

    static login(req,res,next){
        const {email,password} = req.body
        // jika email / password kosong
        if(!email || !password){
            return next({name : 'LOGIN_VALIDATION'})
        }else{
            User.findOne({where: {email}})
            .then((user) => {
                // jika ada email
                if(user && bcrypt.compareSync(password, user.password)) {
                    // jika password sesuai
                    const access_token = jwt.sign({id:user.id,role:user.role}, process.env.JWT_SECREAT)
                    res.status(200).json(
                        {
                            success: true, 
                            message: 'Anda berhasil login', 
                            UserId: user.id, 
                            name: user.name, 
                            access_token
                        })
                }else{
                    throw{name:'LOGIN_FAIL'}
                }
            }).catch((err) => {
                next(err)
            });
        }
    }


    static google(req,res,next){
        const { idToken } = req.body;
        if (!idToken) return next('MISSING_ACCESS_TOKEN');

        let name
        let email;
        let statusCode = 200;
        client
        .verifyIdToken({ idToken, audience: process.env.GOOGLE_OAUTH_CLIENT_ID })
        .then((ticket) => {
            console.log(ticket)
            name = ticket.getPayload().given_name;
            email = ticket.getPayload().email;
            return User.findOne({ where: { email } });
        })
        .then((user) => {
            if (user) return user;
            statusCode = 201;
            return User.create({
                name,
                email,
                password: process.env.GOOGLE_OAUTH_DEFAULT_PASSWORD,
            });
        })
        .then((user) => {
            console.log(user)
            sendEmail(user.email)
            const access_token = jwt.sign({ id: user.id }, process.env.JWT_SECREAT);
            res.status(statusCode).json({id:user.id, name:user.name, access_token });
        })
        .catch((err) => next(err));
    }
}

module.exports = UserController
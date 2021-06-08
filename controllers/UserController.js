const {User , Product} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class UserController{
    static register(req,res,next){
        const {name,email,password,role} = req.body
        User.create({name,email,password,role})
        .then((user) => {
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
                if(user) {
                    // jika password sesuai
                    if(bcrypt.compareSync(password, user.password)) {
                    // if(password === user.password) {
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
                        throw{name:'PASSWORD_FALSE'}
                    }
                }else{
                    throw{name:'LOGIN_FAIL'}
                }
            }).catch((err) => {
                next(err)
            });
        }
    }
}

module.exports = UserController
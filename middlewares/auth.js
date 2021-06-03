const {User, Product} = require('../models')
const jwt = require('jsonwebtoken')

const authentication = (req,res,next) => {
    if(!req.headers.access_token){
        next({ name : 'MISSING_ACCESS_TOKEN'})
    }else{
        try{
            const decode = jwt.verify(req.headers.access_token, process.env.JWT_SECREAT)
            console.log(decode)
            req.UserId = decode.id
            // next()
        }catch(err){
            next({name:'INVALID_ACCESS_TOKEN'})
        }

        User.findByPk(req.UserId)
        .then((user) => {
            if(!user){
                throw{name:'MISSING_USER'}
            }
            next()
        }).catch((err) => {
            next(err)
        });
    }
}

const productAuthorization = (req,res,next) => {
    const {id} = req.params

    Product.findOne({where: {id}})
    .then((product) => {
        if(!product){
            throw{name: 'DATA_NOT_FOUND'}
        }
        req.product = product
        next()
    }).catch((err) => {
        next(err)
    });
}


module.exports = {authentication, productAuthorization} 
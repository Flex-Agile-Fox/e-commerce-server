const {User, Product} = require('../models')

class ProductController{
    static postProduct(req,res,next) {
        const {name,image_url,price,stock} = req.body
        Product.create({name,image_url,price,stock})
        .then((product) => {
            res.status(201).json({success:true, data: product})
        }).catch((err) => {
            next(err)
        });
    }

    static getProduct(req,res,next) {
        Product.findAll({order: [['id','DESC']]})
        .then((product) => {
            res.status(200).json({success:true, data: product})    
        }).catch((err) => {
            next(err)
        });
    }

    static getProductDetail(req,res,next) {
        res.status(200).json({success:true, data: req.product})
    }

    static putProduct(req,res,next) {
        const {id} = req.params
        const {name,image_url,price,stock} = req.body
        Product.update({name,image_url,price,stock},{where:{id},returning:true})
        .then((product) => {
            res.status(200).json({success:true, data:product[1][0]})
        }).catch((err) => {
            next(err)
        });
    }

    static deleteProduct(req,res,next) {
        const {id} = req.params
        Product.destroy({where:{id}})
        .then((product) => {
            res.status(200).json({success:true, message:"data berhasil dihapus"})
        }).catch((err) => {
            next(err)       
        });
    }

}

module.exports = ProductController
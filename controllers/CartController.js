const { User, Product, Cart } = require('../models')

class CartController {
    static listCart(req,res,next) {
        Cart.findAll({include:[User,Product], where:{UserId:req.UserId}})
        .then((cart) => {
            res.status(200).json({success:true, data:cart})
        }).catch((err) => {
           next(err) 
        });
    }

    static addCart(req,res,next) {
        const { ProductId, qty, price } = req.body
        let cartQty
        let sumQty
        let totalPrice
        let stock
        
        Cart.findAll({include:[User,Product], where:{UserId:req.UserId, ProductId}}) //data cart berdasarkan user login dan barang yg mau ditambah / diclick tambah cart
        .then((cart) => {
            // klo barang belum ada dia create jumlah qty = 1
            if(!cart.length){
                return Cart.create({ UserId: req.UserId, ProductId, qty, price })
            // klo barang udah ada dia update jumlah qty di tambah 1
            }else{
                stock = cart[0].dataValues.Product.stock
                cartQty = cart[0].dataValues.qty // jumlah qty sebelumnya yg sudah di pesan
                
                // apabila jumlah barang lebih kecil dari jumlah stock
                if(cartQty < stock) {
                    sumQty = cartQty + qty // jumlah qty sebelumnya yg sudah di pesan di tambah 1
                    totalPrice = sumQty * price
                    return Cart.update({qty: sumQty, price: totalPrice}, {where:{ProductId}})
                }else{
                    // console.log('data gak cukupp')
                    throw{name:'STOCK_NOT_ENOUGH'}
                }
            }
        }).then((cart) => {
            res.status(201).json({success:true, data:cart})
        }).catch((err) => {
            next(err)
        });
    }
    
    static editCart(req,res,next){
        const {id} = req.params
        const { UserId, ProductId, qty, price } = req.body
        Cart.update({ UserId, ProductId, qty, price }, {where:{id},returning:true})
        .then((cart) => {
            res.status(200).json({success:true, data: cart[1][0]})
        }).catch((err) => {
            next(err)
        });
    }

    static deleteCart(req,res,next) {
        const {id} = req.params
        Cart.destroy({where:{id}})
        .then((cart) => {
            res.status(200).json({success:true, message:'data cart berhasil di hapus'})
        }).catch((err) => {
            next(err)
        });
    }
}

module.exports = CartController
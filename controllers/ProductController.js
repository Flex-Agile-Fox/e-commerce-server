class ProductController{
    static postProduct(req,res,next) {
        res.status(201).json({success:true, data: 'list produk'})
    }

    static getProduct(req,res,next) {
        res.status(200).json({success:true, data: 'list produk'})
    }

    static getDetailProduct(req,res,next) {
        res.status(200).json({success:true, data: 'list produk'})
    }

    static putProduct(req,res,next) {
        res.status(200).json({success:true, data: 'list produk'})
    }

    static deleteProduct(req,res,next) {
        res.status(200).json({success:true, data: 'list produk'})
    }

}

module.exports = ProductController
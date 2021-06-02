class UserController{
    static register(req,res,next){
        res.status(201).json({success:true, data:"register"})
    }

    static login(req,res,next){
        res.status(200).json({success:true, data:"login"})
    }
}

module.exports = UserController
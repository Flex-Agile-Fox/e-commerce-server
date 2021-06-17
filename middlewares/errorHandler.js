const errorHandler = (err,req,res,next) => {
    // console.log('name ====>', err.name)
    // console.log('msg ====>', err.message)

    let errStatus
    let errMsg = []

    switch (err.name) {
        case 'SequelizeValidationError':
            errStatus = 400
            errMsg = err.errors ? err.errors.map((e) => e.message) : []
            break;
        case 'MISSING_ACCESS_TOKEN':
            errStatus = 401
            errMsg.push('Access token tidak ditemukan')
            break;
        case 'INVALID_ACCESS_TOKEN':
            errStatus = 401
            errMsg.push('Access token tidak sesuai')
            break;
        case 'MISSING_USER':
            errStatus = 401
            errMsg.push('User tidak ditemukan')
            break;
        case 'AUTHORIZATION_NOT_VALID':
            errStatus = 401
            errMsg.push('Anda tidak punya akses. silahkan hubungi admin')
            break;
        case 'LOGIN_VALIDATION':
            errStatus = 401
            errMsg.push('Username dan Password tidak boleh kosong')
            break;
        case 'LOGIN_FAIL':
            errStatus = 401
            errMsg.push('Username atau password anda salah')
            break;
        case 'PASSWORD_FALSE':
            errStatus = 401
            errMsg.push('Password salah')
            break;    
        case 'DATA_NOT_FOUND':
            errStatus = 404
            errMsg.push('Data tidak ditemukan')
            break;
        case 'STOCK_NOT_ENOUGH':
            errStatus = 404
            errMsg.push('Stok tidak cukup')
            break;
        case 'SequelizeUniqueConstraintError':
            errStatus = 409
            errMsg.push('Data duplikat')
            break;
        default:
            errStatus = 500
            errMsg.push('Internal server error')
    }

    res.status(errStatus).json({success: false, errMsg})
}

module.exports = errorHandler 
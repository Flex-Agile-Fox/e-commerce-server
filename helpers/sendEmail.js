const nodemailer = require('nodemailer');

const sendEmail = (email) => {
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SEND,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL_SEND,
        to: email,
        subject: 'Electronic Village',
        text: 'Hello Terimakasih telah bergabung bersama kami. yuk ikutin diskon diskon menarik lainnya hanya di electronic village ! BELANJA JADI LEBIH MENYENANGKAN'
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log('Email sent: ' + info.response);
    });
}

module.exports = sendEmail

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    
    //host: "smtp.ethereal.email",
    //port: 587,
    //secure: false, // true for 465, false for other ports
    
    service: 'gmail',
    auth: {
        user: "agriedgeusertest@gmail.com",
        pass: "Azerty123456_"
    }
})

// TODO add template engine configuration
//transporter.use()

module.exports = transporter;
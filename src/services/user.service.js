const User = require('../models/user.model');
const transporter = require('../config/mail');

require('dotenv').config();

const register = credentials => {

    const { email, password, firstName, lastName, type, phone } = credentials;
    return User.findOne({ email }).then(exist => {
        if (exist) {
            throw new Error('This email is already registered.');
        }

        user = new User({
            firstName,
            lastName,
            email,
            password,
            type,
            phone
        });

        let token = user.generateJWT(process.env.jwtSecretMail, 7200); // expire In two hours
        let link = "http://localhost:5000/api/auth/verify?token=" + token;
        const message = {
            from: 'ucef.idder96@gmail.com',
            to: email,
            subject: 'Verify your account !',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: ' + link + '.\n'
        }
        transporter.sendMail(message)
        return user.save();
    })
}

// passwords = password from form
// TODO change passwords variable name
const changePassword = (passwords, user) => {
    const { oldPassword, newPassword } = passwords;
    const { email } = user;
    return User.findOne({ email }).then(user => {
        if (user) {
            let isMatch = user.comparePassword(newPassword);
            if (isMatch) {
                user.password = newPassword;
                user.save();
            } else {
                throw new Error('this password does not match the old password !')
            }
        }
    })
}

module.exports = {
    register,
    changePassword
}
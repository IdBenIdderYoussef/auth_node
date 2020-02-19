const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const authenticate = credentials => {

    const { email, password } = credentials;
    return User.findOne({ email }).then(user => {
        if (!user) {
            throw new Error('Your email address is not associated with any account.');
        }

        const isMatch = user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid Email or password');
        }

        if (!user.isVerified) {
            throw new Error('Your account has not been verified.');
        }
        let token = user.generateJWT(process.env.jwtSecret, 2592000); // expire In one month
        return token;
    }
    )
}

const verify = token => {
    const data = jwt.verify(token, process.env.jwtSecretMail);

    return User.findOne({ _id: data.id }).then(user => {
        if (!user) {
            throw new Error('We were unable to find a user for this token.');
        }
        if (user.isVerified) {
            throw new Error('This user has already been verified.');
        }
        user.isVerified = true;
        user.save();
        return true;
    })
}



module.exports = {
    authenticate,
    verify
}
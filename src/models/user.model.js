const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        trim: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        max: 50
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        max: 50
    },
    password: {
        type: String,
        min: 8,
        required: [true, 'Password is required'],
        max: 64
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    type: {
        type: String,
        required: [true, 'Type is required']
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

// Hash password before save
UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});


UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Generate token
UserSchema.methods.generateJWT = function (secret, expiresIn) {

    let payload = {
        id: this._id,
        email: this.email,
        type: this.type
    };

    return jwt.sign(payload, secret, {
        expiresIn: expiresIn // 1 month in seconds
    });
};

module.exports = mongoose.model('User', UserSchema);
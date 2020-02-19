const jwt = require('jsonwebtoken')
const User = require('../models/user.model');
require('dotenv').config();

// Authorization permissions middleware
const permit = (...permissions) => async (req, res, next) => {

    // TODO change type to role

    //check the role permission
    const isPermit = type => permissions.indexOf(type) > -1;

    const token = req.header('Authorization').replace('Bearer ', '');
    // TODO add error handle here
    const data = jwt.verify(token, process.env.jwtSecret);

    try {
        const user = await User.findOne({ _id: data.id });

        if (!user || !isPermit(user.type)) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}

module.exports = permit
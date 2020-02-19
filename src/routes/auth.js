const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const { check, validationResult } = require('express-validator');

// @route     POST api/auth/login
// @desc      Auth user & get token
// @access    Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        //check form validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        try {
            return authService.authenticate(req.body)
                .then(token => {
                    res.status(200).json({ token });
                })
                .catch(err => {
                    res.status(400).json({ message: err.message });
                })
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Server Error !" })
        }
    }
)

// @route     POST api/auth/verify/:token
// @desc      verify user account
// @access    Public
router.get('/verify',
    async (req, res) => {
        const { token } = req.query;
        try {
            return authService.verify(token).then(result => {
                if (result === true) {
                    res.status(200).json({ message: "The account has been verified. Please log in." });
                }
            }).catch(err => {
                res.status(400).json({ message: err.message });
            })
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ message: "Oops Something goes wrong, this link is invalid !" });
        }
    }
)

module.exports = router;
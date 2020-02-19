const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const { check, validationResult } = require('express-validator');
const roles = require('../utils/roles');
const permit = require('../middlewares/permit');

// @route     POST api/users/register
// @desc      Register user
// @access    Public
router.post(
    '/register',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('firstName', 'Please include a first name').exists(),
        check('lastName', 'Please include a last name').exists(),
        check('type', 'Please include a type').exists(),
        check('phone', 'Please include a phone number').exists(),
        check('confirmPassword', 'Please include a confirmation password').exists(),
        check('password', 'Password should not be empty,'
            + ' minimum eight characters, at least one letter and one number.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
    ],
    async (req, res) => {
        // check form validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ message: "The password and confirmation password do not match." });
        }
        try {
            return userService.register(req.body)
                .then(user => {
                    res.status(200).json({ message: "A verification email has been sent to your address email" });
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

// @route     POST api/users/change-password
// @desc      Change user password
// @access    private
router.post(
    '/change-password',
    [
        check('oldPassword', 'Please include an old password').exists(),
        check('confirmNewPassword', 'Please include a confirmation password').exists(),
        check('newPassword', 'Password should not be empty,'
            + ' minimum eight characters, at least one letter and one number.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
    ],permit(roles.ROLE_FARMER),
    async (req, res) => {
        console.log(roles);
        // check form validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        if (req.body.newPassword !== req.body.confirmNewPassword) {
            return res.status(400).json({ message: "The new password and confirmation password do not match." });
        }
        try {
            return userService.changePassword(req.body, req.user)
                .then(user => {
                    res.status(200).json({ message: "Your password has been successfully changed." });
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

module.exports = router;
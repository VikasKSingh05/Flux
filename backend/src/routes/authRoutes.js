const express = require('express');
const authController = require('../controllers/authController');
const { validate, signupValidations, loginValidations } = require('../middleware/validateRequest');

const router = express.Router();

router.post('/signup', validate(signupValidations), authController.signup);
router.post('/login', validate(loginValidations), authController.login);

module.exports = router;

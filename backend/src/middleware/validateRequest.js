const { body, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const message = errors.array().map((e) => e.msg).join('; ');
    next(new ValidationError(message));
  };
};

const signupValidations = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidations = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const createTodoValidations = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 500 })
    .withMessage('Title cannot exceed 500 characters'),
];

const updateTodoValidations = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Title cannot exceed 500 characters'),
  body('completed').optional().isBoolean().withMessage('completed must be boolean'),
];

const paginationValidations = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage('limit must be between 1 and 100'),
];

module.exports = {
  validate,
  signupValidations,
  loginValidations,
  createTodoValidations,
  updateTodoValidations,
  paginationValidations,
};

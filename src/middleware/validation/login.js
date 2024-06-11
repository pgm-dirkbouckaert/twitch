import { body } from 'express-validator';

export default [
  body('email')
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email."),
  body('password')
    .isLength({min: 8})
    .withMessage("Password must have at least 8 characters."),
];

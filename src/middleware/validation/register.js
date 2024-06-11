import { body } from 'express-validator';

export default [
  body('firstname')
    .notEmpty()
    .withMessage("First name is required."),
  body('lastname')
    .notEmpty()
    .withMessage("Last name is required."),
  body('username')
    .notEmpty()
    .withMessage("User name is required."),
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

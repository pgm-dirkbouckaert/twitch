import { body } from 'express-validator';

export default [
  body('current')
    .notEmpty()
    .withMessage("Current password is required."),
  body('newpassword')
    .notEmpty()
    .withMessage("New password is required.")
    .bail()
    .isLength({min: 8})
    .withMessage("Password must have at least 8 characters."),
  body('confirm')
    .notEmpty()
    .withMessage("Confirmation is required.")
    .bail()
    .custom((value, { req }) => value === req.body.newpassword)
    .withMessage("Passwords do not match."),
];

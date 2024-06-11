import { body } from 'express-validator';

export default [
  body('name')
    .notEmpty()
    .withMessage('Name is required.'),
  body('user_id')
    .notEmpty()
    .withMessage('User is required.'),
];

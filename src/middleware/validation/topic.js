import { body } from 'express-validator';

export default [
  body('name')
    .notEmpty()
    .withMessage('Name is required.'),
];

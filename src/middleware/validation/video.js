import { body } from 'express-validator';

export default [
  body('topic_id')
    .notEmpty()
    .withMessage('Topic is required.'),
  body('name')
    .notEmpty()
    .withMessage('Name is required.'),
  body('thumbnail')
    .notEmpty()
    .withMessage('Thumbnail is required.'),
  body('youtube_id')
    .notEmpty()
    .withMessage('YouTube ID is required.'),
  body('user_id')
    .notEmpty()
    .withMessage('User is required.'),
];

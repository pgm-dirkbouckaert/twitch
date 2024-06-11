import express from 'express';
import multer from 'multer';
import { jwtAuth } from '../middleware/jwtAuth.js';
import {
  handleApply,
  handleEditAccount,
  handleEditAvatar,
  handleEditPassword,
  showAccount,
  showApply,
  showEditAccount,
  showEditAvatar,
  showEditPassword,
} from '../controllers/account.js';
import accountValidation from '../middleware/validation/account.js';
import passwordValidation from '../middleware/validation/password.js';

/**
 * INIT ROUTER
 */
const router = express.Router();

/**
 * SHOW ACCOUNT
 */
router.get('', jwtAuth, showAccount);

/**
 * EDIT ACCOUNT
 */
router.get('/edit', jwtAuth, showEditAccount);
router.post(
  '/edit',
  jwtAuth,
  ...accountValidation,
  handleEditAccount,
  showEditAccount
);

/**
 * EDIT AVATAR
 */
router.get('/avatar', jwtAuth, showEditAvatar);
router.post(
  '/avatar',
  jwtAuth,
  multer().single('avatar'),
  handleEditAvatar,
  showEditAvatar
);

/**
 * CHANGE PASSWORD
 */
router.get('/password', jwtAuth, showEditPassword);
router.post(
  '/password',
  jwtAuth,
  ...passwordValidation,
  handleEditPassword,
  showEditPassword
);

/**
 * APPLY AS TEACHER OR ADMIN
 */
router.get('/apply', jwtAuth, showApply);
router.post('/apply', jwtAuth, handleApply, showApply);

/**
 * EXPORT ROUTER
 */
export default router;

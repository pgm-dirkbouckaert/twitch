import 'dotenv/config';
import { LocalStorage } from 'node-localstorage';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import fs from 'fs';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import * as dataService from '../services/dataService.js';
import { AVATAR_EXT, AVATAR_PATH, DEFAULT_AVATAR_FILENAME } from '../consts.js';
import AppDataSource from '../lib/DataSource.js';

const localStorage = new LocalStorage('./scratch');
const userRepo = AppDataSource.getRepository('User');

/**
 * Show account page
 */
export const showAccount = async (req, res) => {
  // Get flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Get user
  const user = await dataService.getUserById(req.user.id);

  // Inputs
  const inputs = [
    {
      label: 'Role',
      type: 'text',
      name: 'role',
      disabled: true,
      value: user.role.label,
    },
    {
      label: 'First name',
      type: 'text',
      name: 'firstname',
      disabled: true,
      value: user.usermeta.firstname,
    },
    {
      label: 'Last name',
      type: 'text',
      name: 'lastname',
      disabled: true,
      value: user.usermeta.lastname,
    },
    {
      label: 'Username',
      type: 'text',
      name: 'username',
      disabled: true,
      value: user.usermeta.username,
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      disabled: true,
      value: user.email,
    },
  ];

  // Render page
  res.render('account/index', {
    activeNav: 'account',
    action: 'view',
    role: req.user.role,
    flash,
    inputs,
  });
};

/**
 * Show page to edit account
 */
export const showEditAccount = async (req, res) => {
  // Get user
  const user = await dataService.getUserById(req.user.id);

  // Errors from handler
  const handlerErrors = req.handlerErrors ? req.handlerErrors : [];

  // Inputs
  const inputs = [
    {
      label: 'First name',
      type: 'text',
      name: 'firstname',
      required: true,
      value: req.body?.firstname ? req.body.firstname : user.usermeta.firstname,
      error: req.inputErrors?.firstname ? req.inputErrors.firstname : '',
    },
    {
      label: 'Last name',
      name: 'lastname',
      type: 'text',
      required: true,
      value: req.body?.lastname ? req.body.lastname : user.usermeta.lastname,
      error: req.inputErrors?.lastname ? req.inputErrors.lastname : '',
    },
    {
      label: 'Username',
      type: 'text',
      name: 'username',
      required: true,
      value: req.body?.username ? req.body.username : user.usermeta.username,
      error: req.inputErrors?.username ? req.inputErrors.username : '',
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      required: true,
      value: req.body?.email ? req.body.email : user.email,
      error: req.inputErrors?.email ? req.inputErrors.email : '',
    },
  ];

  // Render page
  res.render('account/edit', {
    activeNav: 'account',
    action: 'edit',
    role: req.user.role,
    handlerErrors,
    inputs,
  });
};

/**
 * Handle edit account
 */
export const handleEditAccount = async (req, res, next) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
      return next();
    }

    // Get logged in user
    const user = await dataService.getUserById(req.user.id);

    // Check if email already exists
    const { email: newEmail } = req.body;
    if (newEmail !== user.email) {
      const emailExists = await dataService.getUserByEmail(newEmail);
      if (emailExists) {
        req.handlerErrors = [{ message: 'Email already exists.' }];
        return next();
      }
    }

    // Check if username already exists
    const { username: newUsername } = req.body;
    if (newUsername !== user.usermeta.username) {
      const usernameExists = await dataService.getUserByUsername(newUsername);
      if (usernameExists) {
        req.handlerErrors = [{ message: 'Username already exists.' }];
        return next();
      }
    }

    // Save user
    await userRepo.save({
      id: user.id,
      email: req.body.email,
      usermeta: {
        id: user.usermeta.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
      },
    });

    // Redirect to account page (with flash)
    localStorage.setItem(
      'flash',
      JSON.stringify([
        {
          type: 'success',
          message: 'Your account details have been successfully saved.',
        },
      ])
    );
    return res.redirect('/account');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * show page to edit avatar
 */
export const showEditAvatar = async (req, res) => {
  // Get logged in user
  const user = await dataService.getUserById(req.user.id);

  // Render page
  res.render('account/avatar', {
    activeNav: 'account',
    action: 'avatar',
    role: req.user.role,
    // flash,
    avatar: user.usermeta.avatar,
    error: req.inputErrors?.avatar ? req.inputErrors.avatar : '',
  });
};

/**
 * Handle edit avatar
 */
export const handleEditAvatar = async (req, res, next) => {
  try {
    // Get file
    const { file } = req;

    // File is required
    if (!file) {
      req.inputErrors = { avatar: 'Avatar file is required.' };
      return next();
    }

    // Proceed if mimetype complies to requested format
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      // Get old avatar
      const user = await dataService.getUserById(req.user.id);
      const oldAvatar = user.usermeta.avatar;

      // Remove old avatar
      if (oldAvatar && oldAvatar !== DEFAULT_AVATAR_FILENAME) {
        const filePath = `${AVATAR_PATH}/${oldAvatar}`;
        fs.access(filePath, (err) => {
          if (!err) fs.rmSync(filePath);
        });
      }

      // Upload avatar to public folder
      const newAvatarName = `${uuid()}.${AVATAR_EXT}`;
      await sharp(file.buffer)
        .resize(128, 128, {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .toFormat(AVATAR_EXT)
        .toFile(`${AVATAR_PATH}/${newAvatarName}`);

      // Save avatar to database
      await userRepo.save({
        id: user.id,
        usermeta: { id: user.usermeta.id, avatar: newAvatarName },
      });

      // Redirect
      return next();
    }
    // File doesn't have the required mimetype
    req.inputErrors = { avatar: 'Please upload a png, jpg or jpeg file.' };
    return next();
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * show page to edit password
 */
export const showEditPassword = async (req, res) => {
  // Errors from handler
  const handlerErrors = req.handlerErrors ? req.handlerErrors : [];

  // Inputs
  const inputs = [
    {
      label: 'Current password',
      type: 'password',
      name: 'current',
      required: true,
      value: req.body?.current ? req.body.current : '',
      error: req.inputErrors?.current ? req.inputErrors.current : '',
    },
    {
      label: 'New password',
      type: 'password',
      name: 'newpassword',
      required: true,
      value: req.body?.newpassword ? req.body.newpassword : '',
      error: req.inputErrors?.newpassword ? req.inputErrors.newpassword : '',
    },
    {
      label: 'Confirm password',
      type: 'password',
      name: 'confirm',
      required: true,
      value: req.body?.confirm ? req.body.confirm : '',
      error: req.inputErrors?.confirm ? req.inputErrors.confirm : '',
    },
  ];

  // Render page
  res.render('account/password', {
    activeNav: 'account',
    action: 'password',
    role: req.user.role,
    handlerErrors,
    inputs,
  });
};

/**
 * Handle edit password
 */
export const handleEditPassword = async (req, res, next) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
      return next();
    }

    // Check if currentPassword in form matches password in database
    const user = await dataService.getUserById(req.user.id);
    if (!bcrypt.compareSync(req.body.current, user.password)) {
      req.handlerErrors = [
        { message: 'Please provide correct current password.' },
      ];
      return next();
    }

    // Save new password
    const hashedPassword = bcrypt.hashSync(req.body.newpassword, 12);
    await userRepo.save({ ...user, password: hashedPassword });

    // Redirect with flash
    localStorage.setItem(
      'flash',
      JSON.stringify([
        {
          type: 'success',
          message: 'Your new password has been successfully saved.',
        },
      ])
    );
    return res.redirect('/account');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Show page to apply as teacher or admin
 */
export const showApply = (req, res) => {
  // Get flash messages
  let { flash } = req;
  if (flash) flash = JSON.parse(req.flash);

  // Render page
  return res.render('account/apply', {
    activeNav: 'account',
    action: 'apply',
    role: req.user.role,
    flash,
  });
};

/**
 * Handle apply as teacher or admin
 */
export const handleApply = (req, res, next) => {
  req.flash = JSON.stringify([
    { type: 'success', message: 'Thank you. We will be in touch soon.' },
  ]);
  return next();
};

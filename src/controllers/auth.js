import { LocalStorage } from 'node-localstorage';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import * as dataService from '../services/dataService.js';
import { DEFAULT_AVATAR_FILENAME } from '../consts.js';

const localStorage = new LocalStorage('./scratch');

/**
 * Show page to register
 */
export const showRegister = (req, res) => {
  // Flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Errors from handler
  const handlerErrors = req.handlerErrors ? req.handlerErrors : [];

  // Inputs
  const inputs = [
    {
      label: 'First name',
      type: 'text',
      name: 'firstname',
      required: true,
      value: req.body?.firstname ? req.body.firstname : '',
      error: req.inputErrors?.firstname ? req.inputErrors.firstname : '',
    },
    {
      label: 'Last name',
      type: 'text',
      name: 'lastname',
      required: true,
      value: req.body?.lastname ? req.body.lastname : '',
      error: req.inputErrors?.lastname ? req.inputErrors.lastname : '',
    },
    {
      label: 'Username',
      type: 'text',
      name: 'username',
      required: true,
      value: req.body?.username ? req.body.username : '',
      error: req.inputErrors?.username ? req.inputErrors.username : '',
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      required: true,
      value: req.body?.email ? req.body.email : '',
      error: req.inputErrors?.email ? req.inputErrors.email : '',
    },
    {
      label: 'Password',
      type: 'password',
      name: 'password',
      required: true,
      value: req.body?.password ? req.body.password : '',
      error: req.inputErrors?.password ? req.inputErrors.password : '',
    },
  ];

  // Render page
  res.render('auth/register', {
    layout: 'auth',
    flash,
    handlerErrors,
    inputs,
  });
};

/**
 * Handle registration
 */
export const handleRegister = async (req, res, next) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
      return next();
    }

    // Check if email already exists
    const { email } = req.body;
    let user = await dataService.getUserByEmail(email);
    if (user) {
      req.handlerErrors = [{ message: 'Email already exists.' }];
      return next();
    }

    // Check if username already exists
    const { username } = req.body;
    user = await dataService.getUserByUsername(username);
    if (user) {
      req.handlerErrors = [{ message: 'Username already exists.' }];
      return next();
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 12);

    // Create a new user
    await dataService.saveUser({
      email: req.body.email,
      password: hashedPassword,
      role: { id: 1 },
      usermeta: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        avatar: DEFAULT_AVATAR_FILENAME,
      },
    });

    // Redirect to login page
    localStorage.setItem(
      'flash',
      JSON.stringify([
        {
          type: 'success',
          message: 'Your account has been created. You can login now.',
        },
      ])
    );
    return res.redirect('/login');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Show page to login
 */
export const showLogin = (req, res) => {
  // Flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Errors from handler
  const handlerErrors = req.handlerErrors ? req.handlerErrors : [];

  // Inputs
  const inputs = [
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      required: true,
      value: req.body?.email ? req.body.email : '',
      error: req.inputErrors?.email ? req.inputErrors.email : '',
    },
    {
      label: 'Password',
      type: 'password',
      name: 'password',
      required: true,
      value: req.body?.password ? req.body.password : '',
      error: req.inputErrors?.password ? req.inputErrors.password : '',
    },
  ];

  res.render('auth/login', {
    layout: 'auth',
    flash,
    handlerErrors,
    inputs,
  });
};

/**
 * Handle login
 */
export const handleLogin = async (req, res, next) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
      return next();
    }

    // Check if email exists
    const { email } = req.body;
    const user = await dataService.getUserByEmail(email);
    if (!user) {
      req.handlerErrors = [{ message: 'Please provide correct credentials.' }];
      return next();
    }

    // Check if password is correct
    const { password } = req.body;
    if (!bcrypt.compareSync(password, user.password)) {
      req.handlerErrors = [{ message: 'Please provide correct credentials.' }];
      return next();
    }

    // Create a JSON Web Token
    const token = jwt.sign(
      { id: user.id, role: user.role.label },
      process.env.TOKEN_SALT,
      { expiresIn: 60 * 60 * 24 } // expiresIn = seconds
    );

    // Add token to cookie
    res.cookie('token', token, { httpOnly: true });

    // Redirect to home page
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Handle logout
 */
export const handleLogout = (req, res, next) => {
  try {
    res.clearCookie('token');
    return res.redirect('/login');
  } catch (error) {
    return next(error.message);
  }
};

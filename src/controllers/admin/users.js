import bcrypt from 'bcrypt';
import { LocalStorage } from 'node-localstorage';
import { validationResult } from 'express-validator';
import { arrToPagedObj } from '../../lib/Utils.js';
import * as dataService from '../../services/dataService.js';
import { DEFAULT_AVATAR_FILENAME } from '../../consts.js';

const localStorage = new LocalStorage('./scratch');

/**
 * Show list of users
 */
export const showUsers = async (req, res) => {
  // Get pageing
  const currentPage = parseInt(req.query.page, 10) || 1;

  // Get flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Get users
  let users = await dataService.getUsers();

  // Set allUsernames for datalist
  const allUsernames = users.map((user) => user.usermeta.username);

  // Apply filter
  const filterByUsername = req.query.username;
  if (filterByUsername) {
    users = users.filter((user) => user.usermeta.username === filterByUsername);
  }

  // Render page
  res.render('admin/users', {
    activeNav: 'admin',
    action: 'users',
    role: req.user.role,
    flash,
    allUsernames,
    filterByUsername,
    users: arrToPagedObj(users, 10, currentPage),
  });
};

/**
 * Show page to edit a user
 */
export const showEditUser = async (req, res) => {
  // Get flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Get user
  const user = await dataService.getUserById(req.params.id);
  if (!user) {
    localStorage.setItem(
      'flash',
      JSON.stringify([
        {
          type: 'danger',
          message: 'User was not found.',
        },
      ])
    );
    return res.redirect('/admin/users');
  }

  // Get roles
  const roles = await dataService.getRoles();

  // Inputs
  const inputs = [
    {
      name: 'id',
      type: 'hidden',
      value: user.id,
    },
    {
      label: 'Username',
      name: 'username',
      type: 'text',
      required: true,
      value: req.body?.username ? req.body.username : user.usermeta.username,
      error: req.inputErrors?.username ? req.inputErrors.username : '',
    },
    {
      label: 'First name',
      name: 'firstname',
      type: 'text',
      required: true,
      value: req.body?.firstname ? req.body.firstname : user.usermeta.firstname,
      error: req.inputErrors?.firstname ? req.inputErrors.firstname : '',
    },
    {
      label: 'Last name',
      type: 'text',
      name: 'lastname',
      required: true,
      value: req.body?.lastname ? req.body.lastname : user.usermeta.lastname,
      error: req.inputErrors?.lastname ? req.inputErrors.lastname : '',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      required: true,
      value: req.body?.email ? req.body.email : user.email,
      error: req.inputErrors?.email ? req.inputErrors.email : '',
    },
    {
      label: 'Role',
      name: 'role_id',
      type: 'select',
      options: roles,
      required: true,
      value: req.body?.role_id ? req.body.role_id : user.role.label,
      error: req.inputErrors?.role_id ? req.inputErrors.role_id : '',
    },
  ];

  // Render page
  return res.render('admin/users/edit', {
    activeNav: 'admin',
    action: 'users',
    role: req.user.role,
    flash,
    roleIdForForm: user.role.id,
    user,
    inputs,
  });
};

/**
 * Save edited user
 */
export const handleEditUser = async (req, res, next) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
      return next();
    }

    // Get user
    const user = await dataService.getUserById(req.body.id);

    // Check if email already exists
    const { email: newEmail } = req.body;
    if (newEmail !== user.email) {
      const emailExists = await dataService.getUserByEmail(newEmail);
      if (emailExists) {
        req.inputErrors = { email: 'Email already exists.' };
        return next();
      }
    }

    // Check if username already exists
    const { username: newUsername } = req.body;
    if (newUsername !== user.usermeta.username) {
      const usernameExists = await dataService.getUserByUsername(newUsername);
      if (usernameExists) {
        req.inputErrors = { username: 'Username already exists.' };
        return next();
      }
    }

    // Save user
    await dataService.saveUser({
      id: user.id,
      email: req.body.email,
      usermeta: {
        id: user.usermeta.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
      },
      role: { id: req.body.role_id },
    });

    // Redirect
    return res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Show page to create a user
 */
export const showCreateUser = async (req, res) => {
  // Get roles
  const roles = await dataService.getRoles();

  // Inputs
  const inputs = [
    {
      label: 'Username',
      name: 'username',
      type: 'text',
      required: true,
      value: req.body?.username ? req.body.username : '',
      error: req.inputErrors?.username ? req.inputErrors.username : '',
    },
    {
      label: 'First name',
      name: 'firstname',
      type: 'text',
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
      label: 'Role',
      name: 'role_id',
      type: 'select',
      options: roles,
      required: true,
      value: req.body?.role_id ? req.body.role_id : '',
      error: req.inputErrors?.role_id ? req.inputErrors.role_id : '',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      required: true,
      value: req.body?.email ? req.body.email : '',
      error: req.inputErrors?.email ? req.inputErrors.email : '',
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      required: true,
      value: req.body?.password ? req.body.password : '',
      error: req.inputErrors?.password ? req.inputErrors.password : '',
    },
  ];

  // Render page
  res.render('admin/users/create', {
    activeNav: 'admin',
    action: 'users',
    role: req.user.role,
    inputs,
    roleIdForForm: req.body?.role_id ? req.body.role_id : '',
  });
};

/**
 * Save new user
 */
export const handleCreateUser = async (req, res, next) => {
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
    const emailExists = await dataService.getUserByEmail(email);
    if (emailExists) {
      req.inputErrors = { email: 'Email already exists.' };
      return next();
    }

    // Check if username already exists
    const { username } = req.body;
    const usernameExists = await dataService.getUserByUsername(username);
    if (usernameExists) {
      req.inputErrors = { username: 'Username already exists.' };
      return next();
    }
    // Save user
    await dataService.saveUser({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
      usermeta: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        avatar: DEFAULT_AVATAR_FILENAME,
      },
      role: { id: req.body.role_id },
    });

    // Redirect
    return res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res, next) => {
  try {
    // Check if user exists
    const { id, currentPage } = req.body;
    const user = await dataService.getUserById(id);
    if (!user) {
      localStorage.setItem(
        'flash',
        JSON.stringify([
          {
            type: 'danger',
            message: 'User was not found.',
          },
        ])
      );
      return res.redirect('/admin/users');
    }

    // Delete user
    await dataService.deleteUser(id);

    // Redirect
    return res.redirect(`/admin/users?page=${currentPage}`);
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import * as dataService from '../../services/dataService.js';
import {
  DEFAULT_AVATAR_FILENAME,
  MSG_400,
  MSG_401,
  MSG_404,
  MSG_500,
} from '../../consts.js';

/**
 * Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for correct request
    if (!email || !password) return res.status(400).json(MSG_400);

    // Check if user exists
    const user = await dataService.getUserByEmail(email);
    if (!user) return res.status(404).json(MSG_404);

    // Check if password is correct
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json(MSG_401);
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role.label },
      process.env.TOKEN_SALT,
      { expiresIn: 60 * 60 * 24 } // expiresIn = seconds
    );

    // Response
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Register
 */
export const register = async (req, res) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        inputErrors[param] = msg;
      return res.status(400).json(inputErrors);
    }

    // Check if email already exists
    let user = await dataService.getUserByEmail(req.body.email);
    if (user)
      return res.status(409).json({ message: 'Email is already in use.' });

    // Check if username already exists
    user = await dataService.getUserByUsername(req.body.username);
    if (user)
      return res.status(409).json({ message: 'Username is already in use.' });

    // Create new user
    const hashedPassword = bcrypt.hashSync(req.body.password, 12);
    const newUser = await dataService.saveUser({
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

    // Response
    delete newUser.password;
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

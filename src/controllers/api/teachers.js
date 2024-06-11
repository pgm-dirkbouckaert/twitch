import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import * as dataService from '../../services/dataService.js';
import {
  DEFAULT_AVATAR_FILENAME,
  MSG_200,
  MSG_404,
  MSG_500,
} from '../../consts.js';

/**
 * Get all teachers
 */
export const getTeachers = async (req, res) => {
  try {
    const teachers = await dataService.getUsersByRole('teacher');
    if (!teachers) return res.status(404).json(MSG_404);
    return res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Get one teacher by ID
 */
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Id is required.' });
    // Get user
    const teacher = await dataService.getUserById(id);
    if (!teacher) return res.status(404).json(MSG_404);
    // Only return teachers (not readers nor admins)
    if (teacher.role.label !== 'teacher') return res.status(404).json(MSG_404);
    // Response
    delete teacher.password;
    return res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Create a new teacher
 */
export const createTeacher = async (req, res) => {
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

    // Create new teacher
    const hashedPassword = bcrypt.hashSync(req.body.password, 12);
    const newTeacher = await dataService.saveUser({
      email: req.body.email,
      password: hashedPassword,
      role: { id: 2 },
      usermeta: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        avatar: DEFAULT_AVATAR_FILENAME,
      },
    });

    // Response
    delete newTeacher.password;
    return res.status(201).json(newTeacher);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Upate a teacher
 */
export const updateTeacher = async (req, res) => {
  try {
    const { id, firstname, lastname, username, email, password } = req.body;
    if (!id) return res.status(400).json({ message: 'Id is required.' });

    // Check if user exists
    const user = await dataService.getUserById(id);
    if (!user) return res.status(404).json(MSG_404);

    // Teachers can only update own account
    if (req.user.role === 'teacher' && req.user.id !== user.id)
      return res
        .status(401)
        .json({ message: 'Teachers can only update their own accounts.' });

    // Check if user (to be updated) is a teacher
    if (user.role.label !== 'teacher')
      return res.status(409).json({ message: 'User is not a teacher.' });

    // Check if email already exists
    if (email) {
      const emailExists = await dataService.getUserByEmail(req.body.email);
      if (emailExists)
        return res.status(409).json({ message: 'Email is already in use.' });
    }

    // Check if username already exists
    if (username) {
      const usernameExists = await dataService.getUserByUsername(
        req.body.username
      );
      if (usernameExists)
        return res.status(409).json({ message: 'Username is already in use.' });
    }

    // Update teacher
    const data = { usermeta: { id: user.usermeta.id } };
    if (email) data.email = email;
    if (password) data.password = bcrypt.hashSync(password, 12);
    if (firstname) data.usermeta.firstname = firstname;
    if (lastname) data.usermeta.lastname = lastname;
    if (username) data.usermeta.username = username;
    const updatedUser = await dataService.saveUser({ ...user, ...data });

    // Response
    delete updatedUser.password;
    delete updatedUser.usermeta.avatar;
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Delete a teacher
 */
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Id is required.' });

    // Check if user exists
    const user = await dataService.getUserById(id);
    if (!user) return res.status(404).json(MSG_404);

    // Check if user is a teacher
    if (user.role.label !== 'teacher')
      return res.status(409).json({ message: 'User is not a teacher.' });

    // Delete teacher
    await dataService.deleteUser(id);

    // Response
    return res.status(200).json(MSG_200);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

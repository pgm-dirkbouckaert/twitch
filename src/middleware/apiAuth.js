import jwt from 'jsonwebtoken';
import { MSG_401 } from '../consts.js';

export const jwtAuthAPI = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.TOKEN_SALT);
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json(MSG_401);
  }
};

export const isTeacherAPI = (req, res, next) => {
  try {
    if (req.user.role === 'teacher' || req.user.role === 'admin') return next();
    return res.status(401).json(MSG_401);
  } catch (error) {
    console.error(error);
    return res.status(401).json(MSG_401);
  }
};

export const isAdminAPI = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(401).json(MSG_401);
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json(MSG_401);
  }
};

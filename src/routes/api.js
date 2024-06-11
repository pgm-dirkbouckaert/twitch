import express from 'express';
import multer from 'multer';
import registerValidation from '../middleware/validation/register.js';
import videoValidation from '../middleware/validation/video.js';
import topicValidation from '../middleware/validation/topic.js';
import playlistValidation from '../middleware/validation/playlist.js';
import { isAdminAPI, isTeacherAPI, jwtAuthAPI } from '../middleware/apiAuth.js';
import { login, register } from '../controllers/api/auth.js';
import {
  createTeacher,
  deleteTeacher,
  getTeacherById,
  getTeachers,
  updateTeacher,
} from '../controllers/api/teachers.js';
import {
  createVideo,
  deleteVideo,
  getVideoById,
  getVideos,
  updateVideo,
} from '../controllers/api/videos.js';
import {
  createTopic,
  deleteTopic,
  getTopicById,
  getTopics,
  updateTopic,
} from '../controllers/api/topics.js';
import {
  addVideo,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylists,
  updatePlaylist,
} from '../controllers/api/playlists.js';

/**
 * INIT ROUTER
 */
const router = express.Router();

/**
 * AUTHENTICATION
 */
router.post('/login', login);
router.post('/register', ...registerValidation, register);

/**
 * TEACHERS
 */
router.get('/teachers', jwtAuthAPI, getTeachers);
router.get('/teachers/:id', jwtAuthAPI, getTeacherById);
router.post(
  '/teachers',
  jwtAuthAPI,
  isAdminAPI,
  ...registerValidation,
  createTeacher
);
router.put('/teachers', jwtAuthAPI, isTeacherAPI, updateTeacher);
router.delete('/teachers', jwtAuthAPI, isAdminAPI, deleteTeacher);

/**
 * VIDEOS
 */
router.get('/videos', jwtAuthAPI, getVideos);
router.get('/videos/:id', jwtAuthAPI, getVideoById);
router.post('/videos', jwtAuthAPI, isAdminAPI, ...videoValidation, createVideo);
router.put('/videos', jwtAuthAPI, isTeacherAPI, updateVideo);
router.delete('/videos', jwtAuthAPI, isAdminAPI, deleteVideo);

/**
 * TOPICS
 */
router.get('/topics', jwtAuthAPI, getTopics);
router.get('/topics/:id', jwtAuthAPI, getTopicById);
router.post(
  '/topics',
  jwtAuthAPI,
  isAdminAPI,
  multer().single('icon'),
  ...topicValidation,
  createTopic
);
router.put(
  '/topics',
  jwtAuthAPI,
  isAdminAPI,
  multer().single('icon'),
  ...topicValidation,
  updateTopic
);
router.delete('/topics', jwtAuthAPI, isAdminAPI, deleteTopic);

/**
 * PLAYLISTS
 */
router.get('/playlists', jwtAuthAPI, getPlaylists);
router.get('/playlists/:id', jwtAuthAPI, getPlaylistById);
router.post(
  '/playlists',
  jwtAuthAPI,
  isAdminAPI,
  ...playlistValidation,
  createPlaylist
);
router.put(
  '/playlists',
  jwtAuthAPI,
  isTeacherAPI,
  ...playlistValidation,
  updatePlaylist
);
router.delete('/playlists', jwtAuthAPI, isAdminAPI, deletePlaylist);
router.post(
  '/playlists/addVideo',
  jwtAuthAPI,
  isAdminAPI,
  ...videoValidation,
  addVideo
);

/**
 * EXPORT ROUTER
 */
export default router;

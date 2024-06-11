import express from 'express';
import multer from 'multer';
import { jwtAuth } from '../middleware/jwtAuth.js';
import {
  deleteVideo,
  handleCreateVideo,
  handleEditVideo,
  showCreateVideo,
  showEditVideo,
  showVideos,
} from '../controllers/admin/videos.js';
import { isAdmin, isTeacher } from '../middleware/roleAuth.js';
import {
  deletePlaylist,
  handleCreatePlaylist,
  handleEditPlaylist,
  showCreatePlaylist,
  showEditPlaylist,
  showPlaylists,
} from '../controllers/admin/playlists.js';
import {
  deleteUser,
  handleCreateUser,
  handleEditUser,
  showCreateUser,
  showEditUser,
  showUsers,
} from '../controllers/admin/users.js';
import videoValidation from '../middleware/validation/video.js';
import playlistValidation from '../middleware/validation/playlist.js';
import topicValidation from '../middleware/validation/topic.js';
import userEditValidation from '../middleware/validation/user-admin-edit.js';
import userCreateValidation from '../middleware/validation/user-admin-create.js';
import {
  deleteTopic,
  handleCreateTopic,
  handleEditTopic,
  showCreateTopic,
  showEditTopic,
  showTopics,
} from '../controllers/admin/topics.js';

/**
 * INIT ROUTER
 */
const router = express.Router();

/**
 * DASHBOARD FOR VIDEOS
 */
// Read
router.get('/videos', jwtAuth, isTeacher, showVideos);
// Create
router.get('/videos/create', jwtAuth, isTeacher, showCreateVideo);
router.post(
  '/videos/create',
  jwtAuth,
  isTeacher,
  ...videoValidation,
  handleCreateVideo,
  showCreateVideo
);
// Edit
router.get('/videos/:id', jwtAuth, isTeacher, showEditVideo);
router.post(
  '/videos/:id',
  jwtAuth,
  isTeacher,
  ...videoValidation,
  handleEditVideo,
  showEditVideo
);
// Delete
router.delete('/videos', jwtAuth, isTeacher, deleteVideo);

/**
 * DASHBOARD FOR PLAYLISTS
 */
// Read
router.get('/playlists', jwtAuth, isTeacher, showPlaylists);
// Create
router.get('/playlists/create', jwtAuth, isTeacher, showCreatePlaylist);
router.post(
  '/playlists/create',
  jwtAuth,
  isTeacher,
  ...playlistValidation,
  handleCreatePlaylist,
  showCreatePlaylist
);
// Edit
router.get('/playlists/:id', jwtAuth, isTeacher, showEditPlaylist);
router.post(
  '/playlists/:id',
  jwtAuth,
  isTeacher,
  ...playlistValidation,
  handleEditPlaylist,
  showEditPlaylist
);
// Delete
router.delete('/playlists', jwtAuth, isTeacher, deletePlaylist);

/**
 * DASHBOARD FOR TOPICS
 */
// Read
router.get('/topics', jwtAuth, isAdmin, showTopics);
// Create
router.get('/topics/create', jwtAuth, isAdmin, showCreateTopic);
router.post(
  '/topics/create',
  jwtAuth,
  isAdmin,
  multer().single('icon'),
  ...topicValidation,
  handleCreateTopic,
  showCreateTopic
);
// Edit
router.get('/topics/:id', jwtAuth, isAdmin, showEditTopic);
router.post(
  '/topics/:id',
  jwtAuth,
  isAdmin,
  multer().single('icon'),
  ...topicValidation,
  handleEditTopic,
  showEditTopic
);
// Delete
router.delete('/topics', jwtAuth, isAdmin, deleteTopic);

/**
 * DASHBOARD FOR USERS
 */
// Read
router.get('/users', jwtAuth, isAdmin, showUsers);
// Create
router.get('/users/create', jwtAuth, isAdmin, showCreateUser);
router.post(
  '/users/create',
  jwtAuth,
  isTeacher,
  ...userCreateValidation,
  handleCreateUser,
  showCreateUser
);
// Edit
router.get('/users/:id', jwtAuth, isAdmin, showEditUser);
router.post(
  '/users/:id',
  jwtAuth,
  isTeacher,
  ...userEditValidation,
  handleEditUser,
  showEditUser
);
// Delete
router.delete('/users', jwtAuth, isAdmin, deleteUser);

/**
 * EXPORT ROUTER
 */
export default router;

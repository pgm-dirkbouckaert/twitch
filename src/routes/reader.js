import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { home } from '../controllers/home.js';
import {
  showPlaylistDetails,
  showPlaylists,
} from '../controllers/reader/playlists.js';
import {
  showTeacherDetails,
  showTeachers,
} from '../controllers/reader/teachers.js';
import { showTopicDetails, showTopics } from '../controllers/reader/topics.js';
import {
  addStarVideo,
  deleteStarVideo,
  showStars,
} from '../controllers/reader/stars.js';

/**
 * INIT ROUTER
 */
const router = express.Router();

/**
 * VIEW VIDEOS
 */
router.get('/', jwtAuth, home);

/**
 * VIEW PLAYLISTS
 */
router.get('/playlists', jwtAuth, showPlaylists);
router.get('/playlists/:id', jwtAuth, showPlaylistDetails);

/**
 * VIEW TEACHERS
 */
router.get('/teachers', jwtAuth, showTeachers);
router.get('/teachers/:id', jwtAuth, showTeacherDetails);

/**
 * VIEW TOPICS
 */
router.get('/topics', jwtAuth, showTopics);
router.get('/topics/:id', jwtAuth, showTopicDetails);

/**
 * VIEW STARS
 */
router.get('/stars', jwtAuth, showStars);
router.get('/stars/addVideo/:id', jwtAuth, addStarVideo);
router.get('/stars/deleteVideo/:id', jwtAuth, deleteStarVideo);

/**
 * EXPORT ROUTER
 */
export default router;

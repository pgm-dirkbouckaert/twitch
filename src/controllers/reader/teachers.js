import { LocalStorage } from 'node-localstorage';
import * as dataService from '../../services/dataService.js';

const localStorage = new LocalStorage('./scratch');

/**
 * Show teachers page
 */
export const showTeachers = async (req, res) => {
  // Get flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Get filter
  const filterByUsername = req.query.username;

  // Get teachers
  let teachers;
  if (filterByUsername) {
    // Get teacher by username
    const teacher = await dataService.getUserByUsername(filterByUsername);
    if (!teacher) teachers = [];
    else teachers = [teacher];
  } else {
    // Get all teachers
    teachers = await dataService.getUsersByRole('teacher');
  }

  // Get all teachers for datalist
  const allTeachers = await dataService.getUsersByRole('teacher');

  // Render page
  res.render('reader/teachers/index', {
    activeNav: 'teachers',
    role: req.user.role,
    flash,
    teachers,
    allTeachers,
    filterByUsername,
  });
};

/**
 * Show page with teacher details
 */
export const showTeacherDetails = async (req, res) => {
  // Get teacher
  const { id } = req.params;
  const teacher = await dataService.getUserById(id);
  if (!teacher) {
    localStorage.setItem(
      'flash',
      JSON.stringify([{ type: 'danger', message: 'Teacher was not found.' }])
    );
    return res.redirect('/teachers');
  }
  delete teacher.password;

  // Get videos
  const videos = await dataService.getVideosByUserId(id);

  // Get playlists
  const playlists = await dataService.getPlaylistsByUserId(id);

  // Get videostars
  const videostars = await dataService.getVideostarsByUserId(req.user.id);
  const videostarIds = videostars.map((star) => star.video.id);

  // Render page
  return res.render('reader/teachers/detail', {
    activeNav: 'teachers',
    role: req.user.role,
    teacher,
    videos,
    videostarIds,
    playlists,
  });
};

import { LocalStorage } from 'node-localstorage';
import * as dataService from '../../services/dataService.js';

const localStorage = new LocalStorage('./scratch');

/**
 * Show page with all playlists
 */
export const showPlaylists = async (req, res) => {
  // Get flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Get filter
  const filterByUsername = req.query.username;

  // Get playlists
  let playlists;
  if (filterByUsername) {
    // Get playlists for teacher
    playlists = await dataService.getPlaylistsByUsername(filterByUsername);
  } else {
    // Get all playlists
    playlists = await dataService.getPlaylists();
  }

  // Get all teachers
  const teachers = await dataService.getUsersByRole('teacher');

  // Render page
  res.render('reader/playlists/index', {
    activeNav: 'playlists',
    role: req.user.role,
    flash,
    filterByUsername,
    teachers,
    playlists,
  });
};

/**
 * Show page with playlist details
 */
export const showPlaylistDetails = async (req, res) => {
  // Get playlist id
  const { id } = req.params;

  // Get playlist
  const playlist = await dataService.getPlaylistById(id);
  if (!playlist) {
    localStorage.setItem(
      'flash',
      JSON.stringify([{ type: 'danger', message: 'Playlist was not found.' }])
    );
    return res.redirect('/playlists');
  }

  // Get videostars
  const videostars = await dataService.getVideostarsByUserId(req.user.id);
  const videostarIds = videostars.map((star) => star.video.id);

  // Render page
  return res.render('reader/playlists/detail', {
    activeNav: 'playlists',
    role: req.user.role,
    playlist,
    videostarIds,
  });
};

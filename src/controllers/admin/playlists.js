import { LocalStorage } from 'node-localstorage';
import { validationResult } from 'express-validator';
import * as dataService from '../../services/dataService.js';
import { arrToPagedObj, getSlug } from '../../lib/Utils.js';

const localStorage = new LocalStorage('./scratch');

/**
 * Show list of playlists
 */
export const showPlaylists = async (req, res) => {
  // Get pageing
  const currentPage = parseInt(req.query.page, 10) || 1;

  // Get flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Get playlists
  let playlists;
  if (req.user.role === 'teacher') {
    // Get playlists for teacher
    playlists = await dataService.getPlaylistsByUserId(req.user.id, {
      user: { usermeta: { username: 'ASC' } },
      name: 'ASC',
    });
  } else {
    // Get all playlists
    playlists = await dataService.getPlaylists({
      user: { usermeta: { username: 'ASC' } },
      name: 'ASC',
    });
  }

  // Set allPlaylists for datalist
  const allPlaylists = [...playlists];

  // Apply filter
  const filterByName = req.query.name;
  if (filterByName) {
    playlists = playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(filterByName.toLowerCase())
    );
  }
  // Render page
  res.render('admin/playlists', {
    activeNav: 'admin',
    action: 'playlists',
    role: req.user.role,
    flash,
    allPlaylists,
    playlists: arrToPagedObj(playlists, 10, currentPage),
  });
};

/**
 * Show page to create a playlist
 */
export const showCreatePlaylist = async (req, res) => {
  // Get handlerErrors
  const { handlerErrors } = req;

  // Get videos for datalist
  let allVideos;
  if (req.user.role === 'teacher') {
    // Get videos for teacher
    allVideos = await dataService.getVideosByUserId(req.user.id, {
      topic: { name: 'ASC' },
      name: 'ASC',
    });
  } else {
    // Get all videos
    allVideos = await dataService.getVideos({
      topic: { name: 'ASC' },
      name: 'ASC',
    });
  }

  // Get teachers
  const teachers = await dataService.getUsersByRole('teacher');

  // Inputs
  const inputs = [
    {
      name: 'videos',
      type: 'hidden',
      value: '',
    },
    {
      label: 'Title',
      name: 'name',
      type: 'input',
      required: true,
      value: req.body?.name ? req.body.name : '',
      error: req.inputErrors?.name ? req.inputErrors.name : '',
    },
  ];

  // Add 'teacher' (user) to inputs:
  // role teacher: input is hidden | role admin: select element
  if (req.user.role === 'teacher') {
    inputs.push({
      name: 'user_id',
      type: 'hidden',
      value: req.user.id,
    });
  } else if (req.user.role === 'admin') {
    inputs.push({
      label: 'Teacher',
      name: 'user_id',
      type: 'select',
      options: teachers,
      required: true,
      value: req.body?.user_id ? req.body.user_id : '',
      error: req.inputErrors?.user_id ? req.inputErrors.user_id : '',
    });
  }

  // Render page
  res.render('admin/playlists/create', {
    activeNav: 'admin',
    action: 'playlists',
    role: req.user.role,
    handlerErrors,
    allVideos,
    inputs,
  });
};

/**
 * Save new playlist
 */
export const handleCreatePlaylist = async (req, res, next) => {
  try {
    // Check authorization: teacher can only add playlist for own account
    if (
      req.user.role === 'teacher' &&
      parseInt(req.body.user_id, 10) !== parseInt(req.user.id, 10)
    ) {
      localStorage.setItem(
        'flash',
        JSON.stringify([
          {
            type: 'danger',
            message: 'You can only add playlists for your own account.',
          },
        ])
      );
      return res.redirect('/admin/playlists');
    }

    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array()) {
        req.inputErrors[param] = msg;
      }
      return next();
    }

    // Create array of video objects
    let arrOfVideoObj = [];
    if (req.body.videos) {
      const videoIds = req.body.videos.split(',');
      // for (const id of videoIds) {
      //   // eslint-disable-next-line no-await-in-loop
      //   const video = await dataService.getVideoById(id);
      //   if (video) arrOfVideoObj.push({ ...video });
      // }
      // Source: https://stackoverflow.com/questions/52152842/fix-no-await-in-loop-lint-warning#52152930
      const promises = [];
      for (const id of videoIds) {
        promises.push(dataService.getVideoById(id));
      }
      arrOfVideoObj = await Promise.all(promises);
    }

    // Create playlist object
    const playlist = {
      name: req.body.name.trim(),
      slug: getSlug(req.body.name),
      user: { id: req.body.user_id },
    };
    if (arrOfVideoObj.length !== 0) playlist.videos = [...arrOfVideoObj];

    // Save new playlist to database
    await dataService.createPlaylist(playlist);

    // Redirect
    return res.redirect('/admin/playlists');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Show page to edit a playlist
 */
export const showEditPlaylist = async (req, res) => {
  // Get handlerErrors
  const { handlerErrors } = req;

  // Get playlist
  const playlist = await dataService.getPlaylistById(req.params.id);
  if (!playlist) {
    localStorage.setItem(
      'flash',
      JSON.stringify([
        {
          type: 'danger',
          message: 'Playlist was not found.',
        },
      ])
    );
    return res.redirect('/admin/playlists');
  }

  // Check authorization: teacher can only edit own playlists
  if (
    req.user.role === 'teacher' &&
    parseInt(playlist.user.id, 10) !== parseInt(req.user.id, 10)
  ) {
    localStorage.setItem(
      'flash',
      JSON.stringify([
        {
          type: 'danger',
          message: 'You are not authorized to edit that playlist.',
        },
      ])
    );
    return res.redirect('/admin/playlists');
  }

  // Get videos for datalist
  let allVideos;
  if (req.user.role === 'teacher') {
    // Get videos for teacher
    allVideos = await dataService.getVideosByUserId(req.user.id, {
      topic: { name: 'ASC' },
      name: 'ASC',
    });
  } else {
    // Get all videos
    allVideos = await dataService.getVideos({
      topic: { name: 'ASC' },
      name: 'ASC',
    });
  }

  // Get teachers
  const teachers = await dataService.getUsersByRole('teacher');

  // Inputs
  const inputs = [
    {
      name: 'id',
      type: 'hidden',
      value: playlist.id,
    },
    {
      name: 'videos',
      type: 'hidden',
      value: playlist.videos.map((video) => video.id).join(','),
    },
    {
      label: 'Title',
      name: 'name',
      type: 'input',
      required: true,
      value: req.body?.name ? req.body.name : playlist.name,
      error: req.inputErrors?.name ? req.inputErrors.name : '',
    },
  ];

  // Add 'teacher' (user) to inputs:
  // role teacher: input is hidden | role admin: select element
  if (req.user.role === 'teacher') {
    inputs.push({
      name: 'user_id',
      type: 'hidden',
      value: playlist.user.id,
    });
  } else if (req.user.role === 'admin') {
    inputs.push({
      label: 'Teacher',
      name: 'user_id',
      type: 'select',
      options: teachers,
      required: true,
      value: req.body?.user_id ? req.body.user_id : playlist.user.id,
      error: req.inputErrors?.user_id ? req.inputErrors.user_id : '',
    });
  }

  // Render page
  return res.render('admin/playlists/edit', {
    activeNav: 'admin',
    action: 'playlists',
    role: req.user.role,
    userIdForForm: playlist.user.id,
    handlerErrors,
    allVideos,
    playlist,
    inputs,
  });
};

/**
 * Save edited playlist
 */
export const handleEditPlaylist = async (req, res, next) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
      if (!req.body.videos)
        req.handlerErrors = [
          { type: 'danger', message: 'At least one video is required.' },
        ];
      return next();
    }

    // Create array of video objects
    let arrOfVideoObj = [];
    if (req.body.videos) {
      const videoIds = req.body.videos.split(',');
      // for (const id of videoIds) {
      //   // eslint-disable-next-line no-await-in-loop
      //   const video = await dataService.getVideoById(id);
      //   if (video) arrOfVideoObj.push({ ...video });
      // }
      // Source: https://stackoverflow.com/questions/52152842/fix-no-await-in-loop-lint-warning#52152930
      const promises = [];
      for (const id of videoIds) {
        promises.push(dataService.getVideoById(id));
      }
      arrOfVideoObj = await Promise.all(promises);
    }

    // Create playlist object
    const playlist = {
      name: req.body.name.trim(),
      slug: getSlug(req.body.name),
      user: { id: req.body.user_id },
      videos: arrOfVideoObj,
    };

    // Save update to database
    await dataService.updatePlaylist(req.body.id, playlist);

    // Redirect
    return res.redirect('/admin/playlists');
  } catch (error) {
    console.error(error);
    return next();
  }
};

/**
 * Delete a playlist
 */
export const deletePlaylist = async (req, res, next) => {
  try {
    // Check if playlist exists
    const { id, currentPage } = req.body;
    const playlist = await dataService.getPlaylistById(id);
    if (!playlist) {
      localStorage.setItem(
        'flash',
        JSON.stringify([
          {
            type: 'danger',
            message: 'Playlist was not found.',
          },
        ])
      );
      return res.redirect('/admin/playlists');
    }

    // Check authorization: teacher can only delete own playlists
    if (
      req.user.role === 'teacher' &&
      parseInt(playlist.user.id, 10) !== parseInt(req.user.id, 10)
    ) {
      localStorage.setItem(
        'flash',
        JSON.stringify([
          {
            type: 'danger',
            message: 'You are not authorized to delete that playlist.',
          },
        ])
      );
      return res.redirect('/admin/playlists');
    }

    // Delete playlist
    await dataService.deletePlaylist(id);

    // Redirect
    return res.redirect(`/admin/playlists?page=${currentPage}`);
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

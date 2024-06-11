import { validationResult } from 'express-validator';
import * as dataService from '../../services/dataService.js';
import { MSG_200, MSG_404, MSG_500 } from '../../consts.js';
import { getSlug } from '../../lib/Utils.js';

/**
 * Get all playlists
 */
export const getPlaylists = async (req, res) => {
  try {
    const playlists = await dataService.getPlaylists();
    if (!playlists) return res.status(404).json(MSG_404);
    return res.status(200).json(playlists);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Get one playlist by ID
 */
export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Id is required.' });
    const playlist = await dataService.getPlaylistById(id);
    if (!playlist) return res.status(404).json(MSG_404);
    return res.status(200).json(playlist);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Create a new playlist
 */
export const createPlaylist = async (req, res) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        inputErrors[param] = msg;
      return res.status(400).json(inputErrors);
    }

    // Create array of video objects
    let arrOfVideoObj = [];
    if (req.body.videos && req.body.videos.length !== 0) {
      const videoIds = req.body.videos.map((video) => video.id);
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
    const newPlaylist = await dataService.createPlaylist(playlist);

    // Response
    return res.status(201).json(newPlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Update a playlist
 */
export const updatePlaylist = async (req, res) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        inputErrors[param] = msg;
      return res.status(400).json(inputErrors);
    }

    // Check if id is provided
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Id is required.' });

    // Check if playlist exists
    const playlist = await dataService.getPlaylistById();
    if (!playlist) return res.status(404).json({ MSG_404 });

    // Teacher can only edit own playlists
    if (req.user.role === 'teacher' && playlist.user.id !== req.user.id)
      return res
        .status(401)
        .json({ message: 'Teachers can only edit own playlists.' });

    // Create array of video objects
    let arrOfVideoObj = [];
    if (req.body.videos && req.body.videos.length !== 0) {
      const videoIds = req.body.videos.map((video) => video.id);
      // for (const id of videoIds) {
      //   // eslint-disable-next-line no-await-in-loop
      //   const video = await dataService.getVideoById(id);
      //   if (video) arrOfVideoObj.push({ ...video });
      // }
      // Source: https://stackoverflow.com/questions/52152842/fix-no-await-in-loop-lint-warning#52152930
      const promises = [];
      for (const vid of videoIds) {
        promises.push(dataService.getVideoById(vid));
      }
      arrOfVideoObj = await Promise.all(promises);
    }

    // Save update to database
    const update = await dataService.updatePlaylist(id, {
      name: req.body.name.trim(),
      slug: getSlug(req.body.name),
      user: { id: req.body.user_id },
      videos: [...playlist.videos, ...arrOfVideoObj],
    });

    // Response
    return res.status(200).json(update);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Add a video to a playlist
 */
export const addVideo = async (req, res) => {
  try {
    // Check for playlist ID
    const { playlist_id: playlistID, video_id: videoId } = req.body;
    if (!playlistID || !videoId)
      return res
        .status(400)
        .json({ message: 'Playlist ID and video ID are required.' });

    // Get playlist
    const playlist = await dataService.getPlaylistById(playlistID);
    if (!playlist)
      return res.status(404).json({ message: 'Playlist was not found.' });

    // Get video
    const video = await dataService.getVideoById(videoId);
    if (!video)
      return res.status(404).json({ message: 'Video was not found.' });

    // Add video to playlist
    playlist.videos = [...playlist.videos, video];

    // Save update
    const update = await dataService.updatePlaylist(playlistID, playlist);

    // Response
    return res.status(200).json(update);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Delete a playlist
 */
export const deletePlaylist = async (req, res) => {
  try {
    // Check for id
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'ID is required.' });

    // Check for playlist
    const playlist = await dataService.getPlaylistById(id);
    if (!playlist) return res.status(404).json(MSG_404);

    // Delete playlist
    await dataService.deletePlaylist(id);

    // Response
    return res.status(200).json(MSG_200);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

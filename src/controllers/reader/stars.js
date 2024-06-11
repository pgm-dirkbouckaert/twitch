import { BASE_URL } from '../../consts.js';
import * as dataService from '../../services/dataService.js';

/**
 * Show stars page
 */
export const showStars = async (req, res) => {
  // Get videostars
  const videostars = await dataService.getVideostarsByUserId(req.user.id);
  const videostarIds = videostars.map((star) => star.video.id);

  // Get starred videos
  let videos = [];
  for (const star of videostars) {
    videos.push(dataService.getVideoById(star.video.id));
  }
  videos = await Promise.all(videos);

  // Render page
  res.render('reader/stars', {
    activeNav: 'stars',
    role: req.user.role,
    videos,
    videostarIds,
  });
};

/**
 * Add a star for a video
 */
export const addStarVideo = async (req, res) => {
  // Add star
  const { id: videoId } = req.params;
  const { id: userId } = req.user;
  await dataService.addStarVideo(videoId, userId);

  // Redirect
  // const path = new URL(req.get('Referrer')).pathname;
  const path = req.get('Referrer').replace(BASE_URL, '');
  return res.redirect(path);
};

/**
 * Delete a star for a video
 */
export const deleteStarVideo = async (req, res) => {
  // Delete star
  const { id: videoId } = req.params;
  await dataService.deleteStarVideo(videoId);

  // Redirect
  // const path = new URL(req.get('Referrer')).pathname;
  const path = req.get('Referrer').replace(BASE_URL, '');
  return res.redirect(path);
};

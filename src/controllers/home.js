import * as dataService from '../services/dataService.js';

/**
 * Show page with all videos
 */
export const home = async (req, res) => {
  // Get filter
  const filterByTopic = req.query.topic;

  // Get videos
  let videos;
  if (filterByTopic) {
    // Get videos for topic
    videos = await dataService.getVideosByTopic(filterByTopic);
  } else {
    // Get all videos
    videos = await dataService.getVideos();
  }

  // Get all topics
  const topics = await dataService.getTopics();

  // Get videostars
  const videostars = await dataService.getVideostarsByUserId(req.user.id);
  const videostarIds = videostars.map((star) => star.video.id);

  // Render page
  res.render('home', {
    activeNav: 'videos',
    role: req.user.role,
    videos,
    videostarIds,
    topics,
    filterByTopic,
  });
};

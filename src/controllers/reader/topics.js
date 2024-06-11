import { LocalStorage } from 'node-localstorage';
import * as dataService from '../../services/dataService.js';

const localStorage = new LocalStorage('./scratch');

/**
 * Show topics page
 */
export const showTopics = async (req, res) => {
  // Get flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Get filter
  const filterByTopic = req.query.topic;

  // Get topics
  let topics;
  if (filterByTopic) {
    // Get topic by name
    topics = await dataService.getTopicsByName(filterByTopic);
  } else {
    // Get all topics
    topics = await dataService.getTopics();
  }

  // Get all topics for datalist
  const allTopics = await dataService.getTopics();

  // Render page
  res.render('reader/topics/index', {
    activeNav: 'topics',
    role: req.user.role,
    flash,
    filterByTopic,
    topics,
    allTopics,
  });
};

/**
 * Show page with topic details
 */
export const showTopicDetails = async (req, res) => {
  // Get topic
  const { id } = req.params;
  const topic = await dataService.getTopicById(id);
  if (!topic) {
    localStorage.setItem(
      'flash',
      JSON.stringify([{ type: 'danger', message: 'Topic was not found.' }])
    );
    return res.redirect('/topics');
  }

  // Get videostars
  const videostars = await dataService.getVideostarsByUserId(req.user.id);
  const videostarIds = videostars.map((star) => star.video.id);

  // Render page
  return res.render('reader/topics/detail', {
    activeNav: 'topics',
    role: req.user.role,
    topic,
    videostarIds,
  });
};

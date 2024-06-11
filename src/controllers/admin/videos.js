import { LocalStorage } from 'node-localstorage';
import { validationResult } from 'express-validator';
import * as dataService from '../../services/dataService.js';
import { arrToPagedObj, getSlug } from '../../lib/Utils.js';

const localStorage = new LocalStorage('./scratch');

/**
 * Show list of videos
 */
export const showVideos = async (req, res) => {
  // Get pageings
  const currentPage = parseInt(req.query.page, 10) || 1;

  // Get flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Get videos
  let videos;
  if (req.user.role === 'teacher') {
    // Get videos for teacher
    videos = await dataService.getVideosByUserId(req.user.id, {
      topic: { name: 'ASC' },
      name: 'ASC',
    });
  } else {
    // Get all videos
    videos = await dataService.getVideos({
      topic: { name: 'ASC' },
      name: 'ASC',
    });
  }

  // Apply filter
  const filterByTopic = req.query.topic;
  if (filterByTopic) {
    videos = videos.filter((video) => video.topic.name === filterByTopic);
  }

  // Get topics
  const topics = await dataService.getTopics();

  // Render page
  res.render('admin/videos', {
    activeNav: 'admin',
    action: 'videos',
    role: req.user.role,
    flash,
    topics,
    filterByTopic,
    videos: arrToPagedObj(videos, 10, currentPage),
  });
};

/**
 * Show page to edit video
 */
export const showEditVideo = async (req, res) => {
  // Get video
  const video = await dataService.getVideoById(req.params.id);
  if (!video) {
    localStorage.setItem(
      'flash',
      JSON.stringify([
        {
          type: 'danger',
          message: 'Video was not found.',
        },
      ])
    );
    return res.redirect('/admin/videos');
  }

  // Check authorization: teacher can only edit own videos
  if (
    req.user.role === 'teacher' &&
    parseInt(video.user.id, 10) !== parseInt(req.user.id, 10)
  ) {
    localStorage.setItem(
      'flash',
      JSON.stringify([
        {
          type: 'danger',
          message: 'You are not authorized to edit that video.',
        },
      ])
    );
    return res.redirect('/admin/videos');
  }

  // Get all topics
  const topics = await dataService.getTopics();

  // Get teachers
  const teachers = await dataService.getUsersByRole('teacher');

  // Inputs
  const inputs = [
    {
      name: 'id',
      type: 'hidden',
      value: video.id,
    },
    {
      label: 'Topic',
      name: 'topic_id',
      type: 'select',
      options: topics,
      required: true,
      value: req.body?.topic_id ? req.body.topic_id : video.topic.id,
      error: req.inputErrors?.topic_id ? req.inputErrors.topic_id : '',
    },
    {
      label: 'Title',
      name: 'name',
      type: 'text',
      required: true,
      value: req.body?.name ? req.body.name : video.name,
      error: req.inputErrors?.name ? req.inputErrors.name : '',
    },
    {
      label: 'Thumbnail (url)',
      name: 'thumbnail',
      type: 'url',
      required: true,
      value: req.body?.thumbnail ? req.body.thumbnail : video.thumbnail,
      error: req.inputErrors?.thumbnail ? req.inputErrors.thumbnail : '',
    },
    {
      label: 'YouTube ID',
      name: 'youtube_id',
      type: 'text',
      required: true,
      value: req.body?.youtube_id ? req.body.youtube_id : video.youtube_id,
      error: req.inputErrors?.youtube_id ? req.inputErrors.youtube_id : '',
    },
  ];

  // Add 'teacher' (user) to inputs:
  // role teacher: input is hidden | role admin: select element
  if (req.user.role === 'teacher') {
    inputs.push({
      name: 'user_id',
      type: 'hidden',
      value: video.user.id,
    });
  } else if (req.user.role === 'admin') {
    inputs.push({
      label: 'Teacher',
      name: 'user_id',
      type: 'select',
      options: teachers,
      required: true,
      value: req.body?.user_id ? req.body.user_id : video.user.id,
      error: req.inputErrors?.user_id ? req.inputErrors.user_id : '',
    });
  }

  // Render page
  return res.render('admin/videos/edit', {
    activeNav: 'admin',
    action: 'videos',
    role: req.user.role,
    video,
    inputs,
    topicIdForForm: video.topic.id,
    userIdForForm: video.user.id,
  });
};

/**
 * Save edited video
 */
export const handleEditVideo = async (req, res, next) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
      return next();
    }

    // Create update object
    const update = {
      name: req.body.name.trim(),
      slug: getSlug(req.body.name),
      thumbnail: req.body.thumbnail.trim(),
      youtube_id: req.body.youtube_id.trim(),
      user: { id: req.body.user_id },
      topic: { id: req.body.topic_id },
    };

    // Save update to database
    await dataService.updateVideo(req.body.id, update);

    // Redirect
    return res.redirect('/admin/videos');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Show page to add a video
 */
export const showCreateVideo = async (req, res) => {
  // Get handlerErrors
  const handlerErrors = req.handlerErrors || [];

  // Get all topics
  const topics = await dataService.getTopics();

  // Get teachers
  const teachers = await dataService.getUsersByRole('teacher');

  // Inputs
  const inputs = [
    {
      label: 'Topic',
      name: 'topic_id',
      type: 'select',
      options: topics,
      required: true,
      value: req.body?.topic_id ? req.body.topic_id : '',
      error: req.inputErrors?.topic_id ? req.inputErrors.topic_id : '',
    },
    {
      label: 'Title',
      name: 'name',
      type: 'text',
      required: true,
      value: req.body?.name ? req.body.name : '',
      error: req.inputErrors?.name ? req.inputErrors.name : '',
    },
    {
      label: 'Thumbnail (url)',
      name: 'thumbnail',
      type: 'url',
      required: true,
      value: req.body?.thumbnail ? req.body.thumbnail : '',
      error: req.inputErrors?.thumbnail ? req.inputErrors.thumbnail : '',
    },
    {
      label: 'YouTube ID',
      name: 'youtube_id',
      type: 'text',
      required: true,
      value: req.body?.youtube_id ? req.body.youtube_id : '',
      error: req.inputErrors?.youtube_id ? req.inputErrors.youtube_id : '',
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
  res.render('admin/videos/create', {
    activeNav: 'admin',
    action: 'videos',
    role: req.user.role,
    inputs,
    handlerErrors,
  });
};

/**
 * Save new video
 */
export const handleCreateVideo = async (req, res, next) => {
  try {
    // Check authorization: teacher can only add video for own account
    if (
      req.user.role === 'teacher' &&
      parseInt(req.body.user, 10) !== parseInt(req.user.id, 10)
    ) {
      localStorage.setItem(
        'flash',
        JSON.stringify([
          {
            type: 'danger',
            message: 'You can only add videos for your own account.',
          },
        ])
      );
      return res.redirect('/admin/videos');
    }

    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
      return next();
    }

    // Create video object
    const video = {
      name: req.body.name.trim(),
      slug: getSlug(req.body.name),
      thumbnail: req.body.thumbnail.trim(),
      youtube_id: req.body.youtube_id.trim(),
      user: { id: req.body.user_id },
      topic: { id: req.body.topic_id },
    };

    // Save new video to database
    await dataService.createVideo(video);

    // Redirect
    return res.redirect('/admin/videos');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Delete a video
 */
export const deleteVideo = async (req, res, next) => {
  try {
    // Check if video exists
    const { id, currentPage } = req.body;
    const video = await dataService.getVideoById(id);
    if (!video) {
      localStorage.setItem(
        'flash',
        JSON.stringify([
          {
            type: 'danger',
            message: 'Video was not found.',
          },
        ])
      );
      return res.redirect('/admin/videos');
    }

    // Check authorization: teacher can only delete own videos
    if (
      req.user.role === 'teacher' &&
      parseInt(video.user.id, 10) !== parseInt(req.user.id, 10)
    ) {
      localStorage.setItem(
        'flash',
        JSON.stringify([
          {
            type: 'danger',
            message: 'You are not authorized to delete that video.',
          },
        ])
      );
      return res.redirect('/admin/videos');
    }

    // Delete video
    await dataService.deleteVideo(id);

    // Redirect
    return res.redirect(`/admin/videos?page=${currentPage}`);
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

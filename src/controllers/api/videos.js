import { validationResult } from 'express-validator';
import * as dataService from '../../services/dataService.js';
import { MSG_200, MSG_404, MSG_500 } from '../../consts.js';
import { getSlug } from '../../lib/Utils.js';

/**
 * Get all videos
 */
export const getVideos = async (req, res) => {
  try {
    const videos = await dataService.getVideos();
    if (!videos) return res.status(404).json(MSG_404);
    return res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Get one video by ID
 */
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Id is required.' });
    const video = await dataService.getVideoById(id);
    if (!video) return res.status(404).json(MSG_404);
    return res.status(200).json(video);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Create a new video
 */
export const createVideo = async (req, res) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        inputErrors[param] = msg;
      return res.status(400).json(inputErrors);
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
    const newVideo = await dataService.createVideo(video);

    // Response
    return res.status(201).json(newVideo);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Update a video
 */
export const updateVideo = async (req, res) => {
  try {
    const {
      id,
      topic_id: topicId,
      name,
      thumbnail,
      youtube_id: youtubeID,
      teacher_id: teacherId,
    } = req.body;
    if (!id) return res.status(400).json({ message: 'Id is required.' });

    // Check if video exists
    const video = await dataService.getVideoById(id);
    if (!video) return res.status(404).json(MSG_404);

    // Teachers can only update own videos
    if (req.user.role === 'teacher' && req.user.id !== video.user.id)
      return res
        .status(401)
        .json({ meszsage: 'Teachers can only edit own videos.' });

    // If topic is being updated: check if it exists
    if (topicId) {
      const topic = await dataService.getTopicById(topicId);
      if (!topic)
        return res.status(404).json({ message: 'Topic was not found.' });
    }

    // If teacher (user) is being updated: check if user exists and is teacher
    if (teacherId) {
      const user = await dataService.getUserById(teacherId);
      if (!user)
        return res.status(404).json({ message: 'Teacher was not found.' });
      if (user.role.label !== 'teacher')
        return res
          .status(409)
          .json({ message: 'You can assign videos only to teachers.' });
    }

    // Update video
    const data = {};
    if (name) {
      data.name = name;
      data.slug = getSlug(name);
    }
    if (thumbnail) data.thumbnail = thumbnail;
    if (youtubeID) data.youtubeID = youtubeID;
    if (topicId) {
      data.topic = {};
      data.topic.id = topicId;
    }
    if (teacherId) {
      data.user = {};
      data.user.id = teacherId;
    }
    const updatedVideo = await dataService.updateVideo(id, {
      ...video,
      ...data,
    });

    // Response
    return res.status(200).json(updatedVideo);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Delete a video
 */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Id is required.' });

    // Check if video exists
    const video = await dataService.getVideoById(id);
    if (!video) return res.status(404).json(MSG_404);

    // Delete video
    await dataService.deleteVideo(id);

    // Response
    return res.status(200).json(MSG_200);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

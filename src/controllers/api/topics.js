import fs from 'fs';
import { validationResult } from 'express-validator';
import sharp from 'sharp';
import * as dataService from '../../services/dataService.js';
import {
  ICON_EXT,
  ICON_PATH,
  MSG_200,
  MSG_404,
  MSG_500,
} from '../../consts.js';
import { getSlug } from '../../lib/Utils.js';

/**
 * Get all topics
 */
export const getTopics = async (req, res) => {
  try {
    const topics = await dataService.getTopics();
    if (!topics) return res.status(404).json(MSG_404);
    return res.status(200).json(topics);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Get one topic by ID
 */
export const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Id is required.' });
    const topic = await dataService.getTopicById(id);
    if (!topic) return res.status(404).json(MSG_404);
    return res.status(200).json(topic);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Create a new topic
 */
export const createTopic = async (req, res) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        inputErrors[param] = msg;
      return res.status(400).json(inputErrors);
    }

    // Check if topic already exists
    const topicExists = await dataService.getTopicBySlug(
      getSlug(req.body.name)
    );
    if (topicExists) {
      return res.status(409).json({ message: 'Topic already exists.' });
    }

    // Refactor topic object
    const topic = req.body;
    topic.slug = getSlug(topic.name);

    // Get file (icon)
    const { file } = req;

    if (!file) {
      // File is required
      return res.status(400).json({ message: 'Icon file is required.' });
    }
    // Proceed if mimetype complies to requested format
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      // Set icon name and add to topic
      const iconName = `${getSlug(topic.name)}.${ICON_EXT}`;
      topic.icon = iconName;

      // Upload icon to public folder
      await sharp(file.buffer)
        .resize(64, 64, {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .toFormat(ICON_EXT)
        .toFile(`${ICON_PATH}/${iconName}`);
    } else {
      // File doesn't have the required mimetype
      return res
        .status(400)
        .json({ message: 'Please upload a png, jpg or jpeg file.' });
    }

    // Save update to database
    const newTopic = await dataService.createTopic(topic);

    // Redirect
    return res.status(201).json(newTopic);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Update a topic
 */
export const updateTopic = async (req, res) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        inputErrors[param] = msg;
      return res.status(400).json(inputErrors);
    }

    // Get id
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Id is required.' });

    // Check if topic exists
    const topic = await dataService.getTopicById(id);
    if (!topic) {
      return res.status(404).json(MSG_404);
    }

    // Create update object
    const update = {
      name: req.body.name.trim(),
      slug: getSlug(req.body.name),
    };

    // Get file (icon)
    const { file } = req;

    // Proceed if mimetype complies to requested format
    if (file) {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        // Remove old icon
        const oldIcon = topic.icon;
        if (oldIcon) {
          const filePath = `${ICON_PATH}/${oldIcon}`;
          fs.access(filePath, (err) => {
            if (!err) fs.rmSync(filePath);
          });
        }

        // Set icon name and add to update
        const iconName = `${getSlug(update.name)}.${ICON_EXT}`;
        update.icon = iconName;

        // Upload icon to public folder
        await sharp(file.buffer)
          .resize(64, 64, {
            fit: 'cover',
            withoutEnlargement: true,
          })
          .toFormat(ICON_EXT)
          .toFile(`${ICON_PATH}/${iconName}`);
      } else {
        // File doesn't have the required mimetype
        return res
          .status(400)
          .json({ message: 'Please upload a png, jpg or jpeg file.' });
      }
    }

    // Save update to database
    const updatedTopic = await dataService.updateTopic(req.body.id, update);

    // Redirect
    return res.status(200).json(updatedTopic);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

/**
 * Delete a topic
 */
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Id is required.' });

    // Check if topic exists
    const topic = await dataService.getTopicById(id);
    if (!topic) return res.status(404).json(MSG_404);

    // Delete video
    await dataService.deleteTopic(id);

    // Response
    return res.status(200).json(MSG_200);
  } catch (error) {
    console.error(error);
    return res.status(500).json(MSG_500);
  }
};

import fs from 'fs';
import sharp from 'sharp';
import { LocalStorage } from 'node-localstorage';
import { validationResult } from 'express-validator';
import { ICON_EXT, ICON_PATH } from '../../consts.js';
import { arrToPagedObj, getSlug } from '../../lib/Utils.js';
import * as dataService from '../../services/dataService.js';

const localStorage = new LocalStorage('./scratch');

/**
 * Show list of topics
 */
export const showTopics = async (req, res) => {
  // Get pageing
  const currentPage = parseInt(req.query.page, 10) || 1;

  // Get flash messages
  const flash = JSON.parse(localStorage.getItem('flash'));
  localStorage.removeItem('flash');

  // Get topics
  let topics = await dataService.getTopics({
    topic: { name: 'ASC' },
    name: 'ASC',
  });

  // Set allTopics for datalist
  const allTopics = [...topics];

  // Apply filter
  const filterByTopic = req.query.topic;
  if (filterByTopic) {
    topics = topics.filter((topic) => topic.name === filterByTopic);
  }

  // Render page
  res.render('admin/topics', {
    activeNav: 'admin',
    action: 'topics',
    role: req.user.role,
    flash,
    allTopics,
    topics: arrToPagedObj(topics, 10, currentPage),
  });
};

/**
 * Show page to edit a topic
 */
export const showEditTopic = async (req, res) => {
  // Get topic
  const topic = await dataService.getTopicById(req.params.id);
  if (!topic) {
    localStorage.setItem(
      'flash',
      JSON.stringify([
        {
          type: 'danger',
          message: 'Topic was not found.',
        },
      ])
    );
    return res.redirect('/admin/topics');
  }

  // Get videos for datalist
  const allVideos = await dataService.getVideos({
    topic: { name: 'ASC' },
    name: 'ASC',
  });

  // Inputs
  const inputs = [
    {
      name: 'id',
      type: 'hidden',
      value: topic.id,
    },
    {
      name: 'videos',
      type: 'hidden',
      value: topic.videos.map((video) => video.id).join(','),
    },
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      required: true,
      value: req.body?.name ? req.body.name : topic.name,
      error: req.inputErrors?.name ? req.inputErrors.name : '',
    },
    {
      label: 'Icon',
      instructions: 'Leave blank if you do not want to change the icon.',
      name: 'icon',
      type: 'file',
      required: false,
      value: req.body?.icon ? req.body.icon : topic.icon,
      error: req.inputErrors?.icon ? req.inputErrors.icon : '',
    },
  ];

  // Render page
  return res.render('admin/topics/edit', {
    activeNav: 'admin',
    action: 'topics',
    role: req.user.role,
    topic,
    allVideos,
    inputs,
  });
};

/**
 * Save edited topic
 */
export const handleEditTopic = async (req, res, next) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
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

    // Create update object
    const update = {
      name: req.body.name.trim(),
      slug: getSlug(req.body.name),
      videos: [...arrOfVideoObj],
    };

    // Get file (icon)
    const { file } = req;
    if (file) {
      // Proceed if mimetype complies to requested format
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        // Remove old icon
        const topic = await dataService.getTopicById(req.body.id);
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
        req.inputErrors = { icon: 'Please upload a png, jpg or jpeg file.' };
        return next();
      }
    }

    // Save update to database
    await dataService.updateTopic(req.body.id, update);

    // Redirect
    return res.redirect('/admin/topics');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Show page to add a topic
 */
export const showCreateTopic = async (req, res) => {
  // Inputs
  const inputs = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      required: true,
      value: req.body?.name ? req.body.name : '',
      error: req.inputErrors?.name ? req.inputErrors.name : '',
    },
    {
      label: 'Icon',
      name: 'icon',
      type: 'file',
      required: true,
      value: req.body?.icon ? req.body.icon : '',
      error: req.inputErrors?.icon ? req.inputErrors.icon : '',
    },
  ];

  // Render page
  res.render('admin/topics/create', {
    activeNav: 'admin',
    action: 'topics',
    role: req.user.role,
    inputs,
  });
};

/**
 * Save new topic
 */
export const handleCreateTopic = async (req, res, next) => {
  try {
    // Validate form
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array())
        req.inputErrors[param] = msg;
      return next();
    }

    // Check if topic already exists
    const topicExists = await dataService.getTopicBySlug(
      getSlug(req.body.name)
    );
    if (topicExists) {
      req.inputErrors = { name: 'Topic already exists.' };
      return next();
    }

    // Refactor topic object
    const topic = req.body;
    topic.slug = getSlug(topic.name);

    // Get file (icon)
    const { file } = req;
    if (!file) {
      // File is required
      req.inputErrors = { icon: 'Icon is required.' };
      return next();
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
      req.inputErrors = { icon: 'Please upload a png, jpg or jpeg file.' };
      return next();
    }

    // Save update to database
    await dataService.createTopic(topic);

    // Redirect
    return res.redirect('/admin/topics');
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

/**
 * Delete a topic
 */
export const deleteTopic = async (req, res, next) => {
  try {
    // Check if topic exists
    const { id, currentPage } = req.body;
    const topic = await dataService.getTopicById(id);
    if (!topic) {
      localStorage.setItem(
        'flash',
        JSON.stringify([
          {
            type: 'danger',
            message: 'Topic was not found.',
          },
        ])
      );
      return res.redirect('/admin/topics');
    }

    // Delete topic
    await dataService.deleteTopic(id);

    // Redirect
    return res.redirect(`/admin/topics?page=${currentPage}`);
  } catch (error) {
    console.error(error);
    return next(error.message);
  }
};

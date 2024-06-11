import fs from 'fs';
import { ILike } from 'typeorm';
import AppDataSource from '../lib/DataSource.js';
import { ICON_PATH } from '../consts.js';

/** **************************************************
 *                    TOPICS                         *
 *************************************************** */

/** s
 * Get all topics
 */
export const getTopics = async () => {
  const topicRepo = AppDataSource.getRepository('Topic');
  const topics = await topicRepo.find({
    relations: {
      videos: { user: true, playlists: true },
    },
    order: { name: 'ASC' },
  });
  // Remove password from topic info (relation: video > user)
  for (const topic of topics) {
    for (const video of topic.videos) delete video.user.password;
  }
  return topics;
};

/**
 * Get topics by name
 */
export const getTopicsByName = async (name, order = { name: 'ASC' }) => {
  const topicRepo = AppDataSource.getRepository('Topic');
  const topics = await topicRepo.find({
    relations: {
      videos: { user: true, playlists: true },
    },
    where: {
      name: ILike(name),
    },
    order,
  });
  // Remove password from topic info (relation: video > user)
  for (const topic of topics) {
    for (const video of topic.videos) delete video.user.password;
  }
  return topics;
};

/**
 * Get topic by slug
 */
export const getTopicBySlug = async (slug) => {
  const topicRepo = AppDataSource.getRepository('Topic');
  const topic = await topicRepo.findOne({
    relations: {
      videos: { user: true, playlists: true },
    },
    where: {
      slug,
    },
  });
  if (!topic) return false;
  // Remove password from topic info (relation: video > user)
  if (topic.videos && topic.videos.length !== 0) {
    for (const video of topic.videos) delete video.user.password;
  }
  return topic;
};

/**
 * Get topic by id
 */
export const getTopicById = async (id) => {
  const topicRepo = AppDataSource.getRepository('Topic');
  const topic = await topicRepo.findOne({
    relations: {
      videos: {
        user: { usermeta: true },
        playlists: true,
      },
    },
    where: { id },
  });
  if (!topic) return false;
  // Remove password from topic info (relation: video > user)
  for (const video of topic.videos) delete video.user.password;
  return topic;
};

/**
 * Update a topic
 */
export const updateTopic = async (id, update) => {
  const topicRepo = AppDataSource.getRepository('Topic');
  const topic = await topicRepo.findOne({
    where: { id },
    relations: { videos: true },
  });
  if (!topic) return false;
  const updatedTopic = await topicRepo.save({ ...topic, ...update });
  return updatedTopic;
};

/**
 * Create a topic
 */
export const createTopic = async (topic) => {
  const topicRepo = AppDataSource.getRepository('Topic');
  const newTopic = await topicRepo.save(topic);
  return newTopic;
};

/**
 * Delete a topic
 */
export const deleteTopic = async (id) => {
  const topicRepo = AppDataSource.getRepository('Topic');

  // Delete icon
  const topic = await topicRepo.findOneBy({ id });
  if (topic.icon) {
    const filePath = `${ICON_PATH}/${topic.icon}`;
    fs.access(filePath, (err) => {
      if (!err) fs.rmSync(filePath);
    });
  }

  // Delete topic
  await topicRepo.delete(id);
  return true;
};

/** **************************************************
 *                    VIDEOS                         *
 *************************************************** */

/**
 * Get all videos
 */
export const getVideos = async (order = { id: 'DESC' }) => {
  const videoRepo = AppDataSource.getRepository('Video');
  const videos = await videoRepo.find({
    relations: {
      topic: true,
      user: { usermeta: true },
    },
    order,
  });
  // Remove password from video info (relation: user)
  for (const video of videos) delete video.user.password;
  return videos;
};

/**
 * Get videos by topic
 */
export const getVideosByTopic = async (topic) => {
  const videoRepo = AppDataSource.getRepository('Video');
  const videos = await videoRepo.find({
    relations: {
      topic: true,
      user: { usermeta: true },
    },
    where: {
      topic: { name: ILike(topic) },
    },
    order: { id: 'DESC' },
  });
  // Remove password from video info (relation: user)
  for (const video of videos) delete video.user.password;
  return videos;
};

/**
 * Get videos by user id
 */
export const getVideosByUserId = async (id, order = { id: 'DESC' }) => {
  const videoRepo = AppDataSource.getRepository('Video');
  const videos = await videoRepo.find({
    relations: {
      topic: true,
      user: { usermeta: true },
    },
    where: {
      user: { id },
    },
    order,
  });
  // Remove password from video info (relation: user)
  for (const video of videos) delete video.user.password;
  return videos;
};

/**
 * Get one video by id
 */
export const getVideoById = async (id) => {
  const videoRepo = AppDataSource.getRepository('Video');
  const video = await videoRepo.findOne({
    relations: {
      topic: true,
      user: { usermeta: true },
    },
    where: { id },
  });
  if (!video) return false;
  // Remove password from video info (relation: user)
  delete video.user.password;
  return video;
};

/**
 * Create a video
 */
export const createVideo = async (video) => {
  const videoRepo = AppDataSource.getRepository('Video');
  const newVideo = await videoRepo.save(video);
  return newVideo;
};

/**
 * Update a video
 */
export const updateVideo = async (id, update) => {
  const videoRepo = AppDataSource.getRepository('Video');
  const video = await videoRepo.findOne({
    where: { id },
    relations: ['user', 'topic'],
  });
  if (!video) return false;
  const updatedVideo = await videoRepo.save({ ...video, ...update });
  return updatedVideo;
};

/**
 * Delete a video
 */
export const deleteVideo = async (id) => {
  const videoRepo = AppDataSource.getRepository('Video');
  await videoRepo.delete(id);
  return true;
};

/** **************************************************
 *                    PLAYLISTS                      *
 *************************************************** */

/**
 * Get all playlists
 */
export const getPlaylists = async (order = { id: 'DESC' }) => {
  const playlistRepo = AppDataSource.getRepository('Playlist');
  const playlists = await playlistRepo.find({
    relations: {
      videos: true,
      user: { usermeta: true },
    },
    order,
  });
  // Remove password from playlist info (relation: user)
  for (const playlist of playlists) delete playlist.user.password;
  return playlists;
};

/**
 * Get playlist by id
 */
export const getPlaylistById = async (id) => {
  const playlistRepo = AppDataSource.getRepository('Playlist');
  const playlist = await playlistRepo.findOne({
    relations: {
      user: { usermeta: true },
      videos: { user: { usermeta: true } },
    },
    where: {
      id,
    },
  });
  if (!playlist) return false;
  // Remove password from playlist info (relation: user)
  delete playlist.user.password;
  // Remove password from video info (relation: user)
  for (const video of playlist.videos) delete video.user.password;
  return playlist;
};

/**
 * Get playlists by username
 */
export const getPlaylistsByUsername = async (
  username,
  order = { id: 'DESC' }
) => {
  const playlistRepo = AppDataSource.getRepository('Playlist');
  const playlists = await playlistRepo.find({
    relations: {
      videos: true,
      user: { usermeta: true },
    },
    where: {
      user: {
        usermeta: {
          username: ILike(username),
        },
      },
    },
    order,
  });
  // Remove password from playlist info (relation: user)
  for (const playlist of playlists) delete playlist.user.password;
  return playlists;
};

/**
 * Get playlists by user id
 */
export const getPlaylistsByUserId = async (id, order = { id: 'DESC' }) => {
  const playlistRepo = AppDataSource.getRepository('Playlist');
  const playlists = await playlistRepo.find({
    relations: {
      videos: true,
      user: { usermeta: true },
    },
    where: {
      user: { id },
    },
    order,
  });
  // Remove password from playlist info (relation: user)
  for (const playlist of playlists) delete playlist.user.password;
  return playlists;
};

/**
 * Update a playlist
 */
export const updatePlaylist = async (id, update) => {
  const playlistRepo = AppDataSource.getRepository('Playlist');
  const playlist = await playlistRepo.findOne({
    where: { id },
    relations: ['user', 'videos'],
  });
  if (!playlist) return false;
  const updatedPlaylist = await playlistRepo.save({ ...playlist, ...update });
  return updatedPlaylist;
};

/**
 * Create a playlist
 */
export const createPlaylist = async (playlist) => {
  const playlistRepo = AppDataSource.getRepository('Playlist');
  const newPlaylist = await playlistRepo.save(playlist);
  return newPlaylist;
};

/**
 * Delete a playlist
 */
export const deletePlaylist = async (id) => {
  const playlistRepo = AppDataSource.getRepository('Playlist');
  await playlistRepo.delete(id);
  return true;
};

/** **************************************************
 *                      USERS                        *
 *************************************************** */

/**
 * Get all users
 */
export const getUsers = async (order = { usermeta: { username: 'ASC' } }) => {
  const userRepo = AppDataSource.getRepository('User');
  const users = await userRepo.find({
    relations: {
      role: true,
      usermeta: true,
    },
    order,
  });
  // Remove password from user info
  for (const user of users) delete user.password;
  return users;
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role) => {
  const userRepo = AppDataSource.getRepository('User');
  const users = await userRepo.find({
    relations: {
      role: true,
      usermeta: true,
    },
    where: {
      role: { label: role },
    },
  });
  // Remove password from user info
  for (const user of users) delete user.password;
  return users;
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email) => {
  const userRepo = AppDataSource.getRepository('User');
  const user = await userRepo.findOne({
    relations: ['role', 'usermeta'],
    where: { email },
  });
  if (!user) return false;
  return user;
};

/**
 * Get user by username
 */
export const getUserByUsername = async (
  username,
  order = { usermeta: { username: 'ASC' } }
) => {
  const userRepo = AppDataSource.getRepository('User');
  const user = await userRepo.findOne({
    relations: ['role', 'usermeta'],
    where: {
      usermeta: { username },
    },
    order,
  });
  if (!user) return false;
  return user;
};

/**
 * Get user by id
 */
export const getUserById = async (id) => {
  const userRepo = AppDataSource.getRepository('User');
  const user = await userRepo.findOne({
    relations: ['role', 'usermeta'],
    where: { id },
  });
  if (!user) return false;
  return user;
};

/**
 * Save a user
 */
export const saveUser = async (user) => {
  const repo = AppDataSource.getRepository('User');
  return repo.save(user);
};

/**
 * Delete a user
 */
export const deleteUser = async (id) => {
  const repo = AppDataSource.getRepository('User');
  await repo.delete(id);
  return true;
};

/** **************************************************
 *                      ROLES                        *
 *************************************************** */

/**
 * Get all roles
 */
export const getRoles = async () => {
  const repo = AppDataSource.getRepository('Role');
  const roles = await repo.find({});
  return roles;
};

/** *************************************************
 *                    VIDEOSTARS                    *
 ************************************************** */

/**
 * Get all videostars
 */
export const getAllVideostars = async () => {
  const repo = AppDataSource.getRepository('Videostar');
  const stars = await repo.find({});
  return stars;
};

/**
 * Get videostars by user ID
 */
export const getVideostarsByUserId = async (id) => {
  const repo = AppDataSource.getRepository('Videostar');
  const stars = await repo.find({
    relations: ['user', 'video'],
    where: { user: { id } },
  });
  return stars;
};

/**
 * Add a star for a video
 */
export const addStarVideo = async (videoId, userId) => {
  const repo = AppDataSource.getRepository('Videostar');
  const star = await repo.save({
    type: 'video',
    user: { id: userId },
    video: { id: videoId },
  });
  return star;
};

/**
 * Delete a star for a video
 */
export const deleteStarVideo = async (videoId) => {
  const repo = AppDataSource.getRepository('Videostar');
  const star = await repo.findOne({
    relations: ['video'],
    where: { video: { id: videoId } },
  });
  if (!star) return false;
  const deleted = await repo.delete(star.id);
  return deleted;
};

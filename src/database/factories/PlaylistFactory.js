import AppDataSource from '../../lib/DataSource.js';
import Factory from './Factory.js';
import { getSlug } from '../../lib/Utils.js';

class PlaylistFactory extends Factory {
  constructor() {
    super();
  }

  async make() {
    // Get random teacher
    const userRepo = AppDataSource.getRepository('User');
    const teachers = await userRepo.find({
      relations: { role: true },
      where: { role: { label: 'teacher' } },
    });
    const teacher = teachers[Math.floor(Math.random() * teachers.length)];

    // Get random topic
    const topicRepo = AppDataSource.getRepository('Topic');
    const topics = await topicRepo.find({});
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // Get all videos for topic
    const videoRepo = AppDataSource.getRepository('Video');
    const allVideosForTopic = await videoRepo.find({
      relations: { topic: true },
      where: { topic: { name: randomTopic.name } },
    });

    // Select 5 videos
    let startIndex = 0;
    if (allVideosForTopic.length > 5)
      startIndex = Math.floor(Math.random() * (allVideosForTopic.length - 5));
    const selectedVideos = allVideosForTopic
      .slice(startIndex, startIndex + 5)
      .map((video) => ({ id: video.id }));

    // Create playlist
    const playlist = {
      name: `Learn ${randomTopic.name}`,
      slug: getSlug(`Learn ${randomTopic.name}`),
      user: { id: teacher.id },
      videos: selectedVideos,
    };
    // console.log('playlist:', playlist);

    // Insert playlist
    const record = await this.insert(playlist);
    this.inserted.push(record);
  }

  async insert(playlist) {
    const playlistRepo = AppDataSource.getRepository('Playlist');
    // Check if record exists
    const record = await playlistRepo.findOne({
      where: { name: playlist.name },
    });
    if (record) return record;
    // If the record doesn't exist, create it
    return playlistRepo.save(playlist);
  }
}

export default new PlaylistFactory();

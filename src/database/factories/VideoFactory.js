import fetch from 'node-fetch';
import AppDataSource from '../../lib/DataSource.js';
import Factory from './Factory.js';
import { getSlug } from '../../lib/Utils.js';
import { YOUTUBE_SEARCHURL } from '../../consts.js';

class VideoFactory extends Factory {
  constructor() {
    super();
    this.searchurl = YOUTUBE_SEARCHURL;
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
    const topic = topics[Math.floor(Math.random() * topics.length)];

    // Search videos on YouTube
    const results = await fetch(this.searchurl + topic.name);
    const videoData = await results.json();

    // Create 5 videos for current topic and teacher
    let numVideos = 0;
    const videosForThisTeacher = [];
    for (const item of videoData.items) {
      if (numVideos === 5) break;
      if (item.id.kind === 'youtube#video') {
        const video = {
          name: item.snippet.title,
          slug: getSlug(item.snippet.title),
          youtube_id: item.id.videoId,
          thumbnail: item.snippet.thumbnails.medium.url,
          user: { id: teacher.id },
          topic: { id: topic.id },
        };
        // const record = await this.insert(video);
        // videosForThisTeacher.push(record);
        videosForThisTeacher.push(this.insert(video));
        numVideos += 1;
      }
    }
    // this.inserted.push(videosForThisTeacher);
    this.inserted.push(await Promise.all(videosForThisTeacher));
  }

  async insert(video) {
    const videoRepo = AppDataSource.getRepository('Video');
    // Check if record exists
    const record = await videoRepo.findOne({
      where: { youtube_id: video.youtube_id },
    });
    if (record) return record;
    // If record doesn't exist, create it
    return videoRepo.save(video);
  }
}

export default new VideoFactory();

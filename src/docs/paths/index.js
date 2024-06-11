import auth from './auth.js';
import playlists from './playlists.js';
import teachers from './teachers.js';
import topics from './topics.js';
import videos from './videos.js';

export default {
  ...auth,
  ...teachers,
  ...topics,
  ...videos,
  ...playlists,
};

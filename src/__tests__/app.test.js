import request from 'supertest';
import app from '../app.js';
import AppDataSource from '../lib/DataSource.js';
import { getSlug } from '../lib/Utils.js';

let server;

describe('API tests', () => {
  beforeAll(async () => {
    const connection = await AppDataSource.initialize();
    if (!connection.isInitialized)
      console.error('Error during Data Source initialization');
    server = app.listen(process.env.PORT, () => {
      console.log(`App is running on http://localhost:${process.env.PORT}/.`);
    });
  });

  afterAll(async () => {
    await AppDataSource.destroy();
    server.close();
  });

  describe('Testing authentication endpoints', () => {
    test('POST /api/login responds with 200 and returns a JWT', async () => {
      // Send a request to /api/login with a valid email and password
      const response = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'reader@example.com',
          password: 'artevelde',
        })
        .set('Accept', 'application/json');

      // Check response
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test('POST /api/register responds with 201 and returns the new user object', async () => {
      // Send a request to /api/register with a valid user object
      const response = await request(app)
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .send({
          firstname: 'Reader',
          lastname: 'API',
          username: 'reader-api',
          email: 'reader-api@example.com',
          password: 'artevelde',
        })
        .set('Accept', 'application/json');

      // Check response
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('role');
      expect(response.body.role.id).toBe(1);
      expect(response.body).toHaveProperty('usermeta');
      expect(response.body.usermeta).toHaveProperty('firstname');
      expect(response.body.usermeta).toHaveProperty('lastname');
      expect(response.body.usermeta).toHaveProperty('username');
      expect(response.body.usermeta).toHaveProperty('avatar');
      expect(response.body.usermeta.avatar).toBe('default_avatar.png');
    });
  });

  describe('Testing video endpoints', () => {
    test.only('GET /api/videos responds with 200 and returns all videos', async () => {
      const getToken = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'reader@example.com',
          password: 'artevelde',
        })
        .set('Accept', 'application/json');

      const { token } = getToken.body;

      const response = await request(app)
        .get('/api/videos')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('length');
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/videos responds with 201 and returns the new video object (only for admins)', async () => {
      // Get token
      const getToken = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'admin@example.com',
          password: 'artevelde',
        })
        .set('Accept', 'application/json');
      const { token } = getToken.body;

      // Create new video object
      const newVideo = {
        topic_id: 15,
        name: 'How To Use TypeScript With Express & Node',
        thumbnail: 'https://i.ytimg.com/vi/qy8PxD3alWw/maxresdefault.jpg',
        youtube_id: 'qy8PxD3alWw',
        user_id: 2,
      };

      // Create video
      const response = await request(app)
        .post('/api/videos')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({
          topic_id: newVideo.topic_id,
          name: newVideo.name,
          thumbnail: newVideo.thumbnail,
          youtube_id: newVideo.youtube_id,
          user_id: newVideo.user_id,
        })
        .set('Accept', 'application/json');

      // Check response
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toBe(newVideo.name);
      expect(response.body).toHaveProperty('slug');
      expect(response.body.slug).toBe(getSlug(newVideo.name));
      expect(response.body).toHaveProperty('thumbnail');
      expect(response.body.thumbnail).toBe(newVideo.thumbnail);
      expect(response.body).toHaveProperty('youtube_id');
      expect(response.body.youtube_id).toBe(newVideo.youtube_id);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(newVideo.user_id);
      expect(response.body).toHaveProperty('topic');
      expect(response.body.topic.id).toBe(newVideo.topic_id);
    });
  });

  describe('Testing playlist endpoints', () => {
    test('GET /api/playlists responds with 200 and returns all playlists', async () => {
      // Get token
      const getToken = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'reader@example.com',
          password: 'artevelde',
        })
        .set('Accept', 'application/json');
      const { token } = getToken.body;

      // Send request
      const response = await request(app)
        .get('/api/playlists')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      // Check response
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('length');
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  test('POST /api/playlists/addVideo responds with 200 and returns the updated playlist (only for admins)', async () => {
    // Get token
    const getToken = await request(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@example.com',
        password: 'artevelde',
      })
      .set('Accept', 'application/json');
    const { token } = getToken.body;

    const addVideoInfo = {
      playlist_id: 11,
      video_id: 178,
    };

    // Send request
    const response = await request(app)
      .post('/api/playlists/addVideo')
      .set('Authorization', `Bearer ${token}`)
      .send(addVideoInfo)
      .set('Accept', 'application/json');

    // Check response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(addVideoInfo.playlist_id);
    expect(response.body).toHaveProperty('videos');
    expect(response.body.videos).toHaveProperty('length');
    expect(Array.isArray(response.body.videos)).toBeTruthy();
    expect(Array.isArray(response.body.videos)).toBe(true);
    expect(
      response.body.videos.filter((video) => video.id === addVideoInfo.video_id)
    ).toHaveLength(1);
  });

  describe('Testing user endpoints', () => {
    test('GET /api/teachers responds with 200 and returns all teachers', async () => {
      // Get token
      const getToken = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'reader@example.com',
          password: 'artevelde',
        })
        .set('Accept', 'application/json');

      const { token } = getToken.body;

      const response = await request(app)
        .get('/api/teachers')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('length');
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/teachers/:id responds with 200 and returns the requested teacher', async () => {
      // Get token
      const getToken = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'reader@example.com',
          password: 'artevelde',
        })
        .set('Accept', 'application/json');

      const { token } = getToken.body;

      const response = await request(app)
        .get('/api/teachers/2')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('usermeta');
      expect(response.body).toHaveProperty('role');
      expect(response.body.role.labe).toBe('teacher');
    });
  });

  describe('Testing topic endpoints', () => {
    test('GET /api/topics responds with 200 and returns all topics', async () => {
      // Get token
      const getToken = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'reader@example.com',
          password: 'artevelde',
        })
        .set('Accept', 'application/json');

      const { token } = getToken.body;

      const response = await request(app)
        .get('/api/topics')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('length');
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/topcis/:id responds with 200 and returns the requested topic', async () => {
      // Get token
      const getToken = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'reader@example.com',
          password: 'artevelde',
        })
        .set('Accept', 'application/json');

      const { token } = getToken.body;

      const response = await request(app)
        .get('/api/topics/2')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('slug');
      expect(response.body).toHaveProperty('icon');
      expect(response.body).toHaveProperty('videos');
      expect(response.body.videos).toHaveProperty('length');
      expect(Array.isArray(response.body.videos)).toBeTruthy();
      expect(Array.isArray(response.body.videos)).toBe(true);
    });
  });
});

export default {
  user: {
    required: ['id', 'email', 'password', 'usermeta', 'role'],
    properties: {
      id: { type: 'number', required: true },
      email: { type: 'string', required: true, unique: true },
      password: { type: 'string', required: true },
      usermeta: { $ref: '#/components/schemas/usermeta' },
      role: { $ref: '#/components/schemas/role' },
      videos: {
        type: 'array',
        items: { $ref: '#/components/schemas/video' },
      },
      playlists: {
        type: 'array',
        items: { $ref: '#/components/schemas/playlist' },
      },
    },
  },
  userInput: {
    required: ['email', 'password', 'usermeta', 'role'],
    properties: {
      email: { type: 'string', required: true, unique: true },
      password: { type: 'string', required: true },
      usermeta: { $ref: '#/components/schemas/usermetaInput' },
      role: { $ref: '#/components/schemas/roleInput' },
      videos: {
        type: 'array',
        items: { $ref: '#/components/schemas/videoInput' },
      },
      playlists: {
        type: 'array',
        items: { $ref: '#/components/schemas/playlistInput' },
      },
    },
  },
  usermeta: {
    required: ['id', 'firstname', 'lastname', 'username'],
    properties: {
      id: { type: 'number', required: true },
      firstname: { type: 'string', required: true },
      lastname: { type: 'string', required: true },
      username: { type: 'string', required: true, unique: true },
      avatar: { type: 'string', nullable: true },
    },
  },
  usermetaInput: {
    required: ['firstname', 'lastname', 'username'],
    properties: {
      firstname: { type: 'string', required: true },
      lastname: { type: 'string', required: true },
      username: { type: 'string', required: true, unique: true },
      avatar: { type: 'string', nullable: true },
    },
  },
  role: {
    required: ['id', 'label'],
    properties: {
      id: { type: 'integer' },
      label: {
        type: 'string',
        enum: ['reader', 'teacher', 'admin'],
        required: true,
      },
    },
  },
  roleInput: {
    required: ['id'],
    properties: {
      id: { type: 'number', required: true },
    },
  },
  video: {
    required: [
      'id',
      'name',
      'slug',
      'thumbnail',
      'youtube_id',
      'topic',
      'user',
    ],
    properties: {
      id: { type: 'integer', required: true },
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      thumbnail: { type: 'string', required: true },
      youtube_id: { type: 'string', required: true },
      topic: { $ref: '#/components/schemas/topic' },
      user: { $ref: '#/components/schemas/user' },
    },
  },
  videoInput: {
    required: ['name', 'slug', 'thumbnail', 'youtube_id', 'topic', 'user'],
    properties: {
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      thumbnail: { type: 'string', required: true },
      youtube_id: { type: 'string', required: true },
      topic: { $ref: '#/components/schemas/topicInput' },
      user: { $ref: '#/components/schemas/userInput' },
    },
  },
  topic: {
    required: ['id', 'name', 'slug', 'icon'],
    properties: {
      id: { type: 'integer', required: true },
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      icon: { type: 'string', required: true },
    },
  },
  topicInput: {
    required: ['name', 'slug', 'icon'],
    properties: {
      name: { type: 'string', required: true },
      icon: { type: 'string', required: true },
    },
  },
  playlist: {
    required: ['id', 'name', 'slug', 'user'],
    properties: {
      id: { type: 'integer', required: true },
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      user: { $ref: '#/components/schemas/user' },
      videos: {
        type: 'array',
        items: { $ref: '#/components/schemas/video' },
      },
    },
  },
  playlistInput: {
    required: ['name', 'slug', 'user'],
    properties: {
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      user: { $ref: '#/components/schemas/userInput' },
      videos: {
        type: 'array',
        items: { $ref: '#/components/schemas/videoInput' },
      },
    },
  },
};

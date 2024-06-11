import responses from '../responses/general.js';

export default {
  '/playlists': {
    get: {
      tags: ['Playlists'],
      summary: 'Get all playlists.',
      description: `Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/playlist' },
              },
            },
          },
        },
        400: responses[400],
        401: responses[401],
        404: responses[404],
        500: responses[500],
      },
    },
    post: {
      tags: ['Playlists'],
      summary: 'Create a new playlist. Only for admins.',
      description: `<b>Note</b>: Only users with role <code>admin</code> are authorized.<br>
                    Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['user_id', 'name'],
              properties: {
                user_id: { type: 'number', required: true },
                name: { type: 'string', required: true },
                videos: {
                  type: 'array',
                  nullable: true,
                  items: {
                    properties: { id: { type: 'number' } },
                  },
                },
              },
            },
            example: {
              user_id: 63,
              name: 'JavaScript Tutorials',
              videos: [{ id: 170 }],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/playlist' },
              example: {
                name: 'JavaScript Tutorials',
                slug: 'javascript-tutorials',
                user: { id: 63 },
                id: 25,
              },
            },
          },
        },
        400: responses[400],
        401: responses[401],
        409: responses[409],
        500: responses[500],
      },
    },
    put: {
      tags: ['Playlists'],
      summary: 'Update a playlist. Only for playlists and admins.',
      description: `<b>Note</b>: Only users with role <code>playlist</code> or <code>admin</code> are authorized.<br>
                    <b>Note</b>: playlists can only edit their own account.<br>
                    Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['id', 'user_id', 'name'],
              properties: {
                id: { type: 'number', required: true },
                user_id: { type: 'number', required: true },
                name: { type: 'string', required: true },
                videos: {
                  type: 'array',
                  items: {
                    properties: { id: { type: 'number' } },
                  },
                  nullable: true,
                },
              },
              example: {
                id: 25,
                user_id: 63,
                name: 'JavaScript Tutorials Update',
                videos: [{ id: 175 }],
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/playlist' },
              example: {
                id: 25,
                name: 'JavaScript Tutorials Update',
                slug: 'javascript-tutorials-update',
                user: {
                  id: 63,
                },
                videos: [
                  {
                    id: 175,
                    name: 'JavaScript Programming - Full Course',
                    slug: 'javascript-programming---full-course',
                    thumbnail:
                      'https://i.ytimg.com/vi_webp/jS4aFq5-91M/maxresdefault.webp',
                    youtube_id: 'jS4aFq5-91M',
                    topic: {
                      id: 2,
                      name: 'Javascript',
                      slug: 'javascript',
                      icon: 'javascript.png',
                    },
                    user: {
                      id: 2,
                      email: 'teacher@example.com',
                      usermeta: {
                        id: 2,
                        firstname: 'Teacher',
                        lastname: 'Artevelde',
                        username: 'teacher-ahs',
                        avatar:
                          'https://ui-avatars.com/api/?name=Teacher+Artevelde&size=128&background=random',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        400: responses[400],
        401: responses[401],
        409: responses[409],
        500: responses[500],
      },
    },
    delete: {
      tags: ['Playlists'],
      summary: 'Delete a playlist. Only for admins.',
      description: `Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
              },
            },
            example: {
              id: 23,
            },
          },
        },
      },
      responses: {
        200: responses[200],
        400: responses[400],
        401: responses[401],
        404: responses[404],
        500: responses[500],
      },
    },
  },
  '/playlists/{id}': {
    get: {
      tags: ['Playlists'],
      summary: 'Get one playlist by ID.',
      description: `Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          descripton: 'The ID of the playlist.',
          required: true,
          type: 'integer',
          example: 2,
        },
      ],
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/playlist' },
            },
          },
        },
        400: responses[400],
        401: responses[401],
        404: responses[404],
        500: responses[500],
      },
    },
  },
  '/playlists/addVideo': {
    post: {
      tags: ['Playlists'],
      summary: 'Add a video to a playlist. Only for admins.',
      description: `<b>Note</b>: Only users with role <code>admin</code> are authorized.<br>
                    Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['playlist_id', 'video_id'],
              properties: {
                playlist_id: { type: 'number', required: true },
                video_id: { type: 'number', required: true },
              },
            },
            example: {
              playlist_id: 25,
              video_id: 173,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/playlist' },
              example: {
                id: 25,
                name: 'JavaScript Tutorials Update',
                slug: 'javascript-tutorials-update',
                user: {
                  id: 63,
                  email: 'teacher2@example.com',
                  usermeta: {
                    id: 59,
                    firstname: 'New',
                    lastname: 'Teacher',
                    username: 'teacher2',
                    avatar: 'default_avatar.png',
                  },
                },
                videos: [
                  {
                    id: 175,
                    name: 'JavaScript Programming - Full Course',
                    slug: 'javascript-programming---full-course',
                    thumbnail:
                      'https://i.ytimg.com/vi_webp/jS4aFq5-91M/maxresdefault.webp',
                    youtube_id: 'jS4aFq5-91M',
                    user: {
                      id: 2,
                      email: 'teacher@example.com',
                      usermeta: {
                        id: 2,
                        firstname: 'Teacher',
                        lastname: 'Artevelde',
                        username: 'teacher-ahs',
                        avatar:
                          'https://ui-avatars.com/api/?name=Teacher+Artevelde&size=128&background=random',
                      },
                    },
                  },
                  {
                    id: 173,
                    name: 'JavaScript Full Course (2023) - Beginner to Pro - Part 1',
                    slug: 'javascript-full-course-(2023)---beginner-to-pro---part-1',
                    thumbnail:
                      'https://i.ytimg.com/vi/SBmSRK3feww/maxresdefault.jpg',
                    youtube_id: 'SBmSRK3feww',
                    topic: {
                      id: 2,
                      name: 'Javascript',
                      slug: 'javascript',
                      icon: 'javascript.png',
                    },
                    user: {
                      id: 63,
                      email: 'teacher2@example.com',
                      usermeta: {
                        id: 59,
                        firstname: 'New',
                        lastname: 'Teacher',
                        username: 'teacher2',
                        avatar: 'default_avatar.png',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        400: responses[400],
        401: responses[401],
        409: responses[409],
        500: responses[500],
      },
    },
  },
};

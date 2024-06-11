import responses from '../responses/general.js';

export default {
  '/videos': {
    get: {
      tags: ['Videos'],
      summary: 'Get all videos.',
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
                items: { $ref: '#/components/schemas/video' },
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
      tags: ['Videos'],
      summary: 'Create a new video. Only for admins.',
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
              required: [
                'topic_id',
                'name',
                'thumbnail',
                'youtube_id',
                'user_id',
              ],
              properties: {
                topic_id: { type: 'number', required: true },
                name: { type: 'string', required: true },
                thumbnail: { type: 'string', required: true },
                youtube_id: { type: 'string', required: true },
                user_id: { type: 'number', required: true },
              },
            },
            example: {
              topic_id: 2,
              name: 'JavaScript Programming - Full Course',
              thumbnail:
                'https://i.ytimg.com/vi_webp/jS4aFq5-91M/maxresdefault.webp',
              youtube_id: 'jS4aFq5-91M',
              user_id: 2,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/video' },
              example: {
                name: 'JavaScript Programming - Full Course',
                thumbnail:
                  'https://i.ytimg.com/vi_webp/jS4aFq5-91M/maxresdefault.webp',
                youtube_id: 'jS4aFq5-91M',
                slug: 'javascript-programming---full-course',
                topic: { id: 2 },
                user: { id: 2 },
                id: 175,
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
      tags: ['Videos'],
      summary: 'Update a video. Only for teachers and admins.',
      description: `<b>Note</b>: Only users with role <code>teacher</code> or <code>admin</code> are authorized.<br>
                    <b>Note</b>: Teachers can only edit own videos.<br>
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
              required: [
                'id',
                'topic_id',
                'name',
                'thumbnail',
                'youtube_id',
                'user_id',
              ],
              properties: {
                id: { type: 'number', required: true },
                topic_id: { type: 'number', required: true },
                name: { type: 'string', required: true },
                thumbnail: { type: 'string', required: true },
                youtube_id: { type: 'string', required: true },
                user_id: { type: 'number', required: true },
              },
              example: {
                id: 177,
                name: 'JavaScript Programming - Full Course DUPLICATE',
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
              schema: { $ref: '#/components/schemas/video' },
              example: {
                name: 'JavaScript Programming - Full Course',
                thumbnail:
                  'https://i.ytimg.com/vi_webp/jS4aFq5-91M/maxresdefault.webp',
                youtube_id: 'jS4aFq5-91M',
                slug: 'javascript-programming---full-course',
                topic: { id: 2 },
                user: { id: 2 },
                id: 175,
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
      tags: ['Videos'],
      summary: 'Delete a video. Only for admins.',
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
              id: 177,
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
  '/videos/{id}': {
    get: {
      tags: ['Videos'],
      summary: 'Get one video by ID.',
      description: `Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          descripton: 'The ID of the video.',
          required: true,
          type: 'integer',
          example: 30,
        },
      ],
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/video' },
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
};

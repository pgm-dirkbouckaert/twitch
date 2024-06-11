import responses from '../responses/general.js';

export default {
  '/topics': {
    get: {
      tags: ['Topics'],
      summary: 'Get all topics.',
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
                items: { $ref: '#/components/schemas/topic' },
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
      tags: ['Topics'],
      summary: 'Create a new topic. Only for admins.',
      description: `<b>Note</b>: Only users with role <code>admin</code> are authorized.<br>
                    Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['name', 'icon'],
              properties: {
                name: { type: 'string', required: true },
                icon: { type: 'string', format: 'binary', required: true },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/topic' },
              example: { name: 'ES6', slug: 'es6', icon: 'es6.png', id: 39 },
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
      tags: ['Topics'],
      summary: 'Update a topic. Only for admins.',
      description: `<b>Note</b>: Only users with role <code>admin</code> are authorized.<br>
                    Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['id', 'name'],
              properties: {
                id: { type: 'number', required: true },
                name: { type: 'string', required: true },
                icon: { type: 'string', format: 'binary' },
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
              schema: { $ref: '#/components/schemas/topic' },
              example: { name: 'ES6', slug: 'es6', icon: 'es6.png', id: 39 },
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
      tags: ['Topics'],
      summary: 'Delete a topic. Only for admins.',
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
              required: ['id'],
              properties: {
                id: { type: 'integer', required: true },
              },
            },
            example: {
              id: 39,
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
  '/topics/{id}': {
    get: {
      tags: ['Topics'],
      summary: 'Get one topic by ID.',
      description: `Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          descripton: 'The ID of the topic.',
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
              schema: { $ref: '#/components/schemas/topic' },
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

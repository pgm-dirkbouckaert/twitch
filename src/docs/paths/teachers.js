import responses from '../responses/general.js';

export default {
  '/teachers': {
    get: {
      tags: ['Teachers'],
      summary: 'Get all teachers.',
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
                items: { $ref: '#/components/schemas/teacher' },
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
      tags: ['Teachers'],
      summary: 'Create a new teacher. Only for admins.',
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
                'firstname',
                'lastname',
                'username',
                'email',
                'password',
              ],
              properties: {
                firstname: { type: 'string', required: true },
                lastname: { type: 'string', required: true },
                username: { type: 'string', required: true },
                email: { type: 'string', required: true },
                password: { type: 'string', required: true },
              },
            },
            example: {
              firstname: 'Third',
              lastname: 'Teacher',
              username: 'teacher3',
              email: 'teacher3@example.com',
              password: 'artevelde',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/teacher' },
              example: {
                email: 'teacher3@example.com',
                role: { id: 2 },
                usermeta: {
                  firstname: 'Third',
                  lastname: 'Teacher',
                  username: 'teacher3',
                  avatar: 'default_avatar.png',
                  id: 63,
                },
                id: 67,
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
      tags: ['Teachers'],
      summary: 'Update a teacher. Only for teachers and admins.',
      description: `<b>Note</b>: Only users with role <code>teacher</code> or <code>admin</code> are authorized.<br>
                    <b>Note</b>: Teachers can only edit their own account.<br>
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
              required: ['id'],
              properties: {
                id: { type: 'number', required: true },
                firstname: { type: 'string' },
                lastname: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
              },
              example: {
                id: 67,
                firstname: '3rd',
                username: 'teacher3-ahs',
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
              schema: { $ref: '#/components/schemas/teacher' },
              example: {
                id: 67,
                email: 'teacher3@example.com',
                role: {
                  id: 2,
                  label: 'teacher',
                },
                usermeta: {
                  id: 63,
                  firstname: '3rd',
                  username: 'teacher3-ahs',
                },
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
      tags: ['Teachers'],
      summary: 'Delete a teacher. Only for admins.',
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
              id: 67,
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
  '/teachers/{id}': {
    get: {
      tags: ['Teachers'],
      summary: 'Get one teacher by ID.',
      description: `Put your token in the headers as <code>Authorization: Bearer {{token}}</code>.<br>
                    For trying out on this page use the <code>Authorize</code> button on top
                    and use the token to authorize for <code>BearerAuth</code>.`,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          descripton: 'The ID of the teacher.',
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
              schema: { $ref: '#/components/schemas/teacher' },
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

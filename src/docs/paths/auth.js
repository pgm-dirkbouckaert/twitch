import responses from '../responses/general.js';

export default {
  '/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login and receive a token.',
      description: `You will receive a JSON Webtoken. When calling the other endpoints,  
         add this token to the headers as <code>Authorization: Bearer {{token}}</code>`,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', required: true },
                password: { type: 'string', required: true },
              },
              example: {
                email: 'reader@example.com',
                password: 'artevelde',
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
              schema: {
                properties: {
                  token: { type: 'string' },
                },
              },
              example: {
                token:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
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
  },
  '/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user.',
      description: `The user will be registered as a reader.`,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/userInput',
            },
            example: {
              firstname: 'New',
              lastname: 'Reader',
              username: 'reader2',
              email: 'reader2@example.com',
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
              schema: { $ref: '#/components/schemas/user' },
              example: {
                id: 66,
                email: 'reader3@example.com',
                role: { id: 1 },
                usermeta: {
                  firstname: 'Third',
                  lastname: 'Reader',
                  username: 'reader3',
                  avatar: 'default_avatar.png',
                  id: 62,
                },
              },
            },
          },
        },
        400: responses[400],
        409: responses[409],
        404: responses[404],
        500: responses[500],
      },
    },
  },
};

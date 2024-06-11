export default {
  200: {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Success',
          },
        },
      },
    },
  },
  201: {
    description: 'Created',
    content: {
      'application/json': {
        schema: {
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Created',
          },
        },
      },
    },
  },
  400: {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: {
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Bad Request',
          },
        },
      },
    },
  },
  401: {
    description: 'Unauthorized',
    content: {
      'application/json': {
        schema: {
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Unauthorized',
          },
        },
      },
    },
  },
  404: {
    description: 'Not Found',
    content: {
      'application/json': {
        schema: {
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Not Found',
          },
        },
      },
    },
  },
  409: {
    description: 'Conflict',
    content: {
      'application/json': {
        schema: {
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Email already exists.',
          },
        },
      },
    },
  },
  500: {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Internal Server Error',
          },
        },
      },
    },
  },
};

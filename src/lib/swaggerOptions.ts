export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api',
      version: '0.0.1',
      description: 'app'
    },
    servers: [
      { url: 'http://localhost:5000' }
    ]
  },
  apis: ['./src/routes/*.ts']
}

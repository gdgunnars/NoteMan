module.exports = {
  swaggerDefinition: {
    info: {
      description: 'This is the API Documentation for NoteMan',
      title: 'NoteMan',
      version: '0.1.0',
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: [
      'application/json',
    ],
    schemes: ['http', 'https'],
  },
  basedir: __dirname, //app absolute path
  files: ['./router/**/*.mjs', './models/**/*.mjs'],
};

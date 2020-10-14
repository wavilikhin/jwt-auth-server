const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'JWT-Authentication server',
      description: 'Sample nodeJS server for jwt authentication.',
      contact: {
        name: 'Vladislav Vavilikhin',
        email: 'vavilikhin.v@gmail.com',
      },
      version: '1.0.0',
    },
  },
  apis: ['./source/routes/**/*.js'],
};
module.exports = swaggerOptions;

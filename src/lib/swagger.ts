import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // define path to your API
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Maarga API Documentation',
        version: '1.0.0',
        description: 'Developer documentation for the Maarga Web App API',
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-KEY',
          },
        },
      },
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
    },
  });
  return spec;
};

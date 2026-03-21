import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async (version: string = 'v1') => {
  const spec = createSwaggerSpec({
    apiFolder: `src/app/api/${version}`, // Dynamically filter based on version
    definition: {
      openapi: '3.0.0',
      info: {
        title: `Maarga API Documentation (${version.toUpperCase()})`,
        version: '1.0.0',
        description: `Developer documentation for the Maarga Web App API - ${version}`,
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

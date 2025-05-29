import SwaggerParser from '@apidevtools/swagger-parser';
import path from 'path';
import { OpenAPIV3 } from 'openapi-types';

const openApiEntryPoint = path.resolve(
  process.cwd(),
  'docs_api/v1/openapi.yaml'
);

let bundledSpec: OpenAPIV3.Document | null = null;

export const getSwaggerSpec = async (): Promise<OpenAPIV3.Document> => {
  if (bundledSpec) {
    return bundledSpec;
  }

  console.log('Resolved OpenAPI spec path:', openApiEntryPoint);
  
  try {
    const api = await SwaggerParser.bundle(openApiEntryPoint);
    bundledSpec = api as OpenAPIV3.Document;
    return bundledSpec;
  } catch (err) {
    console.error('Error loading or bundling OpenAPI specification:', err);
    throw err;
  }
};

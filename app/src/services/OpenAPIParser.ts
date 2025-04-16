import { OpenAPIV3 } from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser';
import { ParsedAPI, Endpoint, Parameter, RequestBody, Response, Schema } from '../types';

export class OpenAPIParser {
  /**
   * Parse an OpenAPI specification from a URL or file path
   */
  async parse(specUrl: string): Promise<ParsedAPI> {
    try {
      // Parse and validate the OpenAPI spec
      const api = await SwaggerParser.validate(specUrl) as OpenAPIV3.Document;
      
      // Extract endpoints
      const endpoints = this.extractEndpoints(api);
      
      // Extract schemas
      const schemas = this.extractSchemas(api);
      
      return {
        info: api.info,
        endpoints,
        schemas
      };
    } catch (error) {
      console.error('Error parsing OpenAPI spec:', error);
      throw error;
    }
  }
  
  /**
   * Parse an OpenAPI specification from a JSON or YAML string
   */
  async parseString(specString: string, format: 'json' | 'yaml'): Promise<ParsedAPI> {
    try {
      // Parse the string into an object
      let specObject;
      
      if (format === 'json') {
        specObject = JSON.parse(specString);
      } else {
        // Use YAML parser
        const YAML = await import('yaml');
        specObject = YAML.parse(specString);
      }
      
      // Validate and dereference the spec
      const api = await SwaggerParser.validate(specObject) as OpenAPIV3.Document;
      
      // Extract endpoints
      const endpoints = this.extractEndpoints(api);
      
      // Extract schemas
      const schemas = this.extractSchemas(api);
      
      return {
        info: api.info,
        endpoints,
        schemas
      };
    } catch (error) {
      console.error(`Error parsing OpenAPI spec from ${format}:`, error);
      throw error;
    }
  }
  
  /**
   * Extract endpoints from the OpenAPI document
   */
  private extractEndpoints(api: OpenAPIV3.Document): Endpoint[] {
    const endpoints: Endpoint[] = [];
    
    // Iterate through paths and methods
    for (const [path, pathItem] of Object.entries(api.paths)) {
      if (!pathItem) continue;
      
      for (const [method, operation] of Object.entries(pathItem)) {
        if (this.isHttpMethod(method) && operation) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            operationId: operation.operationId || `${method}${path}`,
            summary: operation.summary || '',
            description: operation.description || '',
            parameters: this.extractParameters(operation.parameters, api),
            requestBody: operation.requestBody ? this.extractRequestBody(operation.requestBody, api) : undefined,
            responses: this.extractResponses(operation.responses, api),
            tags: operation.tags || []
          });
        }
      }
    }
    
    return endpoints;
  }
  
  /**
   * Extract parameters from the OpenAPI operation
   */
  private extractParameters(
    parameters: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[] | undefined,
    api: OpenAPIV3.Document
  ): Parameter[] {
    if (!parameters) return [];
    
    const result: Parameter[] = [];
    
    for (const param of parameters) {
      // Handle reference objects
      if ('$ref' in param) {
        // Resolve reference
        const refPath = param.$ref.replace('#/', '').split('/');
        let resolved: any = api;
        
        for (const segment of refPath) {
          resolved = resolved[segment];
        }
        
        if (resolved) {
          result.push(this.convertParameter(resolved));
        }
      } else {
        result.push(this.convertParameter(param));
      }
    }
    
    return result;
  }
  
  /**
   * Convert an OpenAPI parameter to our Parameter type
   */
  private convertParameter(param: OpenAPIV3.ParameterObject): Parameter {
    return {
      name: param.name,
      in: param.in as 'path' | 'query' | 'header' | 'cookie',
      required: param.required || false,
      schema: this.convertSchema(param.schema as OpenAPIV3.SchemaObject),
      description: param.description
    };
  }
  
  /**
   * Extract request body from the OpenAPI operation
   */
  private extractRequestBody(
    requestBody: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject,
    api: OpenAPIV3.Document
  ): RequestBody | undefined {
    // Handle reference objects
    if ('$ref' in requestBody) {
      // Resolve reference
      const refPath = requestBody.$ref.replace('#/', '').split('/');
      let resolved: any = api;
      
      for (const segment of refPath) {
        resolved = resolved[segment];
      }
      
      if (resolved) {
        return this.convertRequestBody(resolved);
      }
      
      return undefined;
    }
    
    return this.convertRequestBody(requestBody);
  }
  
  /**
   * Convert an OpenAPI request body to our RequestBody type
   */
  private convertRequestBody(requestBody: OpenAPIV3.RequestBodyObject): RequestBody {
    const content: Record<string, { schema: Schema }> = {};
    
    for (const [mediaType, mediaTypeObject] of Object.entries(requestBody.content || {})) {
      content[mediaType] = {
        schema: this.convertSchema(mediaTypeObject.schema as OpenAPIV3.SchemaObject)
      };
    }
    
    return {
      description: requestBody.description,
      required: requestBody.required || false,
      content
    };
  }
  
  /**
   * Extract responses from the OpenAPI operation
   */
  private extractResponses(
    responses: OpenAPIV3.ResponsesObject,
    api: OpenAPIV3.Document
  ): Response[] {
    const result: Response[] = [];
    
    for (const [statusCode, response] of Object.entries(responses)) {
      // Handle reference objects
      if ('$ref' in response) {
        // Resolve reference
        const refPath = response.$ref.replace('#/', '').split('/');
        let resolved: any = api;
        
        for (const segment of refPath) {
          resolved = resolved[segment];
        }
        
        if (resolved) {
          result.push({
            statusCode,
            description: resolved.description || '',
            content: this.extractResponseContent(resolved.content)
          });
        }
      } else {
        result.push({
          statusCode,
          description: response.description || '',
          content: this.extractResponseContent(response.content)
        });
      }
    }
    
    return result;
  }
  
  /**
   * Extract content from an OpenAPI response
   */
  private extractResponseContent(
    content: OpenAPIV3.ContentObject | undefined
  ): Record<string, { schema: Schema }> | undefined {
    if (!content) return undefined;
    
    const result: Record<string, { schema: Schema }> = {};
    
    for (const [mediaType, mediaTypeObject] of Object.entries(content)) {
      result[mediaType] = {
        schema: this.convertSchema(mediaTypeObject.schema as OpenAPIV3.SchemaObject)
      };
    }
    
    return result;
  }
  
  /**
   * Convert an OpenAPI schema to our Schema type
   */
  private convertSchema(schema: OpenAPIV3.SchemaObject | undefined): Schema {
    if (!schema) {
      return { type: 'object' };
    }
    
    const result: Schema = {
      type: schema.type || 'object',
      format: schema.format,
      description: schema.description,
      title: schema.title,
      default: schema.default,
      example: schema.example,
      nullable: schema.nullable,
      readOnly: schema.readOnly,
      writeOnly: schema.writeOnly,
      deprecated: schema.deprecated
    };
    
    // Handle properties for object types
    if (schema.properties) {
      result.properties = {};
      
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        result.properties[propName] = this.convertSchema(propSchema as OpenAPIV3.SchemaObject);
      }
    }
    
    // Handle items for array types
    if (schema.items) {
      result.items = this.convertSchema(schema.items as OpenAPIV3.SchemaObject);
    }
    
    // Handle enum
    if (schema.enum) {
      result.enum = schema.enum;
    }
    
    // Handle required properties
    if (schema.required) {
      result.required = schema.required;
    }
    
    return result;
  }
  
  /**
   * Extract schemas from the OpenAPI document
   */
  private extractSchemas(api: OpenAPIV3.Document): Schema[] {
    const schemas: Schema[] = [];
    
    if (api.components && api.components.schemas) {
      for (const [name, schema] of Object.entries(api.components.schemas)) {
        const convertedSchema = this.convertSchema(schema as OpenAPIV3.SchemaObject);
        convertedSchema.title = name;
        schemas.push(convertedSchema);
      }
    }
    
    return schemas;
  }
  
  /**
   * Check if a string is a valid HTTP method
   */
  private isHttpMethod(method: string): method is 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' {
    return ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'].includes(method);
  }
}

import { Endpoint, Component, ComponentMapping, Schema } from '../types';

export class UIAPIMapper {
  /**
   * Suggest a mapping between a component and an endpoint
   */
  suggestMapping(component: Component, endpoint: Endpoint): ComponentMapping {
    const mapping: ComponentMapping = {
      endpoint: endpoint.operationId,
      dataPath: this.suggestDataPath(endpoint),
      fields: this.suggestFieldMapping(component, endpoint),
      events: this.suggestEventMapping(component, endpoint)
    };
    
    return mapping;
  }
  
  /**
   * Suggest a data path for an endpoint
   */
  private suggestDataPath(endpoint: Endpoint): string {
    // Check if there's a 200 response with content
    const okResponse = endpoint.responses.find(r => r.statusCode === '200' || r.statusCode === '201');
    
    if (okResponse && okResponse.content) {
      // Find JSON content
      const jsonContent = Object.entries(okResponse.content).find(([mediaType]) => 
        mediaType.includes('json')
      );
      
      if (jsonContent) {
        const [_, content] = jsonContent;
        const schema = content.schema;
        
        // Check if the schema is an array
        if (schema.type === 'array') {
          return '$';
        }
        
        // Check if the schema has a data property
        if (schema.properties && schema.properties.data) {
          return '$.data';
        }
        
        // Check if the schema has a results property
        if (schema.properties && schema.properties.results) {
          return '$.results';
        }
        
        // Check if the schema has a items property
        if (schema.properties && schema.properties.items) {
          return '$.items';
        }
        
        // Default to root
        return '$';
      }
    }
    
    return '$';
  }
  
  /**
   * Suggest field mappings between a component and an endpoint
   */
  private suggestFieldMapping(component: Component, endpoint: Endpoint): Record<string, string> {
    const fields: Record<string, string> = {};
    
    // Get component fields based on component type
    const componentFields = this.getComponentFields(component);
    
    // Get response schema
    const responseSchema = this.getResponseSchema(endpoint);
    
    if (!responseSchema) {
      return fields;
    }
    
    // Map component fields to response schema properties
    for (const field of componentFields) {
      const schemaProperty = this.findMatchingSchemaProperty(field, responseSchema);
      
      if (schemaProperty) {
        fields[field] = `$.${schemaProperty}`;
      }
    }
    
    return fields;
  }
  
  /**
   * Suggest event mappings for a component
   */
  private suggestEventMapping(component: Component, endpoint: Endpoint): Record<string, any> {
    const events: Record<string, any> = {};
    
    // Suggest event mappings based on component type
    switch (component.type) {
      case 'Button':
        // For POST/PUT/DELETE endpoints, suggest onClick event
        if (['POST', 'PUT', 'DELETE'].includes(endpoint.method)) {
          events.onClick = {
            action: 'api',
            endpoint: endpoint.operationId
          };
        }
        break;
        
      case 'Form':
        // For POST/PUT endpoints, suggest onSubmit event
        if (['POST', 'PUT'].includes(endpoint.method)) {
          events.onSubmit = {
            action: 'api',
            endpoint: endpoint.operationId
          };
        }
        break;
        
      case 'DataTable':
      case 'List':
        // For GET endpoints with an item ID parameter, suggest onRowClick/onItemClick event
        if (endpoint.method === 'GET' && this.hasIdParameter(endpoint)) {
          const eventName = component.type === 'DataTable' ? 'onRowClick' : 'onItemClick';
          
          events[eventName] = {
            action: 'navigate',
            path: this.suggestDetailPath(endpoint),
            params: {
              id: '$.id'
            }
          };
        }
        break;
    }
    
    return events;
  }
  
  /**
   * Get fields for a component based on its type
   */
  private getComponentFields(component: Component): string[] {
    switch (component.type) {
      case 'DataTable':
        // Get column fields
        return (component.props.columns || []).map((column: any) => column.field);
        
      case 'Form':
        // Get form field names
        return (component.props.fields || []).map((field: any) => field.name);
        
      case 'Card':
        // Get card fields
        return ['title', 'subtitle', 'content'];
        
      case 'List':
        // Get list item fields
        return ['id', 'title', 'description', 'icon'];
        
      case 'Detail':
        // Get detail fields
        return (component.props.fields || []).map((field: any) => field.name);
        
      default:
        return [];
    }
  }
  
  /**
   * Get the response schema for an endpoint
   */
  private getResponseSchema(endpoint: Endpoint): Schema | null {
    // Check if there's a 200 response with content
    const okResponse = endpoint.responses.find(r => r.statusCode === '200' || r.statusCode === '201');
    
    if (okResponse && okResponse.content) {
      // Find JSON content
      const jsonContent = Object.entries(okResponse.content).find(([mediaType]) => 
        mediaType.includes('json')
      );
      
      if (jsonContent) {
        const [_, content] = jsonContent;
        const schema = content.schema;
        
        // If it's an array, get the items schema
        if (schema.type === 'array' && schema.items) {
          return schema.items;
        }
        
        // If it has a data property, check if it's an array
        if (schema.properties && schema.properties.data) {
          const dataSchema = schema.properties.data;
          
          if (dataSchema.type === 'array' && dataSchema.items) {
            return dataSchema.items;
          }
          
          return dataSchema;
        }
        
        // If it has a results property, check if it's an array
        if (schema.properties && schema.properties.results) {
          const resultsSchema = schema.properties.results;
          
          if (resultsSchema.type === 'array' && resultsSchema.items) {
            return resultsSchema.items;
          }
          
          return resultsSchema;
        }
        
        // If it has an items property, check if it's an array
        if (schema.properties && schema.properties.items) {
          const itemsSchema = schema.properties.items;
          
          if (itemsSchema.type === 'array' && itemsSchema.items) {
            return itemsSchema.items;
          }
          
          return itemsSchema;
        }
        
        return schema;
      }
    }
    
    return null;
  }
  
  /**
   * Find a matching schema property for a component field
   */
  private findMatchingSchemaProperty(field: string, schema: Schema): string | null {
    if (!schema.properties) {
      return null;
    }
    
    // Check for exact match
    if (schema.properties[field]) {
      return field;
    }
    
    // Check for case-insensitive match
    const fieldLower = field.toLowerCase();
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      if (propName.toLowerCase() === fieldLower) {
        return propName;
      }
    }
    
    // Check for similar match
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      // Check if the field is contained in the property name
      if (propName.toLowerCase().includes(fieldLower) || fieldLower.includes(propName.toLowerCase())) {
        return propName;
      }
      
      // Check if the property has a title or description that matches
      if (propSchema.title && propSchema.title.toLowerCase().includes(fieldLower)) {
        return propName;
      }
      
      if (propSchema.description && propSchema.description.toLowerCase().includes(fieldLower)) {
        return propName;
      }
    }
    
    return null;
  }
  
  /**
   * Check if an endpoint has an ID parameter
   */
  private hasIdParameter(endpoint: Endpoint): boolean {
    return endpoint.parameters.some(param => 
      param.name === 'id' || param.name.endsWith('Id')
    );
  }
  
  /**
   * Suggest a detail path for an endpoint
   */
  private suggestDetailPath(endpoint: Endpoint): string {
    // Extract the base path
    const pathParts = endpoint.path.split('/');
    const basePath = pathParts.slice(0, -1).join('/');
    
    // Add /:id to the base path
    return `${basePath}/:id`;
  }
  
  /**
   * Validate a mapping between a component and an endpoint
   */
  validateMapping(component: Component, endpoint: Endpoint, mapping: ComponentMapping): string[] {
    const errors: string[] = [];
    
    // Check if the endpoint exists
    if (!endpoint) {
      errors.push('Endpoint does not exist');
      return errors;
    }
    
    // Check if the data path is valid
    if (!mapping.dataPath) {
      errors.push('Data path is required');
    }
    
    // Check if the field mappings are valid
    if (mapping.fields) {
      for (const [field, path] of Object.entries(mapping.fields)) {
        if (!path) {
          errors.push(`Field mapping for ${field} is empty`);
        }
      }
    }
    
    // Check if the event mappings are valid
    if (mapping.events) {
      for (const [event, eventMapping] of Object.entries(mapping.events)) {
        if (!eventMapping.action) {
          errors.push(`Event mapping for ${event} is missing an action`);
        }
        
        if (eventMapping.action === 'api' && !eventMapping.endpoint) {
          errors.push(`API action for ${event} is missing an endpoint`);
        }
        
        if (eventMapping.action === 'navigate' && !eventMapping.path) {
          errors.push(`Navigate action for ${event} is missing a path`);
        }
      }
    }
    
    return errors;
  }
}

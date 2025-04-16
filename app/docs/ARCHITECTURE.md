# Jcule-Builder Architecture

## Overview

Jcule-Builder is a visual application that allows users to create user interfaces from OpenAPI specifications using jellicule components. It provides a drag-and-drop interface for mapping API endpoints to UI components, creating a complete application without writing code.

The core concept is to transform an OpenAPI specification into a working UI by:
1. Parsing the OpenAPI specification
2. Allowing users to visually map endpoints to UI components
3. Generating a jcule application that connects the UI to the API

## System Architecture

```
+---------------------------------------------------------------+
|                     Jcule-Builder App                         |
|                                                               |
|  +----------------+  +----------------+  +----------------+   |
|  | OpenAPI        |  | Component      |  | UI-API         |   |
|  | Parser         |  | Library        |  | Mapper         |   |
|  +----------------+  +----------------+  +----------------+   |
|                                                               |
|  +----------------+  +----------------+  +----------------+   |
|  | Visual         |  | Preview        |  | Code           |   |
|  | Editor         |  | Renderer       |  | Generator      |   |
|  +----------------+  +----------------+  +----------------+   |
|                                                               |
+---------------------------------------------------------------+
                              |
                              | Generates
                              v
+---------------------------------------------------------------+
|                     Jcule Application                         |
|                                                               |
|  +----------------+  +----------------+  +----------------+   |
|  | Jellicule      |  | API            |  | State          |   |
|  | Components     |  | Client         |  | Management     |   |
|  +----------------+  +----------------+  +----------------+   |
|                                                               |
+---------------------------------------------------------------+
```

## Core Components

### OpenAPI Parser

The OpenAPI Parser is responsible for:
- Loading and parsing OpenAPI specifications (JSON or YAML)
- Extracting endpoints, parameters, request bodies, and responses
- Organizing the API structure for easy navigation
- Validating the OpenAPI specification

### Component Library

The Component Library provides:
- A catalog of available jellicule components
- Component metadata (properties, events, etc.)
- Component previews
- Component categories and search

### UI-API Mapper

The UI-API Mapper enables:
- Mapping API endpoints to UI components
- Configuring data binding between API responses and UI components
- Setting up event handlers for API calls
- Defining navigation between views

### Visual Editor

The Visual Editor provides:
- A drag-and-drop interface for building UIs
- A component palette with available components
- A canvas for arranging components
- Property editors for configuring components
- A structure view for navigating the component hierarchy

### Preview Renderer

The Preview Renderer:
- Renders a live preview of the application
- Updates in real-time as changes are made
- Simulates API responses for testing
- Allows interaction with the preview

### Code Generator

The Code Generator:
- Generates a complete jcule application
- Creates UI component definitions
- Sets up API client configuration
- Establishes data binding and event handling
- Produces deployable code

## Data Flow

### Loading an OpenAPI Specification

1. User uploads or provides a URL to an OpenAPI specification
2. OpenAPI Parser loads and validates the specification
3. Parser extracts endpoints, parameters, and schemas
4. UI-API Mapper initializes with the parsed API structure
5. Visual Editor displays the API structure in a navigation panel

### Building a UI

1. User drags components from the Component Library to the Visual Editor canvas
2. User arranges and configures components using property editors
3. User maps API endpoints to components using the UI-API Mapper
4. Preview Renderer updates to show the current state of the UI
5. User iterates on the design until satisfied

### Generating an Application

1. User initiates code generation
2. Code Generator analyzes the component structure and API mappings
3. Generator creates UI component definitions using jellicule
4. Generator sets up API client configuration
5. Generator establishes data binding and event handling
6. Generator produces a complete, deployable jcule application

## UI-API Mapping

The core of Jcule-Builder is the UI-API mapping system, which connects UI components to API endpoints.

### Mapping Types

1. **Data Display Mapping**: Maps API responses to display components
   - List endpoints to tables/lists
   - Detail endpoints to forms/cards
   - Media endpoints to image/video components

2. **Data Input Mapping**: Maps form inputs to API parameters
   - Text inputs to string parameters
   - Checkboxes to boolean parameters
   - Select dropdowns to enum parameters
   - Date pickers to date parameters

3. **Action Mapping**: Maps user actions to API calls
   - Button clicks to POST/PUT/DELETE operations
   - Form submissions to POST/PUT operations
   - List item selections to GET operations

### Mapping Configuration

Each mapping includes:
- Source API endpoint
- Target UI component
- Data path mapping (JSON path expressions)
- Transformation rules (formatting, validation, etc.)
- Event triggers
- Loading/error states

Example mapping:

```json
{
  "endpoint": "/pets",
  "method": "GET",
  "component": "DataTable",
  "dataPath": "$.pets",
  "columns": [
    { "field": "id", "header": "ID", "dataPath": "$.id" },
    { "field": "name", "header": "Name", "dataPath": "$.name" },
    { "field": "status", "header": "Status", "dataPath": "$.status" }
  ],
  "events": {
    "onRowClick": {
      "action": "navigate",
      "path": "/pets/:id",
      "params": { "id": "$.id" }
    }
  },
  "loading": {
    "component": "Spinner",
    "props": { "size": "medium" }
  },
  "error": {
    "component": "Alert",
    "props": { "severity": "error" }
  }
}
```

## Component Templates

Jcule-Builder provides templates for common UI patterns to accelerate development:

### List-Detail Template

A two-panel layout with a list on the left and details on the right:
- List component mapped to a collection endpoint
- Detail component mapped to a single item endpoint
- Selection in the list updates the detail view

### CRUD Template

A complete Create, Read, Update, Delete interface:
- Table for viewing items
- Form for creating/editing items
- Confirmation dialog for deleting items
- Success/error notifications

### Dashboard Template

A dashboard with multiple cards and widgets:
- Summary cards with key metrics
- Charts and graphs for data visualization
- Recent activity lists
- Quick action buttons

### Authentication Template

A login/registration flow:
- Login form
- Registration form
- Password reset flow
- Profile management

## Implementation Details

### Technology Stack

Jcule-Builder is built with:
- **React**: For the UI framework
- **TypeScript**: For type safety
- **jellicule**: For UI components
- **jcule**: For application framework
- **OpenAPI Tools**: For parsing OpenAPI specifications
- **Monaco Editor**: For code editing
- **React DnD**: For drag-and-drop functionality

### OpenAPI Parser Implementation

The OpenAPI Parser uses the OpenAPI Tools library to parse specifications:

```typescript
import { OpenAPIV3 } from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser';

class OpenAPIParser {
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
  
  private extractEndpoints(api: OpenAPIV3.Document): Endpoint[] {
    const endpoints: Endpoint[] = [];
    
    // Iterate through paths and methods
    for (const [path, pathItem] of Object.entries(api.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (this.isHttpMethod(method)) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            operationId: operation.operationId || `${method}${path}`,
            summary: operation.summary || '',
            description: operation.description || '',
            parameters: this.extractParameters(operation.parameters, api),
            requestBody: this.extractRequestBody(operation.requestBody, api),
            responses: this.extractResponses(operation.responses, api),
            tags: operation.tags || []
          });
        }
      }
    }
    
    return endpoints;
  }
  
  // Other extraction methods...
  
  private isHttpMethod(method: string): method is 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' {
    return ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'].includes(method);
  }
}
```

### Visual Editor Implementation

The Visual Editor uses React DnD for drag-and-drop functionality:

```typescript
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Component palette item
const ComponentPaletteItem = ({ component }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { type: component.type, id: component.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });
  
  return (
    <div
      ref={drag}
      className={`component-palette-item ${isDragging ? 'dragging' : ''}`}
    >
      {component.name}
    </div>
  );
};

// Canvas drop target
const Canvas = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      const position = monitor.getClientOffset();
      onDrop(item, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });
  
  return (
    <div
      ref={drop}
      className={`canvas ${isOver ? 'drop-target' : ''}`}
    >
      {children}
    </div>
  );
};

// Visual editor
const VisualEditor = ({ components, onAddComponent }) => {
  const [canvasComponents, setCanvasComponents] = useState([]);
  
  const handleDrop = (item, position) => {
    const newComponent = {
      id: `component-${Date.now()}`,
      type: item.type,
      position: {
        x: position.x,
        y: position.y
      },
      props: {}
    };
    
    setCanvasComponents([...canvasComponents, newComponent]);
    onAddComponent(newComponent);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="visual-editor">
        <div className="component-palette">
          {components.map(component => (
            <ComponentPaletteItem
              key={component.id}
              component={component}
            />
          ))}
        </div>
        <Canvas onDrop={handleDrop}>
          {canvasComponents.map(component => (
            <CanvasComponent
              key={component.id}
              component={component}
            />
          ))}
        </Canvas>
      </div>
    </DndProvider>
  );
};
```

### UI-API Mapper Implementation

The UI-API Mapper connects UI components to API endpoints:

```typescript
import React, { useState } from 'react';
import { JsonPath } from 'jsonpath-plus';

const UIAPIMapper = ({ endpoints, component }) => {
  const [mapping, setMapping] = useState({
    endpoint: null,
    dataPath: '',
    fields: {}
  });
  
  const handleEndpointSelect = (endpoint) => {
    setMapping({
      ...mapping,
      endpoint
    });
  };
  
  const handleDataPathChange = (dataPath) => {
    setMapping({
      ...mapping,
      dataPath
    });
  };
  
  const handleFieldMapping = (field, dataPath) => {
    setMapping({
      ...mapping,
      fields: {
        ...mapping.fields,
        [field]: dataPath
      }
    });
  };
  
  return (
    <div className="ui-api-mapper">
      <h3>Map API to Component</h3>
      
      <div className="endpoint-selector">
        <label>Endpoint:</label>
        <select onChange={(e) => handleEndpointSelect(endpoints.find(ep => ep.operationId === e.target.value))}>
          <option value="">Select an endpoint</option>
          {endpoints.map(endpoint => (
            <option key={endpoint.operationId} value={endpoint.operationId}>
              {endpoint.method} {endpoint.path} - {endpoint.summary}
            </option>
          ))}
        </select>
      </div>
      
      {mapping.endpoint && (
        <>
          <div className="data-path-input">
            <label>Data Path:</label>
            <input
              type="text"
              value={mapping.dataPath}
              onChange={(e) => handleDataPathChange(e.target.value)}
              placeholder="$.data"
            />
          </div>
          
          <div className="field-mapping">
            <h4>Field Mapping</h4>
            {component.fields.map(field => (
              <div key={field.name} className="field-map-item">
                <label>{field.label}:</label>
                <input
                  type="text"
                  value={mapping.fields[field.name] || ''}
                  onChange={(e) => handleFieldMapping(field.name, e.target.value)}
                  placeholder={`$.${field.name}`}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
```

### Code Generator Implementation

The Code Generator produces a complete jcule application:

```typescript
class CodeGenerator {
  generateApplication(appDefinition: AppDefinition): GeneratedCode {
    return {
      components: this.generateComponents(appDefinition.components),
      apiClient: this.generateApiClient(appDefinition.api),
      stateManagement: this.generateStateManagement(appDefinition),
      routing: this.generateRouting(appDefinition.views)
    };
  }
  
  private generateComponents(components: ComponentDefinition[]): string {
    let code = `import React from 'react';\nimport { ${this.getUsedComponents(components)} } from 'jellicule';\n\n`;
    
    for (const component of components) {
      code += this.generateComponent(component);
    }
    
    return code;
  }
  
  private generateComponent(component: ComponentDefinition): string {
    return `
export const ${component.name} = (props) => {
  return (
    <${component.type}
      ${this.generateProps(component.props)}
    >
      ${this.generateChildren(component.children)}
    </${component.type}>
  );
};
`;
  }
  
  private generateApiClient(api: ApiDefinition): string {
    return `
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '${api.baseUrl}',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
${this.generateApiMethods(api.endpoints)}
};
`;
  }
  
  private generateApiMethods(endpoints: EndpointDefinition[]): string {
    return endpoints.map(endpoint => `
  ${endpoint.operationId}: async (${this.generateMethodParams(endpoint)}) => {
    try {
      const response = await apiClient.${endpoint.method.toLowerCase()}(
        \`${this.generateUrlWithParams(endpoint.path)}\`,
        ${endpoint.method === 'GET' ? 'params' : 'data'}
      );
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }`).join(',\n');
  }
  
  // Other generation methods...
}
```

## User Experience

### Workflow

1. **Start**: User creates a new project or opens an existing one
2. **Import API**: User imports an OpenAPI specification
3. **Create Views**: User creates views for different parts of the application
4. **Add Components**: User adds components to each view
5. **Map API**: User maps API endpoints to components
6. **Configure**: User configures component properties and styles
7. **Preview**: User previews the application
8. **Generate**: User generates the final application code
9. **Export**: User exports the project for deployment

### User Interface

The Jcule-Builder interface is divided into several panels:

1. **API Explorer**: Shows the OpenAPI structure
   - Endpoints grouped by tags
   - Parameters and responses
   - Search and filter options

2. **Component Palette**: Shows available components
   - Categorized by type (Form, Layout, etc.)
   - Drag-and-drop interface
   - Search and filter options

3. **Canvas**: The main editing area
   - Visual representation of the UI
   - Drag-and-drop component placement
   - Selection and multi-selection
   - Grid and alignment guides

4. **Properties Panel**: Shows properties of selected components
   - Basic properties (size, color, etc.)
   - Data binding configuration
   - Event handling configuration
   - Styling options

5. **Structure Panel**: Shows the component hierarchy
   - Tree view of components
   - Drag-and-drop reordering
   - Context menu for operations

6. **Preview Panel**: Shows a live preview
   - Responsive design preview
   - Interaction testing
   - Mock data configuration

## Conclusion

Jcule-Builder provides a powerful visual interface for creating applications from OpenAPI specifications using jellicule components. By automating the connection between UI and API, it significantly reduces development time and ensures consistency between the frontend and backend.

The drag-and-drop interface, combined with intelligent mapping suggestions and templates, makes it accessible to developers of all skill levels. The generated code follows best practices and is ready for deployment, with proper separation of concerns and maintainable structure.

Jcule-Builder is an essential tool in the jcule ecosystem, enabling rapid application development while maintaining the flexibility and power of the underlying framework.

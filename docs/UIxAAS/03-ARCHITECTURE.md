# 3. Architecture

The jcule-builder tool follows a modular architecture with several key components that work together to transform API specifications into complete WebAX applications.

## 3.1 Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  API Definition │     │  UxA Adapter    │     │  UIxAAS Output  │
│  (OpenAPI, etc) │ ──> │  (OpenAPI-UxA)  │ ──> │  (Standardized) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Code Generator │ <── │  Visual Editor  │ <── │  UI Generator   │
│  (Final Output) │     │  (Customization)│     │  (Components)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 3.2 Key Components

### 3.2.1 API Specification Parser

The API Specification Parser is responsible for parsing API specifications in various formats and validating them.

**Responsibilities:**
- Parse the API specification (OpenAPI, GraphQL, etc.)
- Validate the specification against the appropriate schema
- Extract metadata about the API (title, description, version, etc.)
- Pass the parsed specification to the UxA adapter

**Key Features:**
- Support for multiple API specification formats
- Validation of specifications for correctness and completeness
- Error reporting for invalid specifications
- Extraction of metadata for use in the generated application

### 3.2.2 UxA Adapter

The UxA Adapter transforms the parsed API specification into the standardized UIxAAS format.

**Responsibilities:**
- Identify resources/entities from the API specification
- Derive UI views (list, detail, create, edit) from API operations
- Normalize schema properties into fields
- Extract actions from API operations
- Handle security definitions
- Generate the UIxAAS output

**Supported Adapters:**
- **OpenAPI-UxA**: Transforms OpenAPI specifications into UIxAAS
- **GraphQL-UxA**: Transforms GraphQL schemas into UIxAAS
- **Custom-UxA**: Allows for custom API specification formats

### 3.2.3 UI Generator

The UI Generator creates UI components based on the UIxAAS output.

**Responsibilities:**
- Analyze the UIxAAS output to identify resources, views, and actions
- Generate appropriate jellicule components for each view
- Create UI-API mappings to connect components with API operations
- Generate the necessary jcule code to wire everything together

**Generated Components:**
- **List Views**: Tables, cards, or other list components
- **Detail Views**: Forms, panels, or other detail components
- **Create/Edit Forms**: Input forms with validation
- **Search Components**: Search forms and filters
- **Navigation**: Menus, breadcrumbs, and other navigation components

### 3.2.4 Visual Editor

The Visual Editor provides a graphical interface for customizing the generated application.

**Responsibilities:**
- Display the generated UI components in a visual editor
- Allow users to customize component properties, layouts, and styles
- Provide a live preview of the application
- Enable users to modify UI-API mappings

**Key Features:**
- Drag-and-drop interface for arranging components
- Property editor for customizing component properties
- Theme editor for customizing styles
- Layout editor for arranging components in different layouts
- Live preview of the application

### 3.2.5 Code Generator

The Code Generator produces the final application code.

**Responsibilities:**
- Generate jellicule component code
- Create jcule BLC (Business Logic Controller) code
- Set up the application structure following WebAX standards
- Generate configuration files, documentation, and tests

**Generated Code:**
- **Component Code**: Jellicule components for each view
- **BLC Code**: Jcule Business Logic Controller code
- **UI-API Mappings**: Connections between components and API operations
- **Configuration**: Application configuration files
- **Documentation**: Automatically generated documentation
- **Tests**: Unit and integration tests

## 3.3 Data Flow

1. The user imports an API specification (OpenAPI, GraphQL, etc.)
2. The API Specification Parser validates the specification and extracts metadata
3. The UxA Adapter transforms the specification into the UIxAAS format
4. The UI Generator creates jellicule components based on the UIxAAS output
5. The Visual Editor displays the generated components and allows customization
6. The Code Generator produces the final application code

## 3.4 Extension Points

The jcule-builder architecture includes several extension points:

1. **UxA Adapters**: Custom adapters can be created for proprietary API formats
2. **Component Templates**: Custom templates can be created for generating components
3. **Code Generators**: Custom generators can be created for different output formats
4. **Visual Editor Plugins**: Custom plugins can extend the functionality of the visual editor

## Next Steps

Continue to [Workflow](04-WORKFLOW.md) to see how to use jcule-builder.

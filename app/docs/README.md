# Jcule-Builder

Jcule-Builder is a visual application that allows you to create user interfaces from OpenAPI specifications using jellicule components. It provides a drag-and-drop interface for mapping API endpoints to UI components, creating a complete application without writing code.

## Features

- **OpenAPI Integration**: Import OpenAPI specifications to automatically generate UI components
- **Visual Editor**: Drag-and-drop interface for building UIs
- **API Mapping**: Map API endpoints to UI components with intelligent suggestions
- **Live Preview**: See your application in real-time as you build it
- **Code Generation**: Generate a complete jcule application with proper separation of concerns

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/webax/jcule-builder.git
cd jcule-builder
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Importing an OpenAPI Specification

1. Click the "Load Spec" button in the toolbar
2. Enter the URL of your OpenAPI specification or upload a file
3. The API Explorer will show the available endpoints

### Building a UI

1. Drag components from the Component Palette to the Canvas
2. Configure component properties in the Properties Panel
3. Map API endpoints to components using the UI-API Mapper
4. Preview your application in the Preview Panel

### Generating Code

1. Click the "Generate Code" button in the toolbar
2. The generated code will be displayed in a modal
3. Copy the code or download it as a zip file

## Architecture

Jcule-Builder follows a modular architecture with the following components:

- **OpenAPI Parser**: Parses OpenAPI specifications
- **Component Library**: Provides a catalog of available jellicule components
- **UI-API Mapper**: Maps API endpoints to UI components
- **Visual Editor**: Provides a drag-and-drop interface for building UIs
- **Preview Renderer**: Renders a live preview of the application
- **Code Generator**: Generates a complete jcule application

For more details, see the [Architecture Documentation](docs/ARCHITECTURE.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

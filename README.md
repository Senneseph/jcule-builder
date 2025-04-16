# Jcule Builder

Jcule Builder is a visual application that allows you to create user interfaces from OpenAPI specifications using jellicule components. It provides a drag-and-drop interface for mapping API endpoints to UI components, creating a complete application without writing code.

## Project Structure

This project follows the WebAX standard layout:

- `/app` - Application code and documentation
- `/cicd` - CI/CD configuration
- `/develop` - Development tools and configuration
- `/dist` - Distribution files

## Features

- **OpenAPI Integration**: Import OpenAPI specifications to automatically generate UI components
- **Visual Editor**: Drag-and-drop interface for building UIs
- **API Mapping**: Map API endpoints to UI components with intelligent suggestions
- **Live Preview**: See your application in real-time as you build it
- **Code Generation**: Generate a complete jcule application with proper separation of concerns

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Running the Application

```bash
# Start the application
docker-compose up

# Access the application
open http://localhost
```

### Development

```bash
# Start the application in development mode
docker-compose up

# Make changes to the code in the /app directory
# The application will automatically reload
```

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

For more details, see the [Architecture Documentation](app/docs/ARCHITECTURE.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

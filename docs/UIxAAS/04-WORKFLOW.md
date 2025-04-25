# 4. Workflow

This section describes the typical workflow for using jcule-builder with UIxAAS and UxA to generate WebAX applications.

## 4.1 End-to-End Workflow

The complete workflow for using jcule-builder consists of the following steps:

1. **Import API Specification**
2. **Generate UIxAAS**
3. **Generate UI**
4. **Customize UI**
5. **Generate Code**
6. **Build and Deploy**

Let's explore each step in detail.

## 4.2 Import API Specification

The first step is to import an API specification into jcule-builder.

**Actions:**
- Select the API specification format (OpenAPI, GraphQL, etc.)
- Provide the specification file or URL
- Validate the specification for correctness and completeness

**User Interface:**
- File upload or URL input field
- Format selection dropdown
- Validation status indicator
- Error messages for invalid specifications

**Example:**
```bash
# Command-line example
jcule-builder import --format openapi --file api.yaml

# Or with a URL
jcule-builder import --format openapi --url https://example.com/api.yaml
```

## 4.3 Generate UIxAAS

Once the API specification is imported, jcule-builder uses the appropriate UxA adapter to transform it into the UIxAAS format.

**Actions:**
- Select the UxA adapter for the specification format
- Configure adapter options (if needed)
- Generate the UIxAAS output
- Review the generated resources, views, and actions

**User Interface:**
- Adapter selection (if multiple adapters are available)
- Adapter configuration options
- Progress indicator during generation
- Summary of generated resources, views, and actions

**Example:**
```bash
# Command-line example
jcule-builder generate-uixaas --adapter openapi-uxa --output uixaas.json

# With configuration options
jcule-builder generate-uixaas --adapter openapi-uxa --config adapter-config.json --output uixaas.json
```

## 4.4 Generate UI

After generating the UIxAAS output, jcule-builder uses the UI Generator to create jellicule components for each view.

**Actions:**
- Configure UI generation options (component types, layouts, etc.)
- Generate UI components for each view
- Create UI-API mappings
- Review the generated components

**User Interface:**
- UI generation options
- Progress indicator during generation
- Preview of generated components
- Summary of generated components and mappings

**Example:**
```bash
# Command-line example
jcule-builder generate-ui --uixaas uixaas.json --output ui-components

# With configuration options
jcule-builder generate-ui --uixaas uixaas.json --config ui-config.json --output ui-components
```

## 4.5 Customize UI

The generated UI components can be customized using the Visual Editor.

**Actions:**
- Arrange components using drag-and-drop
- Customize component properties
- Modify layouts and styles
- Adjust UI-API mappings
- Preview the application

**User Interface:**
- Visual editor with drag-and-drop interface
- Property editor for component properties
- Theme editor for styles
- Layout editor for arranging components
- Live preview of the application

**Example:**
```bash
# Command-line example to launch the visual editor
jcule-builder edit --project project-directory

# Save customizations
jcule-builder save --project project-directory
```

## 4.6 Generate Code

Once the UI is customized, jcule-builder generates the final application code.

**Actions:**
- Configure code generation options
- Generate jellicule component code
- Create jcule BLC code
- Set up the application structure
- Generate configuration files, documentation, and tests

**User Interface:**
- Code generation options
- Progress indicator during generation
- Summary of generated files
- Options to download or export the generated code

**Example:**
```bash
# Command-line example
jcule-builder generate-code --project project-directory --output app-directory

# With configuration options
jcule-builder generate-code --project project-directory --config code-config.json --output app-directory
```

## 4.7 Build and Deploy

Finally, the generated application can be built and deployed using CICADA.

**Actions:**
- Build the application
- Run tests
- Deploy to staging or production
- Monitor the deployed application

**User Interface:**
- Build and deployment options
- Progress indicator during build and deployment
- Build and deployment logs
- Deployment status and monitoring

**Example:**
```bash
# Command-line example
jcule-builder build --project app-directory

# Deploy to staging
jcule-builder deploy --project app-directory --environment staging

# Deploy to production
jcule-builder deploy --project app-directory --environment production
```

## 4.8 Iterative Development

The jcule-builder workflow supports iterative development:

1. **Update API Specification**: When the API changes, update the specification
2. **Regenerate UIxAAS**: Transform the updated specification into UIxAAS
3. **Update UI**: Regenerate UI components while preserving customizations
4. **Regenerate Code**: Generate updated code with the new components
5. **Rebuild and Redeploy**: Build and deploy the updated application

This iterative approach makes it easy to keep the application in sync with the API as it evolves.

## Next Steps

Continue to [Integration with IMS Prime](05-IMS-PRIME-INTEGRATION.md) to see how jcule-builder will be used with the IMS Prime application.

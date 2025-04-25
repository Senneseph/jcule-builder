# 1. Overview

This document outlines how the User Interface API Adapter Specification (UIxAAS) and User Interface Adapter (UxA) concepts are integrated into the jcule-builder tool. It describes how jcule-builder uses these concepts to automatically generate WebAX applications from API specifications.

## Key Concepts

### UIxAAS (User Interface API Adapter Specification)

UIxAAS is a standardized format for representing API definitions in a way that can be easily consumed by UI generation tools. It provides:

- A consistent representation of API resources, views, and actions
- A normalized schema for field definitions
- A standardized format for validation rules
- A clear separation between API definitions and UI components

### UxA (User Interface Adapter)

UxA is an implementation that transforms API definitions (like OpenAPI or GraphQL) into the UIxAAS format. It:

- Parses API definitions
- Identifies resources/entities
- Derives UI views (list, detail, create, edit)
- Normalizes schema properties into fields
- Extracts actions (API operations)
- Handles security definitions

### jcule-builder

jcule-builder is a tool that uses UIxAAS and UxA to:

- Generate complete WebAX applications from API specifications
- Provide a visual interface for customizing the generated applications
- Automate the process of connecting UI components to API endpoints
- Reduce the amount of boilerplate code that developers need to write

## Purpose

The purpose of integrating UIxAAS and UxA into jcule-builder is to enable a specifications-first approach to application development. This approach:

1. Uses the API specification as the source of truth
2. Automates the generation of UI components based on API operations
3. Reduces the amount of manual coding required
4. Ensures consistency across the application
5. Makes it easier to update the UI when the API changes

By automating the connection between UI components and API endpoints, jcule-builder allows developers to focus on the unique aspects of their applications rather than repetitive tasks.

## Next Steps

Continue to [Vision](02-VISION.md) to understand the goals of the project.

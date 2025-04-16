# PWA Builder Demo App Requirements

This document outlines the requirements for building a Progressive Web App (PWA) and the specific features planned for this demo PWA builder application.

## 1. Absolute Minimum Requirements for a PWA

To qualify as a basic PWA installable on a device, the following elements are generally required:

*   **`manifest.json` File:** A JSON file that tells the browser about the web application and how it should behave when 'installed' on the user's mobile device or desktop. Key properties include:
    *   `name`: The full name of the application.
    *   `short_name`: A shorter name used on the home screen, launcher, etc.
    *   `start_url`: The URL loaded when the application is launched.
    *   `display`: Preferred display mode (e.g., `standalone`, `fullscreen`, `minimal-ui`, `browser`). `standalone` is common for app-like feel.
    *   `background_color`: Placeholder background color shown before the stylesheet loads.
    *   `theme_color`: UI color hint for the browser/OS.
    *   `description`: A brief description of the application.
    *   `icons`: An array of image objects specifying icons for different contexts (home screen, splash screen). Each object needs `src`, `sizes`, and `type`. At least one icon, typically 192x192 and 512x512, is needed.
*   **Service Worker (`sw.js`):** A JavaScript file that runs separately from the main browser thread, enabling features like offline support, background sync, and push notifications.
    *   Must be registered correctly from the main application script.
    *   Needs at least a basic `fetch` event handler to allow the PWA to be installable (even if it just passes the request through). For offline capabilities, it needs caching strategies.
*   **`index.html`:** The main entry point for the application.
    *   Must link to the `manifest.json` (e.g., `<link rel="manifest" href="/manifest.json">`).
    *   Must register the service worker.
*   **Icons:** Actual image files referenced in the `manifest.json`.
*   **HTTPS:** The application must be served over HTTPS. (Deployment requirement, not a code file).

## 2. GoodBarber PWA Creation Options (Investigation Needed)

*(This section requires investigation of the GoodBarber platform to itemize the specific options and steps they provide during PWA creation. Since I cannot access external sites, this needs to be filled in manually based on user observation.)*

**General Areas Observed in PWA Builders:**

*   **General App Info:** Name, Bundle ID, Version, Icons, Splash Screens.
*   **Design/Theme:**
    *   Global Theme Selection
    *   Navigation Mode (e.g., Tab Bar, Side Menu)
    *   Color Customization (Primary, Secondary, Text, Background)
    *   Font Customization
    *   Logo/Header Configuration
    *   Layout Options (Density, Styles)
*   **Content Sections/Features:** Adding pre-built modules like Articles, Maps, Forms, Videos, Social Feeds, Custom Pages.
*   **App Settings:** Permissions, API Keys, Domain Names.
*   **Build/Publish:** PWA settings, iOS/Android build options (if applicable), Deployment.

**(Please add detailed GoodBarber specific options here based on investigation)**
*   Option 1: ...
*   Option 2: ...
*   ...

## 3. Scope for This Demo PWA Builder

Based on the initial request, this demo app will focus on a simplified subset of features:

*   **Basic PWA Configuration:**
    *   App Name (`manifest.json -> name`)
    *   App Short Name (`manifest.json -> short_name`)
    *   App Description (`manifest.json -> description`)
    *   App Icons (Allow uploading/selecting basic icons -> `manifest.json -> icons`)
    *   Start URL (`manifest.json -> start_url` - likely fixed for the demo)
    *   Display Mode (`manifest.json -> display` - likely fixed to `standalone`)
*   **Theme Selection:**
    *   Initially, only one "Default" theme will be available and automatically selected. (No explicit selection UI needed yet).
*   **Theme Customization (for the Default Theme):**
    *   Primary Color (`manifest.json -> theme_color`, also used in CSS)
    *   Background Color (`manifest.json -> background_color`, also used in CSS)
    *   Basic Font Selection (if feasible within scope)
*   **Output:**
    *   Generate the necessary `manifest.json`.
    *   Generate a basic `index.html` that links the manifest and registers a placeholder service worker.
    *   Generate a placeholder `sw.js` (minimal fetch handler).
    *   Provide necessary icon files (or use placeholders).

**Out of Scope for Initial Demo:**

*   Multiple themes
*   Complex layout builders
*   Content management systems (Articles, Sections, etc.)
*   Service worker offline strategies
*   Build/Deployment automation
*   Push notifications
*   Advanced manifest properties
import { h } from './jsx';
import { OpenAPIParser } from './services/OpenAPIParser';
import { UIAPIMapper } from './services/UIAPIMapper';
import { CodeGenerator } from './services/CodeGenerator';
import { ParsedAPI, Component, View, AppDefinition } from './types';
import './App.css';

// Import components
import { ApiExplorer } from './components/ApiExplorer';
import { ComponentPalette } from './components/ComponentPalette';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { StructurePanel } from './components/StructurePanel';
import { PreviewPanel } from './components/PreviewPanel';
import { Toolbar } from './components/Toolbar';

// App state
let state = {
  api: null as ParsedAPI | null,
  views: [] as View[],
  currentView: null as string | null,
  components: [] as Component[],
  selectedComponent: null as string | null,
  generatedCode: null as string | null
};

// Services
const parser = new OpenAPIParser();
const mapper = new UIAPIMapper();
const generator = new CodeGenerator();

// Event handlers
const handleLoadSpec = async (specUrl: string) => {
  try {
    const parsedApi = await parser.parse(specUrl);
    state.api = parsedApi;

    // Create default view
    const defaultView: View = {
      id: 'view-1',
      name: 'HomeView',
      path: '/',
      components: []
    };

    state.views = [defaultView];
    state.currentView = defaultView.id;

    // Re-render the app
    renderApp();
  } catch (error) {
    console.error('Error loading OpenAPI spec:', error);
    alert('Error loading OpenAPI spec. Please check the URL and try again.');
  }
};

const handleLoadSpecString = async (specString: string, format: 'json' | 'yaml') => {
  try {
    const parsedApi = await parser.parseString(specString, format);
    state.api = parsedApi;

    // Create default view
    const defaultView: View = {
      id: 'view-1',
      name: 'HomeView',
      path: '/',
      components: []
    };

    state.views = [defaultView];
    state.currentView = defaultView.id;

    // Re-render the app
    renderApp();
  } catch (error) {
    console.error(`Error loading OpenAPI spec from ${format}:`, error);
    alert(`Error loading OpenAPI spec from ${format}. Please check the content and try again.`);
  }
};

const handleAddComponent = (component: Component) => {
  if (!state.currentView) return;

  // Find current view
  const viewIndex = state.views.findIndex(v => v.id === state.currentView);
  if (viewIndex === -1) return;

  // Add component to view
  const updatedViews = [...state.views];
  updatedViews[viewIndex].components.push(component);

  state.views = updatedViews;
  state.components = [...state.components, component];
  state.selectedComponent = component.id;

  // Re-render the app
  renderApp();
};

const handleUpdateComponent = (componentId: string, props: Record<string, any>) => {
  // Find component
  const componentIndex = state.components.findIndex(c => c.id === componentId);
  if (componentIndex === -1) return;

  // Update component
  const updatedComponents = [...state.components];
  updatedComponents[componentIndex] = {
    ...updatedComponents[componentIndex],
    props: {
      ...updatedComponents[componentIndex].props,
      ...props
    }
  };

  state.components = updatedComponents;

  // Update component in view
  if (!state.currentView) return;

  const viewIndex = state.views.findIndex(v => v.id === state.currentView);
  if (viewIndex === -1) return;

  const viewComponentIndex = state.views[viewIndex].components.findIndex(c => c.id === componentId);
  if (viewComponentIndex === -1) return;

  const updatedViews = [...state.views];
  updatedViews[viewIndex].components[viewComponentIndex] = updatedComponents[componentIndex];

  state.views = updatedViews;

  // Re-render the app
  renderApp();
};

const handleMapComponent = (componentId: string, endpointId: string) => {
  if (!state.api) return;

  // Find component
  const componentIndex = state.components.findIndex(c => c.id === componentId);
  if (componentIndex === -1) return;

  // Find endpoint
  const endpoint = state.api.endpoints.find(e => e.operationId === endpointId);
  if (!endpoint) return;

  // Generate mapping
  const mapping = mapper.suggestMapping(state.components[componentIndex], endpoint);

  // Update component
  const updatedComponents = [...state.components];
  updatedComponents[componentIndex] = {
    ...updatedComponents[componentIndex],
    mapping
  };

  state.components = updatedComponents;

  // Update component in view
  if (!state.currentView) return;

  const viewIndex = state.views.findIndex(v => v.id === state.currentView);
  if (viewIndex === -1) return;

  const viewComponentIndex = state.views[viewIndex].components.findIndex(c => c.id === componentId);
  if (viewComponentIndex === -1) return;

  const updatedViews = [...state.views];
  updatedViews[viewIndex].components[viewComponentIndex] = updatedComponents[componentIndex];

  state.views = updatedViews;

  // Re-render the app
  renderApp();
};

const handleGenerateCode = () => {
  if (!state.api) return;

  // Create app definition
  const appDefinition: AppDefinition = {
    name: state.api.info.title,
    description: state.api.info.description,
    api: {
      baseUrl: 'https://api.example.com', // This should be configurable
      endpoints: state.api.endpoints.map(e => ({
        operationId: e.operationId,
        path: e.path,
        method: e.method,
        parameters: e.parameters.map(p => ({
          name: p.name,
          in: p.in,
          required: p.required,
          schema: p.schema
        })),
        requestBody: e.requestBody ? {
          required: e.requestBody.required,
          content: e.requestBody.content
        } : undefined,
        responses: e.responses.map(r => ({
          statusCode: r.statusCode,
          content: r.content
        }))
      }))
    },
    views: state.views,
    components: state.components,
    state: {
      initial: {
        loading: {},
        error: {}
      },
      derived: {},
      effects: []
    }
  };

  // Generate code
  const code = generator.generateApplication(appDefinition);

  // Set generated code
  state.generatedCode = JSON.stringify(code, null, 2);

  // Re-render the app
  renderApp();
};

const handleSelectComponent = (componentId: string) => {
  state.selectedComponent = componentId;

  // Re-render the app
  renderApp();
};

// App component
export const App = () => {
  return (
    <div className="app">
      <Toolbar
        onLoadSpec={handleLoadSpec}
        onLoadSpecString={handleLoadSpecString}
        onGenerateCode={handleGenerateCode}
      />

      <div className="app-content">
        <div className="left-panel">
          <ApiExplorer api={state.api} />
          <ComponentPalette />
        </div>

        <div className="center-panel">
          <Canvas
            view={state.currentView ? state.views.find(v => v.id === state.currentView) : null}
            components={state.components}
            selectedComponent={state.selectedComponent}
            onSelectComponent={handleSelectComponent}
            onAddComponent={handleAddComponent}
          />
        </div>

        <div className="right-panel">
          <PropertiesPanel
            component={state.selectedComponent ? state.components.find(c => c.id === state.selectedComponent) : null}
            api={state.api}
            onUpdateComponent={handleUpdateComponent}
            onMapComponent={handleMapComponent}
          />
          <StructurePanel
            view={state.currentView ? state.views.find(v => v.id === state.currentView) : null}
            selectedComponent={state.selectedComponent}
            onSelectComponent={handleSelectComponent}
          />
        </div>
      </div>

      <div className="preview-panel">
        <PreviewPanel
          view={state.currentView ? state.views.find(v => v.id === state.currentView) : null}
          components={state.components}
          api={state.api}
        />
      </div>

      {state.generatedCode && (
        <div className="code-panel">
          <pre>{state.generatedCode}</pre>
          <button className="close-button" onclick={() => {
            state.generatedCode = null;
            renderApp();
          }}>Close</button>
        </div>
      )}
    </div>
  );
};

// Function to re-render the app
function renderApp() {
  const rootElement = document.getElementById('app');

  if (rootElement) {
    // Clear the root element
    rootElement.innerHTML = '';

    // Render the app
    import('./jsx').then(({ render }) => {
      render(App(), rootElement);
    });
  }
}



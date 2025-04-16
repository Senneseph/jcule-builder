import { AppDefinition, Component, View, EndpointDefinition, GeneratedCode } from '../types';

export class CodeGenerator {
  /**
   * Generate a complete jcule application
   */
  generateApplication(appDefinition: AppDefinition): GeneratedCode {
    return {
      components: this.generateComponents(appDefinition.components),
      apiClient: this.generateApiClient(appDefinition),
      stateManagement: this.generateStateManagement(appDefinition),
      routing: this.generateRouting(appDefinition.views)
    };
  }
  
  /**
   * Generate component code
   */
  private generateComponents(components: Component[]): string {
    let code = `import React from 'react';\nimport { ${this.getUsedComponents(components)} } from 'jellicule';\n\n`;
    
    for (const component of components) {
      code += this.generateComponent(component);
    }
    
    return code;
  }
  
  /**
   * Get a list of unique component types used in the application
   */
  private getUsedComponents(components: Component[]): string {
    const componentTypes = new Set<string>();
    
    const addComponentType = (component: Component) => {
      componentTypes.add(component.type);
      
      if (component.children) {
        for (const child of component.children) {
          addComponentType(child);
        }
      }
    };
    
    for (const component of components) {
      addComponentType(component);
    }
    
    return Array.from(componentTypes).join(', ');
  }
  
  /**
   * Generate code for a single component
   */
  private generateComponent(component: Component): string {
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
  
  /**
   * Generate props for a component
   */
  private generateProps(props: Record<string, any>): string {
    return Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          return `${key}={${value}}`;
        } else if (Array.isArray(value)) {
          return `${key}={${JSON.stringify(value)}}`;
        } else if (typeof value === 'object' && value !== null) {
          return `${key}={${JSON.stringify(value)}}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n      ');
  }
  
  /**
   * Generate children for a component
   */
  private generateChildren(children?: Component[]): string {
    if (!children || children.length === 0) {
      return '';
    }
    
    return children.map(child => {
      if (child.children && child.children.length > 0) {
        return `<${child.type} ${this.generateProps(child.props)}>
        ${this.generateChildren(child.children)}
      </${child.type}>`;
      }
      
      return `<${child.type} ${this.generateProps(child.props)} />`;
    }).join('\n      ');
  }
  
  /**
   * Generate API client code
   */
  private generateApiClient(appDefinition: AppDefinition): string {
    return `
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '${appDefinition.api.baseUrl}',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
${this.generateApiMethods(appDefinition.api.endpoints)}
};
`;
  }
  
  /**
   * Generate API methods
   */
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
  
  /**
   * Generate method parameters
   */
  private generateMethodParams(endpoint: EndpointDefinition): string {
    const params = [];
    
    // Add path parameters
    const pathParams = endpoint.parameters.filter(p => p.in === 'path');
    if (pathParams.length > 0) {
      params.push('pathParams = {}');
    }
    
    // Add query parameters
    const queryParams = endpoint.parameters.filter(p => p.in === 'query');
    if (queryParams.length > 0 || endpoint.method === 'GET') {
      params.push('params = {}');
    }
    
    // Add request body
    if (endpoint.method !== 'GET' && endpoint.requestBody) {
      params.push('data = {}');
    }
    
    return params.join(', ');
  }
  
  /**
   * Generate URL with path parameters
   */
  private generateUrlWithParams(path: string): string {
    // Replace {param} with ${pathParams.param}
    return path.replace(/{([^}]+)}/g, '${pathParams.$1}');
  }
  
  /**
   * Generate state management code
   */
  private generateStateManagement(appDefinition: AppDefinition): string {
    return `
import { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from './api';

// Initial state
const initialState = ${JSON.stringify(appDefinition.state.initial, null, 2)};

// Action types
const ActionTypes = {
  SET_STATE: 'SET_STATE',
  API_REQUEST: 'API_REQUEST',
  API_SUCCESS: 'API_SUCCESS',
  API_ERROR: 'API_ERROR'
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_STATE:
      return {
        ...state,
        [action.path]: action.value
      };
      
    case ActionTypes.API_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.endpoint]: true
        },
        error: {
          ...state.error,
          [action.endpoint]: null
        }
      };
      
    case ActionTypes.API_SUCCESS:
      return {
        ...state,
        [action.path]: action.data,
        loading: {
          ...state.loading,
          [action.endpoint]: false
        }
      };
      
    case ActionTypes.API_ERROR:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.endpoint]: false
        },
        error: {
          ...state.error,
          [action.endpoint]: action.error
        }
      };
      
    default:
      return state;
  }
};

// State context
const StateContext = createContext();

// State provider
export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Derived state
  const derivedState = {
${this.generateDerivedState(appDefinition.state.derived)}
  };
  
  // Effects
  useEffect(() => {
${this.generateEffects(appDefinition.state.effects)}
  }, [${this.getEffectDependencies(appDefinition.state.effects)}]);
  
  // API actions
  const apiActions = {
${this.generateApiActions(appDefinition.api.endpoints)}
  };
  
  return (
    <StateContext.Provider value={{ state: { ...state, ...derivedState }, dispatch, api: apiActions }}>
      {children}
    </StateContext.Provider>
  );
};

// Hook to use state
export const useState = () => useContext(StateContext);
`;
  }
  
  /**
   * Generate derived state
   */
  private generateDerivedState(derived: Record<string, string>): string {
    return Object.entries(derived)
      .map(([key, expression]) => `    ${key}: ${expression}`)
      .join(',\n');
  }
  
  /**
   * Generate effects
   */
  private generateEffects(effects: any[]): string {
    return effects.map(effect => {
      if (effect.action === 'api') {
        return `    // Effect for ${effect.trigger}
    if (state.${effect.trigger} !== undefined) {
      apiActions.${effect.endpoint}(${this.generateEffectParams(effect)})
        .then(data => {
          dispatch({
            type: ActionTypes.SET_STATE,
            path: '${effect.path}',
            value: data
          });
        })
        .catch(error => {
          console.error('Effect error:', error);
        });
    }`;
      }
      
      return '';
    }).join('\n\n');
  }
  
  /**
   * Generate effect parameters
   */
  private generateEffectParams(effect: any): string {
    if (!effect.params) {
      return '';
    }
    
    return Object.entries(effect.params)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
  
  /**
   * Get effect dependencies
   */
  private getEffectDependencies(effects: any[]): string {
    return effects
      .map(effect => `state.${effect.trigger}`)
      .join(', ');
  }
  
  /**
   * Generate API actions
   */
  private generateApiActions(endpoints: EndpointDefinition[]): string {
    return endpoints.map(endpoint => `
    ${endpoint.operationId}: async (${this.generateMethodParams(endpoint)}) => {
      dispatch({
        type: ActionTypes.API_REQUEST,
        endpoint: '${endpoint.operationId}'
      });
      
      try {
        const data = await api.${endpoint.operationId}(${this.getApiActionParams(endpoint)});
        
        dispatch({
          type: ActionTypes.API_SUCCESS,
          endpoint: '${endpoint.operationId}',
          path: '${this.getDefaultStatePath(endpoint)}',
          data
        });
        
        return data;
      } catch (error) {
        dispatch({
          type: ActionTypes.API_ERROR,
          endpoint: '${endpoint.operationId}',
          error: error.message
        });
        
        throw error;
      }
    }`).join(',\n');
  }
  
  /**
   * Get API action parameters
   */
  private getApiActionParams(endpoint: EndpointDefinition): string {
    const params = [];
    
    // Add path parameters
    const pathParams = endpoint.parameters.filter(p => p.in === 'path');
    if (pathParams.length > 0) {
      params.push('pathParams');
    }
    
    // Add query parameters
    const queryParams = endpoint.parameters.filter(p => p.in === 'query');
    if (queryParams.length > 0 || endpoint.method === 'GET') {
      params.push('params');
    }
    
    // Add request body
    if (endpoint.method !== 'GET' && endpoint.requestBody) {
      params.push('data');
    }
    
    return params.join(', ');
  }
  
  /**
   * Get default state path for an endpoint
   */
  private getDefaultStatePath(endpoint: EndpointDefinition): string {
    // Extract resource name from path
    const pathParts = endpoint.path.split('/').filter(Boolean);
    const resourceName = pathParts[pathParts.length - 1].replace(/[{}]/g, '');
    
    // For collection endpoints, use plural
    if (endpoint.method === 'GET' && !endpoint.path.includes('{')) {
      return resourceName;
    }
    
    // For single item endpoints, use singular
    return resourceName.endsWith('s') ? resourceName.slice(0, -1) : resourceName;
  }
  
  /**
   * Generate routing code
   */
  private generateRouting(views: View[]): string {
    return `
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StateProvider } from './state';
${this.generateViewImports(views)}

export const AppRouter = () => {
  return (
    <StateProvider>
      <Router>
        <Routes>
${this.generateRoutes(views)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StateProvider>
  );
};
`;
  }
  
  /**
   * Generate view imports
   */
  private generateViewImports(views: View[]): string {
    return views.map(view => `import { ${view.name} } from './views/${view.name}';`).join('\n');
  }
  
  /**
   * Generate routes
   */
  private generateRoutes(views: View[]): string {
    return views.map(view => `          <Route path="${view.path}" element={<${view.name} />} />`).join('\n');
  }
}

import { OpenAPIV3 } from 'openapi-types';

// OpenAPI Types
export interface ParsedAPI {
  info: OpenAPIV3.InfoObject;
  endpoints: Endpoint[];
  schemas: Schema[];
}

export interface Endpoint {
  path: string;
  method: string;
  operationId: string;
  summary: string;
  description: string;
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: Response[];
  tags: string[];
}

export interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required: boolean;
  schema: Schema;
  description?: string;
}

export interface RequestBody {
  description?: string;
  required: boolean;
  content: {
    [mediaType: string]: {
      schema: Schema;
    };
  };
}

export interface Response {
  statusCode: string;
  description: string;
  content?: {
    [mediaType: string]: {
      schema: Schema;
    };
  };
}

export interface Schema {
  type: string;
  format?: string;
  properties?: {
    [name: string]: Schema;
  };
  items?: Schema;
  required?: string[];
  enum?: any[];
  description?: string;
  title?: string;
  default?: any;
  example?: any;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  ref?: string;
}

// Component Types
export interface Component {
  id: string;
  type: string;
  name: string;
  description?: string;
  props: Record<string, any>;
  children?: Component[];
  mapping?: ComponentMapping;
}

export interface ComponentMapping {
  endpoint?: string;
  dataPath?: string;
  fields?: Record<string, string>;
  events?: Record<string, EventMapping>;
}

export interface EventMapping {
  action: 'navigate' | 'api' | 'setState';
  endpoint?: string;
  path?: string;
  params?: Record<string, string>;
}

// View Types
export interface View {
  id: string;
  name: string;
  path: string;
  components: Component[];
}

// Application Types
export interface AppDefinition {
  name: string;
  description?: string;
  api: ApiDefinition;
  views: View[];
  components: Component[];
  state: StateDefinition;
}

export interface ApiDefinition {
  baseUrl: string;
  endpoints: EndpointDefinition[];
}

export interface EndpointDefinition {
  operationId: string;
  path: string;
  method: string;
  parameters: ParameterDefinition[];
  requestBody?: RequestBodyDefinition;
  responses: ResponseDefinition[];
}

export interface ParameterDefinition {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required: boolean;
  schema: SchemaDefinition;
}

export interface RequestBodyDefinition {
  required: boolean;
  content: {
    [mediaType: string]: {
      schema: SchemaDefinition;
    };
  };
}

export interface ResponseDefinition {
  statusCode: string;
  content?: {
    [mediaType: string]: {
      schema: SchemaDefinition;
    };
  };
}

export interface SchemaDefinition {
  type: string;
  format?: string;
  properties?: Record<string, SchemaDefinition>;
  items?: SchemaDefinition;
  required?: string[];
  enum?: any[];
}

export interface StateDefinition {
  initial: Record<string, any>;
  derived: Record<string, string>;
  effects: EffectDefinition[];
}

export interface EffectDefinition {
  trigger: string;
  action: 'api' | 'setState';
  endpoint?: string;
  path?: string;
  params?: Record<string, string>;
}

// Generated Code Types
export interface GeneratedCode {
  components: string;
  apiClient: string;
  stateManagement: string;
  routing: string;
}

// UI Types
export interface DragItem {
  type: string;
  id: string;
  component?: Component;
}

export interface DropResult {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Selection {
  componentIds: string[];
}

export interface EditorState {
  api: ParsedAPI | null;
  views: View[];
  currentView: string | null;
  components: Component[];
  selection: Selection;
  dragItem: DragItem | null;
  dropTarget: string | null;
}

export interface EditorAction {
  type: string;
  payload: any;
}

import { h } from '../jsx';
import { Component, ParsedAPI } from '../types';

interface PropertiesPanelProps {
  component: Component | null;
  api: ParsedAPI | null;
  onUpdateComponent: (componentId: string, props: Record<string, any>) => void;
  onMapComponent: (componentId: string, endpointId: string) => void;
}

export const PropertiesPanel = (props: PropertiesPanelProps) => {
  if (!props.component) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p>No component selected. Please select a component to edit its properties.</p>
      </div>
    );
  }
  
  const handlePropertyChange = (property: string, value: any) => {
    props.onUpdateComponent(props.component!.id, { [property]: value });
  };
  
  const handleEndpointSelect = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      props.onMapComponent(props.component!.id, select.value);
    }
  };
  
  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      
      <div className="property">
        <div className="property-label">Type</div>
        <div>{props.component.type}</div>
      </div>
      
      <div className="property">
        <div className="property-label">ID</div>
        <div>{props.component.id}</div>
      </div>
      
      {props.component.type === 'Button' && (
        <>
          <div className="property">
            <div className="property-label">Label</div>
            <input
              type="text"
              className="property-input"
              value={props.component.props.label || ''}
              onchange={(e) => handlePropertyChange('label', (e.target as HTMLInputElement).value)}
            />
          </div>
          
          <div className="property">
            <div className="property-label">Variant</div>
            <select
              className="property-select"
              value={props.component.props.variant || 'primary'}
              onchange={(e) => handlePropertyChange('variant', (e.target as HTMLSelectElement).value)}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="danger">Danger</option>
              <option value="success">Success</option>
            </select>
          </div>
        </>
      )}
      
      {props.component.type === 'Input' && (
        <>
          <div className="property">
            <div className="property-label">Placeholder</div>
            <input
              type="text"
              className="property-input"
              value={props.component.props.placeholder || ''}
              onchange={(e) => handlePropertyChange('placeholder', (e.target as HTMLInputElement).value)}
            />
          </div>
          
          <div className="property">
            <div className="property-label">Label</div>
            <input
              type="text"
              className="property-input"
              value={props.component.props.label || ''}
              onchange={(e) => handlePropertyChange('label', (e.target as HTMLInputElement).value)}
            />
          </div>
          
          <div className="property">
            <div className="property-label">Required</div>
            <input
              type="checkbox"
              className="property-checkbox"
              checked={props.component.props.required || false}
              onchange={(e) => handlePropertyChange('required', (e.target as HTMLInputElement).checked)}
            />
          </div>
        </>
      )}
      
      {props.component.type === 'DataTable' && (
        <>
          <div className="property">
            <div className="property-label">Columns</div>
            <button
              onclick={() => {
                const columns = props.component!.props.columns || [];
                handlePropertyChange('columns', [
                  ...columns,
                  { field: `field${columns.length + 1}`, header: `Column ${columns.length + 1}` }
                ]);
              }}
            >
              Add Column
            </button>
            
            {(props.component.props.columns || []).map((column: any, index: number) => (
              <div className="column-item">
                <input
                  type="text"
                  className="property-input"
                  value={column.header}
                  onchange={(e) => {
                    const columns = [...props.component!.props.columns];
                    columns[index].header = (e.target as HTMLInputElement).value;
                    handlePropertyChange('columns', columns);
                  }}
                />
                <button
                  onclick={() => {
                    const columns = [...props.component!.props.columns];
                    columns.splice(index, 1);
                    handlePropertyChange('columns', columns);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      {props.component.type === 'Card' && (
        <>
          <div className="property">
            <div className="property-label">Title</div>
            <input
              type="text"
              className="property-input"
              value={props.component.props.title || ''}
              onchange={(e) => handlePropertyChange('title', (e.target as HTMLInputElement).value)}
            />
          </div>
          
          <div className="property">
            <div className="property-label">Content</div>
            <textarea
              className="property-input"
              value={props.component.props.content || ''}
              onchange={(e) => handlePropertyChange('content', (e.target as HTMLTextAreaElement).value)}
            ></textarea>
          </div>
        </>
      )}
      
      <div className="mapping-section">
        <h4>API Mapping</h4>
        
        {props.api ? (
          <>
            <div className="property">
              <div className="property-label">Endpoint</div>
              <select
                className="property-select"
                value={props.component.mapping?.endpoint || ''}
                onchange={handleEndpointSelect}
              >
                <option value="">Select an endpoint</option>
                {props.api.endpoints.map(endpoint => (
                  <option value={endpoint.operationId}>
                    {endpoint.method} {endpoint.path} - {endpoint.summary}
                  </option>
                ))}
              </select>
            </div>
            
            {props.component.mapping?.endpoint && (
              <>
                <div className="property">
                  <div className="property-label">Data Path</div>
                  <input
                    type="text"
                    className="property-input"
                    value={props.component.mapping.dataPath || ''}
                    onchange={(e) => {
                      props.onUpdateComponent(props.component!.id, {
                        mapping: {
                          ...props.component!.mapping,
                          dataPath: (e.target as HTMLInputElement).value
                        }
                      });
                    }}
                  />
                </div>
                
                <h5>Field Mapping</h5>
                {props.component.mapping.fields && Object.entries(props.component.mapping.fields).map(([field, path]) => (
                  <div className="property">
                    <div className="property-label">{field}</div>
                    <input
                      type="text"
                      className="property-input"
                      value={path}
                      onchange={(e) => {
                        props.onUpdateComponent(props.component!.id, {
                          mapping: {
                            ...props.component!.mapping,
                            fields: {
                              ...props.component!.mapping!.fields,
                              [field]: (e.target as HTMLInputElement).value
                            }
                          }
                        });
                      }}
                    />
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <p>No API loaded. Please load an OpenAPI specification to map components to endpoints.</p>
        )}
      </div>
    </div>
  );
};

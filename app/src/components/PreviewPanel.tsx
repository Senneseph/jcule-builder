import { h } from '../jsx';
import { Component, View, ParsedAPI } from '../types';

interface PreviewPanelProps {
  view: View | null;
  components: Component[];
  api: ParsedAPI | null;
}

export const PreviewPanel = (props: PreviewPanelProps) => {
  if (!props.view) {
    return (
      <div className="preview-panel">
        <h3>Preview</h3>
        <p>No view selected. Please select a view to preview.</p>
      </div>
    );
  }
  
  // Render a component based on its type and props
  const renderComponent = (component: Component) => {
    switch (component.type) {
      case 'Button':
        return (
          <button
            className={`btn btn-${component.props.variant || 'primary'}`}
            disabled={component.props.disabled}
          >
            {component.props.label || 'Button'}
          </button>
        );
        
      case 'Input':
        return (
          <div className="form-group">
            {component.props.label && (
              <label>{component.props.label}</label>
            )}
            <input
              type="text"
              className="form-control"
              placeholder={component.props.placeholder}
              disabled={component.props.disabled}
              required={component.props.required}
            />
          </div>
        );
        
      case 'DataTable':
        return (
          <table className="table">
            <thead>
              <tr>
                {(component.props.columns || []).map((column: any) => (
                  <th>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {(component.props.columns || []).map(() => (
                  <td>Sample data</td>
                ))}
              </tr>
            </tbody>
          </table>
        );
        
      case 'Card':
        return (
          <div className="card">
            {component.props.title && (
              <div className="card-header">{component.props.title}</div>
            )}
            <div className="card-body">
              {component.props.content || 'Card content'}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="unknown-component">
            Unknown component type: {component.type}
          </div>
        );
    }
  };
  
  return (
    <div className="preview-panel">
      <h3>Preview</h3>
      
      <div className="preview-content">
        {props.view.components.map(component => (
          <div className="preview-component">
            {renderComponent(component)}
          </div>
        ))}
      </div>
    </div>
  );
};

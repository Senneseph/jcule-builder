import { h } from '../jsx';
import { Component, View } from '../types';

interface CanvasProps {
  view: View | null;
  components: Component[];
  selectedComponent: string | null;
  onSelectComponent: (componentId: string) => void;
  onAddComponent: (component: Component) => void;
}

export const Canvas = (props: CanvasProps) => {
  if (!props.view) {
    return (
      <div className="canvas">
        <p>No view selected. Please select a view or create a new one.</p>
      </div>
    );
  }
  
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    
    if (event.dataTransfer) {
      try {
        const data = JSON.parse(event.dataTransfer.getData('application/json'));
        
        // Create a new component
        const component: Component = {
          id: `component-${Date.now()}`,
          type: data.type,
          name: data.name,
          props: {
            style: {
              position: 'absolute',
              left: `${event.offsetX}px`,
              top: `${event.offsetY}px`,
              width: '200px',
              height: '100px'
            }
          },
          children: []
        };
        
        props.onAddComponent(component);
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    }
  };
  
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  };
  
  return (
    <div
      className="canvas"
      ondrop={handleDrop}
      ondragover={handleDragOver}
    >
      <h3>{props.view.name}</h3>
      
      {props.view.components.map(component => (
        <div
          className={`canvas-component ${props.selectedComponent === component.id ? 'selected' : ''}`}
          style={component.props.style}
          onclick={() => props.onSelectComponent(component.id)}
        >
          <div className="component-header">{component.type}</div>
          <div className="component-content">
            {component.type === 'Button' && (
              <button>{component.props.label || 'Button'}</button>
            )}
            {component.type === 'Input' && (
              <input type="text" placeholder={component.props.placeholder || 'Input'} />
            )}
            {component.type === 'DataTable' && (
              <table>
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
            )}
            {component.type === 'Card' && (
              <div className="card">
                <div className="card-header">{component.props.title || 'Card Title'}</div>
                <div className="card-body">{component.props.content || 'Card Content'}</div>
              </div>
            )}
          </div>
          
          {props.selectedComponent === component.id && (
            <>
              <div className="resize-handle top-left"></div>
              <div className="resize-handle top-right"></div>
              <div className="resize-handle bottom-left"></div>
              <div className="resize-handle bottom-right"></div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

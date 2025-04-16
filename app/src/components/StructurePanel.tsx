import { h } from '../jsx';
import { View } from '../types';

interface StructurePanelProps {
  view: View | null;
  selectedComponent: string | null;
  onSelectComponent: (componentId: string) => void;
}

export const StructurePanel = (props: StructurePanelProps) => {
  if (!props.view) {
    return (
      <div className="structure-panel">
        <h3>Structure</h3>
        <p>No view selected. Please select a view to see its structure.</p>
      </div>
    );
  }
  
  return (
    <div className="structure-panel">
      <h3>Structure</h3>
      
      <ul>
        <li className="view-item">
          <span>{props.view.name}</span>
          <ul className="component-tree">
            {props.view.components.map(component => (
              <li
                className={props.selectedComponent === component.id ? 'selected' : ''}
                onclick={() => props.onSelectComponent(component.id)}
              >
                <span>{component.type}</span>
                {component.props.label && <span> - {component.props.label}</span>}
                {component.props.title && <span> - {component.props.title}</span>}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

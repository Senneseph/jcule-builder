import { h } from '../jsx';

interface ComponentCategory {
  name: string;
  components: {
    type: string;
    name: string;
    icon: string;
  }[];
}

const categories: ComponentCategory[] = [
  {
    name: 'Form',
    components: [
      { type: 'Button', name: 'Button', icon: '🔘' },
      { type: 'Input', name: 'Input', icon: '📝' },
      { type: 'Checkbox', name: 'Checkbox', icon: '☑️' },
      { type: 'Radio', name: 'Radio', icon: '⚪' },
      { type: 'Select', name: 'Select', icon: '📋' },
      { type: 'Textarea', name: 'Textarea', icon: '📄' }
    ]
  },
  {
    name: 'Layout',
    components: [
      { type: 'Container', name: 'Container', icon: '📦' },
      { type: 'Grid', name: 'Grid', icon: '🔲' },
      { type: 'Card', name: 'Card', icon: '🃏' },
      { type: 'Tabs', name: 'Tabs', icon: '📑' },
      { type: 'Modal', name: 'Modal', icon: '🪟' },
      { type: 'Divider', name: 'Divider', icon: '➖' }
    ]
  },
  {
    name: 'Data',
    components: [
      { type: 'DataTable', name: 'Table', icon: '🧮' },
      { type: 'List', name: 'List', icon: '📋' },
      { type: 'Detail', name: 'Detail', icon: '🔍' },
      { type: 'Chart', name: 'Chart', icon: '📊' }
    ]
  }
];

export const ComponentPalette = () => {
  const handleDragStart = (event: DragEvent, component: any) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(component));
      event.dataTransfer.effectAllowed = 'copy';
    }
  };
  
  return (
    <div className="component-palette">
      <h3>Components</h3>
      
      {categories.map(category => (
        <div className="category">
          <div className="category-title">{category.name}</div>
          <div className="components">
            {category.components.map(component => (
              <div
                className="component"
                draggable="true"
                ondragstart={(e) => handleDragStart(e as DragEvent, component)}
              >
                <div className="component-icon">{component.icon}</div>
                <div className="component-name">{component.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

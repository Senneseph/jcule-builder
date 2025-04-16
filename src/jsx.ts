/**
 * Simple JSX implementation without React
 */

// Define the JSX namespace
export namespace JSX {
  export interface Element {
    type: string | Function;
    props: any;
    children: any[];
  }

  export interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Create element function (used by JSX transform)
export function h(type: string | Function, props: any, ...children: any[]): JSX.Element {
  return {
    type,
    props: props || {},
    children: children.flat()
  };
}

// Fragment component
export const Fragment = (props: { children: any[] }) => props.children;

// Render JSX element to DOM
export function render(element: JSX.Element, container: HTMLElement): void {
  if (!element) return;

  // Handle text nodes
  if (typeof element === 'string' || typeof element === 'number') {
    container.appendChild(document.createTextNode(element.toString()));
    return;
  }

  // Handle arrays
  if (Array.isArray(element)) {
    element.forEach(child => render(child, container));
    return;
  }

  // Handle functional components
  if (typeof element.type === 'function') {
    const result = element.type({
      ...element.props,
      children: element.children
    });
    render(result, container);
    return;
  }

  // Create DOM element
  const domElement = document.createElement(element.type as string);

  // Add attributes/props
  if (element.props) {
    Object.entries(element.props).forEach(([name, value]) => {
      // Handle event listeners
      if (name.startsWith('on') && typeof value === 'function') {
        const eventName = name.toLowerCase().substring(2);
        domElement.addEventListener(eventName, value as EventListener);
      } 
      // Handle style object
      else if (name === 'style' && typeof value === 'object') {
        Object.entries(value as object).forEach(([prop, val]) => {
          (domElement.style as any)[prop] = val;
        });
      } 
      // Handle className
      else if (name === 'className') {
        domElement.setAttribute('class', value as string);
      } 
      // Handle other attributes
      else if (name !== 'children') {
        if (value === true) {
          domElement.setAttribute(name, '');
        } else if (value !== false && value != null) {
          domElement.setAttribute(name, value as string);
        }
      }
    });
  }

  // Add children
  if (element.children) {
    element.children.forEach(child => {
      render(child, domElement);
    });
  }

  // Append to container
  container.appendChild(domElement);
}

// Create a component
export function createComponent(render: Function, defaultProps: object = {}) {
  return (props: object = {}) => {
    return render({ ...defaultProps, ...props });
  };
}

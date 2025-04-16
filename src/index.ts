import { h, render } from './jsx';
import { App } from './App';
import './index.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('app');
  
  if (rootElement) {
    render(App(), rootElement);
  } else {
    console.error('Root element not found');
  }
});

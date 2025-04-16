import { h } from '../jsx';
import { ParsedAPI, Endpoint } from '../types';

interface ApiExplorerProps {
  api: ParsedAPI | null;
}

export const ApiExplorer = (props: ApiExplorerProps) => {
  if (!props.api) {
    return (
      <div className="api-explorer">
        <h3>API Explorer</h3>
        <p>No API loaded. Please load an OpenAPI specification.</p>
      </div>
    );
  }
  
  // Group endpoints by tags
  const endpointsByTag: Record<string, Endpoint[]> = {};
  
  props.api.endpoints.forEach(endpoint => {
    const tags = endpoint.tags.length > 0 ? endpoint.tags : ['default'];
    
    tags.forEach(tag => {
      if (!endpointsByTag[tag]) {
        endpointsByTag[tag] = [];
      }
      
      endpointsByTag[tag].push(endpoint);
    });
  });
  
  return (
    <div className="api-explorer">
      <h3>API Explorer</h3>
      
      {Object.entries(endpointsByTag).map(([tag, endpoints]) => (
        <div className="tag-group">
          <h4>{tag}</h4>
          <ul>
            {endpoints.map(endpoint => (
              <li>
                <div className="endpoint">
                  <span className={`method ${endpoint.method.toLowerCase()}`}>
                    {endpoint.method}
                  </span>
                  <span className="path">{endpoint.path}</span>
                </div>
                <div className="summary">{endpoint.summary}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

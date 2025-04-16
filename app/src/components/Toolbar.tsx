import { h } from '../jsx';

interface ToolbarProps {
  onLoadSpec: (specUrl: string) => void;
  onLoadSpecString: (specString: string, format: 'json' | 'yaml') => void;
  onGenerateCode: () => void;
}

export const Toolbar = (props: ToolbarProps) => {
  let specUrl = '';
  
  const handleLoadSpec = () => {
    const input = document.getElementById('spec-url') as HTMLInputElement;
    if (input && input.value) {
      props.onLoadSpec(input.value);
    }
  };
  
  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const format = file.name.endsWith('.json') ? 'json' : 'yaml';
        props.onLoadSpecString(content, format);
      };
      
      reader.readAsText(file);
    }
  };
  
  return (
    <div className="toolbar">
      <input
        id="spec-url"
        type="text"
        placeholder="Enter OpenAPI spec URL"
        onchange={(e) => { specUrl = (e.target as HTMLInputElement).value; }}
      />
      <button onclick={handleLoadSpec}>Load Spec</button>
      <input
        id="spec-file"
        type="file"
        accept=".json,.yaml,.yml"
        style={{ display: 'none' }}
        onchange={handleFileUpload}
      />
      <button onclick={() => { document.getElementById('spec-file')?.click(); }}>
        Upload Spec
      </button>
      <button onclick={props.onGenerateCode}>Generate Code</button>
    </div>
  );
};

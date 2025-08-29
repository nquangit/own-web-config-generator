import React, { useState, useEffect, useCallback } from 'react';
import { FiEye, FiDownload, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { generateYAMLConfig } from '../utils/configGenerator';

// YAML Syntax Highlighting Component
const YAMLHighlighter = ({ yamlText }) => {
  const lines = yamlText.split('\n');
  
  return (
    <>
      {lines.map((line, index) => {
        // Handle empty lines
        if (!line.trim()) {
          return <div key={index}>&nbsp;</div>;
        }
        
        // Handle comments
        if (line.trim().startsWith('#')) {
          return (
            <div key={index} style={{ color: '#6b7280', fontStyle: 'italic', whiteSpace: 'pre' }}>
              {line}
            </div>
          );
        }
        
        // Handle YAML key-value pairs
        const keyValueMatch = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
        if (keyValueMatch) {
          const [, indent, key, value] = keyValueMatch;
          return (
            <div key={index} style={{ whiteSpace: 'pre' }}>
              {indent}
              <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{key}</span>
              :{value ? ' ' : ''}
              {value && <span style={{ color: '#34d399' }}>{value}</span>}
            </div>
          );
        }
        
        // Handle list items
        if (line.match(/^\s*-\s/)) {
          const dashMatch = line.match(/^(\s*)(-)(\s*.*)$/);
          if (dashMatch) {
            const [, indent, dash, rest] = dashMatch;
            return (
              <div key={index} style={{ whiteSpace: 'pre' }}>
                {indent}
                <span style={{ color: '#f87171', fontWeight: 'bold' }}>{dash}</span>
                {rest}
              </div>
            );
          }
        }
        
        // Default: return line as-is with preserved whitespace
        return <div key={index} style={{ whiteSpace: 'pre' }}>{line}</div>;
      })}
    </>
  );
};

const ConfigPreview = ({ config }) => {
  const [yamlContent, setYamlContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePreview = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const yaml = generateYAMLConfig(config);
      setYamlContent(yaml);
    } catch (err) {
      setError(err.message);
      setYamlContent('# Error generating preview\n# ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadConfig = () => {
    try {
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.project?.name?.replace(/\s+/g, '_') || 'wexbloit'}_config.yaml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getConfigStats = () => {
    const stats = {
      testCases: config.tests?.test_cases?.length || 0,
      flows: config.tests?.flows?.length || 0,
      modules: config.test_case_modules?.enabled?.length || 0,
      extensions: config.extensions?.enabled?.length || 0
    };
    
    const totalSteps = config.tests?.flows?.reduce((total, flow) => total + (flow.steps?.length || 0), 0) || 0;
    
    return { ...stats, totalSteps };
  };

  const stats = getConfigStats();

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <FiEye className="text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Configuration Preview</h3>
          {isGenerating && (
            <div className="ml-2 flex items-center text-blue-600">
              <FiRefreshCw className="animate-spin mr-1" size={16} />
              <span className="text-sm">Generating...</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className={`flex items-center px-3 py-1 text-sm rounded transition-colors ${
              copySuccess 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Copy to clipboard"
          >
            {copySuccess ? <FiCheck className="mr-1" size={14} /> : <FiCopy className="mr-1" size={14} />}
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
          
          <button
            onClick={downloadConfig}
            className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
            title="Download YAML file"
          >
            <FiDownload className="mr-1" size={14} />
            Download
          </button>
        </div>
      </div>

      {/* Configuration Statistics */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-blue-600">{stats.testCases}</div>
            <div className="text-xs text-gray-600">Test Cases</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">{stats.flows}</div>
            <div className="text-xs text-gray-600">Flows</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-600">{stats.totalSteps}</div>
            <div className="text-xs text-gray-600">Total Steps</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600">{stats.modules}</div>
            <div className="text-xs text-gray-600">Modules</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">{stats.extensions}</div>
            <div className="text-xs text-gray-600">Extensions</div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="text-red-800 text-sm">
            <strong>Preview Error:</strong> {error}
          </div>
        </div>
      )}

      {/* YAML Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-4 text-sm font-mono bg-gray-900 text-green-400">
          <YAMLHighlighter yamlText={yamlContent} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            {yamlContent.split('\n').length} lines • {Math.round(yamlContent.length / 1024 * 10) / 10} KB
          </span>
          <span>
            Compatible with WexBloit v2.0+
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfigPreview;

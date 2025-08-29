import React, { useState } from 'react';
import { FiSettings, FiPlus, FiTrash2, FiCheck, FiInfo, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const TestCaseModulesConfig = ({ config = {}, updateConfig, extensionsConfig, updateExtensionsConfig }) => {
  const [showGlobalConfig, setShowGlobalConfig] = useState(false);
  
  // Available test case modules from the source code analysis
  const availableModules = [
    {
      name: 'SQLInjectionTestCase',
      description: 'SQL injection vulnerability testing with multiple payload types',
      category: 'Injection',
      severity: 'high',
      params: ['target_url', 'test_parameter']
    },
    {
      name: 'XSSTestCase',
      description: 'Cross-site scripting (XSS) vulnerability testing',
      category: 'Injection',
      severity: 'high',
      params: ['target_url', 'test_parameter']
    },
    {
      name: 'IDORTestCase',
      description: 'Insecure Direct Object Reference testing',
      category: 'Access Control',
      severity: 'high',
      params: ['base_url', 'target_urls', 'test_user_ids', 'auth_token', 'session_cookie']
    },
    {
      name: 'BrokenFunctionLevelAuthorizationTestCase',
      description: 'Function-level authorization bypass testing',
      category: 'Access Control',
      severity: 'high',
      params: ['user_role', 'function_endpoints']
    },
    {
      name: 'MassAssignmentTestCase',
      description: 'Mass assignment vulnerability testing',
      category: 'Access Control',
      severity: 'medium',
      params: ['target_endpoints', 'sensitive_parameters']
    },
    {
      name: 'LoginTestCase',
      description: 'Authentication mechanism testing',
      category: 'Authentication',
      severity: 'medium',
      params: ['login_url', 'username', 'password']
    },
    {
      name: 'SecurityHeadersTestCase',
      description: 'Security headers analysis and testing',
      category: 'Security',
      severity: 'low',
      params: ['target_url']
    },
    {
      name: 'APITestCase',
      description: 'General API functionality and security testing',
      category: 'API',
      severity: 'medium',
      params: ['target_url', 'test_headers', 'test_methods']
    }
  ];

  // Available extensions
  const availableExtensions = [
    'auth',
    'headers',
    'logging',
    'rate_limiting',
    'data_extraction'
  ];

  const toggleModule = (moduleName) => {
    const enabled = config.enabled || [];
    const isEnabled = enabled.includes(moduleName);
    
    const updatedEnabled = isEnabled 
      ? enabled.filter(name => name !== moduleName)
      : [...enabled, moduleName];
    
    updateConfig({
      ...config,
      enabled: updatedEnabled
    });
  };

  const toggleExtension = (extensionName) => {
    const enabled = extensionsConfig.enabled || [];
    const isEnabled = enabled.includes(extensionName);
    
    const updatedEnabled = isEnabled 
      ? enabled.filter(name => name !== extensionName)
      : [...enabled, extensionName];
    
    updateExtensionsConfig({
      ...extensionsConfig,
      enabled: updatedEnabled
    });
  };

  const updateGlobalConfig = (key, value) => {
    updateConfig({
      ...config,
      global_config: {
        ...config.global_config,
        [key]: value
      }
    });
  };

  const addGlobalConfigItem = (key, value) => {
    if (!key.trim()) return;
    updateGlobalConfig(key, value);
  };

  const removeGlobalConfigItem = (key) => {
    const updated = { ...config.global_config };
    delete updated[key];
    updateConfig({
      ...config,
      global_config: updated
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Injection': 'bg-red-100 text-red-800',
      'Access Control': 'bg-orange-100 text-orange-800',
      'Authentication': 'bg-blue-100 text-blue-800',
      'Security': 'bg-green-100 text-green-800',
      'API': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Test Case Modules */}
      <div className="form-section">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiSettings className="text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Test Case Modules</h2>
          </div>
          <span className="text-sm text-gray-500">
            {(config.enabled || []).length} enabled
          </span>
        </div>

        <p className="text-gray-600 mb-6">
          Enable pre-built test case modules for common vulnerability types. Each module contains multiple test scenarios.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableModules.map((module) => {
            const isEnabled = (config.enabled || []).includes(module.name);
            
            return (
              <div key={module.name} className={`config-card ${isEnabled ? 'border-blue-500 bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-gray-800">{module.name}</h3>
                      <div className="ml-2 flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(module.category)}`}>
                          {module.category}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(module.severity)}`} 
                             title={`${module.severity} severity`}></div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                    <div className="text-xs text-gray-500">
                      <strong>Required params:</strong> {module.params.join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleModule(module.name)}
                    className={`ml-4 p-2 rounded-lg transition-colors ${
                      isEnabled 
                        ? 'text-blue-600 hover:text-blue-800 bg-blue-100' 
                        : 'text-gray-400 hover:text-gray-600 bg-gray-100'
                    }`}
                    title={isEnabled ? 'Disable module' : 'Enable module'}
                  >
                    {isEnabled ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extensions */}
      <div className="form-section">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiPlus className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Extensions</h2>
          </div>
          <span className="text-sm text-gray-500">
            {(extensionsConfig.enabled || []).length} enabled
          </span>
        </div>

        <p className="text-gray-600 mb-4">
          Enable extensions for additional request/response processing capabilities.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {availableExtensions.map((extension) => {
            const isEnabled = (extensionsConfig.enabled || []).includes(extension);
            
            return (
              <button
                key={extension}
                onClick={() => toggleExtension(extension)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  isEnabled
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isEnabled ? <FiCheck /> : <FiPlus />}
                </div>
                {extension}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Configuration */}
      <div className="form-section">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiInfo className="text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Global Configuration</h2>
          </div>
          <button
            onClick={() => setShowGlobalConfig(!showGlobalConfig)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showGlobalConfig ? 'Hide' : 'Show'} Details
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Define global variables that can be used across all test case modules.
        </p>

        {showGlobalConfig && (
          <div className="space-y-4">
            {/* Common Global Variables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Base URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.global_config?.base_url || ''}
                  onChange={(e) => updateGlobalConfig('base_url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.global_config?.username || ''}
                  onChange={(e) => updateGlobalConfig('username', e.target.value)}
                  placeholder="testuser"
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={config.global_config?.password || ''}
                  onChange={(e) => updateGlobalConfig('password', e.target.value)}
                  placeholder="password123"
                />
              </div>
              <div>
                <label className="form-label">Auth Token</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.global_config?.auth_token || ''}
                  onChange={(e) => updateGlobalConfig('auth_token', e.target.value)}
                  placeholder="Bearer token or API key"
                />
              </div>
            </div>

            {/* Custom Global Variables */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Custom Variables</h3>
              
              {Object.entries(config.global_config || {}).map(([key, value]) => {
                // Skip the common variables we handle above
                if (['base_url', 'username', 'password', 'auth_token'].includes(key)) {
                  return null;
                }
                
                return (
                  <div key={key} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      className="form-input flex-shrink-0 w-32"
                      value={key}
                      readOnly
                    />
                    <span className="text-gray-500">=</span>
                    <input
                      type="text"
                      className="form-input flex-1"
                      value={value}
                      onChange={(e) => updateGlobalConfig(key, e.target.value)}
                    />
                    <button
                      onClick={() => removeGlobalConfigItem(key)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="form-input flex-shrink-0 w-32"
                  placeholder="variable_name"
                  id="new-var-key"
                />
                <span className="text-gray-500">=</span>
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="value"
                  id="new-var-value"
                />
                <button
                  onClick={() => {
                    const keyInput = document.getElementById('new-var-key');
                    const valueInput = document.getElementById('new-var-value');
                    if (keyInput.value.trim()) {
                      addGlobalConfigItem(keyInput.value.trim(), valueInput.value);
                      keyInput.value = '';
                      valueInput.value = '';
                    }
                  }}
                  className="btn-secondary flex items-center"
                >
                  <FiPlus className="mr-1" />
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Configuration Examples */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="text-indigo-800 font-semibold mb-2">🔧 Module Configuration Examples</h3>
        <div className="text-indigo-700 text-sm space-y-3">
          <div>
            <strong>SQL Injection Module:</strong>
            <pre className="bg-white p-2 rounded text-xs mt-1 overflow-x-auto">{`SQLInjectionTestCase:
  target_url: "https://example.com/search"
  test_parameter: "query"
  max_concurrent: 3`}</pre>
          </div>
          
          <div>
            <strong>IDOR Module:</strong>
            <pre className="bg-white p-2 rounded text-xs mt-1 overflow-x-auto">{`IDORTestCase:
  base_url: "{base_url}"
  target_urls: ["/api/users/{user_id}", "/api/orders/{order_id}"]
  test_user_ids: ["1", "2", "999"]
  auth_token: "{auth_token}"`}</pre>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-yellow-800 font-semibold mb-2">💡 Quick Tips</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Global variables can be referenced in module configs using <code>{`{variable_name}`}</code></li>
          <li>• Enable only the modules you need for your specific testing scope</li>
          <li>• High severity modules (red dot) should be prioritized in security assessments</li>
          <li>• Extensions provide additional capabilities like authentication handling</li>
        </ul>
      </div>
    </div>
  );
};

export default TestCaseModulesConfig;

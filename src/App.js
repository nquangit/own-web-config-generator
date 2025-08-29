import React, { useState, useEffect } from 'react';
import { FiSettings, FiGlobe, FiPlay, FiDownload, FiEye, FiCheck, FiAlertTriangle, FiZap } from 'react-icons/fi';
import ProjectConfig from './components/ProjectConfig';
import NetworkConfig from './components/NetworkConfig';
import TestCasesConfig from './components/TestCasesConfig';
import FlowsConfig from './components/FlowsConfig';
import TestCaseModulesConfig from './components/TestCaseModulesConfig';
import ConfigPreview from './components/ConfigPreview';
import QuickStart from './components/QuickStart';
import { generateYAMLConfig, validateConfig } from './utils/configGenerator';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('quickstart');
  const [config, setConfig] = useState({
    project: {
      name: 'WebApp Pentest',
      description: 'Web application penetration testing assessment',
      version: '1.0.0'
    },
    network: {
      proxy: {
        http: '',
        https: ''
      },
      timeout: 30,
      max_retries: 3,
      verify_ssl: true,
      user_agent: 'WexBloit/2.0'
    },
    tests: {
      test_cases: [],
      flows: []
    },
    test_case_modules: {
      enabled: [],
      global_config: {}
    },
    extensions: {
      enabled: [],
      config: {}
    },
    execution: {
      max_parallel_flows: 3,
      default_delay: 0
    },
    raw_requests_path: './requests',
    output: {
      format: 'html',
      path: './reports',
      verbose: true
    }
  });

  const [validationErrors, setValidationErrors] = useState([]);
  const [showPreview, setShowPreview] = useState(true);

  const tabs = [
    { id: 'quickstart', name: 'Quick Start', icon: FiZap },
    { id: 'project', name: 'Project', icon: FiSettings },
    { id: 'network', name: 'Network', icon: FiGlobe },
    { id: 'test_cases', name: 'Test Cases', icon: FiPlay },
    { id: 'flows', name: 'Flows', icon: FiPlay },
    { id: 'modules', name: 'Test Modules', icon: FiSettings },
  ];

  const updateConfig = (section, data) => {
    setConfig(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const validateConfiguration = () => {
    const errors = validateConfig(config);
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const downloadConfig = () => {
    try {
      const yamlContent = generateYAMLConfig(config);
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.project.name.replace(/\s+/g, '_')}_config.yaml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error generating configuration: ' + error.message);
    }
  };

  useEffect(() => {
    validateConfiguration();
  }, [config]);

  const loadTemplate = (templateConfig) => {
    setConfig(templateConfig);
    setActiveTab('project'); // Switch to project tab after loading template
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'quickstart':
        return <QuickStart onLoadTemplate={loadTemplate} />;
      case 'project':
        return (
          <ProjectConfig 
            config={config.project || {}} 
            updateConfig={(data) => updateConfig('project', data)}
            globalConfig={{
              raw_requests_path: config.raw_requests_path,
              output: config.output || {},
              execution: config.execution || {}
            }}
            updateGlobalConfig={(section, data) => updateConfig(section, data)}
          />
        );
      case 'network':
        return (
          <NetworkConfig 
            config={config.network || {}} 
            updateConfig={(data) => updateConfig('network', data)}
          />
        );
      case 'test_cases':
        return (
          <TestCasesConfig 
            config={config.tests?.test_cases || []} 
            updateConfig={(data) => updateConfig('tests', { ...(config.tests || {}), test_cases: data })}
          />
        );
      case 'flows':
        return (
          <FlowsConfig 
            config={config.tests?.flows || []} 
            updateConfig={(data) => updateConfig('tests', { ...(config.tests || {}), flows: data })}
          />
        );
      case 'modules':
        return (
          <TestCaseModulesConfig 
            config={config.test_case_modules || {}} 
            updateConfig={(data) => updateConfig('test_case_modules', data)}
            extensionsConfig={config.extensions || {}}
            updateExtensionsConfig={(data) => updateConfig('extensions', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-none mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🛡️ WexBloit Config Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate professional penetration testing configurations with ease
          </p>
        </div>

        {/* Validation Status */}
        <div className="mb-6 flex justify-center">
          <div className={`flex items-center px-4 py-2 rounded-lg ${
            validationErrors.length === 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {validationErrors.length === 0 ? (
              <>
                <FiCheck className="mr-2" />
                Configuration is valid
              </>
            ) : (
              <>
                <FiAlertTriangle className="mr-2" />
                {validationErrors.length} validation error{validationErrors.length !== 1 ? 's' : ''}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center btn-secondary"
          >
            <FiEye className="mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
          <button
            onClick={downloadConfig}
            disabled={validationErrors.length > 0}
            className={`flex items-center ${
              validationErrors.length > 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'btn-success'
            }`}
          >
            <FiDownload className="mr-2" />
            Download Config
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Configuration Form */}
          <div className={`${showPreview ? 'xl:w-2/3' : 'w-full'} transition-all duration-300`}>
            {/* Tabs */}
            <div className="flex flex-wrap justify-center lg:justify-start mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 mx-1 mb-2 rounded-lg border transition-colors ${
                    activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  <tab.icon className="mr-2" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="fade-in">
              {renderTabContent()}
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-semibold mb-2">Validation Errors:</h3>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="xl:w-1/3 fade-in">
              <ConfigPreview config={config} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>
            Generated configurations are compatible with WexBloit v2.0+
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

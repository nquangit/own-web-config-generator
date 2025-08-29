import React from 'react';
import { FiInfo, FiFolder, FiFileText } from 'react-icons/fi';

const ProjectConfig = ({ config, updateConfig, globalConfig, updateGlobalConfig }) => {
  const handleProjectChange = (field, value) => {
    updateConfig({
      ...config,
      [field]: value
    });
  };

  const handleGlobalChange = (section, field, value) => {
    updateGlobalConfig(section, {
      ...(globalConfig[section] || {}),
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Project Information */}
      <div className="form-section">
        <div className="flex items-center mb-4">
          <FiInfo className="text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Project Information</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="form-label">
              Project Name *
            </label>
            <input
              type="text"
              className="form-input"
              value={config.name}
              onChange={(e) => handleProjectChange('name', e.target.value)}
              placeholder="e.g., WebApp Security Assessment"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              A descriptive name for your penetration testing project
            </p>
          </div>

          <div>
            <label className="form-label">
              Description
            </label>
            <textarea
              className="form-input"
              rows={3}
              value={config.description}
              onChange={(e) => handleProjectChange('description', e.target.value)}
              placeholder="Brief description of the testing scope and objectives"
            />
          </div>

          <div>
            <label className="form-label">
              Version
            </label>
            <input
              type="text"
              className="form-input"
              value={config.version}
              onChange={(e) => handleProjectChange('version', e.target.value)}
              placeholder="1.0.0"
            />
          </div>
        </div>
      </div>

      {/* File Paths */}
      <div className="form-section">
        <div className="flex items-center mb-4">
          <FiFolder className="text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">File Paths</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">
              Raw Requests Path
            </label>
            <input
              type="text"
              className="form-input"
              value={globalConfig.raw_requests_path}
              onChange={(e) => updateGlobalConfig('raw_requests_path', e.target.value)}
              placeholder="./requests"
            />
            <p className="text-sm text-gray-500 mt-1">
              Directory containing raw HTTP request files
            </p>
          </div>

          <div>
            <label className="form-label">
              Output Path
            </label>
            <input
              type="text"
              className="form-input"
              value={globalConfig.output.path}
              onChange={(e) => handleGlobalChange('output', 'path', e.target.value)}
              placeholder="./reports"
            />
            <p className="text-sm text-gray-500 mt-1">
              Directory where reports will be saved
            </p>
          </div>
        </div>
      </div>

      {/* Output Configuration */}
      <div className="form-section">
        <div className="flex items-center mb-4">
          <FiFileText className="text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Output Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">
              Report Format
            </label>
            <select
              className="form-input"
              value={globalConfig.output.format}
              onChange={(e) => handleGlobalChange('output', 'format', e.target.value)}
            >
              <option value="html">HTML Report</option>
              <option value="json">JSON Report</option>
              <option value="csv">CSV Report</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="verbose"
              className="mr-2"
              checked={globalConfig.output.verbose}
              onChange={(e) => handleGlobalChange('output', 'verbose', e.target.checked)}
            />
            <label htmlFor="verbose" className="text-sm text-gray-700">
              Enable verbose output
            </label>
          </div>
        </div>
      </div>

      {/* Execution Settings */}
      <div className="form-section">
        <div className="flex items-center mb-4">
          <FiInfo className="text-orange-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Execution Settings</h2>
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">
              Max Parallel Flows
            </label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="10"
              value={globalConfig.execution?.max_parallel_flows || 3}
              onChange={(e) => handleGlobalChange('execution', 'max_parallel_flows', parseInt(e.target.value))}
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum number of flows to run simultaneously
            </p>
          </div>

          <div>
            <label className="form-label">
              Default Delay (seconds)
            </label>
            <input
              type="number"
              className="form-input"
              min="0"
              step="0.1"
              value={globalConfig.execution?.default_delay || 0}
              onChange={(e) => handleGlobalChange('execution', 'default_delay', parseFloat(e.target.value))}
            />
            <p className="text-sm text-gray-500 mt-1">
              Default delay between requests
            </p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-semibold mb-2">💡 Quick Tips</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Use descriptive project names for better organization</li>
          <li>• Raw request files should be in plain text format</li>
          <li>• HTML format provides the most comprehensive reports</li>
          <li>• Adjust parallel flows based on target server capacity</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectConfig;

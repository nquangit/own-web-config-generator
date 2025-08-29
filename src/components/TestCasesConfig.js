import React, { useState, useEffect } from 'react';
import { FiPlay, FiTrash2, FiEdit3, FiCheck, FiX } from 'react-icons/fi';

const TestCasesConfig = ({ config = [], updateConfig }) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newTestCase, setNewTestCase] = useState({
    name: '',
    description: '',
    raw_request: '',
    expected_status: 200,
    parallel: false,
    test_case_module: '',
    config: {}
  });

  const addTestCase = (testCaseData) => {
    if (!testCaseData.name.trim()) return;
    
    const currentConfig = config || [];
    updateConfig([...currentConfig, { ...testCaseData }]);
    setNewTestCase({
      name: '',
      description: '',
      raw_request: '',
      expected_status: 200,
      parallel: false,
      test_case_module: '',
      config: {}
    });
  };

  const updateTestCase = (index, updatedTestCase) => {
    const currentConfig = config || [];
    const updated = [...currentConfig];
    updated[index] = updatedTestCase;
    updateConfig(updated);
    setEditingIndex(-1);
  };

  const deleteTestCase = (index) => {
    const currentConfig = config || [];
    const updated = currentConfig.filter((_, i) => i !== index);
    updateConfig(updated);
  };

  const TestCaseForm = ({ testCase, onSave, onCancel, isNew = false }) => {
    const [formData, setFormData] = useState({
      name: testCase.name || '',
      description: testCase.description || '',
      raw_request: testCase.raw_request || '',
      expected_status: testCase.expected_status || 200,
      parallel: testCase.parallel || false,
      test_case_module: testCase.test_case_module || '',
      config: testCase.config || {}
    });



    // Update form data when testCase prop changes (for editing)
    useEffect(() => {
      setFormData({
        name: testCase.name || '',
        description: testCase.description || '',
        raw_request: testCase.raw_request || '',
        expected_status: testCase.expected_status || 200,
        parallel: testCase.parallel || false,
        test_case_module: testCase.test_case_module || '',
        config: testCase.config || {}
      });
    }, [testCase]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) return;
      
      // Clean up empty config values
      const cleanedFormData = { ...formData };
      if (cleanedFormData.config) {
        Object.keys(cleanedFormData.config).forEach(key => {
          if (cleanedFormData.config[key] === '' || cleanedFormData.config[key] === undefined) {
            delete cleanedFormData.config[key];
          }
        });
        if (Object.keys(cleanedFormData.config).length === 0) {
          delete cleanedFormData.config;
        }
      }
      
      // Only remove test_case_module if it's explicitly empty
      if (cleanedFormData.test_case_module === '') {
        delete cleanedFormData.test_case_module;
      }
      
      onSave(cleanedFormData);
    };

    const handleStatusChange = (value) => {
      // Handle both single status and array of statuses
      if (value.includes(',')) {
        const statuses = value.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
        setFormData({ ...formData, expected_status: statuses });
      } else {
        const status = parseInt(value);
        setFormData({ ...formData, expected_status: isNaN(status) ? 200 : status });
      }
    };

    const getStatusDisplay = () => {
      if (Array.isArray(formData.expected_status)) {
        return formData.expected_status.join(', ');
      }
      return formData.expected_status.toString();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="form-row">
          <div>
            <label className="form-label">Test Case Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Login Form Test"
              required
            />
          </div>
          <div>
            <label className="form-label">Raw Request File</label>
            <input
              type="text"
              className="form-input"
              value={formData.raw_request}
              onChange={(e) => setFormData({ ...formData, raw_request: e.target.value })}
              placeholder="e.g., auth/login.txt (optional for module tests)"
            />
          </div>
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of what this test case validates"
          />
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">Expected Status Code(s)</label>
            <input
              type="text"
              className="form-input"
              value={getStatusDisplay()}
              onChange={(e) => handleStatusChange(e.target.value)}
              placeholder="200 or 200,302,404"
            />
            <p className="text-xs text-gray-500 mt-1">
              Single code (200) or comma-separated (200,302,404)
            </p>
          </div>
          <div className="flex items-end">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`parallel-${isNew ? 'new' : 'edit'}`}
                className="mr-2"
                checked={formData.parallel}
                onChange={(e) => setFormData({ ...formData, parallel: e.target.checked })}
              />
              <label htmlFor={`parallel-${isNew ? 'new' : 'edit'}`} className="text-sm text-gray-700">
                Run in parallel
              </label>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">Test Case Module</label>
                         <select
               className="form-input"
               value={formData.test_case_module}
               onChange={(e) => setFormData({ ...formData, test_case_module: e.target.value })}
             >
              <option value="">Select a module (optional)</option>
              <option value="SQLInjectionTestCase">SQL Injection Test</option>
              <option value="XSSTestCase">XSS Test</option>
              <option value="IDORTestCase">IDOR Test</option>
              <option value="BrokenFunctionLevelAuthorizationTestCase">BFLA Test</option>
              <option value="MassAssignmentTestCase">Mass Assignment Test</option>
              <option value="LoginTestCase">Login Test</option>
              <option value="SecurityHeadersTestCase">Security Headers Test</option>
              <option value="APITestCase">API Test</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose a pre-built test module or leave empty for custom test
            </p>
          </div>
          <div>
            <label className="form-label">Max Concurrent</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="10"
              value={formData.config?.max_concurrent || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                config: { 
                  ...formData.config, 
                  max_concurrent: parseInt(e.target.value) || undefined 
                } 
              })}
              placeholder="3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum concurrent requests for this test
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="btn-primary flex items-center">
            <FiCheck className="mr-2" />
            {isNew ? 'Add' : 'Save'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary flex items-center">
            <FiX className="mr-2" />
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="form-section">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiPlay className="text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Test Cases</h2>
          </div>
          <span className="text-sm text-gray-500">
            {(config || []).length} test case{(config || []).length !== 1 ? 's' : ''}
          </span>
        </div>

        <p className="text-gray-600 mb-4">
          Configure individual test cases using raw HTTP request files. These are simple, standalone tests.
        </p>

        {/* Add New Test Case */}
        <TestCaseForm
          testCase={newTestCase}
          onSave={(testCase) => {
            addTestCase(testCase);
          }}
          onCancel={() => setNewTestCase({
            name: '',
            description: '',
            raw_request: '',
            expected_status: 200,
            parallel: false,
            test_case_module: '',
            config: {}
          })}
          isNew={true}
        />
      </div>

      {/* Existing Test Cases */}
      {(config || []).length > 0 && (
        <div className="form-section">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Configured Test Cases</h3>
          <div className="space-y-4">
            {(config || []).map((testCase, index) => (
              <div key={index} className="config-card">
                {editingIndex === index ? (
                  <TestCaseForm
                    testCase={testCase}
                    onSave={(updatedTestCase) => updateTestCase(index, updatedTestCase)}
                    onCancel={() => setEditingIndex(-1)}
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-semibold text-gray-800">{testCase.name}</h4>
                        {testCase.parallel && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Parallel
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{testCase.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {testCase.raw_request && <span>📄 {testCase.raw_request}</span>}
                        <span>
                          📊 {Array.isArray(testCase.expected_status) 
                            ? testCase.expected_status.join(', ') 
                            : testCase.expected_status}
                        </span>
                        {testCase.test_case_module && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            🧪 {testCase.test_case_module}
                          </span>
                        )}
                        {testCase.config?.max_concurrent && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            ⚡ {testCase.config.max_concurrent} concurrent
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit test case"
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() => deleteTestCase(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete test case"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

             {/* Help Section */}
       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
         <h3 className="text-blue-800 font-semibold mb-2">💡 Test Cases Types</h3>
         <div className="text-blue-700 text-sm space-y-2">
           <p><strong>Basic Test Cases:</strong> Simple tests using raw HTTP request files (name, raw_request, expected_status)</p>
           <p><strong>Module Test Cases:</strong> Pre-built test scenarios (SQL injection, XSS, IDOR, etc.) with configurable parameters</p>
           <p><strong>Test Case Modules:</strong> Automatically run when enabled in the Modules tab - no need to add manually</p>
           <p><strong>Flows:</strong> Multi-step tests where responses from one step can be used in subsequent steps</p>
         </div>
       </div>

      {/* Raw Request File Examples */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-800 font-semibold mb-2">📄 Raw Request File Example</h3>
        <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`GET /api/users HTTP/1.1
Host: example.com
User-Agent: WexBloit/2.0
Accept: application/json
Authorization: Bearer {token}

`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Create raw request files in your requests directory. Use {`{variable}`} for dynamic values.
        </p>
      </div>
    </div>
  );
};

export default TestCasesConfig;

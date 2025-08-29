import React, { useState } from 'react';
import { FiPlay, FiPlus, FiTrash2, FiEdit3, FiCheck, FiX, FiArrowRight, FiCopy } from 'react-icons/fi';

const FlowsConfig = ({ config = [], updateConfig }) => {
  const [editingFlowIndex, setEditingFlowIndex] = useState(-1);
  const [editingStepIndex, setEditingStepIndex] = useState(-1);
  const [newFlow, setNewFlow] = useState({
    name: '',
    description: '',
    parallel: false,
    continue_on_failure: true,
    steps: []
  });

  const addFlow = () => {
    if (!newFlow.name.trim()) return;
    
    const currentConfig = config || [];
    updateConfig([...currentConfig, { ...newFlow }]);
    setNewFlow({
      name: '',
      description: '',
      parallel: false,
      continue_on_failure: true,
      steps: []
    });
  };

  const updateFlow = (index, updatedFlow) => {
    const currentConfig = config || [];
    const updated = [...currentConfig];
    updated[index] = updatedFlow;
    updateConfig(updated);
    setEditingFlowIndex(-1);
  };

  const deleteFlow = (index) => {
    const currentConfig = config || [];
    const updated = currentConfig.filter((_, i) => i !== index);
    updateConfig(updated);
  };

  const addStepToFlow = (flowIndex) => {
    const currentConfig = config || [];
    const updated = [...currentConfig];
    const newStep = {
      name: '',
      description: '',
      raw_request: '',
      expected_status: 200,
      delay: 0,
      request_modifications: {
        headers: {
          'X-Custom-Check': updated[flowIndex].name.replace(/\s+/g, '') + 'Flow'
        }
      },
      extract: {},
      validations: []
    };
    updated[flowIndex].steps.push(newStep);
    updateConfig(updated);
  };

  const updateStep = (flowIndex, stepIndex, updatedStep) => {
    const currentConfig = config || [];
    const updated = [...currentConfig];
    updated[flowIndex].steps[stepIndex] = updatedStep;
    updateConfig(updated);
    setEditingStepIndex(-1);
  };

  const deleteStep = (flowIndex, stepIndex) => {
    const currentConfig = config || [];
    const updated = [...currentConfig];
    updated[flowIndex].steps.splice(stepIndex, 1);
    updateConfig(updated);
  };

  const duplicateStep = (flowIndex, stepIndex) => {
    const currentConfig = config || [];
    const updated = [...currentConfig];
    const stepToCopy = { ...updated[flowIndex].steps[stepIndex] };
    stepToCopy.name = stepToCopy.name + ' (Copy)';
    updated[flowIndex].steps.splice(stepIndex + 1, 0, stepToCopy);
    updateConfig(updated);
  };

  const FlowForm = ({ flow, onSave, onCancel, isNew = false }) => {
    const [formData, setFormData] = useState(flow);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim()) return;
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="form-row">
          <div>
            <label className="form-label">Flow Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Authentication Flow"
              required
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
            placeholder="Describe the purpose of this multi-step flow"
          />
        </div>

        <div className="form-row">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`parallel-flow-${isNew ? 'new' : 'edit'}`}
              className="mr-2"
              checked={formData.parallel}
              onChange={(e) => setFormData({ ...formData, parallel: e.target.checked })}
            />
            <label htmlFor={`parallel-flow-${isNew ? 'new' : 'edit'}`} className="text-sm text-gray-700">
              Run steps in parallel
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`continue-${isNew ? 'new' : 'edit'}`}
              className="mr-2"
              checked={formData.continue_on_failure}
              onChange={(e) => setFormData({ ...formData, continue_on_failure: e.target.checked })}
            />
            <label htmlFor={`continue-${isNew ? 'new' : 'edit'}`} className="text-sm text-gray-700">
              Continue on failure
            </label>
          </div>
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="btn-primary flex items-center">
            <FiCheck className="mr-2" />
            {isNew ? 'Add Flow' : 'Save Flow'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary flex items-center">
            <FiX className="mr-2" />
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const StepForm = ({ step, onSave, onCancel, flowName }) => {
    const [formData, setFormData] = useState({
      ...step,
      request_modifications: {
        headers: {
          'X-Custom-Check': flowName.replace(/\s+/g, '') + 'Flow',
          ...step.request_modifications?.headers
        },
        ...step.request_modifications
      }
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name.trim() || !formData.raw_request.trim()) return;
      onSave(formData);
    };

    const handleStatusChange = (value) => {
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

    const addValidation = () => {
      const newValidation = {
        type: 'contains',
        target: 'body',
        value: '',
        message: ''
      };
      setFormData({
        ...formData,
        validations: [...(formData.validations || []), newValidation]
      });
    };

    const updateValidation = (index, field, value) => {
      const updated = [...(formData.validations || [])];
      updated[index] = { ...updated[index], [field]: value };
      setFormData({ ...formData, validations: updated });
    };

    const deleteValidation = (index) => {
      const updated = (formData.validations || []).filter((_, i) => i !== index);
      setFormData({ ...formData, validations: updated });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 border border-blue-300 rounded-lg p-4 bg-blue-50">
        <div className="form-row">
          <div>
            <label className="form-label">Step Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Login Request"
              required
            />
          </div>
          <div>
            <label className="form-label">Raw Request File *</label>
            <input
              type="text"
              className="form-input"
              value={formData.raw_request}
              onChange={(e) => setFormData({ ...formData, raw_request: e.target.value })}
              placeholder="e.g., auth/login.txt"
              required
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
            placeholder="What does this step accomplish?"
          />
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">Expected Status</label>
            <input
              type="text"
              className="form-input"
              value={getStatusDisplay()}
              onChange={(e) => handleStatusChange(e.target.value)}
              placeholder="200 or 200,302"
            />
          </div>
          <div>
            <label className="form-label">Delay (seconds)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              step="0.1"
              value={formData.delay || 0}
              onChange={(e) => setFormData({ ...formData, delay: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Data Extraction */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Data Extraction</h4>
          <div className="text-sm text-gray-600 mb-2">
            Extract data from this step's response to use in subsequent steps
          </div>
          <textarea
            className="form-input font-mono text-sm"
            rows={3}
            value={JSON.stringify(formData.extract || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setFormData({ ...formData, extract: parsed });
              } catch (err) {
                // Invalid JSON, don't update
              }
            }}
            placeholder={`{
  "json": {
    "token": "access_token",
    "user_id": "user.id"
  },
  "header": {
    "session_id": "Set-Cookie"
  }
}`}
          />
        </div>

        {/* Validations */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">Response Validations</h4>
            <button
              type="button"
              onClick={addValidation}
              className="btn-secondary text-sm flex items-center"
            >
              <FiPlus className="mr-1" />
              Add Validation
            </button>
          </div>

          {(formData.validations || []).map((validation, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2 p-2 bg-white rounded border">
              <select
                className="form-input text-sm flex-shrink-0 w-24"
                value={validation.type}
                onChange={(e) => updateValidation(index, 'type', e.target.value)}
              >
                <option value="contains">Contains</option>
                <option value="not_contains">Not Contains</option>
                <option value="regex">Regex</option>
                <option value="status_code">Status Code</option>
              </select>
              <select
                className="form-input text-sm flex-shrink-0 w-20"
                value={validation.target}
                onChange={(e) => updateValidation(index, 'target', e.target.value)}
              >
                <option value="body">Body</option>
                <option value="headers">Headers</option>
                <option value="status">Status</option>
              </select>
              <input
                type="text"
                className="form-input text-sm flex-1"
                value={validation.value}
                onChange={(e) => updateValidation(index, 'value', e.target.value)}
                placeholder="Value to check"
              />
              <button
                type="button"
                onClick={() => deleteValidation(index)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="btn-primary flex items-center">
            <FiCheck className="mr-2" />
            Save Step
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
            <h2 className="text-xl font-semibold text-gray-800">Flows</h2>
          </div>
          <span className="text-sm text-gray-500">
            {(config || []).length} flow{(config || []).length !== 1 ? 's' : ''}
          </span>
        </div>

        <p className="text-gray-600 mb-4">
          Configure multi-step test flows where data from one step can be used in subsequent steps.
        </p>

        {/* Add New Flow */}
        <FlowForm
          flow={newFlow}
          onSave={(flow) => addFlow()}
          onCancel={() => setNewFlow({
            name: '',
            description: '',
            parallel: false,
            continue_on_failure: true,
            steps: []
          })}
          isNew={true}
        />
      </div>

      {/* Existing Flows */}
      {(config || []).length > 0 && (
        <div className="space-y-6">
          {(config || []).map((flow, flowIndex) => (
            <div key={flowIndex} className="form-section">
              {editingFlowIndex === flowIndex ? (
                <FlowForm
                  flow={flow}
                  onSave={(updatedFlow) => updateFlow(flowIndex, updatedFlow)}
                  onCancel={() => setEditingFlowIndex(-1)}
                />
              ) : (
                <>
                  {/* Flow Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{flow.name}</h3>
                        <div className="ml-4 flex space-x-2">
                          {flow.parallel && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Parallel Steps
                            </span>
                          )}
                          {flow.continue_on_failure && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Continue on Failure
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600">{flow.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {flow.steps.length} step{flow.steps.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingFlowIndex(flowIndex)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit flow"
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() => deleteFlow(flowIndex)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete flow"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {/* Flow Steps */}
                  <div className="space-y-3">
                    {flow.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="relative">
                        {/* Step Connection Arrow */}
                        {stepIndex > 0 && (
                          <div className="absolute -top-3 left-4 text-gray-400">
                            <FiArrowRight />
                          </div>
                        )}

                        {editingStepIndex === `${flowIndex}-${stepIndex}` ? (
                          <StepForm
                            step={step}
                            flowName={flow.name}
                            onSave={(updatedStep) => updateStep(flowIndex, stepIndex, updatedStep)}
                            onCancel={() => setEditingStepIndex(-1)}
                          />
                        ) : (
                          <div className="config-card bg-gray-50 border-l-4 border-blue-500">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">
                                    {stepIndex + 1}
                                  </span>
                                  <h4 className="font-semibold text-gray-800">{step.name}</h4>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>📄 {step.raw_request}</span>
                                  <span>
                                    📊 {Array.isArray(step.expected_status) 
                                      ? step.expected_status.join(', ') 
                                      : step.expected_status}
                                  </span>
                                  {step.delay > 0 && <span>⏱️ {step.delay}s</span>}
                                  {(step.validations || []).length > 0 && (
                                    <span>✅ {step.validations.length} validation{step.validations.length !== 1 ? 's' : ''}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-1 ml-4">
                                <button
                                  onClick={() => duplicateStep(flowIndex, stepIndex)}
                                  className="text-gray-600 hover:text-gray-800 p-1"
                                  title="Duplicate step"
                                >
                                  <FiCopy size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingStepIndex(`${flowIndex}-${stepIndex}`)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="Edit step"
                                >
                                  <FiEdit3 size={14} />
                                </button>
                                <button
                                  onClick={() => deleteStep(flowIndex, stepIndex)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Delete step"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add Step Button */}
                    <button
                      onClick={() => addStepToFlow(flowIndex)}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-4 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <FiPlus className="mx-auto mb-2" size={20} />
                      Add Step to Flow
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-green-800 font-semibold mb-2">🔄 Flow Data Chaining</h3>
        <div className="text-green-700 text-sm space-y-2">
          <p>Use the <strong>extract</strong> section to capture data from responses:</p>
          <pre className="bg-white p-2 rounded text-xs overflow-x-auto">{`{
  "json": { "token": "access_token" },
  "header": { "session": "Set-Cookie" }
}`}</pre>
          <p>Then reference extracted data in subsequent steps using <code>{`{token}`}</code> or <code>{`{session}`}</code></p>
        </div>
      </div>
    </div>
  );
};

export default FlowsConfig;

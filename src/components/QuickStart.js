import React from 'react';
import { FiZap, FiTarget, FiShield, FiGlobe } from 'react-icons/fi';
import { generateExampleConfig } from '../utils/configGenerator';

const QuickStart = ({ onLoadTemplate }) => {
  const templates = [
    {
      id: 'basic',
      name: 'Basic Security Test',
      description: 'Simple connectivity and basic security checks',
      icon: FiZap,
      color: 'blue',
      features: ['Basic connectivity test', 'Simple request validation', 'HTML reporting']
    },
    {
      id: 'advanced',
      name: 'Advanced Pentest',
      description: 'Comprehensive security assessment with flows and modules',
      icon: FiShield,
      color: 'purple',
      features: ['Multi-step flows', 'Test case modules', 'Proxy integration', 'Data extraction']
    },
    {
      id: 'api',
      name: 'API Security Test',
      description: 'REST API security testing configuration',
      icon: FiTarget,
      color: 'green',
      features: ['API endpoint testing', 'Authentication flows', 'Parameter validation', 'Rate limiting tests']
    },
    {
      id: 'webapp',
      name: 'Web Application Test',
      description: 'Full web application security assessment',
      icon: FiGlobe,
      color: 'orange',
      features: ['SQL injection tests', 'XSS detection', 'Authentication bypass', 'Session management']
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-800',
      purple: 'border-purple-500 bg-purple-50 hover:bg-purple-100 text-purple-800',
      green: 'border-green-500 bg-green-50 hover:bg-green-100 text-green-800',
      orange: 'border-orange-500 bg-orange-50 hover:bg-orange-100 text-orange-800'
    };
    return colors[color] || colors.blue;
  };

  const loadTemplate = (templateId) => {
    const template = generateExampleConfig(templateId);
    onLoadTemplate(template);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🚀 Quick Start Templates
        </h2>
        <p className="text-lg text-gray-600">
          Jump-start your security testing with pre-configured templates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => {
          const IconComponent = template.icon;
          
          return (
            <button
              key={template.id}
              onClick={() => loadTemplate(template.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg transform hover:-translate-y-1 ${getColorClasses(template.color)}`}
            >
              <div className="flex items-start mb-4">
                <div className="p-3 rounded-lg bg-white shadow-sm mr-4">
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm opacity-80">{template.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {template.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-current mr-3 opacity-60"></div>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                <span className="text-sm font-medium">
                  Click to load template →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💡 Pro Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Start Simple:</strong> Begin with the Basic template and add complexity as needed
            </div>
            <div>
              <strong>Use Proxy:</strong> Configure Burp Suite or ZAP proxy for manual verification
            </div>
            <div>
              <strong>Test Modules:</strong> Enable pre-built modules for common vulnerabilities
            </div>
            <div>
              <strong>Flow Chaining:</strong> Use flows to chain requests and pass data between steps
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;

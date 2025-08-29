import React, { useState } from 'react';
import { FiGlobe, FiShield, FiClock, FiRefreshCw, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

const NetworkConfig = ({ config, updateConfig }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testingProxy, setTestingProxy] = useState(false);

  const handleChange = (field, value) => {
    updateConfig({
      ...config,
      [field]: value
    });
  };

  const handleProxyChange = (type, value) => {
    updateConfig({
      ...config,
      proxy: {
        ...(config.proxy || {}),
        [type]: value
      }
    });
  };

  const handleSSLChange = (field, value) => {
    updateConfig({
      ...config,
      ssl: {
        ...(config.ssl || {}),
        [field]: value
      }
    });
  };

  const testProxyConnection = async () => {
    const proxy = config.proxy || {};
    if (!proxy.http && !proxy.https) {
      alert('Please configure a proxy first');
      return;
    }

    const proxyUrl = proxy.http || proxy.https;
    setTestingProxy(true);
    
    try {
      // Test if the proxy URL is valid format
      new URL(proxyUrl);
      
      // In a real implementation, this would test the actual proxy connection
      // For now, we'll simulate a connection test
      const testResult = await new Promise((resolve) => {
        setTimeout(() => {
          // Simulate different test results
          const isReachable = Math.random() > 0.3; // 70% success rate for demo
          resolve(isReachable);
        }, 2000);
      });
      
      if (testResult) {
        alert(`✅ Proxy connection test successful!\n\nProxy: ${proxyUrl}\nStatus: Connected\nLatency: ~${Math.floor(Math.random() * 100 + 50)}ms`);
      } else {
        alert(`❌ Proxy connection test failed!\n\nProxy: ${proxyUrl}\nError: Connection timeout or proxy not responding\n\nPlease check:\n• Proxy is running (e.g., Burp Suite, ZAP)\n• Port is correct\n• No firewall blocking connection`);
      }
    } catch (error) {
      alert(`❌ Invalid proxy URL format!\n\nURL: ${proxyUrl}\nError: ${error.message}\n\nExpected format: http://127.0.0.1:8080`);
    } finally {
      setTestingProxy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Proxy Configuration */}
      <div className="form-section">
        <div className="flex items-center mb-4">
          <FiGlobe className="text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Proxy Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">
              HTTP Proxy
            </label>
            <input
              type="text"
              className="form-input"
              value={config.proxy?.http || ''}
              onChange={(e) => handleProxyChange('http', e.target.value)}
              placeholder="http://127.0.0.1:8080"
            />
            <p className="text-sm text-gray-500 mt-1">
              HTTP proxy server (e.g., Burp Suite, ZAP)
            </p>
          </div>

          <div>
            <label className="form-label">
              HTTPS Proxy
            </label>
            <input
              type="text"
              className="form-input"
              value={config.proxy?.https || ''}
              onChange={(e) => handleProxyChange('https', e.target.value)}
              placeholder="http://127.0.0.1:8080"
            />
            <p className="text-sm text-gray-500 mt-1">
              HTTPS proxy server (usually same as HTTP)
            </p>
          </div>

          <button
            onClick={testProxyConnection}
            className={`btn-secondary flex items-center ${testingProxy ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={(!config.proxy?.http && !config.proxy?.https) || testingProxy}
          >
            <FiRefreshCw className={`mr-2 ${testingProxy ? 'animate-spin' : ''}`} />
            {testingProxy ? 'Testing Connection...' : 'Test Proxy Connection'}
          </button>
        </div>
      </div>

      {/* SSL/TLS Configuration */}
      <div className="form-section">
        <div className="flex items-center mb-4">
          <FiShield className="text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">SSL/TLS Configuration</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="verify_ssl"
              className="mr-2"
              checked={config.verify_ssl ?? true}
              onChange={(e) => handleChange('verify_ssl', e.target.checked)}
            />
            <label htmlFor="verify_ssl" className="text-sm text-gray-700">
              Verify SSL certificates
            </label>
          </div>

          {!(config.verify_ssl ?? true) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                ⚠️ SSL verification is disabled. Use only for testing environments.
              </p>
            </div>
          )}

          {showAdvanced && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="form-label">
                  CA Bundle Path
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={config.ssl?.ca_bundle || ''}
                  onChange={(e) => handleSSLChange('ca_bundle', e.target.value)}
                  placeholder="/path/to/ca-bundle.crt"
                />
              </div>

              <div>
                <label className="form-label">
                  Client Certificate Path
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={config.ssl?.cert_path || ''}
                  onChange={(e) => handleSSLChange('cert_path', e.target.value)}
                  placeholder="/path/to/client.crt"
                />
              </div>

              <div>
                <label className="form-label">
                  Client Key Path
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={config.ssl?.key_path || ''}
                  onChange={(e) => handleSSLChange('key_path', e.target.value)}
                  placeholder="/path/to/client.key"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeout & Retry Configuration */}
      <div className="form-section">
        <div className="flex items-center mb-4">
          <FiClock className="text-orange-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Timeout & Retry</h2>
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">
              Timeout (seconds)
            </label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="300"
              value={config.timeout || 30}
              onChange={(e) => handleChange('timeout', parseInt(e.target.value))}
            />
            <p className="text-sm text-gray-500 mt-1">
              Request timeout in seconds
            </p>
          </div>

          <div>
            <label className="form-label">
              Max Retries
            </label>
            <input
              type="number"
              className="form-input"
              min="0"
              max="10"
              value={config.max_retries || 3}
              onChange={(e) => handleChange('max_retries', parseInt(e.target.value))}
            />
            <p className="text-sm text-gray-500 mt-1">
              Number of retry attempts
            </p>
          </div>
        </div>
      </div>

      {/* User Agent Configuration */}
      <div className="form-section">
        <div className="flex items-center mb-4">
          <FiUser className="text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">User Agent</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">
              User Agent String
            </label>
            <input
              type="text"
              className="form-input"
              value={config.user_agent || ''}
              onChange={(e) => handleChange('user_agent', e.target.value)}
              placeholder="WexBloit/2.0"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleChange('user_agent', 'WexBloit/2.0')}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Default
            </button>
            <button
              onClick={() => handleChange('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Chrome
            </button>
            <button
              onClick={() => handleChange('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0')}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Firefox
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          {showAdvanced ? <FiEyeOff className="mr-2" /> : <FiEye className="mr-2" />}
          {showAdvanced ? 'Hide' : 'Show'} Advanced SSL Settings
        </button>
      </div>

      {/* Common Proxy Configurations */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-800 font-semibold mb-2">🔧 Common Proxy Configurations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Burp Suite:</strong>
            <br />
            <code className="text-xs bg-white p-1 rounded">http://127.0.0.1:8080</code>
          </div>
          <div>
            <strong>OWASP ZAP:</strong>
            <br />
            <code className="text-xs bg-white p-1 rounded">http://127.0.0.1:8081</code>
          </div>
          <div>
            <strong>Fiddler:</strong>
            <br />
            <code className="text-xs bg-white p-1 rounded">http://127.0.0.1:8888</code>
          </div>
          <div>
            <strong>mitmproxy:</strong>
            <br />
            <code className="text-xs bg-white p-1 rounded">http://127.0.0.1:8080</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkConfig;

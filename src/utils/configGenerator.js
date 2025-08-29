import yaml from 'js-yaml';

/**
 * Generate YAML configuration from the form data
 */
export const generateYAMLConfig = (config) => {
  try {
    // Clean up the configuration object
    const cleanConfig = cleanConfigObject(config);
    
    // Generate YAML with custom formatting
    const yamlContent = yaml.dump(cleanConfig, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
      quotingType: '"',
      forceQuotes: false
    });

    return yamlContent;
  } catch (error) {
    throw new Error(`Failed to generate YAML: ${error.message}`);
  }
};

/**
 * Clean up configuration object by removing empty values and formatting correctly
 */
const cleanConfigObject = (config) => {
  const cleaned = {};

  // Project section
  if (config.project) {
    cleaned.project = {
      name: config.project.name,
      ...(config.project.description && { description: config.project.description }),
      ...(config.project.version && { version: config.project.version })
    };
  }

  // Network section
  if (config.network) {
    const network = {};
    
    // Proxy configuration
    if (config.network.proxy && (config.network.proxy.http || config.network.proxy.https)) {
      network.proxy = {};
      if (config.network.proxy.http) network.proxy.http = config.network.proxy.http;
      if (config.network.proxy.https) network.proxy.https = config.network.proxy.https;
    }

    // SSL configuration
    if (config.network.ssl) {
      network.ssl = {
        verify_ssl: config.network.verify_ssl !== undefined ? config.network.verify_ssl : true,
        ...(config.network.ssl.ca_bundle && { ca_bundle: config.network.ssl.ca_bundle }),
        ...(config.network.ssl.cert_path && { cert_path: config.network.ssl.cert_path }),
        ...(config.network.ssl.key_path && { key_path: config.network.ssl.key_path })
      };
    } else {
      network.verify_ssl = config.network.verify_ssl !== undefined ? config.network.verify_ssl : true;
    }

    // Other network settings
    if (config.network.timeout) network.timeout = config.network.timeout;
    if (config.network.max_retries !== undefined) network.max_retries = config.network.max_retries;
    if (config.network.user_agent) network.user_agent = config.network.user_agent;

    if (Object.keys(network).length > 0) {
      cleaned.network = network;
    }
  }

  // Tests section
  if (config.tests) {
    const tests = {};

    // Test cases
    if (config.tests.test_cases && config.tests.test_cases.length > 0) {
      tests.test_cases = config.tests.test_cases.map(testCase => {
        const cleaned = {
          name: testCase.name,
          ...(testCase.description && { description: testCase.description }),
          ...(testCase.raw_request && { raw_request: testCase.raw_request }),
          ...(testCase.expected_status !== undefined && { expected_status: testCase.expected_status }),
          ...(testCase.parallel && { parallel: testCase.parallel }),
          ...(testCase.test_case_module && { test_case_module: testCase.test_case_module }),
          ...(testCase.config && Object.keys(testCase.config).length > 0 && { config: testCase.config })
        };
        return cleaned;
      });
    }

    // Flows
    if (config.tests.flows && config.tests.flows.length > 0) {
      tests.flows = config.tests.flows.map(flow => {
        const cleanedFlow = {
          name: flow.name,
          ...(flow.description && { description: flow.description }),
          ...(flow.parallel && { parallel: flow.parallel }),
          ...(flow.continue_on_failure !== undefined && { continue_on_failure: flow.continue_on_failure })
        };

        if (flow.steps && flow.steps.length > 0) {
          cleanedFlow.steps = flow.steps.map(step => {
            const cleanedStep = {
              name: step.name,
              ...(step.description && { description: step.description }),
              raw_request: step.raw_request,
              ...(step.expected_status !== undefined && { expected_status: step.expected_status }),
              ...(step.delay && step.delay > 0 && { delay: step.delay })
            };

            // Request modifications
            if (step.request_modifications && Object.keys(step.request_modifications).length > 0) {
              cleanedStep.request_modifications = cleanRequestModifications(step.request_modifications);
            }

            // Data extraction
            if (step.extract && Object.keys(step.extract).length > 0) {
              cleanedStep.extract = step.extract;
            }

            // Validations
            if (step.validations && step.validations.length > 0) {
              cleanedStep.validations = step.validations.filter(validation => 
                validation.type && validation.target && validation.value
              );
            }

            return cleanedStep;
          });
        }

        return cleanedFlow;
      });
    }

    if (Object.keys(tests).length > 0) {
      cleaned.tests = tests;
    }
  }

  // Test case modules
  if (config.test_case_modules) {
    const modules = {};
    
    if (config.test_case_modules.enabled && config.test_case_modules.enabled.length > 0) {
      modules.enabled = config.test_case_modules.enabled;
    }

    if (config.test_case_modules.global_config && Object.keys(config.test_case_modules.global_config).length > 0) {
      modules.global_config = config.test_case_modules.global_config;
    }

    if (Object.keys(modules).length > 0) {
      cleaned.test_case_modules = modules;
    }
  }

  // Extensions
  if (config.extensions) {
    const extensions = {};
    
    if (config.extensions.enabled && config.extensions.enabled.length > 0) {
      extensions.enabled = config.extensions.enabled;
    }

    if (config.extensions.config && Object.keys(config.extensions.config).length > 0) {
      extensions.config = config.extensions.config;
    }

    if (Object.keys(extensions).length > 0) {
      cleaned.extensions = extensions;
    }
  }

  // Execution settings
  if (config.execution) {
    const execution = {};
    if (config.execution.max_parallel_flows) execution.max_parallel_flows = config.execution.max_parallel_flows;
    if (config.execution.default_delay !== undefined) execution.default_delay = config.execution.default_delay;
    
    if (Object.keys(execution).length > 0) {
      cleaned.execution = execution;
    }
  }

  // File paths and output
  if (config.raw_requests_path) {
    cleaned.raw_requests_path = config.raw_requests_path;
  }

  if (config.output) {
    const output = {};
    if (config.output.format) output.format = config.output.format;
    if (config.output.path) output.path = config.output.path;
    if (config.output.verbose !== undefined) output.verbose = config.output.verbose;
    
    if (Object.keys(output).length > 0) {
      cleaned.output = output;
    }
  }

  return cleaned;
};

/**
 * Clean request modifications object
 */
const cleanRequestModifications = (mods) => {
  const cleaned = {};

  if (mods.url) cleaned.url = mods.url;
  if (mods.method) cleaned.method = mods.method;
  
  if (mods.headers && Object.keys(mods.headers).length > 0) {
    cleaned.headers = mods.headers;
  }
  
  if (mods.cookies && Object.keys(mods.cookies).length > 0) {
    cleaned.cookies = mods.cookies;
  }
  
  if (mods.params && Object.keys(mods.params).length > 0) {
    cleaned.params = mods.params;
  }
  
  if (mods.body && Object.keys(mods.body).length > 0) {
    cleaned.body = mods.body;
  }

  return cleaned;
};

/**
 * Validate configuration object
 */
export const validateConfig = (config) => {
  const errors = [];

  // Validate project section
  if (!config.project || !config.project.name || !config.project.name.trim()) {
    errors.push('Project name is required');
  }

  // Validate network timeouts
  if (config.network) {
    if (config.network.timeout && (config.network.timeout < 1 || config.network.timeout > 300)) {
      errors.push('Network timeout must be between 1 and 300 seconds');
    }
    if (config.network.max_retries && (config.network.max_retries < 0 || config.network.max_retries > 10)) {
      errors.push('Max retries must be between 0 and 10');
    }
  }

  // Validate test cases
  if (config.tests && config.tests.test_cases) {
    config.tests.test_cases.forEach((testCase, index) => {
      if (!testCase.name || !testCase.name.trim()) {
        errors.push(`Test case ${index + 1}: Name is required`);
      }
      if (!testCase.raw_request || !testCase.raw_request.trim()) {
        errors.push(`Test case ${index + 1}: Raw request file is required`);
      }
    });
  }

  // Validate flows
  if (config.tests && config.tests.flows) {
    config.tests.flows.forEach((flow, flowIndex) => {
      if (!flow.name || !flow.name.trim()) {
        errors.push(`Flow ${flowIndex + 1}: Name is required`);
      }
      if (!flow.steps || flow.steps.length === 0) {
        errors.push(`Flow ${flowIndex + 1}: At least one step is required`);
      } else {
        flow.steps.forEach((step, stepIndex) => {
          if (!step.name || !step.name.trim()) {
            errors.push(`Flow ${flowIndex + 1}, Step ${stepIndex + 1}: Name is required`);
          }
          if (!step.raw_request || !step.raw_request.trim()) {
            errors.push(`Flow ${flowIndex + 1}, Step ${stepIndex + 1}: Raw request file is required`);
          }
        });
      }
    });
  }

  // Validate execution settings
  if (config.execution) {
    if (config.execution.max_parallel_flows && (config.execution.max_parallel_flows < 1 || config.execution.max_parallel_flows > 10)) {
      errors.push('Max parallel flows must be between 1 and 10');
    }
    if (config.execution.default_delay && config.execution.default_delay < 0) {
      errors.push('Default delay cannot be negative');
    }
  }

  // Validate that we have at least some tests configured
  const hasTestCases = config.tests && config.tests.test_cases && config.tests.test_cases.length > 0;
  const hasFlows = config.tests && config.tests.flows && config.tests.flows.length > 0;
  const hasModules = config.test_case_modules && config.test_case_modules.enabled && config.test_case_modules.enabled.length > 0;

  if (!hasTestCases && !hasFlows && !hasModules) {
    errors.push('At least one test case, flow, or test module must be configured');
  }

  return errors;
};

/**
 * Generate example configurations
 */
export const generateExampleConfig = (type = 'basic') => {
  const examples = {
    basic: {
      project: {
        name: 'Basic Web Security Test',
        description: 'Simple security assessment',
        version: '1.0.0'
      },
      network: {
        timeout: 30,
        max_retries: 3,
        verify_ssl: true,
        user_agent: 'WexBloit/2.0'
      },
      tests: {
        test_cases: [
          {
            name: 'Basic Connectivity Test',
            description: 'Test basic connectivity to target',
            raw_request: 'basic_get.txt',
            expected_status: 200
          }
        ]
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
        max_parallel_flows: 1,
        default_delay: 0
      },
      raw_requests_path: './requests',
      output: {
        format: 'html',
        path: './reports',
        verbose: true
      }
    },
    
    advanced: {
      project: {
        name: 'Advanced Pentest Assessment',
        description: 'Comprehensive web application security testing',
        version: '1.0.0'
      },
      network: {
        proxy: {
          http: 'http://127.0.0.1:8080',
          https: 'http://127.0.0.1:8080'
        },
        timeout: 30,
        max_retries: 3,
        verify_ssl: false,
        user_agent: 'WexBloit/2.0'
      },
      tests: {
        flows: [
          {
            name: 'Authentication Flow',
            description: 'Multi-step authentication testing',
            continue_on_failure: true,
            steps: [
              {
                name: 'Get Login Page',
                raw_request: 'auth/login_page.txt',
                expected_status: 200,
                extract: {
                  body: {
                    csrf_token: 'csrf_token'
                  }
                }
              },
              {
                name: 'Submit Login',
                raw_request: 'auth/login_submit.txt',
                expected_status: 302,
                request_modifications: {
                  body: {
                    username: 'admin',
                    password: 'password',
                    csrf_token: '{csrf_token}'
                  }
                }
              }
            ]
          }
        ]
      },
      test_case_modules: {
        enabled: ['SQLInjectionTestCase', 'XSSTestCase', 'SecurityHeadersTestCase'],
        global_config: {
          base_url: 'https://example.com',
          username: 'testuser',
          password: 'testpass'
        }
      },
      extensions: {
        enabled: ['auth', 'headers', 'logging']
      },
      execution: {
        max_parallel_flows: 3,
        default_delay: 0.5
      },
      raw_requests_path: './requests',
      output: {
        format: 'html',
        path: './reports',
        verbose: true
      }
    },
    
    api: {
      project: {
        name: 'API Security Assessment',
        description: 'REST API security testing configuration',
        version: '1.0.0'
      },
      network: {
        timeout: 45,
        max_retries: 3,
        verify_ssl: true,
        user_agent: 'WexBloit-API/2.0'
      },
      tests: {
        flows: [
          {
            name: 'API Authentication Flow',
            description: 'Test API authentication and authorization',
            continue_on_failure: true,
            steps: [
              {
                name: 'Get API Token',
                raw_request: 'api/get_token.txt',
                expected_status: 200,
                extract: {
                  json: {
                    api_token: 'access_token'
                  }
                }
              },
              {
                name: 'Test Protected Endpoint',
                raw_request: 'api/protected_endpoint.txt',
                expected_status: 200,
                request_modifications: {
                  headers: {
                    'Authorization': 'Bearer {api_token}',
                    'X-Custom-Check': 'APISecurityFlow'
                  }
                }
              }
            ]
          }
        ]
      },
      test_case_modules: {
        enabled: ['APITestCase', 'SecurityHeadersTestCase'],
        global_config: {
          base_url: 'https://api.example.com',
          api_version: 'v1'
        }
      },
      extensions: {
        enabled: ['auth', 'headers'],
        config: {}
      },
      execution: {
        max_parallel_flows: 2,
        default_delay: 0.5
      },
      raw_requests_path: './requests',
      output: {
        format: 'html',
        path: './reports',
        verbose: true
      }
    },

    webapp: {
      project: {
        name: 'Web Application Security Test',
        description: 'Full web application security assessment',
        version: '1.0.0'
      },
      network: {
        proxy: {
          http: 'http://127.0.0.1:8080',
          https: 'http://127.0.0.1:8080'
        },
        timeout: 30,
        max_retries: 3,
        verify_ssl: false,
        user_agent: 'WexBloit-WebApp/2.0'
      },
      tests: {
        flows: [
          {
            name: 'Login and Session Testing',
            description: 'Test login functionality and session management',
            continue_on_failure: true,
            steps: [
              {
                name: 'Get Login Form',
                raw_request: 'webapp/login_form.txt',
                expected_status: 200,
                extract: {
                  body: {
                    csrf_token: 'csrf_token'
                  }
                }
              },
              {
                name: 'Submit Login',
                raw_request: 'webapp/login_submit.txt',
                expected_status: [200, 302],
                request_modifications: {
                  body: {
                    username: 'admin',
                    password: 'password',
                    csrf_token: '{csrf_token}'
                  },
                  headers: {
                    'X-Custom-Check': 'WebAppSecurityFlow'
                  }
                }
              }
            ]
          }
        ]
      },
      test_case_modules: {
        enabled: ['SQLInjectionTestCase', 'XSSTestCase', 'SecurityHeadersTestCase', 'LoginTestCase'],
        global_config: {
          base_url: 'https://webapp.example.com',
          username: 'testuser',
          password: 'testpass'
        }
      },
      extensions: {
        enabled: ['auth', 'headers', 'logging'],
        config: {}
      },
      execution: {
        max_parallel_flows: 3,
        default_delay: 1.0
      },
      raw_requests_path: './requests',
      output: {
        format: 'html',
        path: './reports',
        verbose: true
      }
    }
  };

  return examples[type] || examples.basic;
};

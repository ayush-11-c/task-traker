// Test configuration for different environments
export const testConfig = {
  // Database configuration
  database: {
    // Use in-memory MongoDB for tests
    useInMemoryDB: true,
    // Connection timeout
    connectionTimeout: 10000,
  },

  // JWT configuration for tests
  jwt: {
    secret: "test-jwt-secret-key-for-testing-purposes-only",
    expiresIn: "7d",
  },

  // Test timeouts
  timeouts: {
    default: 30000,
    integration: 60000,
    e2e: 120000,
  },

  // Mock configurations
  mocks: {
    // AI service responses
    aiService: {
      defaultResponse: {
        title: "Enhanced Test Task",
        description:
          "Enhanced test task description with professional formatting",
      },
      delay: 100, // Simulate AI processing delay
    },

    // External service configurations
    externalServices: {
      enabled: false, // Disable external services in tests
    },
  },

  // Test data
  testData: {
    users: {
      valid: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
      admin: {
        name: "Admin User",
        email: "admin@example.com",
        password: "adminpassword123",
      },
    },

    tasks: {
      valid: {
        title: "Test Task",
        description: "This is a test task description",
      },
      minimal: {
        title: "T",
        description: "D",
      },
      maxLength: {
        title: "A".repeat(99),
        description: "B".repeat(499),
      },
    },
  },

  // Coverage thresholds
  coverage: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Per-file thresholds
    perFile: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default testConfig;

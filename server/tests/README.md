# Task Tracker Test Suite

This directory contains comprehensive unit, integration, and end-to-end tests for the Task Tracker application.

## Test Structure

```
tests/
├── config/
│   └── testConfig.js          # Test configuration
├── utils/
│   └── testHelpers.js         # Test utilities and helpers
├── unit/                      # Unit tests
│   ├── authController.test.js # Authentication controller tests
│   ├── taskController.test.js # Task controller tests
│   ├── isAuth.test.js         # Authentication middleware tests
│   └── utility.test.js        # Utility functions tests
├── integration/               # Integration tests
│   ├── auth.test.js          # Authentication API tests
│   └── tasks.test.js         # Task management API tests
├── e2e/                      # End-to-end tests
│   └── app.test.js           # Full application flow tests
├── setup.js                  # Test setup and teardown
├── testRunner.js             # Custom test runner
└── README.md                 # This file
```

## Test Categories

### Unit Tests

- Test individual functions and components in isolation
- Mock external dependencies
- Fast execution
- High code coverage

### Integration Tests

- Test API endpoints with real database
- Test middleware integration
- Test request/response flow
- Use in-memory MongoDB

### End-to-End Tests

- Test complete user workflows
- Test multi-user scenarios
- Test error handling
- Test security features

## Running Tests

### Prerequisites

```bash
npm install
```

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Using the Custom Test Runner

```bash
# Run all tests
node tests/testRunner.js

# Run specific test suite
node tests/testRunner.js unit
node tests/testRunner.js integration
node tests/testRunner.js e2e

# Run with coverage
node tests/testRunner.js --coverage

# Run in watch mode
node tests/testRunner.js unit --watch

# Generate coverage report only
node tests/testRunner.js coverage

# Continue running tests even if some fail
node tests/testRunner.js --no-bail
```

## Test Coverage

The test suite aims for at least 80% code coverage across:

- Statements
- Branches
- Functions
- Lines

### Coverage Reports

- Text summary in terminal
- HTML report in `coverage/lcov-report/index.html`
- LCOV format for CI/CD integration

## Test Features

### Authentication Tests

- ✅ User registration with validation
- ✅ User login with credential verification
- ✅ JWT token generation and validation
- ✅ Password hashing and comparison
- ✅ Cookie-based authentication
- ✅ Logout functionality
- ✅ Protected route access
- ✅ Token expiration handling

### Task Management Tests

- ✅ Task creation with AI enhancement
- ✅ Task retrieval with user isolation
- ✅ Task updates with validation
- ✅ Task deletion with authorization
- ✅ Status management (pending, in-progress, completed)
- ✅ Input validation (title/description length)
- ✅ User-specific task filtering

### Security Tests

- ✅ Authentication middleware
- ✅ Authorization checks
- ✅ Data isolation between users
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Secure cookie settings

### Error Handling Tests

- ✅ Validation errors
- ✅ Authentication errors
- ✅ Authorization errors
- ✅ Database errors
- ✅ External service errors
- ✅ Malformed requests

## Test Data

### Test Users

```javascript
{
  validUser: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  invalidEmailUser: {
    name: 'Jane Doe',
    email: 'invalid-email',
    password: 'password123'
  },
  shortPasswordUser: {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: '123'
  }
}
```

### Test Tasks

```javascript
{
  validTask: {
    title: 'Test Task',
    description: 'This is a test task description'
  },
  longTitleTask: {
    title: 'A'.repeat(101), // 101 characters
    description: 'Valid description'
  },
  longDescriptionTask: {
    title: 'Valid Title',
    description: 'A'.repeat(501) // 501 characters
  }
}
```

## Mocking Strategy

### External Services

- **AI Service (Google GenAI)**: Mocked to return consistent responses
- **Database**: Uses MongoDB Memory Server for isolation
- **JWT**: Real implementation for integration tests, mocked for unit tests

### Mock Responses

```javascript
// AI Service Mock Response
{
  title: 'Enhanced Test Task',
  description: 'Enhanced test task description with professional formatting'
}
```

## Test Environment

### Database

- Uses MongoDB Memory Server for isolated testing
- Fresh database instance for each test suite
- Automatic cleanup after each test

### Environment Variables

```javascript
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key-for-testing-purposes-only
```

### Timeouts

- Unit tests: 30 seconds
- Integration tests: 60 seconds
- End-to-end tests: 120 seconds

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v1
```

## Best Practices

### Test Organization

- One test file per source file
- Descriptive test names
- Grouped related tests with `describe` blocks
- Clear setup and teardown

### Test Data

- Use factory functions for test data creation
- Avoid hardcoded IDs
- Clean up test data after each test

### Assertions

- Use specific matchers
- Test both success and error cases
- Verify side effects (database changes, etc.)

### Mocking

- Mock external dependencies
- Use real implementations for integration tests
- Reset mocks between tests

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**

   ```bash
   # Ensure MongoDB Memory Server is properly installed
   npm install --save-dev mongodb-memory-server
   ```

2. **Jest ES Module Issues**

   ```bash
   # Ensure proper Jest configuration for ES modules
   # Check jest.config.js settings
   ```

3. **Test Timeouts**

   ```bash
   # Increase timeout for slow tests
   jest.setTimeout(60000);
   ```

4. **Port Conflicts**
   ```bash
   # Tests use in-memory database, no port conflicts
   # If issues persist, check for running processes
   ```

### Debug Mode

```bash
# Run tests with debug output
DEBUG=* npm test

# Run specific test file
npx jest tests/unit/authController.test.js --verbose
```

## Contributing

### Adding New Tests

1. Follow existing naming conventions
2. Add appropriate setup/teardown
3. Include both positive and negative test cases
4. Update coverage thresholds if needed
5. Document any new test utilities

### Test Guidelines

- Write tests before implementing features (TDD)
- Aim for high coverage but focus on quality
- Test edge cases and error conditions
- Keep tests independent and isolated
- Use descriptive test names and comments

## Performance

### Test Execution Times

- Unit tests: ~10-30 seconds
- Integration tests: ~30-60 seconds
- End-to-end tests: ~60-120 seconds
- Full suite with coverage: ~3-5 minutes

### Optimization Tips

- Run unit tests first (fail fast)
- Use `--bail` to stop on first failure
- Parallelize test execution when possible
- Mock expensive operations in unit tests

#!/usr/bin/env node

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test runner configuration
const testSuites = {
  unit: {
    name: "Unit Tests",
    pattern: "tests/unit/**/*.test.js",
    timeout: 30000,
  },
  integration: {
    name: "Integration Tests",
    pattern: "tests/integration/**/*.test.js",
    timeout: 60000,
  },
  e2e: {
    name: "End-to-End Tests",
    pattern: "tests/e2e/**/*.test.js",
    timeout: 120000,
  },
};

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader(text) {
  console.log("\n" + "=".repeat(60));
  console.log(colorize(text, "cyan"));
  console.log("=".repeat(60));
}

function printSubHeader(text) {
  console.log("\n" + colorize(text, "yellow"));
  console.log("-".repeat(40));
}

async function runTestSuite(suiteName, options = {}) {
  const suite = testSuites[suiteName];
  if (!suite) {
    console.error(colorize(`Unknown test suite: ${suiteName}`, "red"));
    return false;
  }

  printSubHeader(`Running ${suite.name}`);

  const jestArgs = [
    suite.pattern,
    "--testTimeout",
    suite.timeout.toString(),
    "--verbose",
  ];

  if (options.coverage) {
    jestArgs.push("--coverage");
  }

  if (options.watch) {
    jestArgs.push("--watch");
  }

  if (options.bail) {
    jestArgs.push("--bail");
  }

  return new Promise((resolve) => {
    const jest = spawn("npx", ["jest", ...jestArgs], {
      stdio: "inherit",
      cwd: path.resolve(__dirname, ".."),
    });

    jest.on("close", (code) => {
      if (code === 0) {
        console.log(colorize(`✅ ${suite.name} passed!`, "green"));
        resolve(true);
      } else {
        console.log(colorize(`❌ ${suite.name} failed!`, "red"));
        resolve(false);
      }
    });

    jest.on("error", (error) => {
      console.error(
        colorize(`Error running ${suite.name}: ${error.message}`, "red")
      );
      resolve(false);
    });
  });
}

async function runAllTests(options = {}) {
  printHeader("Task Tracker Test Suite");

  const results = {
    unit: false,
    integration: false,
    e2e: false,
  };

  // Run unit tests first
  results.unit = await runTestSuite("unit", options);

  // Only run integration tests if unit tests pass (unless --no-bail is specified)
  if (results.unit || options.noBail) {
    results.integration = await runTestSuite("integration", options);
  } else {
    console.log(
      colorize(
        "⏭️  Skipping integration tests due to unit test failures",
        "yellow"
      )
    );
  }

  // Only run e2e tests if previous tests pass (unless --no-bail is specified)
  if ((results.unit && results.integration) || options.noBail) {
    results.e2e = await runTestSuite("e2e", options);
  } else {
    console.log(
      colorize("⏭️  Skipping e2e tests due to previous test failures", "yellow")
    );
  }

  // Print summary
  printHeader("Test Results Summary");

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  console.log(
    `Unit Tests: ${
      results.unit
        ? colorize("✅ PASSED", "green")
        : colorize("❌ FAILED", "red")
    }`
  );
  console.log(
    `Integration Tests: ${
      results.integration
        ? colorize("✅ PASSED", "green")
        : colorize("❌ FAILED", "red")
    }`
  );
  console.log(
    `E2E Tests: ${
      results.e2e
        ? colorize("✅ PASSED", "green")
        : colorize("❌ FAILED", "red")
    }`
  );

  console.log(`\nOverall: ${passed}/${total} test suites passed`);

  if (passed === total) {
    console.log(colorize("🎉 All tests passed!", "green"));
    return true;
  } else {
    console.log(colorize("💥 Some tests failed!", "red"));
    return false;
  }
}

async function runCoverageReport() {
  printHeader("Generating Coverage Report");

  const jestArgs = [
    "--coverage",
    "--coverageReporters=text",
    "--coverageReporters=lcov",
    "--coverageReporters=html",
    "--coverageDirectory=coverage",
  ];

  return new Promise((resolve) => {
    const jest = spawn("npx", ["jest", ...jestArgs], {
      stdio: "inherit",
      cwd: path.resolve(__dirname, ".."),
    });

    jest.on("close", (code) => {
      if (code === 0) {
        console.log(
          colorize("✅ Coverage report generated successfully!", "green")
        );
        console.log(
          colorize(
            "📊 Open coverage/lcov-report/index.html to view detailed report",
            "blue"
          )
        );
        resolve(true);
      } else {
        console.log(colorize("❌ Failed to generate coverage report!", "red"));
        resolve(false);
      }
    });
  });
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  coverage: args.includes("--coverage"),
  watch: args.includes("--watch"),
  bail: !args.includes("--no-bail"),
  noBail: args.includes("--no-bail"),
};

// Main execution
async function main() {
  try {
    if (args.includes("--help") || args.includes("-h")) {
      console.log(`
${colorize("Task Tracker Test Runner", "cyan")}

Usage: node testRunner.js [options] [suite]

Options:
  --coverage     Generate coverage report
  --watch        Run tests in watch mode
  --no-bail      Continue running tests even if some fail
  --help, -h     Show this help message

Test Suites:
  unit           Run only unit tests
  integration    Run only integration tests
  e2e            Run only end-to-end tests
  coverage       Generate coverage report only
  (no suite)     Run all test suites

Examples:
  node testRunner.js                    # Run all tests
  node testRunner.js unit               # Run only unit tests
  node testRunner.js --coverage         # Run all tests with coverage
  node testRunner.js unit --watch       # Run unit tests in watch mode
  node testRunner.js coverage           # Generate coverage report only
      `);
      return;
    }

    const suite = args.find((arg) => !arg.startsWith("--"));

    if (suite === "coverage") {
      await runCoverageReport();
    } else if (suite && testSuites[suite]) {
      await runTestSuite(suite, options);
    } else if (!suite) {
      const success = await runAllTests(options);

      if (options.coverage) {
        await runCoverageReport();
      }

      process.exit(success ? 0 : 1);
    } else {
      console.error(colorize(`Unknown test suite: ${suite}`, "red"));
      console.log("Available suites: unit, integration, e2e, coverage");
      process.exit(1);
    }
  } catch (error) {
    console.error(colorize(`Error: ${error.message}`, "red"));
    process.exit(1);
  }
}

main();

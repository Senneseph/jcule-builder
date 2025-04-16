#!/bin/bash

# CICADA Testing Script
# Self-Contained Integrated Continuous Automatic Development, Testing, and Deployment Approach

# Default test type is all
TEST_TYPE=${1:-all}

echo "=========================================================="
echo "  CICADA Testing Process"
echo "  Self-Contained Integrated Continuous Automatic"
echo "  Development, Testing, and Deployment Approach"
echo "=========================================================="
echo ""
echo "Running $TEST_TYPE tests..."
echo ""

# Check if running in the correct directory
if [ ! -d "./cicada" ]; then
  echo "Error: This script must be run from the project root directory."
  echo "Please navigate to the project root and run: ./cicada/test/run-tests.sh [test-type]"
  exit 1
fi

# Check if app directory exists
if [ ! -d "./app" ]; then
  echo "Error: App directory not found."
  echo "Please run the initialization script first: ./cicada/init/init.sh"
  exit 1
fi

# Navigate to app directory
cd app

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run tests based on type
case $TEST_TYPE in
  unit)
    echo "Running unit tests..."
    npm test -- --testPathPattern=__tests__/unit
    ;;
  integration)
    echo "Running integration tests..."
    npm test -- --testPathPattern=__tests__/integration
    ;;
  e2e)
    echo "Running end-to-end tests..."
    npm test -- --testPathPattern=__tests__/e2e
    ;;
  all)
    echo "Running all tests..."
    npm test
    ;;
  *)
    echo "Error: Invalid test type. Must be 'unit', 'integration', 'e2e', or 'all'."
    exit 1
    ;;
esac

# Check if tests passed
if [ $? -ne 0 ]; then
  echo "Error: Tests failed."
  exit 1
fi

echo ""
echo "Testing completed successfully!"
echo ""

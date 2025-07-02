#!/bin/bash

# API Testing Script
# This script tests all the authentication and todo API endpoints

BASE_URL="http://localhost:8080/api"
TEST_EMAIL="test-api@example.com"
TEST_PASSWORD="password123"
COOKIE_JAR="./cookies.txt"

echo "=== Todo List API Testing ==="
echo "Base URL: $BASE_URL"
echo ""

# Clean up any existing cookies
rm -f "$COOKIE_JAR"

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "$BASE_URL/../health" | jq .
echo ""

# Test user registration
echo "2. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -c "$COOKIE_JAR" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
echo "$REGISTER_RESPONSE" | jq .
echo ""

# Test user login
echo "3. Testing user login..."
LOGIN_RESPONSE=$(curl -s -c "$COOKIE_JAR" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
echo "$LOGIN_RESPONSE" | jq .
echo ""

# Test getting todos (should be empty initially)
echo "4. Testing get todos (empty list)..."
curl -s -b "$COOKIE_JAR" "$BASE_URL/todos" | jq .
echo ""

# Test creating a todo
echo "5. Testing create todo..."
CREATE_TODO_RESPONSE=$(curl -s -b "$COOKIE_JAR" -X POST "$BASE_URL/todos" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"This is a test todo","priority":2}')
echo "$CREATE_TODO_RESPONSE" | jq .
TODO_ID=$(echo "$CREATE_TODO_RESPONSE" | jq -r .id)
echo "Created todo with ID: $TODO_ID"
echo ""

# Test getting todos (should have one now)
echo "6. Testing get todos (with data)..."
curl -s -b "$COOKIE_JAR" "$BASE_URL/todos" | jq .
echo ""

# Test updating todo
echo "7. Testing update todo..."
curl -s -b "$COOKIE_JAR" -X PUT "$BASE_URL/todos/$TODO_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Test Todo","description":"This todo has been updated","priority":3}' | jq .
echo ""

# Test toggling todo completion
echo "8. Testing toggle todo completion..."
curl -s -b "$COOKIE_JAR" -X PATCH "$BASE_URL/todos/$TODO_ID/toggle" | jq .
echo ""

# Test getting todos after toggle
echo "9. Testing get todos after toggle..."
curl -s -b "$COOKIE_JAR" "$BASE_URL/todos" | jq .
echo ""

# Test deleting todo
echo "10. Testing delete todo..."
curl -s -b "$COOKIE_JAR" -X DELETE "$BASE_URL/todos/$TODO_ID" | jq .
echo ""

# Test getting todos after deletion (should be empty)
echo "11. Testing get todos after deletion..."
curl -s -b "$COOKIE_JAR" "$BASE_URL/todos" | jq .
echo ""

# Test logout
echo "12. Testing logout..."
curl -s -b "$COOKIE_JAR" -X POST "$BASE_URL/auth/logout" | jq .
echo ""

# Test accessing protected endpoint after logout (should fail)
echo "13. Testing protected endpoint after logout (should fail)..."
curl -s -b "$COOKIE_JAR" "$BASE_URL/todos"
echo ""

# Cleanup
rm -f "$COOKIE_JAR"

echo ""
echo "=== API Testing Complete ==="
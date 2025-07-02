#!/bin/bash

# Database initialization script
# This script creates the database, runs migrations, and seeds test data

set -e

DB_PATH="${DB_PATH:-./data/todo.db}"
DB_DIR=$(dirname "$DB_PATH")

echo "Initializing database at $DB_PATH"

# Create data directory if it doesn't exist
mkdir -p "$DB_DIR"

# Remove existing database for fresh start (development only)
if [ "$RESET_DB" = "true" ]; then
    echo "Resetting database..."
    rm -f "$DB_PATH"
fi

# Run migrations
echo "Running migrations..."
sqlite3 "$DB_PATH" < backend/internal/database/migrations.sql

# Seed test data only in development
if [ "$SEED_DATA" = "true" ]; then
    echo "Seeding test data..."
    sqlite3 "$DB_PATH" < backend/internal/database/seed.sql
fi

echo "Database initialization complete!"
echo "Database location: $DB_PATH"

# Show database info
echo "Database tables:"
sqlite3 "$DB_PATH" ".tables"

echo "Users count:"
sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM users;"

echo "Todos count:"
sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM todos;"
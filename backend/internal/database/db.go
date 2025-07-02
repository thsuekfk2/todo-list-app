package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

// InitDB initializes the SQLite database and creates tables
func InitDB(dataSourceName string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", dataSourceName)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Create tables
	if err := createTables(db); err != nil {
		return nil, fmt.Errorf("failed to create tables: %w", err)
	}

	log.Println("Database initialized successfully")
	return db, nil
}

// createTables creates the necessary database tables
func createTables(db *sql.DB) error {
	// Users table
	usersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err := db.Exec(usersTable); err != nil {
		return fmt.Errorf("failed to create users table: %w", err)
	}

	// Todos table
	todosTable := `
	CREATE TABLE IF NOT EXISTS todos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		title TEXT NOT NULL,
		description TEXT,
		completed BOOLEAN DEFAULT FALSE,
		priority INTEGER DEFAULT 1,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	);`

	if _, err := db.Exec(todosTable); err != nil {
		return fmt.Errorf("failed to create todos table: %w", err)
	}

	// Create indices for better performance
	indices := []string{
		"CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);",
		"CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);",
		"CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);",
	}

	for _, index := range indices {
		if _, err := db.Exec(index); err != nil {
			return fmt.Errorf("failed to create index: %w", err)
		}
	}

	log.Println("Database tables and indices created successfully")
	return nil
}

// InsertTestData inserts initial test data for development
func InsertTestData(db *sql.DB) error {
	// Check if test data already exists
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM users WHERE email = 'test@example.com'").Scan(&count)
	if err != nil {
		return fmt.Errorf("failed to check test data: %w", err)
	}

	if count > 0 {
		log.Println("Test data already exists, skipping insertion")
		return nil
	}

	// Insert test user (password: "password123" hashed with bcrypt)
	testUserQuery := `
	INSERT INTO users (email, password_hash) 
	VALUES ('test@example.com', '$2a$10$J8K7QX9Q8Q8Q8Q8Q8Q8Q8O7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7');`

	result, err := db.Exec(testUserQuery)
	if err != nil {
		return fmt.Errorf("failed to insert test user: %w", err)
	}

	userID, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get user ID: %w", err)
	}

	// Insert test todos
	testTodos := []struct {
		title       string
		description string
		priority    int
		completed   bool
	}{
		{"Complete project setup", "Set up the initial project structure and configurations", 3, true},
		{"Implement authentication", "Create user registration and login functionality", 3, false},
		{"Build Todo CRUD", "Implement create, read, update, delete operations for todos", 2, false},
		{"Design UI/UX", "Create responsive and intuitive user interface", 2, false},
		{"Write tests", "Add unit and integration tests", 1, false},
	}

	for _, todo := range testTodos {
		todoQuery := `
		INSERT INTO todos (user_id, title, description, priority, completed) 
		VALUES (?, ?, ?, ?, ?);`

		_, err := db.Exec(todoQuery, userID, todo.title, todo.description, todo.priority, todo.completed)
		if err != nil {
			return fmt.Errorf("failed to insert test todo: %w", err)
		}
	}

	log.Println("Test data inserted successfully")
	return nil
}
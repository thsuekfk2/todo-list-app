package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"todo-list-app/internal/middleware"
	"todo-list-app/internal/models"
)

type TodoHandler struct {
	db *sql.DB
}

// NewTodoHandler creates a new todo handler
func NewTodoHandler(db *sql.DB) *TodoHandler {
	return &TodoHandler{db: db}
}

// GetTodos retrieves all todos for the authenticated user
func (h *TodoHandler) GetTodos(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r)
	if !ok {
		http.Error(w, "User not found in context", http.StatusUnauthorized)
		return
	}

	rows, err := h.db.Query(`
		SELECT id, user_id, title, description, completed, priority, created_at, updated_at 
		FROM todos 
		WHERE user_id = ? 
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() {
		var todo models.Todo
		err := rows.Scan(
			&todo.ID, &todo.UserID, &todo.Title, &todo.Description,
			&todo.Completed, &todo.Priority, &todo.CreatedAt, &todo.UpdatedAt,
		)
		if err != nil {
			http.Error(w, "Failed to scan todo", http.StatusInternalServerError)
			return
		}
		todos = append(todos, todo)
	}

	if todos == nil {
		todos = []models.Todo{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

// CreateTodo creates a new todo for the authenticated user
func (h *TodoHandler) CreateTodo(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r)
	if !ok {
		http.Error(w, "User not found in context", http.StatusUnauthorized)
		return
	}

	var req models.CreateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Title == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Title is required"})
		return
	}

	// Set default priority if not provided
	if req.Priority == 0 {
		req.Priority = 1
	}

	// Create todo
	result, err := h.db.Exec(`
		INSERT INTO todos (user_id, title, description, priority) 
		VALUES (?, ?, ?, ?)
	`, userID, req.Title, req.Description, req.Priority)
	if err != nil {
		http.Error(w, "Failed to create todo", http.StatusInternalServerError)
		return
	}

	todoID, err := result.LastInsertId()
	if err != nil {
		http.Error(w, "Failed to get todo ID", http.StatusInternalServerError)
		return
	}

	// Get the created todo
	var todo models.Todo
	err = h.db.QueryRow(`
		SELECT id, user_id, title, description, completed, priority, created_at, updated_at 
		FROM todos WHERE id = ?
	`, todoID).Scan(
		&todo.ID, &todo.UserID, &todo.Title, &todo.Description,
		&todo.Completed, &todo.Priority, &todo.CreatedAt, &todo.UpdatedAt,
	)
	if err != nil {
		http.Error(w, "Failed to retrieve todo", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(todo)
}

// UpdateTodo updates an existing todo
func (h *TodoHandler) UpdateTodo(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r)
	if !ok {
		http.Error(w, "User not found in context", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	todoID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid todo ID", http.StatusBadRequest)
		return
	}

	var req models.UpdateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if todo belongs to user
	var existingUserID int
	err = h.db.QueryRow("SELECT user_id FROM todos WHERE id = ?", todoID).Scan(&existingUserID)
	if err == sql.ErrNoRows {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if existingUserID != userID {
		http.Error(w, "Unauthorized", http.StatusForbidden)
		return
	}

	// Update todo
	_, err = h.db.Exec(`
		UPDATE todos 
		SET title = ?, description = ?, priority = ?, updated_at = CURRENT_TIMESTAMP 
		WHERE id = ?
	`, req.Title, req.Description, req.Priority, todoID)
	if err != nil {
		http.Error(w, "Failed to update todo", http.StatusInternalServerError)
		return
	}

	// Get updated todo
	var todo models.Todo
	err = h.db.QueryRow(`
		SELECT id, user_id, title, description, completed, priority, created_at, updated_at 
		FROM todos WHERE id = ?
	`, todoID).Scan(
		&todo.ID, &todo.UserID, &todo.Title, &todo.Description,
		&todo.Completed, &todo.Priority, &todo.CreatedAt, &todo.UpdatedAt,
	)
	if err != nil {
		http.Error(w, "Failed to retrieve updated todo", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}

// DeleteTodo deletes a todo
func (h *TodoHandler) DeleteTodo(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r)
	if !ok {
		http.Error(w, "User not found in context", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	todoID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid todo ID", http.StatusBadRequest)
		return
	}

	// Check if todo belongs to user and delete in one query
	result, err := h.db.Exec("DELETE FROM todos WHERE id = ? AND user_id = ?", todoID, userID)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "Failed to check deletion", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "Todo not found or unauthorized", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Todo deleted successfully"})
}

// ToggleTodo toggles the completed status of a todo
func (h *TodoHandler) ToggleTodo(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r)
	if !ok {
		http.Error(w, "User not found in context", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	todoID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid todo ID", http.StatusBadRequest)
		return
	}

	// Get current status and verify ownership
	var currentCompleted bool
	var existingUserID int
	err = h.db.QueryRow(
		"SELECT completed, user_id FROM todos WHERE id = ?", 
		todoID,
	).Scan(&currentCompleted, &existingUserID)
	if err == sql.ErrNoRows {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if existingUserID != userID {
		http.Error(w, "Unauthorized", http.StatusForbidden)
		return
	}

	// Toggle status
	newCompleted := !currentCompleted
	_, err = h.db.Exec(`
		UPDATE todos 
		SET completed = ?, updated_at = CURRENT_TIMESTAMP 
		WHERE id = ?
	`, newCompleted, todoID)
	if err != nil {
		http.Error(w, "Failed to toggle todo", http.StatusInternalServerError)
		return
	}

	// Get updated todo
	var todo models.Todo
	err = h.db.QueryRow(`
		SELECT id, user_id, title, description, completed, priority, created_at, updated_at 
		FROM todos WHERE id = ?
	`, todoID).Scan(
		&todo.ID, &todo.UserID, &todo.Title, &todo.Description,
		&todo.Completed, &todo.Priority, &todo.CreatedAt, &todo.UpdatedAt,
	)
	if err != nil {
		http.Error(w, "Failed to retrieve updated todo", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}
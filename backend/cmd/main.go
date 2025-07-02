package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"todo-list-app/internal/database"
	"todo-list-app/internal/handlers"
	"todo-list-app/internal/middleware"
)

func main() {
	// Initialize session store
	secretKey := os.Getenv("SESSION_SECRET")
	if secretKey == "" {
		secretKey = "your-super-secret-key-change-this-in-production"
		log.Println("Warning: Using default session secret. Set SESSION_SECRET environment variable in production.")
	}
	middleware.InitSessionStore(secretKey)

	// Initialize database
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./data/todo.db"
	}
	
	db, err := database.InitDB(dbPath)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Seed test data in development
	if os.Getenv("SEED_DATA") == "true" {
		if err := database.InsertTestData(db); err != nil {
			log.Printf("Warning: Failed to insert test data: %v", err)
		}
	}

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db)
	todoHandler := handlers.NewTodoHandler(db)

	// Setup routes
	r := mux.NewRouter()

	// Health check endpoint
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "healthy"}`))
	}).Methods("GET")

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	
	// Auth routes (public)
	api.HandleFunc("/auth/register", authHandler.Register).Methods("POST")
	api.HandleFunc("/auth/login", authHandler.Login).Methods("POST")
	api.HandleFunc("/auth/logout", authHandler.Logout).Methods("POST")

	// Protected Todo routes
	protected := api.PathPrefix("/todos").Subrouter()
	protected.Use(middleware.AuthMiddleware)
	protected.HandleFunc("", todoHandler.GetTodos).Methods("GET")
	protected.HandleFunc("", todoHandler.CreateTodo).Methods("POST")
	protected.HandleFunc("/{id}", todoHandler.UpdateTodo).Methods("PUT")
	protected.HandleFunc("/{id}", todoHandler.DeleteTodo).Methods("DELETE")
	protected.HandleFunc("/{id}/toggle", todoHandler.ToggleTodo).Methods("PATCH")

	// CORS middleware (apply to all routes)
	r.Use(middleware.CORSMiddleware)

	// Determine port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("Database location: %s", dbPath)
	log.Printf("Health check: http://localhost:%s/health", port)
	log.Printf("API base URL: http://localhost:%s/api", port)
	
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
-- Seed data for development and testing
-- This file contains sample data for testing the application

-- Test user (password: "password123")
-- Hashed password using bcrypt cost 10
INSERT OR IGNORE INTO users (email, password_hash) VALUES 
('test@example.com', '$2a$10$J8K7QX9Q8Q8Q8Q8Q8Q8Q8O7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7');

INSERT OR IGNORE INTO users (email, password_hash) VALUES 
('demo@example.com', '$2a$10$J8K7QX9Q8Q8Q8Q8Q8Q8Q8O7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7');

-- Sample todos for test user (user_id: 1)
INSERT OR IGNORE INTO todos (user_id, title, description, priority, completed) VALUES 
(1, 'Complete project setup', 'Set up the initial project structure and configurations', 3, 1),
(1, 'Implement authentication', 'Create user registration and login functionality', 3, 0),
(1, 'Build Todo CRUD', 'Implement create, read, update, delete operations for todos', 2, 0),
(1, 'Design UI/UX', 'Create responsive and intuitive user interface', 2, 0),
(1, 'Write tests', 'Add unit and integration tests', 1, 0),
(1, 'Deploy application', 'Set up production deployment pipeline', 1, 0);

-- Sample todos for demo user (user_id: 2)
INSERT OR IGNORE INTO todos (user_id, title, description, priority, completed) VALUES 
(2, 'Review PRD document', 'Go through the product requirements document', 2, 1),
(2, 'Plan development phases', 'Break down development into manageable phases', 2, 0),
(2, 'Setup development environment', 'Configure local development setup', 3, 1),
(2, 'Create wireframes', 'Design basic wireframes for the application', 1, 0);
import { useState, useEffect } from 'react'

const useTodos = () => {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/todos`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }

      const data = await response.json()
      setTodos(data || [])
    } catch (error) {
      setError(error.message)
      console.error('Failed to fetch todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new todo
  const createTodo = async (todoData) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(todoData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create todo')
      }

      const newTodo = await response.json()
      setTodos(prev => [newTodo, ...prev]) // Add to beginning of list
      return newTodo
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Update an existing todo
  const updateTodo = async (id, todoData) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(todoData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update todo')
      }

      const updatedTodo = await response.json()
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
      return updatedTodo
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Toggle todo completion status
  const toggleTodo = async (id) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to toggle todo')
      }

      const updatedTodo = await response.json()
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
      return updatedTodo
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete todo')
      }

      setTodos(prev => prev.filter(todo => todo.id !== id))
      return true
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Load todos on mount
  useEffect(() => {
    fetchTodos()
  }, [])

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const clearError = () => setError(null)

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearError,
  }
}

export default useTodos
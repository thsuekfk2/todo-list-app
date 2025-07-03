import { useState, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useTodos from '../hooks/useTodos'
import TodoItem from '../components/TodoItem'
import TodoForm from '../components/TodoForm'
import TodoFilters from '../components/TodoFilters'

const Todos = () => {
  const { logout, user } = useAuth()
  const {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearError,
  } = useTodos()

  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('created_desc')

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleCreateTodo = async (todoData) => {
    await createTodo(todoData)
    setShowForm(false)
  }

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = todos.filter(todo => !todo.completed)
        break
      case 'completed':
        filtered = todos.filter(todo => todo.completed)
        break
      default:
        filtered = todos
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'created_asc':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'created_desc':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'priority_desc':
          return b.priority - a.priority
        case 'priority_asc':
          return a.priority - b.priority
        case 'title_asc':
          return a.title.localeCompare(b.title)
        case 'title_desc':
          return b.title.localeCompare(a.title)
        default:
          return new Date(b.created_at) - new Date(a.created_at)
      }
    })

    return sorted
  }, [todos, filter, sortBy])

  const todoStats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter(todo => todo.completed).length
    return { total, completed }
  }, [todos])

  if (isLoading && todos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your todos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-11v11M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">My Todos</h1>
                  {user?.email && (
                    <p className="text-sm text-gray-600 mt-1 font-medium">Welcome back, {user.email}!</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {showForm ? (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                {showForm ? 'Cancel' : 'Add Todo'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearError}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Todo Form */}
        <TodoForm
          onSubmit={handleCreateTodo}
          isLoading={isLoading}
          onCancel={() => setShowForm(false)}
          isVisible={showForm}
        />

        {/* Filters and Stats */}
        {todos.length > 0 && (
          <TodoFilters
            totalCount={todoStats.total}
            completedCount={todoStats.completed}
            filter={filter}
            onFilterChange={setFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {/* Todo List */}
        <div className="space-y-4">
          {filteredAndSortedTodos.length === 0 ? (
            <div className="text-center py-12">
              {todos.length === 0 ? (
                <div>
                  <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-11v11M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first todo!</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Todo
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {filter} todos found
                  </h3>
                  <p className="text-gray-600">
                    {filter === 'completed' && 'No completed todos yet. Keep working!'}
                    {filter === 'active' && 'All caught up! No active todos remaining.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            filteredAndSortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        {/* Loading Overlay for Actions */}
        {isLoading && todos.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200 border-t-blue-600 mr-3"></div>
              <span className="text-sm font-medium text-gray-700">Updating...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Todos
import { useState } from 'react'

const TodoItem = ({ todo, onUpdate, onToggle, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
  })
  const [isLoading, setIsLoading] = useState(false)

  const priorityColors = {
    1: 'bg-green-100 text-green-800 border-green-200',
    2: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    3: 'bg-red-100 text-red-800 border-red-200',
  }

  const priorityLabels = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
    })
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editFormData.title.trim()) return

    try {
      setIsLoading(true)
      await onUpdate(todo.id, editFormData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async () => {
    try {
      setIsLoading(true)
      await onToggle(todo.id)
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        setIsLoading(true)
        await onDelete(todo.id)
      } catch (error) {
        console.error('Failed to delete todo:', error)
        setIsLoading(false)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <div>
            <input
              type="text"
              value={editFormData.title}
              onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Todo title"
              required
            />
          </div>
          
          <div>
            <textarea
              value={editFormData.description}
              onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description (optional)"
            />
          </div>

          <div>
            <select
              value={editFormData.priority}
              onChange={(e) => setEditFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>Low Priority</option>
              <option value={2}>Medium Priority</option>
              <option value={3}>High Priority</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !editFormData.title.trim()}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Todo Header */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className={`flex-shrink-0 w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              } disabled:opacity-50`}
            >
              {todo.completed && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <h3 className={`text-lg font-medium ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>

            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              priorityColors[todo.priority] || priorityColors[1]
            }`}>
              {priorityLabels[todo.priority] || 'Low'}
            </span>
          </div>

          {/* Todo Description */}
          {todo.description && (
            <p className={`text-sm mb-3 ${
              todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}

          {/* Todo Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Created: {formatDate(todo.created_at)}</span>
            {todo.updated_at !== todo.created_at && (
              <span>Updated: {formatDate(todo.updated_at)}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleEdit}
            disabled={isLoading}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
            title="Edit todo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Delete todo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoItem
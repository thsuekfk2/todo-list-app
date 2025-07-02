const TodoFilters = ({ 
  totalCount, 
  completedCount, 
  filter, 
  onFilterChange, 
  sortBy, 
  onSortChange 
}) => {
  const activeCount = totalCount - completedCount

  const filters = [
    { key: 'all', label: 'All', count: totalCount },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'completed', label: 'Completed', count: completedCount },
  ]

  const sortOptions = [
    { key: 'created_desc', label: 'Newest First' },
    { key: 'created_asc', label: 'Oldest First' },
    { key: 'priority_desc', label: 'High Priority First' },
    { key: 'priority_asc', label: 'Low Priority First' },
    { key: 'title_asc', label: 'Title A-Z' },
    { key: 'title_desc', label: 'Title Z-A' },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex space-x-1">
          {filters.map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => onFilterChange(filterOption.key)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filterOption.label}
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                filter === filterOption.key
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {filterOption.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      {totalCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {activeCount} active, {completedCount} completed
            </span>
            <span>
              {totalCount} total todo{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoFilters
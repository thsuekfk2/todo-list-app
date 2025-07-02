import { useAuth } from '../contexts/AuthContext'

const Todos = () => {
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
            {user?.email && (
              <p className="text-sm text-gray-600 mt-1">Welcome back, {user.email}!</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        {/* Temporary placeholder - Todo management will be implemented in issue #6 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Todo Management Coming Soon
            </h3>
            <p className="text-gray-600">
              The todo management interface will be implemented in issue #6.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Authentication is working! You are successfully logged in.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Todos
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Todos from './pages/Todos'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route 
              path="/todos" 
              element={
                <ProtectedRoute>
                  <Todos />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/todos" replace />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/todos" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
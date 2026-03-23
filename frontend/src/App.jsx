import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {
  // This is our most important state — the JWT token
  // null means not logged in
  const [token, setToken] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        {/* Login page — pass setToken so Login can update it */}
        <Route 
          path="/" 
          element={<Login setToken={setToken} />} 
        />

        {/* Register page */}
        <Route 
          path="/register" 
          element={<Register />} 
        />

        {/* Dashboard — protected route */}
        {/* If no token → redirect to login */}
        {/* If has token → show dashboard */}
        <Route 
          path="/dashboard" 
          element={
            token 
              ? <Dashboard token={token} setToken={setToken} /> 
              : <Navigate to="/" />
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App


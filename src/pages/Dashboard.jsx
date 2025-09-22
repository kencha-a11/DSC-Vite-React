import React from 'react'
import api from '../services/api'

function Dashboard() {
  const handleLogout = async () => {
    try {
      await api.post('/logout') // Sanctum will now see the Bearer token
      localStorage.removeItem('token')
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err)
    }
  }

  return (
    <>
      <h1>DASHBOARD PAGE</h1>
      <button onClick={handleLogout}>Logout</button>
      <h3>test components</h3>
    </>
  )
}

export default Dashboard

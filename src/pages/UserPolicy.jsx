import React, { useState } from 'react'
import api from '../services/api'

function UserPolicy() {
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('')

  const checkPolicy = async () => {
    if (!userId) {
      setMessage('Please enter a User ID')
      return
    }

    try {
      const res = await api.get(`/users/policy/${userId}`)
      setMessage(res.data.message)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error checking policy' || err.message)
    }
  }

  return (
    <div>
      <h1>User Policy</h1>
      <input
        type="number"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID"
      />
      <button onClick={checkPolicy}>Check Policy</button>
      <p>{message}</p>
    </div>
  )
}

export default UserPolicy

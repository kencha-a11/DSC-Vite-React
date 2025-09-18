import React, { useState } from 'react'
import api from '../../services/api'

export default function DeleteUser() {
    const [userId, setUserId] = useState('');

    const deleteUser = async () => {
        try {
            await api.delete(`/users/${userId}`);
            alert(`User with ID ${userId} deleted successfully.`);
            setUserId(''); // Clear the input after successful deletion
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user.");
        }
    };

  return (
    <div>
      <h1>Delete User Component</h1>
      <input 
        type="number" 
        placeholder="Enter user ID" 
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={deleteUser}>Delete User</button>
    </div>
  )
}
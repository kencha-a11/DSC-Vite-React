import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams } from 'react-router-dom';

export default function ShowUser({ initialUserId = '' }) {
  const { id } = useParams(); // ID from route
  const [userId, setUserId] = useState(initialUserId || id || '');
  const [user, setUser] = useState(null);

  // Fetch user when route param changes
  useEffect(() => {
    if (id) {
      setUserId(id);
      fetchUser(id);
    }
  }, [id]);

  // Fetch user on button click
  const fetchUser = async (idToFetch = userId) => {
    if (!idToFetch) return;
    try {
      const res = await api.get(`/users/${idToFetch}`);
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
    }
  };

  const handleChange = (e) => {
    setUserId(e.target.value);
  };

  return (
    <div>
      <h1>Show User</h1>
      <p>Enter user ID:</p>
      <input
        type="number"
        value={userId}
        onChange={handleChange}
      />
      <button onClick={() => fetchUser()}>Fetch User</button>

      {user ? (
        <div>
          <h2>User Details</h2>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        userId && <p>No user found for ID {userId}</p>
      )}
    </div>
  );
}

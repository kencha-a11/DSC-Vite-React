import React, { useState } from 'react'
import api from '../../services/api'

export default function StoreUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/users', user)
      .then((res) => {
        console.log("User created:", res.data);
      })
      .catch((err) => {
        console.error("Error creating user:", err);
      });
  };

  return (
    <>
        <h1>Store User Component</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={user.name} onChange={handleChange} />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={user.email} onChange={handleChange} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={user.password} onChange={handleChange} />
            </div>
            <button type="submit">Create User</button>
        </form>
    </>
  )
}


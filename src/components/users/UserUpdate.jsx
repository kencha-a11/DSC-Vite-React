import React, { useState } from 'react'
import api from '../../services/api'

export default function UpdateUser() {
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/users/${user.id}`, user);
            console.log("User updated:", res.data);
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    return (
        <div>
            <h1>Update User Component</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    ID:
                    <input type="text" name="id" value={user.id} onChange={handleChange} />
                </label>
                <label>
                    Name:
                    <input type="text" name="name" value={user.name} onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={user.email} onChange={handleChange} />
                </label>
                <button type="submit">Update User</button>
            </form>
        </div>
    );
}

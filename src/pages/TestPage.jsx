import React, { useEffect, useState } from "react"
import api from '../services/api'

export default function TestPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get(`/users/${10}`)
      .then((res) => {
        console.log("API Response:", res.data);
        setUsers(res.data); // save full array
      })
      .catch((err) => {
        console.error("Error fetching users:", err)
      })
  }, [])

  return (
    <div>
      <h1>Test Page</h1>
      <ul>
        {/* {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))} */}
        <li>{JSON.stringify(users)}</li>
        <h1>may changes ba we di nga</h1>
        isa pa nga bakit ayaw????
      </ul>
    </div>
  )
}
          
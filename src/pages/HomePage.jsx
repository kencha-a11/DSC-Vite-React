import React from 'react'
import { Link } from "react-router-dom"


function HomePage() {
  return (
    <div>
      This is home page components <br />
      <Link to="/home">Home Page</Link><br />
      <Link to="/login">Login Page</Link><br />
    </div>
  )
}

export default HomePage

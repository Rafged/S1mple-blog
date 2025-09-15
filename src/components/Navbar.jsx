import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthAPI, getToken, setToken } from '../api'

export default function Navbar(){
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    async function load(){
      const token = getToken()
      if(!token) { setUser(null); return }
      try{
        const data = await AuthAPI.current()
        setUser(data.user)
      }catch(e){
        console.error(e)
        setToken(null)
        setUser(null)
      }
    }
    load()
  },[])

  function handleLogout(){
    setToken(null)
    setUser(null)
    navigate('/')
  }

  return (
    <div>
      <div className="navbar">
        <div className="nav-inner">
          <Link to="/" className="brand">Realworld Blog</Link>
          <div className="navlinks">
            <Link to="/">Home</Link>
            {user && <Link to="/editor">New Post</Link>}
            {user && <Link to="/settings">Settings</Link>}
            {user ? (
              <>
                <Link to="/profile">{user.username}</Link>
                <a href="#" onClick={(e)=>{e.preventDefault(); handleLogout()}} style={{marginLeft:12, color:'#e44'}}>Logout</a>
              </>
            ) : (
              <>
                <Link to="/login">Sign In</Link>
                <Link to="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

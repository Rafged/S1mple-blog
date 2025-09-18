import React, { useState } from 'react'
import { AuthAPI, setToken } from '../api'
import { useNavigate } from 'react-router-dom'

export default function SignIn(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      // simple validation
      if(!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        setError('Please enter a valid email')
        return
      }
      if(!password){ setError('Please enter your password'); return }
      setError('')
      const data = await AuthAPI.login({ email, password })
      setToken(data.user.token)
      navigate('/')
      window.location.reload()
    }catch(e){
      console.error(e)
      alert('Login failed: ' + (e.response?.errors ? JSON.stringify(e.response.errors) : e.message))
    }
  }

  return (
    <div className="container" style={{maxWidth:520}}>
      <h2 style={{textAlign:'center'}}>Sign In</h2>
      <form className="form" onSubmit={submit}>
        {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{textAlign:'right'}}><button className="btn" type="submit">Sign In</button></div>
      </form>
    </div>
  )
}

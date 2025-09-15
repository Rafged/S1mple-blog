import React, { useState } from 'react'
import { AuthAPI, setToken } from '../api'
import { useNavigate } from 'react-router-dom'

export default function SignIn(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
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
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{textAlign:'right'}}><button className="btn" type="submit">Sign In</button></div>
      </form>
    </div>
  )
}

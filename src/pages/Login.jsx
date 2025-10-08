import React, { useState } from 'react'
import { login } from '../api'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Button } from 'antd'

export default function Login({ onAuth }){
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(){
    try{
      const res = await login(email, password)
      localStorage.setItem('token', res.user.token)
      localStorage.setItem('username', res.user.username)
      onAuth && onAuth()
      navigate('/')
    }catch(e){ alert('Login failed') }
  }

  return <Card style={{maxWidth:520, margin:'24px auto'}}>
    <h2>Sign In</h2>
    <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{marginBottom:8}}/>
    <Input.Password placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{marginBottom:8}}/>
    <Button type="primary" onClick={submit}>Sign In</Button>
  </Card>
}

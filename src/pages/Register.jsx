import React, { useState } from 'react'
import { register } from '../api'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Button } from 'antd'

export default function Register({ onAuth }){
  const [username,setUsername]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const navigate = useNavigate()

  async function submit(){
    try{
      const res = await register(username,email,password)
      localStorage.setItem('token', res.user.token)
      localStorage.setItem('username', res.user.username)
      onAuth && onAuth()
      navigate('/')
    }catch(e){ alert('Register failed') }
  }

  return <Card style={{maxWidth:520, margin:'24px auto'}}>
    <h2>Sign Up</h2>
    <Input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={{marginBottom:8}}/>
    <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{marginBottom:8}}/>
    <Input.Password placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{marginBottom:8}}/>
    <Button type="primary" onClick={submit}>Create</Button>
  </Card>
}

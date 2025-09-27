import React, { useState, useEffect } from 'react'
import { getCurrentUser, updateUser } from '../api'
import { Card, Input, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Settings(){
  const [user, setUser] = useState({ username:'', email:'', bio:'', image:'' })
  const navigate = useNavigate()

  useEffect(()=> {
    if(!localStorage.getItem('token')){ navigate('/login'); return; }
    async function load(){ try{ const res = await getCurrentUser(); setUser(res.user) }catch(e){ console.error(e) } }
    load()
  },[])

  async function submit(){
    try{
      const res = await updateUser({ username: user.username, email: user.email, bio: user.bio, image: user.image })
      localStorage.setItem('username', res.user.username)
      alert('Updated')
      navigate('/')
    }catch(e){ alert('Failed to update') }
  }

  return <Card style={{maxWidth:720, margin:'24px auto'}}>
    <h2>Your Settings</h2>
    <Input placeholder="Username" value={user.username} onChange={e=>setUser({...user, username: e.target.value})} style={{marginBottom:8}}/>
    <Input placeholder="Email" value={user.email} onChange={e=>setUser({...user, email: e.target.value})} style={{marginBottom:8}}/>
    <Input.TextArea placeholder="Bio" value={user.bio} onChange={e=>setUser({...user, bio: e.target.value})} rows={4} style={{marginBottom:8}}/>
    <Input placeholder="Avatar image (url)" value={user.image} onChange={e=>setUser({...user, image: e.target.value})} style={{marginBottom:8}}/>
    <div style={{display:'flex', gap:8}}>
      <Button type="primary" onClick={submit}>Update Settings</Button>
      <Button danger onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('username'); navigate('/') }}>Log out</Button>
    </div>
  </Card>
}

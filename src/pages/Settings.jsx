import React, { useState, useEffect } from 'react'
import { getCurrentUser, updateUser } from '../api'
import { Card, Input, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Settings(){
  const [user, setUser] = useState({ username:'', email:'', bio:'', image:'' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(()=> {
    if(!localStorage.getItem('token')){ navigate('/login'); return; }
    async function load(){ try{ const res = await getCurrentUser(); setUser(res.user || {}) }catch(e){ console.error(e) } }
    load()
  },[])

  async function submit(){
    setLoading(true)
    try{
      await updateUser(user)
      navigate('/')
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  function doLogout(){
    // clear all user related keys
    try{
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('user');
    }catch(e){}
    // navigate home and reload to ensure header updates
    navigate('/');
    window.location.reload();
  }

  return <Card style={{maxWidth:720, margin:'24px auto'}}>
    <h2>Your Settings</h2>
    <Input placeholder="Username" value={user.username} onChange={e=>setUser({...user, username: e.target.value})} style={{marginBottom:8}}/>
    <Input placeholder="Email" value={user.email} onChange={e=>setUser({...user, email: e.target.value})} style={{marginBottom:8}}/>
    <Input.TextArea placeholder="Bio" value={user.bio} onChange={e=>setUser({...user, bio: e.target.value})} rows={4} style={{marginBottom:8}}/>
    <Input placeholder="Avatar image (url)" value={user.image} onChange={e=>setUser({...user, image: e.target.value})} style={{marginBottom:8}}/>
    <div style={{display:'flex', gap:8}}>
      <Button type="primary" onClick={submit} loading={loading}>Update Settings</Button>
      <Button danger onClick={doLogout}>Log out</Button>
    </div>
  </Card>
}

import React, { useEffect, useState } from 'react'
import { AuthAPI, setToken } from '../api'

export default function Settings(){
  const [user, setUser] = useState({username:'', email:'', bio:'', image:''})

  useEffect(()=>{
    AuthAPI.current().then(data=>{
      setUser(data.user)
    }).catch(e=>console.error(e))
  },[])

  async function submit(e){
    e.preventDefault()
    try{
      const data = await AuthAPI.update(user)
      alert('Updated')
    }catch(e){
      console.error(e)
      alert('Update failed')
    }
  }

  function logout(){
    setToken(null)
    window.location.href = '/'
  }

  return (
    <div className="container" style={{maxWidth:720}}>
      <h2 style={{textAlign:'center'}}>Your Settings</h2>
      <form className="form" onSubmit={submit}>
        <input placeholder="Username" value={user.username} onChange={e=>setUser({...user, username:e.target.value})} />
        <input placeholder="Email" value={user.email} onChange={e=>setUser({...user, email:e.target.value})} />
        <textarea placeholder="Bio" value={user.bio} onChange={e=>setUser({...user, bio:e.target.value})} />
        <input placeholder="Avatar image (url)" value={user.image} onChange={e=>setUser({...user, image:e.target.value})} />
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button className="btn" type="submit">Update Settings</button>
          <button type="button" style={{border:'1px solid #e77', background:'#fff', color:'#e44', padding:'6px 10px', borderRadius:4}} onClick={logout}>Or click here to logout</button>
        </div>
      </form>
    </div>
  )
}

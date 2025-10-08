import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Layout, Button } from 'antd'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewPost from './pages/NewPost'
import Settings from './pages/Settings'
import Article from './pages/Article'
import Profile from './pages/Profile'

const { Header, Content } = Layout

function getUsername(){ return localStorage.getItem('username') || null }

export default function App(){
  const [auth, setAuth] = useState(!!localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(()=> {
    function onStorage(){ setAuth(!!localStorage.getItem('token')) }
    window.addEventListener('storage', onStorage)
    return ()=> window.removeEventListener('storage', onStorage)
  },[])

  function doLogout(){
    try{
      localStorage.removeItem('token'); localStorage.removeItem('username'); localStorage.removeItem('user');
    }catch(e){}
    setAuth(false);
    navigate('/');
    window.location.reload();
  }

  return (
    <Layout style={{minHeight:'100vh'}}>
      <Header style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{color:'#5fb46d', fontWeight:700}}>Realworld Blog</div>
        <div>
          <Link to="/" style={{marginRight:30, color:'#fff'}}>Home</Link>
          {auth && <Link to="/new" style={{marginRight:20, color:'#fff'}}>New post</Link>}
          {auth && <Link to="/settings" style={{marginRight:12, color:'#fff'}}>Settings</Link>}
          {auth ? (
            <>
              <Link to={ getUsername() ? ('/profile/' + getUsername()) : '/profile' } style={{marginRight:12, color:'#fff'}}>
                Hi, {getUsername() || 'Unknown'}
              </Link>
              <Button onClick={doLogout}>Log out</Button>
            </>
          ) : (
            <>
              <Link to="/login" style={{marginRight:12, color:'#fff'}}>Login</Link>
              <Link to="/register" style={{color:'#fff'}}>Register</Link>
            </>
          )}
        </div>
      </Header>
      <Content style={{padding:24}}>
        <div style={{maxWidth:960, margin:'0 auto'}}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login onAuth={() => setAuth(true)}/>}/>
            <Route path="/register" element={<Register onAuth={() => setAuth(true)}/>}/>
            <Route path="/new" element={<NewPost/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/article/:slug" element={<Article/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/profile/:username" element={<Profile/>}/>
          </Routes>
        </div>
      </Content>
    </Layout>
  )
}

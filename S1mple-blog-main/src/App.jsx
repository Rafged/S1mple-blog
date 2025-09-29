import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Avatar } from 'antd'
import { HomeOutlined, EditOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewPost from './pages/NewPost'
import Settings from './pages/Settings'
import Article from './pages/Article'
import Profile from './pages/Profile'

const { Header, Content } = Layout

function getUsername(){ return localStorage.getItem('username') }

export default function App(){
  const [auth, setAuth] = useState(!!localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(()=> {
    const onStorage = ()=> setAuth(!!localStorage.getItem('token'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  },[])

  function logout(){
    localStorage.removeItem('token'); localStorage.removeItem('username'); setAuth(false); navigate('/')
  }

  return (
    <Layout>
      <Header style={{background:'#fff', borderBottom:'1px solid #eee', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', gap:24, alignItems:'center'}}>
          <Link to="/" className="brand">Realworld Blog</Link>
          <Menu mode="horizontal" selectable={false} items={[
            {label: <Link to="/">Home</Link>, key:'home', icon:<HomeOutlined/>},
            {label: <Link to="/new">New Post</Link>, key:'new', icon:<EditOutlined/>},
            {label: <Link to="/settings">Settings</Link>, key:'settings', icon:<SettingOutlined/>},
          ]}/>
        </div>
        <div>
          {!auth ? (
            <>
              <Link to="/login" style={{marginRight:12}}>Sign In</Link>
              <Link to="/register">Sign Up</Link>
            </>
          ):(
            <>
              <Link to="/profile" style={{marginRight:12}}>
                <Avatar style={{backgroundColor:'#55b36b'}} icon={<UserOutlined/>}/>
                <span style={{marginLeft:8}}>{getUsername()}</span>
              </Link>
              <Button onClick={logout} danger>Log out</Button>
            </>
          )}
        </div>
      </Header>
      <Content style={{minHeight:'80vh', padding:'24px 0'}}>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login onAuth={() => setAuth(true)}/>}/>
            <Route path="/register" element={<Register onAuth={() => setAuth(true)}/>}/>
            <Route path="/new" element={<NewPost/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/article/:slug" element={<Article/>}/>
            <Route path="/profile" element={<Profile/>}/>
          </Routes>
        </div>
      </Content>
    </Layout>
  )
}

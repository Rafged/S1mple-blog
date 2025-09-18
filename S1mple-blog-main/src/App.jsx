import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import Editor from './pages/Editor'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Article from './pages/Article'

export default function App(){
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/register' element={<Register />} />
        <Route path='/editor' element={<Editor />} />
        <Route path='/articles/:slug' element={<Article />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

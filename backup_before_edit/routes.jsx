import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Articles from './pages/Articles';
import ArticleView from './pages/ArticleView';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import NewArticle from './pages/NewArticle';
import EditArticle from './pages/EditArticle';

function isAuthenticated(){
  // simple check; replace with real auth check
  try{
    return !!localStorage.getItem('token');
  }catch(e){ return false; }
}

function PrivateRoute({children}){
  if(!isAuthenticated()) return <Navigate to="/sign-in" />;
  return children;
}

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/articles" replace />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleView />} />
        <Route path="/articles/:slug/edit" element={
          <PrivateRoute><EditArticle /></PrivateRoute>
        } />
        <Route path="/new-article" element={
          <PrivateRoute><NewArticle /></PrivateRoute>
        } />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
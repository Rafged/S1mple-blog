import React, { useEffect, useState } from 'react'
import { getArticlesByAuthor } from '../api'
import { Card, Button } from 'antd'
import { Link } from 'react-router-dom'

export default function Profile(){
  const username = localStorage.getItem('username') || ''
  const [articles, setArticles] = useState([])

  useEffect(()=> { load() }, [])

  async function load(){
    try{ const res = await getArticlesByAuthor(username); setArticles(res.articles || []) }catch(e){ console.error(e) }
  }

  if(!username) return <Card style={{maxWidth:700, margin:'24px auto'}}>Please sign in</Card>

  return <div style={{maxWidth:900, margin:'24px auto'}}>
    <Card style={{marginBottom:16}}>
      <h2>{username}</h2>
      <div>Your feed</div>
    </Card>
    {articles.map(a=> <Card key={a.slug} style={{marginBottom:12}}>
      <h3>{a.title}</h3>
      <div className="meta">{new Date(a.createdAt).toLocaleDateString()}</div>
      <Link to={'/article/' + a.slug}>Read</Link>
    </Card>)}
  </div>
}

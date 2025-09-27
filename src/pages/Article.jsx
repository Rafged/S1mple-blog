import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getArticle, favoriteArticle, unfavoriteArticle } from '../api'
import { Card, Button } from 'antd'

export default function Article(){
  const { slug } = useParams()
  const [article, setArticle] = useState(null)

  useEffect(()=> { load() }, [slug])

  async function load(){
    try{ const res = await getArticle(slug); setArticle(res.article) }catch(e){ console.error(e) }
  }

  
  async function toggleFav(){
    if(!localStorage.getItem('token')){ alert('Войдите чтобы оценивать'); return; }
    try{
      if(article.favorited) await unfavoriteArticle(article.slug)
      else await favoriteArticle(article.slug)
      await load()
    }catch(e){ console.error(e); alert('Ошибка') }
  }


  if(!article) return <div>Loading...</div>

  return <Card style={{maxWidth:900, margin:'24px auto'}}>
    <h1>{article.title}</h1>
    <div className="meta">{article.author.username} · {new Date(article.createdAt).toLocaleDateString()}</div>
    <p style={{color:'#555'}}>{article.body}</p>
    <div style={{textAlign:'center', marginTop:16}}>
      <Button onClick={toggleFav} type={article.favorited ? 'primary' : 'default'}>Favorite article</Button>
    </div>
  </Card>
}

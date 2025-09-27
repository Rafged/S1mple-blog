import React, { useEffect, useState } from 'react'
import { Card, Tag, Button } from 'antd'
import { getArticles, getTags, favoriteArticle, unfavoriteArticle } from '../api'
import { Link } from 'react-router-dom'

export default function Home(){
  const [articles, setArticles] = useState([])
  const [tags, setTags] = useState([])

  useEffect(()=> {
    load()
    loadTags()
  },[])

  async function load(){ 
    try{
      const res = await getArticles()
      setArticles(res.articles || [])
    }catch(e){
      console.error(e)
    }
  }
  async function loadTags(){
    try{ const r = await getTags(); setTags(r.tags || []) }catch(e){ console.error(e) }
  }

  async function toggleFav(a){
    if(!localStorage.getItem('token')){ alert('Войдите чтобы оценивать'); return; }
    try{
      if(a.favorited) await unfavoriteArticle(a.slug)
      else await favoriteArticle(a.slug)
      load()
    }catch(e){ console.error(e); alert('Ошибка') }
  }

  return (
    <div>
      <div className="banner"><h1>Realworld Blog</h1><p>A place to share your knowledge.</p></div>
      <div style={{display:'flex', gap:24, alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          {articles.map(a => (
            <Card key={a.slug} style={{marginBottom:16}}>
              <h2>{a.title}</h2>
              <div className="meta">
                <Link to="/profile">{a.author.username}</Link>
                <span style={{marginLeft:12, color:'#888'}}>{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{color:'#666'}}>{a.description}</p>
              <div style={{marginTop:8}}>
                {(a.tagList || []).map(t => <Tag key={t}>{t}</Tag>)}
              </div>
              <div style={{marginTop:12, display:'flex', gap:8, alignItems:'center'}}>
                <Button onClick={()=> toggleFav(a)} type={a.favorited ? 'primary' : 'default'}>❤ {a.favoritesCount}</Button>
                <Link to={'/article/' + a.slug}>Read more</Link>
              </div>
            </Card>
          ))}
        </div>
        <div style={{width:1460}}>
          <Card>
            <section style={{padding: '20px'}}>
        <h3>Popular Tags</h3>
        <div>
          {tags.map(tag => (
            <span key={tag} style={{border: '1px solid #5cb85c', padding: '5px', margin: '5px', display: 'inline-block'}}>
              {tag}
            </span>
          ))}
        </div>
      </section>
          </Card>
        </div>
      </div>
    </div>
  )
}

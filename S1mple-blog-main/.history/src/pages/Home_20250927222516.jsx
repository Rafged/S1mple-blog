import React, { useEffect, useState } from 'react'
import { getArticles, favoriteArticle, unfavoriteArticle } from '../api'
import { Link } from 'react-router-dom'
import PopularTags from '../components/PopularTags'
import Pagination from '../components/Pagination'

export default function Home(){
  const [articles, setArticles] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 3

  useEffect(()=> {
    load(currentPage)
  },[currentPage])

  async function load(page = 1){ 
    try{
      const offset = (page-1)*limit
      const res = await getArticles(`?limit=${limit}&offset=${offset}`)
      setArticles(res.articles || [])
      const count = res.articlesCount || (res.articles ? res.articles.length : 0)
      setTotalPages(Math.max(1, Math.ceil(count / limit)))
    }catch(e){
      console.error(e)
    }
  }

  async function toggleFav(a){
    if(!localStorage.getItem('token')){ alert('Войдите чтобы оценивать'); return; }
    try{
      if(a.favorited) await unfavoriteArticle(a.slug)
      else await favoriteArticle(a.slug)
      await load(currentPage)
    }catch(e){ console.error(e); alert('Ошибка') }
  }

  return (
    <div className="container">
      <div className="banner" style={{textAlign:'center'}}>
        <h1 style={{margin:0, fontSize:36}}>Realworld Blog</h1>
        <p style={{margin:0}}>A place to share your knowledge.</p>
      </div>

      {/* Popular tags at center top */}
      <div style={{display:'flex', justifyContent:'center', marginBottom:20}}>
        <div style={{maxWidth:1200, width:'100%'}}>
          <PopularTags />
        </div>
      </div>

      <div>
        {articles.length === 0 ? <div>Нет постов</div> : articles.map(a => (
          <div key={a.slug} className="article-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <div className="article-meta"><Link to={`/profile`}>{a.author?.username}</Link> · {new Date(a.createdAt).toLocaleDateString()}</div>
                <Link to={`/article/${a.slug}`} style={{textDecoration:'none'}}>
                  <h2 style={{margin:'8px 0', color:'#222'}}>{a.title}</h2>
                </Link>
                <p style={{color:'#555'}}>{a.description || (a.body && a.body.slice(0,200)+'...')}</p>
                <div style={{marginTop:8}}>
                  {a.tagList && a.tagList.map(t => <span key={t} className="tag-btn">{t}</span>)}
                </div>
              </div>
              <div>
                <button className="favorite-badge" onClick={()=>toggleFav(a)} title="Favorite">
                  ❤️ <span style={{marginLeft:6}}>{a.favoritesCount||0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p)=>setCurrentPage(p)} />
      </div>
    </div>
  )
}

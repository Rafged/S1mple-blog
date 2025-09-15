import React, { useState } from 'react'
import { ArticlesAPI } from '../api'

export default function ArticleCard({ article }){
  const [favCount, setFavCount] = useState(article.favoritesCount || 0)
  const [favorited, setFavorited] = useState(!!article.favorited)

  async function toggleFavorite(){
    try{
      if(favorited){
        await ArticlesAPI.unfavorite(article.slug)
        setFavCount(c => c-1)
        setFavorited(false)
      } else {
        await ArticlesAPI.favorite(article.slug)
        setFavCount(c => c+1)
        setFavorited(true)
      }
    }catch(e){
      console.error(e)
      alert('Ошибка при установке лайка (проверьте, вошли ли вы).')
    }
  }

  return (
    <div className="card">
      <div className="meta">
        <div>
          <div className="author">{article.author?.username}</div>
          <div style={{fontSize:12, color:'#999'}}>{new Date(article.createdAt).toLocaleDateString()}</div>
        </div>
        <div>
          <button className="heart" onClick={toggleFavorite}>
            ❤ {favCount}
          </button>
        </div>
      </div>

      <div className="article-title">{article.title}</div>
      <div className="article-desc">{article.description}</div>
      <div className="tags">
        {(article.tagList || []).map((t,i)=>(<span className="tag" key={i}>{t}</span>))}
      </div>
    </div>
  )
}

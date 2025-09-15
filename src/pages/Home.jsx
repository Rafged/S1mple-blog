import React, { useEffect, useState } from 'react'
import { ArticlesAPI } from '../api'
import ArticleCard from '../components/ArticleCard'
import Pagination from '../components/Pagination'

export default function Home(){
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    ArticlesAPI.list(page, 5).then(data=>{
      setArticles(data.articles || [])
    }).catch(err=>{
      console.error(err)
      alert('Ошибка загрузки статей. Проверьте API и CORS/proxy.')
    }).finally(()=>setLoading(false))
  },[page])

  return (
    <div>
      <div className="header-hero">
        <div className="container header-center">
          <h1 style={{margin:0, fontSize:36, fontWeight:800}}>Realworld Blog</h1>
          <p style={{marginTop:8}}>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container">
        <div style={{marginBottom:12}}>
          <strong>Popular tags</strong>
          <div style={{marginTop:8}}>
            <span className="tag">react</span>
            <span className="tag">javascript</span>
            <span className="tag">webdev</span>
          </div>
        </div>

        {loading && <div>Loading...</div>}
        {articles.map(a=>(<ArticleCard key={a.slug} article={a} />))}

        <Pagination current={page} onChange={setPage} total={7} />
      </div>
    </div>
  )
}

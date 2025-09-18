
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArticlesAPI } from '../api'

export default function Article(){
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    ArticlesAPI.get(slug).then(d=>{
      setArticle(d.article)
    }).catch(e=>console.error(e)).finally(()=>setLoading(false))
  },[slug])

  if(loading) return <div>Loading...</div>
  if(!article) return <div>Article not found</div>

  let bodyEl = null
  try{
    const ReactMarkdown = require('react-markdown')
    bodyEl = <ReactMarkdown>{article.body || ''}</ReactMarkdown>
  }catch(e){
    bodyEl = <div><pre style={{whiteSpace:'pre-wrap'}}>{article.body}</pre><div style={{color:'#666',fontSize:12,marginTop:8}}>For rich markdown rendering install <code>react-markdown</code>.</div></div>
  }

  return (
    <div className="container" style={{maxWidth:800}}>
      <h1>{article.title}</h1>
      <div style={{marginBottom:12,color:'#666'}}>{article.description}</div>
      <div>{bodyEl}</div>
    </div>
  )
}

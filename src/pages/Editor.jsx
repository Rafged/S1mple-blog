import React, { useState } from 'react'
import { ArticlesAPI } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Editor(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const article = { title, description, body, tagList: tags.split(',').map(t=>t.trim()).filter(Boolean) }
      const data = await ArticlesAPI.create(article)
      alert('Created: ' + data.article.slug)
      navigate('/')
    }catch(e){
      console.error(e)
      alert('Create failed: ' + (e.response?.errors ? JSON.stringify(e.response.errors) : e.message))
    }
  }

  return (
    <div className="container" style={{maxWidth:720}}>
      <h2>Write Article</h2>
      <form className="form" onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input placeholder="Short description" value={description} onChange={e=>setDescription(e.target.value)} />
        <textarea placeholder="Write your article" rows={8} value={body} onChange={e=>setBody(e.target.value)} />
        <input placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
        <div style={{textAlign:'right'}}><button className="btn" type="submit">Publish Article</button></div>
      </form>
    </div>
  )
}

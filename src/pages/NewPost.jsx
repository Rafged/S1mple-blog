import React, { useState } from 'react'
import { createArticle } from '../api'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Button } from 'antd'

export default function NewPost(){
  const [title,setTitle]=useState(''); const [desc,setDesc]=useState(''); const [body,setBody]=useState(''); const [tags,setTags]=useState('')
  const navigate = useNavigate()

  async function submit(){
    if(!localStorage.getItem('token')){ alert('Только для авторизованных'); navigate('/login'); return; }
    try{
      const res = await createArticle({ title, description: desc, body, tagList: tags.split(',').map(s=>s.trim()).filter(Boolean) })
      alert('Posted')
      navigate('/article/' + res.article.slug)
    }catch(e){ alert('Failed to create') }
  }

  return <Card style={{maxWidth:720, margin:'24px auto'}}>
    <h2>New Post</h2>
    <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{marginBottom:8}}/>
    <Input placeholder="Short description" value={desc} onChange={e=>setDesc(e.target.value)} style={{marginBottom:8}}/>
    <Input.TextArea placeholder="Article body" value={body} onChange={e=>setBody(e.target.value)} rows={8} style={{marginBottom:8}}/>
    <Input placeholder="tags comma-separated" value={tags} onChange={e=>setTags(e.target.value)} style={{marginBottom:8}}/>
    <Button type="primary" onClick={submit}>Publish Article</Button>
  </Card>
}

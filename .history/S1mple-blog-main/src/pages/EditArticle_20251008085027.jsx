
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditArticle(){
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({ title:'', description:'', body:'', tagList:[] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => { try{ return localStorage.getItem('token'); }catch(e){return null;} };
  const getUsername = () => { try{ return localStorage.getItem('username'); }catch(e){return null;} };

  useEffect(()=>{
    let cancelled = false;
    setLoading(true);
    fetch(`/api/articles/${slug}`)
      .then(async r=>{
        if(!r.ok) throw new Error('Failed to load');
        const data = await r.json();
        const a = data.article || data;
        if(!cancelled) setArticle({
          title: a.title || '',
          description: a.description || '',
          body: a.body || '',
          tagList: (a.tagList || a.taglist || '').join ? a.tagList : (a.tagList || [])
        });
      })
      .catch(e=> setError(e.message))
      .finally(()=> setLoading(false));
    return ()=> cancelled = true;
  },[slug]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setSaving(true);
    setError(null);
    const token = getToken();
    try{
      const res = await fetch(`/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          ...(token ? {'Authorization': 'Token ' + token} : {})
        },
        body: JSON.stringify({ article: { title: article.title, description: article.description, body: article.body, tagList: article.tagList } })
      });
      if(!res.ok){
        const err = await res.text();
        throw new Error(err || 'Save failed');
      }
      const data = await res.json();
      const newSlug = data.article?.slug || slug;
      navigate(`/articles/${newSlug}`);
    }catch(e){
      setError(e.message);
    }finally{
      setSaving(false);
    }
  }

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Edit article</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Title</label><br/>
          <input value={article.title} onChange={e=>setArticle({...article, title:e.target.value})} style={{width:'100%'}} /></div>
        <div><label>Description</label><br/>
          <input value={article.description} onChange={e=>setArticle({...article, description:e.target.value})} style={{width:'100%'}} /></div>
        <div><label>Body (Markdown)</label><br/>
          <textarea value={article.body} onChange={e=>setArticle({...article, body:e.target.value})} style={{width:'100%', minHeight:200}} /></div>
        <div><label>Tags (comma separated)</label><br/>
          <input value={(article.tagList || []).join(',')} onChange={e=>setArticle({...article, tagList: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} style={{width:'100%'}} /></div>
        <div style={{marginTop:8}}>
          <button type="submit" disabled={saving}>Save</button>
        </div>
      </form>
    </div>
  )
}

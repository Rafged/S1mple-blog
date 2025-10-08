import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditArticle(){
  const { slug } = useParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    fetch(`/api/articles/${slug}`).then(r=>r.json()).then(data=>{
      const a = data.article || data;
      setTitle(a.title || '');
      setBody(a.body || '');
    }).catch(()=>{});
  },[slug]);

  const submit = async (e) => {
    e.preventDefault();
    if(!title || !body){ alert('Please fill title and body'); return;}
    const res = await fetch(`/api/articles/${slug}`, {method:'PUT', body: JSON.stringify({article:{title, body}}), headers:{'Content-Type':'application/json'}});
    if(res.ok){
      const data = await res.json();
      navigate(`/articles/${data.article.slug || slug}`);
    } else alert('Update failed');
  };

  return (
    <form onSubmit={submit}>
      <h2>Edit Article</h2>
      <label>Title<input required value={title} onChange={e=>setTitle(e.target.value)} /></label><br/>
      <label>Body<textarea required value={body} onChange={e=>setBody(e.target.value)} /></label><br/>
      <button type="submit">Save</button>
    </form>
  )
}
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewArticle(){
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    if(!title || !body){ alert('Please fill title and body'); return;}
    const res = await fetch('/api/articles', {method:'POST', body: JSON.stringify({article:{title, body}}), headers:{'Content-Type':'application/json'}});
    if(res.ok){
      const data = await res.json();
      navigate(`/articles/${data.article.slug || ''}`);
    } else alert('Create failed');
  };
  return (
    <form onSubmit={submit}>
      <h2>New Article</h2>
      <label>Title<input required value={title} onChange={e=>setTitle(e.target.value)} /></label><br/>
      <label>Body<textarea required value={body} onChange={e=>setBody(e.target.value)} /></label><br/>
      <button type="submit">Create</button>
    </form>
  )
}
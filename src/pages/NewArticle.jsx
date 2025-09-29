import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewArticle(){
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    try{ return localStorage.getItem('token'); }catch(e){ return null; }
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if(!title.trim() || !body.trim()){ setError('Title and body are required'); return; }
    const token = getToken();
    if(!token){ setError('Please sign in'); return; }
    try{
      const res = await fetch('/api/articles', {
        method:'POST',
        headers: {'Content-Type':'application/json', 'Authorization': 'Token ' + token},
        body: JSON.stringify({article:{title, body}})
      });
      const data = await res.json();
      if(!res.ok){ setError(data?.errors ? JSON.stringify(data.errors) : 'Create failed'); return; }
      navigate(`/articles/${data.article.slug}`);
    }catch(e){
      setError(e.message || 'Network error');
    }
  };

  return (
    <div>
      <h2>New Article</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={submit}>
        <label>Title<input value={title} onChange={e=>setTitle(e.target.value)} /></label><br/>
        <label>Body<textarea value={body} onChange={e=>setBody(e.target.value)} /></label><br/>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

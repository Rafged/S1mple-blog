import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import Loader from '../components/Loader';

export default function NewArticle(){
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const getToken = () => {
    try{ return localStorage.getItem('token'); }catch(e){ return null; }
  }

  const validate = () => {
    if(!title.trim()) return 'Title is required';
    if(!body.trim()) return 'Body is required';
    return null;
  }

  const submit = async (e) => {
    e && e.preventDefault();
    setError(null);
    const v = validate();
    if(v){ setError(v); return; }
    setSubmitting(true);
    try{
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          Authorization: getToken() ? `Token ${getToken()}` : ''
        },
        body: JSON.stringify({ article: { title, body }})
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({errors:{server:['unknown']}}));
        throw new Error(err?.errors ? JSON.stringify(err.errors) : 'Failed to create');
      }
      const data = await res.json();
      navigate(`/articles/${data.article.slug}`);
    }catch(err){
      setError(err.message);
    }finally{ setSubmitting(false); }
  }

  return (
    <div style={{maxWidth:800, margin:'24px auto'}}>
      <h2>New Article</h2>
      {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{width:'100%', padding:8, marginBottom:8}}
        />
        <textarea
          placeholder="Body (Markdown supported)"
          value={body}
          onChange={e => setBody(e.target.value)}
          style={{width:'100%', minHeight:200, padding:8, marginBottom:8}}
        />
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button type="submit" disabled={submitting}>Publish</button>
          {submitting && <Loader size={24} />}
        </div>
      </form>

      <h3>Preview</h3>
      <div dangerouslySetInnerHTML={{__html: marked.parse(body || '')}} style={{border:'1px solid #ddd', padding:12, borderRadius:6}} />
    </div>
  )
}

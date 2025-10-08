
import React, {useEffect, useState} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { marked } from 'marked';

export default function ArticleView(){
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    try { return localStorage.getItem('token'); } catch(e){ return null; }
  }
  const getUsername = () => {
    try { return localStorage.getItem('username'); } catch(e){ return null; }
  }

  useEffect(()=>{
    let cancelled = false;
    setLoading(true);
    fetch(`/api/articles/${slug}`)
      .then(async r => {
        if(!r.ok) throw new Error('Failed to fetch article');
        const data = await r.json();
        if(!cancelled) setArticle(data.article || data);
      })
      .catch(e=> setError(e.message))
      .finally(()=> setLoading(false));
    return ()=> cancelled = true;
  },[slug]);

  const handleDelete = async ()=>{
    if(!window.confirm('Delete article?')) return;
    const token = getToken();
    try{
      const res = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': 'Token ' + token } : {}
      });
      if(!res.ok) throw new Error('Delete failed');
      navigate('/');
    }catch(e){ alert('Delete failed: ' + e.message); }
  }

  const isAuthor = article && article.author && article.author.username === getUsername();

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error: {error}</div>;
  if(!article) return <div>Article not found</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>By <strong>{article.author?.username}</strong></p>
      <div dangerouslySetInnerHTML={{__html: marked.parse(article.body || '')}} />
      <div style={{marginTop:12}}>
        {isAuthor && (
          <>
            <Link to={`/articles/${slug}/edit`}><button>Edit</button></Link>
            <button onClick={handleDelete} style={{marginLeft:8}}>Delete</button>
          </>
        )}
        <Link to="/"><button style={{marginLeft:12}}>Back</button></Link>
      </div>
    </div>
  )
}

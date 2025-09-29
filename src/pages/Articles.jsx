import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

export default function Articles(){
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let canceled = false;
    setLoading(true);
    setError(null);
    fetch('/api/articles')
      .then(async r => {
        if(!r.ok) throw new Error('Failed to fetch articles');
        const data = await r.json();
        if(!canceled) setArticles(data.articles || []);
      })
      .catch(e => {
        if(!canceled) setError(e.message || 'Unknown error');
      })
      .finally(()=> { if(!canceled) setLoading(false); });
    return () => { canceled = true; };
  },[]);

  if(loading) return <div>Loading articles...</div>;
  if(error) return <div style={{color:'red'}}>Error: {error}</div>;
  return (
    <div>
      <h1>Articles</h1>
      <Link to="/new-article">Create new article</Link>
      <ul>
        {articles.map(a => (
          <li key={a.slug}>
            <Link to={`/articles/${a.slug}`}>{a.title || a.slug}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

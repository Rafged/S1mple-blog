import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

export default function Articles(){
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    setLoading(true);
    fetch('/api/articles')
      .then(r => {
        if(!r.ok) throw new Error('Network response was not ok');
        return r.json();
      })
      .then(data => setArticles(data.articles || []))
      .catch(err => setError(err.message))
      .finally(()=> setLoading(false));
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
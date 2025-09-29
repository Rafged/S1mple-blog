import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditArticle(){
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({ title: '', description: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle(){
      try{
        setLoading(true);
        const res = await fetch(`/api/articles/${slug}`);
        if(!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setArticle(data.article);
      }catch(e){
        setError(e.message);
      }finally{
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  async function handleSubmit(e){
    e.preventDefault();
    if(!article.title || !article.body){
      setError('Title and body are required');
      return;
    }
    try{
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ article })
      });
      if(!res.ok) throw new Error('Failed to update');
      const data = await res.json();
      navigate(`/articles/${data.article.slug}`);
    }catch(e){
      setError(e.message);
    }
  }

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Article</h2>
      <input
        type="text"
        placeholder="Title"
        value={article.title}
        onChange={e => setArticle({...article, title: e.target.value})}
      />
      <textarea
        placeholder="Body"
        value={article.body}
        onChange={e => setArticle({...article, body: e.target.value})}
      />
      <button type="submit">Update</button>
    </form>
  );
}

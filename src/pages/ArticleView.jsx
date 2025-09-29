import React, {useEffect, useState} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { marked } from 'marked';

export default function ArticleView(){
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const getToken = () => {
    try { return localStorage.getItem('token'); } catch(e){ return null; }
  }

  useEffect(()=>{
    let canceled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/articles/${slug}`)
      .then(async r => {
        if(!r.ok) throw new Error('Article not found');
        const data = await r.json();
        if(!canceled) setArticle(data.article);
      })
      .catch(e => { if(!canceled) setError(e.message || 'Unknown error'); })
      .finally(()=> { if(!canceled) setLoading(false); });
    return () => { canceled = true; };
  },[slug]);

  const toggleFavorite = async () => {
    if(!article) return;
    const token = getToken();
    if(!token){ alert('Please sign in to favorite articles'); return; }
    try{
      const method = article.favorited ? 'DELETE' : 'POST';
      const res = await fetch(`/api/articles/${slug}/favorite`, {
        method,
        headers: { 'Authorization': 'Token ' + token }
      });
      if(!res.ok) throw new Error('Failed to toggle favorite');
      const data = await res.json();
      setArticle(prev => ({...prev, favorited: data.article.favorited, favoritesCount: data.article.favoritesCount}));
    }catch(e){
      alert('Favorite action failed: ' + (e.message || 'error'));
    }
  }

  const handleDelete = async () => {
    const token = getToken();
    if(!token){ alert('Not authorized'); return; }
    try{
      const res = await fetch(`/api/articles/${slug}`, { method:'DELETE', headers:{ 'Authorization': 'Token ' + token }});
      if(!res.ok) throw new Error('Delete failed');
      navigate('/articles');
    }catch(e){
      alert('Delete failed: ' + (e.message || 'error'));
    }
  }

  if(loading) return <div>Loading article...</div>;
  if(error) return <div style={{color:'red'}}>Error: {error}</div>;
  if(!article) return <div>No article</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <div>
        <span>By <Link to={`/profile/${article.author?.username}`}>{article.author?.username}</Link></span>
        <span style={{marginLeft:10}}>Favorites: {article.favoritesCount || 0}</span>
        <button onClick={toggleFavorite} style={{marginLeft:10}}>
          {article.favorited ? 'Unfavorite' : 'Favorite'} article
        </button>
        {article.author && article.author.username === (localStorage.getItem('username') || '') && (
          <>
            <button onClick={()=>navigate(`/articles/${slug}/edit`)} style={{marginLeft:8}}>Edit</button>
            <button onClick={()=>setShowModal(true)} style={{marginLeft:8}}>Delete</button>
          </>
        )}
      </div>
      <hr/>
      <div dangerouslySetInnerHTML={{__html: marked.parse(article.body || '')}} />
      <ConfirmModal
        open={showModal}
        title="Confirm delete"
        onConfirm={()=>{
          setShowModal(false);
          handleDelete();
        }}
        onCancel={()=>setShowModal(false)}
      >
        Are you sure you want to delete this article?
      </ConfirmModal>
    </div>
  )
}

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

  useEffect(()=>{
    setLoading(true);
    fetch(`/api/articles/${slug}`)
      .then(r => {
        if(!r.ok) throw new Error('Failed to fetch article');
        return r.json();
      })
      .then(data => setArticle(data.article || data))
      .catch(err => setError(err.message))
      .finally(()=> setLoading(false));
  },[slug]);

  const handleFavorite = async () => {
    try{
      const resp = await fetch(`/api/articles/${slug}/favorite`, { method: 'POST' });
      if(!resp.ok) throw new Error('Favorite failed');
      // refresh article
      const refreshed = await (await fetch(`/api/articles/${slug}`)).json();
      setArticle(refreshed.article || refreshed);
    }catch(e){
      alert('Could not favorite: ' + e.message);
    }
  };

  const handleDelete = async () => {
    try{
      const resp = await fetch(`/api/articles/${slug}`, { method: 'DELETE' });
      if(!resp.ok) throw new Error('Delete failed');
      navigate('/');
    }catch(e){
      alert('Delete failed: ' + e.message);
    }
  };

  if(loading) return <div>Loading article...</div>;
  if(error) return <div style={{color:'red'}}>Error: {error}</div>;
  if(!article) return <div>No article found</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <div>
        <button onClick={handleFavorite}>Favorite article ({article.favoritesCount || 0})</button>
        <Link to={`/articles/${slug}/edit`} style={{marginLeft:10}}>Edit</Link>
        <button onClick={()=>setShowModal(true)} style={{marginLeft:10}}>Delete</button>
      </div>

      <hr />
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
// Article.jsx (или компонент статьи)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser"; // хук для получения текущего пользователя

function Article() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser, token } = useCurrentUser();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://realworld.habsida.net/api/articles/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        // можно добавить авторизацию, если нужно и API требует
        ...(token ? { Authorization: `Token ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        setArticle(data.article);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка при загрузке статьи:", err);
        setLoading(false);
      });
  }, [slug, token]);

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Статья не найдена</div>;

  const isAuthor = currentUser && article.author.username === currentUser.username;

  const handleDelete = async () => {
    const ok = window.confirm("Уверен, что хочешь удалить статью?");
    if (!ok) return;
    try {
      const resp = await fetch(`https://realworld.habsida.net/api/articles/${slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        }
      });
      if (resp.ok) {
        // успешно удалено
        navigate("/");  // например, на главную или список статей
      } else {
        const errData = await resp.json();
        console.error("Ошибка при удалении:", errData);
        alert("Не удалось удалить статью");
      }
    } catch (err) {
      console.error("Ошибка сети при удалении:", err);
      alert("Ошибка сети");
    }
  };

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      {/* другие поля, author, дата и т.д. */}
      {isAuthor && (
        <div>
          <Link to={`/articles/${slug}/edit`}>
            <button>Edit Article</button>
          </Link>
          <button onClick={handleDelete}>Delete Article</button>
        </div>
      )}
    </div>
  );
}

export default Article;
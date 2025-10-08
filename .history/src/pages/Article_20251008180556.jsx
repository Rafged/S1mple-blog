import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import ArticleDetail from "../components/ArticleDetail";

function Article() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // ✅ Добавляем защиту от null:
  const userData = useCurrentUser() || {};
  const currentUser = userData.currentUser || null;
  const token = userData.token || null;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://realworld.habsida.net/api/articles/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticle(data.article);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке статьи:", err);
        setLoading(false);
      });
  }, [slug, token]);

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Статья не найдена</div>;

  const handleEdit = () => navigate(`/articles/${slug}/edit`);
  const handleFavorite = async () => {
    try {
      const resp = await fetch(
        `https://realworld.habsida.net/api/articles/${slug}/favorite`,
        {
          method: article.favorited ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
        }
      );
      if (resp.ok) {
        const data = await resp.json();
        setArticle(data.article);
      }
    } catch (err) {
      console.error("Ошибка при изменении избранного:", err);
    }
  };

  return (
    <ArticleDetail
      article={article}
      currentUser={currentUser}
      onEdit={handleEdit}
      onFavorite={handleFavorite}
    />
  );
}

export default Article;
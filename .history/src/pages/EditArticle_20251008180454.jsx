import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser, token } = useCurrentUser();

  const [article, setArticle] = useState({
    title: "",
    description: "",
    body: "",
    tagList: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загружаем существующую статью
  useEffect(() => {
    fetch(`https://realworld.habsida.net/api/articles/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data.article);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке статьи:", err);
        setError("Не удалось загрузить статью");
        setLoading(false);
      });
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Вы не авторизованы!");
      return;
    }

    try {
      const resp = await fetch(`https://realworld.habsida.net/api/articles/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ article }),
      });
      if (resp.ok) {
        const data = await resp.json();
        navigate(`/articles/${data.article.slug}`);
      } else {
        const err = await resp.json();
        console.error(err);
        alert("Ошибка при сохранении статьи");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", color: "#333" }}>
      <h1 style={{ fontSize: "32px", marginBottom: 20 }}>Редактировать статью</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Заголовок</label>
          <input
            name="title"
            value={article.title}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Описание</label>
          <input
            name="description"
            value={article.description}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Текст статьи</label>
          <textarea
            name="body"
            value={article.body}
            onChange={handleChange}
            rows="10"
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Теги (через запятую)</label>
          <input
            name="tagList"
            value={article.tagList ? article.tagList.join(", ") : ""}
            onChange={(e) =>
              setArticle({ ...article, tagList: e.target.value.split(",").map((t) => t.trim()) })
            }
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            background: "#4CAF50",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
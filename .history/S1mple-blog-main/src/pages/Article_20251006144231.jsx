import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`https://realworld.habsida.net/api/articles/${slug}`);
        const data = await res.json();
        setArticle(data.article);
      } catch (err) {
        console.error("Ошибка загрузки статьи:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Заголовок */}
      <div style={{ backgroundColor: "#333", color: "white", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "40px" }}>{article.title}</h1>
        <div style={{ marginTop: "15px", fontSize: "20px", fontWeight: "bold" }}>
          by {article.author.username}
        </div>
        <div style={{ marginTop: "8px", fontSize: "14px", color: "#bbb" }}>
          {new Date(article.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Контент статьи */}
      <div style={{ maxWidth: "1000px", margin: "20px auto", padding: "0 20px" }}>
        <p style={{ fontSize: "18px", lineHeight: "1.6" }}>{article.description}</p>
        <div dangerouslySetInnerHTML={{ __html: article.body }} style={{ marginTop: "20px" }} />

        {/* Теги */}
        {article.tagList && article.tagList.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            {article.tagList.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-block",
                  backgroundColor: "#f3f3f3",
                  padding: "5px 10px",
                  marginRight: "8px",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Автор + кнопка */}
      <div
        style={{
          borderTop: "1px solid #ddd",
          marginTop: "40px",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src={article.author.image || "https://static.productionready.io/images/smiley-cyrus.jpg"}
            alt={article.author.username}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
          <div>
            <div style={{ fontWeight: "bold" }}>{article.author.username}</div>
            <button
              style={{
                marginTop: "5px",
                padding: "8px 16px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Favorite article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

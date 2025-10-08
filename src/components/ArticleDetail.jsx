import React from "react";

export default function ArticleDetail({ article, currentUser, onEdit, onFavorite }) {
  if (!article) return null;
  const isOwner = currentUser && article.author && (currentUser.username === article.author.username);

  return (
    <div className="article-detail">
      <div style={{ background: "#333", color: "#fff", padding: "60px 80px" }}>
        <h1 style={{ fontSize: "48px", lineHeight: "1.05", margin: 0 }}>{article.title}</h1>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={article.author?.image || "https://via.placeholder.com/40"}
            alt="avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              border: "2px solid #4CAF50",
            }}
          />
          <div>
            <div style={{ color: "#6fd070", fontWeight: 700 }}>{article.author?.username}</div>
            <div style={{ fontSize: 12, color: "#ddd" }}>
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        <p style={{ color: "#666" }}>{article.description || article.body?.slice(0, 300) + "..."}</p>

        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(article.tagList || []).map((t, i) => (
            <div
              key={i}
              style={{
                padding: "6px 10px",
                borderRadius: 12,
                border: "1px solid #eee",
                fontSize: 12,
              }}
            >
              {t}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={article.author?.image || "https://via.placeholder.com/48"}
            alt="avatar"
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#2f9e44" }}>{article.author?.username}</div>
            <div style={{ fontSize: 12, color: "#999" }}>
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <button
              style={{
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: 6,
                cursor: "pointer",
              }}
              onClick={onFavorite}
            >
              Favorite article
            </button>
            {isOwner && (
              <button
                style={{
                  marginLeft: 12,
                  background: "#eee",
                  border: "1px solid #ccc",
                  padding: "8px 14px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
                onClick={onEdit}
              >
                Edit Article
              </button>
            )}
          </div>
        </div>

        <hr style={{ margin: "30px 0" }} />
        <div style={{ whiteSpace: "pre-wrap", color: "#333" }} dangerouslySetInnerHTML={{ __html: article.body || "" }} />
      </div>
    </div>
  );
}
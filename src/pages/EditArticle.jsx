import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

/*
  EditArticle page
  - Loads article by slug
  - Verifies current user is the author (otherwise redirects)
  - Allows editing title, description, body and tags (comma separated)
  - Sends PUT request to /api/articles/:slug with Authorization header (Token ...)
  - On success navigates back to article page
*/

export default function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser, token } = useCurrentUser();

  const [article, setArticle] = useState({
    title: "",
    description: "",
    body: "",
    tagList: [],
    author: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const res = await fetch("/api/articles/" + encodeURIComponent(slug));
        if (!res.ok) {
          throw new Error("Не удалось загрузить статью: " + res.status);
        }
        const data = await res.json();
        const a = data.article;
        setArticle({
          title: a.title || "",
          description: a.description || "",
          body: a.body || "",
          tagList: Array.isArray(a.tagList) ? a.tagList : [],
          author: a.author || null,
        });
      } catch (err) {
        console.error(err);
        setError("Ошибка при загрузке статьи.");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    // If we know both currentUser and article author and not matching -> redirect away
    if (!loading && article && article.author && currentUser) {
      if (currentUser.username !== article.author.username) {
        // not owner
        navigate("/", { replace: true });
      }
    }
  }, [loading, article, currentUser, navigate]);

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    if (key === "tagList") {
      // user edits tags as comma separated string
      setArticle((s) => ({ ...s, tagList: value }));
    } else {
      setArticle((s) => ({ ...s, [key]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // Prepare payload
      const payload = {
        article: {
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: Array.isArray(article.tagList)
            ? article.tagList
            : String(article.tagList || "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
        },
      };

      const headers = {
        "Content-Type": "application/json",
      };
      const savedToken = token || localStorage.getItem("token");
      if (savedToken) headers["Authorization"] = "Token " + savedToken;

      const res = await fetch("/api/articles/" + encodeURIComponent(slug), {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error("Ошибка при сохранении: " + res.status + " " + txt);
      }
      const data = await res.json();
      const newSlug = data.article.slug;
      navigate("/article/" + newSlug);
    } catch (err) {
      console.error(err);
      setError("Не удалось сохранить статью. " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Загрузка статьи...</div>;
  if (error)
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h2>Редактирование статьи</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Заголовок</label>
          <input
            value={article.title}
            onChange={handleChange("title")}
            required
            style={{ width: "100%", padding: 10, fontSize: 16 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Краткое описание</label>
          <input
            value={article.description}
            onChange={handleChange("description")}
            required
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Текст статьи (HTML/Markdown)</label>
          <textarea
            value={article.body}
            onChange={handleChange("body")}
            required
            rows={12}
            style={{ width: "100%", padding: 10, fontSize: 15 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Теги (через запятую)</label>
          <input
            value={Array.isArray(article.tagList) ? article.tagList.join(", ") : article.tagList || ""}
            onChange={(e) =>
              setArticle((s) => ({ ...s, tagList: e.target.value }))
            }
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: "#4CAF50",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}

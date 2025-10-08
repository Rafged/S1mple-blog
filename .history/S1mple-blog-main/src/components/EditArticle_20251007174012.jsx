// EditArticle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token, currentUser } = useCurrentUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagList, setTagList] = useState("");
  const [loading, setLoading] = useState(true);

  // Загрузим существующие данные статьи
  useEffect(() => {
    fetch(`https://realworld.habsida.net/api/articles/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        const art = data.article;
        setTitle(art.title);
        setDescription(art.description);
        setBody(art.body);
        setTagList(art.tagList.join(" "));
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка при загрузке для редактирования:", err);
        setLoading(false);
      });
  }, [slug, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      article: {
        title,
        description,
        body,
        tagList: tagList.split(" ").filter(t => t)
      }
    };
    try {
      const resp = await fetch(`https://realworld.habsida.net/api/articles/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const data = await resp.json();
        const newSlug = data.article.slug;
        navigate(`/articles/${newSlug}`);
      } else {
        const err = await resp.json();
        console.error("Ошибка при обновлении:", err);
        alert("Не удалось обновить статью");
      }
    } catch (err) {
      console.error("Ошибка сети при обновлении:", err);
      alert("Ошибка сети");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Article</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            required
            rows={10}
          />
        </div>
        <div>
          <label>Tags (space separated)</label>
          <input
            type="text"
            value={tagList}
            onChange={e => setTagList(e.target.value)}
          />
        </div>
        <button type="submit">Update Article</button>
      </form>
    </div>
  );
}

export default EditArticle;
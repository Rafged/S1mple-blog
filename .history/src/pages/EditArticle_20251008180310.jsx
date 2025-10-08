import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({ title: "", description: "", body: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`https://api.realworld.io/api/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticle(data.article);
        setLoading(false);
      });
  }, [slug]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`https://api.realworld.io/api/articles/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ article }),
    })
      .then((res) => res.json())
      .then((data) => {
        navigate(`/articles/${data.article.slug}`);
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-article">
      <h2>Edit your article</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={article.title}
          onChange={handleChange}
          placeholder="Article title"
        />
        <input
          type="text"
          name="description"
          value={article.description}
          onChange={handleChange}
          placeholder="What's this article about?"
        />
        <textarea
          name="body"
          value={article.body}
          onChange={handleChange}
          placeholder="Write your article"
          rows={10}
        />
        <button type="submit">Update Article</button>
      </form>
    </div>
  );
};

export default EditArticle;
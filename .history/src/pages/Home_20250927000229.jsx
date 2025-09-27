import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";
import PopularTags from "../components/PopularTags";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchArticles = async () => {
    const offset = (page - 1) * limit;
    try {
      const res = await fetch(`${API_URL}/articles?limit=${limit}&offset=${offset}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setArticlesCount(data.articlesCount || 0);
    } catch (err) {
      console.error("Ошибка загрузки статей:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page]);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">Realworld Blog</h1>
          <p>A place to share your knowledge.</p>

          {/* 🔹 Теперь PopularTags сразу под заголовком */}
          <PopularTags />
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            {articles.length === 0 && <p>No articles are here... yet.</p>}
            {articles.map((article) => (
              <div className="article-preview" key={article.slug}>
                <div className="article-meta">
                  <Link to={`/@${article.author.username}`}>
                    <img src={article.author.image} alt={article.author.username} />
                  </Link>
                  <div className="info">
                    <Link to={`/@${article.author.username}`} className="author">
                      {article.author.username}
                    </Link>
                    <span className="date">
                      {new Date(article.createdAt).toDateString()}
                    </span>
                  </div>
                </div>
                <Link to={`/article/${article.slug}`} className="preview-link">
                  <h1>{article.title}</h1>
                  <p>{article.description}</p>
                  <span>Read more...</span>
                </Link>
              </div>
            ))}

            {/* 🔹 Пагинация */}
            {articlesCount > limit && (
              <nav className="pagination">
                {Array.from({ length: Math.ceil(articlesCount / limit) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={page === i + 1 ? "page-item active" : "page-item"}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


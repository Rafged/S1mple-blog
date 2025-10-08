import React, { useState, useEffect } from "react";
import { getArticles } from "../api";
import Pagination from "../components/Pagination";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      const offset = (currentPage - 1) * limit;
      const res = await getArticles(limit, offset);
      setArticles(res.articles);
      setArticlesCount(res.articlesCount);
    };
    fetchArticles();
  }, [currentPage]);

  return (
    <div>
      <h1 className="logo-font">Realworld Blog</h1>
      <p>A place to share your knowledge</p>

      {/* Popular Tags перенес сюда */}
      <PopularTags />

      <div className="article-list">
        {articles.map((article) => (
          <ArticlePreview key={article.slug} article={article} />
        ))}
      </div>

      <Pagination
        articlesCount={articlesCount}
        limit={limit}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Home;
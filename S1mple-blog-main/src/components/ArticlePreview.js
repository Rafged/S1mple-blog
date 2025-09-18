import React from "react";
import { Link } from "react-router-dom";

const ArticlePreview = (props) => {
  const article = props.article;

  return (
    <div className="article-preview">
      <div className="article-meta">
        <i className="fa fa-user-circle green-icon"></i>
        <Link to={`/@${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">{new Date(article.createdAt).toDateString()}</span>
      </div>

      <Link to={`/articles/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
};

export default ArticlePreview;

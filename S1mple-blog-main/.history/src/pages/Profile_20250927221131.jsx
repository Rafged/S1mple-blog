import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resProfile = await api.get(`/profiles/${username}`);
        setProfile(resProfile.data.profile);

        const resArticles = await api.get(`/articles?author=${username}`);
        setArticles(resArticles.data.articles || []);
      } catch (err) {
        console.error("Error loading profile", err);
      }
    }
    fetchData();
  }, [username]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      {/* --- Шапка профиля --- */}
      <div className="profile-header">
        <img
          className="profile-avatar"
          src={
            profile.image ||
            "https://static.productionready.io/images/smiley-cyrus.jpg"
          }
          alt={profile.username}
        />
        <h2 className="profile-username">{profile.username}</h2>
        <div className="profile-meta">
          <span className="heart">❤️</span>
          <span className="text">Text</span>
        </div>
      </div>

      {/* --- Список постов --- */}
      <div className="profile-posts">
        {articles.map((article) => (
          <div key={article.slug} className="post-card">
            <div className="post-meta">
              <img
                src={article.author.image}
                alt={article.author.username}
                className="post-author-avatar"
              />
              <div>
                <div className="post-author">{article.author.username}</div>
                <div className="post-date">
                  {new Date(article.createdAt).toDateString()}
                </div>
              </div>
              <div className="favorites">
                ❤️ {article.favoritesCount}
              </div>
            </div>
            <h3 className="post-title">{article.title}</h3>
            <p className="post-description">{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
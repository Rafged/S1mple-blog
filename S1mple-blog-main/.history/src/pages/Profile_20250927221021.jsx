import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";

const Profile = () => {
  const params = useParams();
  const paramUsername = params?.username;
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState("my");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const usernameToUse = paramUsername || localStorage.getItem("username");

  const fetchProfile = async (username) => {
    if (!username) {
      setProfile({ username: "Unknown", image: "", bio: "" });
      return;
    }
    try {
      const res = await fetch(`/api/profiles/${encodeURIComponent(username)}`);
      const data = await res.json();
      if (data && data.profile) setProfile(data.profile);
      else setProfile({ username, image: "", bio: "" });
    } catch (e) {
      console.warn("Failed to load profile", e);
      setError(true);
      setProfile({ username, image: "", bio: "" });
    }
  };

  const fetchArticles = async (page = 1, tab = "my") => {
    const limit = 3;
    const offset = (page - 1) * limit;
    if (!usernameToUse) {
      setArticles([]);
      setTotalPages(1);
      return;
    }
    const url =
      tab === "my"
        ? `/api/articles?author=${encodeURIComponent(usernameToUse)}&limit=${limit}&offset=${offset}`
        : `/api/articles?favorited=${encodeURIComponent(usernameToUse)}&limit=${limit}&offset=${offset}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.articles || []);
      setTotalPages(Math.max(1, Math.ceil((data.articlesCount || 0) / limit)));
    } catch (e) {
      console.error("Failed to fetch profile articles", e);
      setArticles([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchProfile(usernameToUse);
  }, [paramUsername]);

  useEffect(() => {
    fetchArticles(currentPage, activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeTab, paramUsername]);

  if (!profile) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <img
          src={profile.image || "https://api.realworld.io/images/smiley-cyrus.jpeg"}
          alt="avatar"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <h2 style={{ marginTop: 12 }}>{profile.username}</h2>
        <p className="meta">{profile.bio}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button
          onClick={() => { setActiveTab("my"); setCurrentPage(1); }}
          style={{ marginRight: "10px", padding: "8px 15px", background: activeTab==="my" ? "#55b36b" : "#eee", border: "none", borderRadius: 6 }}
        >
          My Articles
        </button>
        <button
          onClick={() => { setActiveTab("favorited"); setCurrentPage(1); }}
          style={{ padding: "8px 15px", background: activeTab==="favorited" ? "#55b36b" : "#eee", border: "none", borderRadius: 6 }}
        >
          Favorited Articles
        </button>
      </div>

      <div>
        {articles.length === 0 ? (
          <p style={{ textAlign: "center" }}>No articles yet...</p>
        ) : (
          articles.map((article) => (
            <div key={article.slug} style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
              <h3 style={{ margin: "6px 0" }}>{article.title}</h3>
              <p style={{ margin: "6px 0", color: "#555" }}>{article.description}</p>
            </div>
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Profile;
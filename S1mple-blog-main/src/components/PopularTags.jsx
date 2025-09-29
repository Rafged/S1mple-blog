import React, { useEffect, useState } from "react";
import { getTags } from "../api";

const PopularTags = () => {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getTags();
        if (res && res.tags) setTags(res.tags);
      } catch (e) {
        setError(true);
        console.warn("Failed to load tags", e);
      }
    };
    fetchTags();
  }, []);

  return (
    <div className="popular-box">
      <h4 style={{ margin: "0 0 8px 0" }}>Popular tags</h4>
      {error ? (
        <div>Не удалось загрузить теги.</div>
      ) : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tags.length === 0 ? <span>Нет тегов</span> : tags.map((t) => (
            <button key={t} className="tag-btn">{t}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularTags;

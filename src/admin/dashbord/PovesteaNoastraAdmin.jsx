import React, { useEffect, useState } from "react";
import { useHomepagePostsApi } from "../../api/HomepagePostApi";
import "./dashbordStyle/PostsAdmin.css"; // refolosește același stil

export default function PovesteaNoastraAdmin() {
  const homepageApi = useHomepagePostsApi();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ content: "", author: "", _id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username") || "Unknown";

  const normalizePost = (p) => ({
    _id: p._id || p.id,
    content: p.content,
    author: p.author,
    createdAt: p.createdAt || new Date().toLocaleString(),
    updatedAt: p.updatedAt || new Date().toLocaleString(),
  });

  // 🔹 Încarcă toate textele salvate pentru „Povestea Noastră”
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await homepageApi.getAll();
      setPosts(Array.isArray(data) ? data.map(normalizePost) : []);
    } catch (err) {
      setError(err?.message || "Eroare la încărcare");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      alert("Conținutul este obligatoriu");
      return;
    }

    const postData = {
      author: form.author || username,
      content: form.content,
    };

    try {
      let newPost;
      if (isEditing) {
        newPost = await homepageApi.update(form._id, postData);
      } else {
        newPost = await homepageApi.create(postData);
      }

      setForm({ content: "", author: "", _id: null });
      setIsEditing(false);
      await fetchPosts();
    } catch (err) {
      alert(err?.message || "Nu s-a putut salva conținutul");
    }
  };

  const handleEdit = (post) => {
    setForm({
      content: post.content,
      author: post.author,
      _id: post._id,
    });
    setIsEditing(true);
  };

  const handleDelete = async (post) => {
    if (!window.confirm("Ștergi această poveste?")) return;
    try {
      await homepageApi.remove(post._id);
      await fetchPosts();
    } catch (err) {
      alert("Nu s-a putut șterge povestea");
    }
  };

  return (
    <div className="posts-admin-container">
      <div className="form-section">
        <h2>{isEditing ? "Editează Povestea Noastră" : "Adaugă Povestea Noastră"}</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            name="content"
            placeholder="Scrie povestea magazinului tău aici..."
            value={form.content}
            onChange={handleChange}
          />
          <input
            name="author"
            placeholder="Autor"
            value={form.author || username}
            onChange={handleChange}
          />

          <div className="form-buttons">
            <button type="submit">{isEditing ? "Update" : "Creează"}</button>
            {isEditing && (
              <button
                type="button"
                onClick={() => setForm({ content: "", author: "", _id: null })}
              >
                Anulează
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="posts-list-section">
        <h2>📖 Povestea Noastră</h2>
        {loading && <p>Se încarcă...</p>}
        {error && <p className="error">{error}</p>}
        <ul className="posts-list">
          {posts.map((p) => (
            <li key={p._id} className="post-card">
              <p>{p.content}</p>
              <small>
                Autor: {p.author} | Creat: {p.createdAt} | Modificat: {p.updatedAt}
              </small>
              <div className="post-buttons">
                <button onClick={() => handleEdit(p)}>Editează</button>
                <button onClick={() => handleDelete(p)}>Șterge</button>
              </div>
            </li>
          ))}
          {posts.length === 0 && !loading && <p>Nu există nicio poveste salvată.</p>}
        </ul>
      </div>
    </div>
  );
}

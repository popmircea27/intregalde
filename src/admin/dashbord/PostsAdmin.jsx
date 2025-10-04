import React, { useEffect, useState } from "react";
import { usePostsApi } from "../../api/PostApi";
import "./dashbordStyle/PostsAdmin.css";

export default function PostsAdmin() {
    const postsApi = usePostsApi();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ title: "", content: "", author: "", _id: null });
    const [isEditing, setIsEditing] = useState(false);

    const username = localStorage.getItem("username") || "Unknown";

    const normalizePost = (p) => ({
        _id: p._id,
        title: p.title,
        content: p.content,
        author: p.author,
        images: p.images || [],   // ← aici păstrezi imaginile
        createdAt: p.createdAt || new Date().toLocaleString(),
        updatedAt: p.updatedAt || new Date().toLocaleString(),
    });


    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await postsApi.getAll();
            const rawPosts = Array.isArray(data) ? data : [];
            setPosts(rawPosts.map(normalizePost));
        } catch (err) {
            setError(err?.message || "Eroare la încărcarea postărilor");
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

        // validare simplă
        if (!form.title.trim() || !form.author.trim() || !form.content.trim()) {
            alert("Titlu, autor și conținut sunt obligatorii");
            return;
        }

        const postData = {
            title: form.title,
            content: form.content,
            author: form.author // rămâne text simplu
        };

        try {
            let newPost;

            if (isEditing) {
                // editare
                newPost = await postsApi.update(form._id, postData);
            } else {
                // creare
                newPost = await postsApi.create(postData);
            }

            // resetare formular
            setForm({ title: "", content: "", author: "", _id: null });
            setIsEditing(false);

            // actualizare listă
            setPosts((prev) => {
                if (isEditing) {
                    return prev.map((p) => (p._id === newPost._id ? normalizePost(newPost) : p));
                } else {
                    return [normalizePost(newPost), ...prev];
                }
            });
        } catch (err) {
            alert(err?.message || "Nu s-a putut salva postarea");
        }
    };
    const handleUploadImage = async (postId, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token"); // token-ul JWT salvat la login
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}/upload-image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });

            const updatedPost = await res.json();

            setPosts((prev) =>
                prev.map((p) => (p._id === updatedPost._id ? { ...p, ...updatedPost } : p))
            );
        } catch (err) {
            alert("Eroare la upload imagine");
        }
    };


    const handleEdit = (post) => {
        setForm({
            title: post.title,
            content: post.content,
            author: post.author || username,
            _id: post._id,
        });
        setIsEditing(true);
    };

    const handleDelete = async (post) => {
        if (!window.confirm("Ștergi această postare?")) return;
        try {
            await postsApi.remove(post._id);
            setPosts((prev) => prev.filter((p) => p._id !== post._id));
        } catch (err) {
            alert(err?.message || "Nu s-a putut șterge postarea");
        }
    };

    return (
        <div className="posts-admin-container">
            {/* Formularul de creare/editare */}
            <div className="form-section">
                <h2>{isEditing ? "Editează Postare" : "Adaugă Postare Nouă"}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        name="title"
                        placeholder="Titlu"
                        value={form.title}
                        onChange={handleChange}
                    />
                    <textarea
                        name="content"
                        placeholder="Conținut"
                        value={form.content}
                        onChange={handleChange}
                    />
                    <input
                        name="author"
                        placeholder="Autor"
                        value={form.author || username}
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        disabled={!form._id}
                        onChange={(e) => handleUploadImage(form._id, e.target.files[0])}
                    />


                    <div className="form-buttons">
                        <button type="submit">
                            {isEditing ? "Update" : "Create"}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() =>
                                    setForm({ title: "", content: "", author: "", _id: null })
                                }
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>


            {/* Lista postărilor */}
            <div className="posts-list-section">
                <h2>Lista Postărilor</h2>
                {loading && <p>Se încarcă…</p>}
                {error && <p className="error">{error}</p>}
                <ul className="posts-list">
                    {posts.map((p) => (
                        <li key={p._id || Math.random()} className="post-card">
                            <h3>{p.title}</h3>
                            {p.images?.map((img, idx) => (
                                <div key={idx} className="post-image-container">
                                    <img
                                        src={`${import.meta.env.VITE_API_BASE_URL}${img}`}
                                        alt={`${p.title}-${idx}`}
                                        className="post-image"
                                    />


                                </div>
                            ))}


                            <p>{p.content}</p>
                            <small>
                                Autor: {p.author} | Creare: {p.createdAt || "N/A"} | Modificat:{" "}
                                {p.updatedAt || "N/A"}
                            </small>
                            <div className="post-buttons">
                                <button onClick={() => handleEdit(p)}>Edit</button>
                                <button onClick={() => handleDelete(p)}>Delete</button>
                            </div>
                        </li>
                    ))}
                    {posts.length === 0 && !loading && <p>Nu există postări.</p>}
                </ul>
            </div>
        </div>
    );
}

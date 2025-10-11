import React, { useEffect, useMemo, useState } from "react";
import { usePostsApi } from "../../api/PostApi";
import "./dashbordStyle/PostsAdmin.css";

/** "DD.MM.YYYY HH:mm" sau "N/A" */
function formatDateTime(value) {
    if (!value) return "N/A";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "N/A";
    const date = d.toLocaleDateString("ro-RO");
    const time = d.toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    return `${date} ${time}`;
}

/** Helper unificat pentru ID (acceptă obiect post sau direct string) */
function getId(x) {
    if (!x) return null;
    if (typeof x === "string") return x;
    return x._id ?? x.id ?? null;
}

export default function PostsAdmin() {
    const postsApi = usePostsApi();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        content: "",
        author: "",
        _id: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [uploadingIds, setUploadingIds] = useState(new Set());

    const username = useMemo(() =>
        localStorage.getItem("username") || "Unknown",
        []
    );

    /** Normalizer care creează mereu atât _id cât și id cu aceeași valoare */
    const normalizePost = (p) => {
        const id = p?._id ?? p?.id ?? null;
        return {
            _id: id,
            id,
            title: p?.title ?? "",
            content: p?.content ?? "",
            author: p?.author ?? "",
            images: Array.isArray(p?.images) ? p.images : [],
            createdAt: p?.createdAt ?? new Date().toISOString(),
            updatedAt: p?.updatedAt ?? p?.createdAt ?? new Date().toISOString(),
        };
    };

    const fetchPosts = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await postsApi.getAll();
            const rawPosts = Array.isArray(data) ? data : [];
            setPosts(rawPosts.map(normalizePost));
        } catch (err) {
            setError(err?.message || "Eroare la încărcarea postărilor");
            console.error("Fetch posts error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
         
        if (!form.title.trim() || !form.author.trim() || !form.content.trim()) {
            alert("Titlu, autor și conținut sunt obligatorii");
            return;
        }

        const postData = {
            title: form.title.trim(),
            content: form.content.trim(),
            author: form.author.trim(),
        };

        try {
            const saved = isEditing && form._id
                ? await postsApi.update(form._id, postData)
                : await postsApi.create(postData);
                 console.log("Saved post", saved);
            const normalized = normalizePost(saved);

            setForm({ title: "", content: "", author: "", _id: null });
            setIsEditing(false);

            setPosts((prev) =>
                isEditing
                    ? prev.map((p) => (getId(p) === getId(normalized) ? normalized : p))
                    : [normalized, ...prev]
            );
        } catch (err) {
            alert(err?.message || "Nu s-a putut salva postarea");
            console.error("Submit error:", err);
        }
    };

    // Upload 1 fișier pentru un post dat
    const uploadSingle = async (postId, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const token = localStorage.getItem("token");
        const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

        const res = await fetch(`${base}/api/posts/${postId}/upload-image`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Upload failed");
        }
        return res.json();
    };

    const handleSelectFiles = async (fileList) => {
        if (!fileList || fileList.length === 0) return;

        try {
            let postId = form._id;

            // dacă nu avem încă post, creează-l rapid (draft)
            if (!postId) {
                if (!form.title.trim() || !form.author.trim()) {
                    alert("Completează cel puțin Titlu și Autor înainte de a încărca imagini.");
                    return;
                }
                const created = await postsApi.create({
                    title: form.title.trim() || "Fără titlu",
                    content: form.content.trim() || "",
                    author: (form.author || username).trim(),
                });
                const normalized = normalizePost(created);
                postId = getId(normalized);

                // reflectă draftul în UI + setează editarea pe el
                setPosts((prev) => [normalized, ...prev]);
                setForm((prev) => ({ ...prev, _id: postId }));
                setIsEditing(true);
            }

            // Urcă toate fișierele (secvențial)
            let lastUpdated = null;
            for (const file of Array.from(fileList)) {
                const updatedPost = await uploadSingle(postId, file);
                lastUpdated = normalizePost(updatedPost);
                setPosts((prev) =>
                    prev.map((p) => (getId(p) === getId(lastUpdated) ? lastUpdated : p))
                );
            }

            if (lastUpdated) {
                setForm((prev) => ({ ...prev, _id: getId(lastUpdated) }));
            }
        } catch (err) {
            alert(err?.message || "Eroare la încărcarea imaginilor");
            console.error("Select files error:", err);
        }
    };

    const handleUploadImage = async (postId, file) => {
        if (!file || !postId) return;

        const postIdStr = String(postId);
        setUploadingIds(prev => new Set(prev).add(postIdStr));

        try {
            const updatedPost = await uploadSingle(postId, file);
            const normalized = normalizePost(updatedPost);
            setPosts((prev) =>
                prev.map((p) => (getId(p) === getId(normalized) ? normalized : p))
            );
        } catch (err) {
            alert(err?.message || "Eroare la upload imagine");
            console.error("Upload image error:", err);
        } finally {
            setUploadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(postIdStr);
                return newSet;
            });
        }
    };

    const handleEdit = (post) => {
        setForm({
            title: post.title,
            content: post.content,
            author: post.author || username,
            _id: getId(post),
        });
        setIsEditing(true);
        document.querySelector(".form-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    const handleDelete = async (postOrId) => {
        const id = String(getId(postOrId) ?? "").trim();
        if (!id) {
            alert("ID postare lipsește");
            return;
        }
        if (!window.confirm("Sigur dorești să ștergi această postare?")) return;

        setDeletingId(id);
        const snapshot = [...posts]; // Create a proper copy

        try {
            // Optimistic update
            setPosts((curr) => curr.filter((p) => getId(p) !== id));

            await postsApi.remove(id);

            if (form._id === id) {
                setForm({ title: "", content: "", author: "", _id: null });
                setIsEditing(false);
            }
        } catch (err) {
            // Revert on error
            setPosts(snapshot);
            alert(err?.message || "Nu s-a putut șterge postarea");
            console.error("Delete error:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleCancelEdit = () => {
        setForm({ title: "", content: "", author: "", _id: null });
        setIsEditing(false);
    };

    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

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
                        className="form-input"
                    />
                    <textarea
                        name="content"
                        placeholder="Conținut"
                        value={form.content}
                        onChange={handleChange}
                        className="form-textarea"
                        rows="5"
                    />
                    <input
                        name="author"
                        placeholder="Introdu numele autorului"
                        value={form.author}
                        onChange={handleChange}
                        className="form-input"
                    />



                    <div className="inline-upload" title="Încărcare imagine pentru postarea curentă">
                        <label htmlFor="image-upload" className="upload-btn">
                            <span className="clip"></span> Alege imagine
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleSelectFiles(e.target.files)}
                            className="file-input-hidden"
                        />
                    </div>

                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="btn btn-primary btn-full btn-hero"
                            disabled={loading}
                        >
                            {loading ? "Se procesează..." : (isEditing ? "Actualizează" : "Creează")}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                            >
                                Anulează
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lista postărilor */}
            <div className="posts-list-section">
                <h2>Lista Postărilor ({posts.length})</h2>
                {loading && <p className="loading">Se încarcă…</p>}
                {error && <p className="error">{error}</p>}

                <ul className="posts-list">
                    {posts.map((p) => {
                        const pid = getId(p);
                        const isUploading = uploadingIds.has(String(pid));
                        const isDeleting = deletingId === pid;

                        return (
                            <li key={pid} className="post-card">
                                <h3>{p.title}</h3>

                                {p.images?.length > 0 && (
                                    <div className="images-grid">
                                        {p.images.map((img, idx) => (
                                            <div key={`${pid}-${idx}`} className="post-image-container">
                                                <img
                                                    src={`${baseUrl}${img}`}
                                                    alt={`${p.title}-${idx + 1}`}
                                                    className="post-image"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p className="post-content">{p.content}</p>

                                <div className="upload-row">
                                    <label
                                        htmlFor={`file-${pid}`}
                                        className={`btn btn-ghost ${isUploading ? 'uploading' : ''}`}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? "Se încarcă..." : "Adaugă imagine"}
                                    </label>
                                    <input
                                        id={`file-${pid}`}
                                        type="file"
                                        accept="image/*"
                                        className="file-input"
                                        onChange={(e) => handleUploadImage(pid, e.target.files?.[0])}
                                        disabled={isUploading}
                                    />
                                </div>

                                <div className="post-buttons">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleEdit(p)}
                                        disabled={isDeleting}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(pid)}
                                        disabled={isDeleting || isUploading}
                                        title={isDeleting ? "Se șterge..." : "Delete"}
                                    >
                                        {isDeleting ? "Se șterge..." : "Delete"}
                                    </button>
                                </div>

                                <div className="meta meta-after">
                                    <span>Autor: <strong>{p.author}</strong></span>
                                    <span>Creare: {formatDateTime(p.createdAt)}</span>
                                    <span>Modificat: {formatDateTime(p.updatedAt)}</span>
                                </div>
                            </li>
                        );
                    })}
                    {posts.length === 0 && !loading && (
                        <p className="no-posts">Nu există postări.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
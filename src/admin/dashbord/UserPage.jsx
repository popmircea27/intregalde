import React, { useEffect, useState } from "react";
import "./dashbordStyle/UserPage.css";
import { useUsersApi } from "../../api/UserApi";

export default function UserPage() {
  const usersApi = useUsersApi();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [insertOkMsg, setInsertOkMsg] = useState("");

  // rolul este fix ADMIN; nu îl mai arătăm în UI
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () =>
    setForm({ username: "", password: "", email: "", phone: "" });

  const fetchAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await usersApi.get("/users", { role: "ADMIN" });
      const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setAdmins(arr);
    } catch (err) {
      setError(err?.message || "Eroare la încărcarea utilizatorilor");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyOf = (u) =>
    u?.id ?? u?._id?.$oid ?? u?._id ?? `${u?.username}-${Math.random()}`;

  const handleDelete = async (user) => {
    if (!window.confirm(`Ștergi utilizatorul "${user?.username}"?`)) return;
    try {
      await usersApi.del(`/users/${user.id || user?._id || user?._id?.$oid || ""}`);
      await fetchAdmins();
    } catch (err) {
      alert(err?.message || "Nu s-a putut șterge utilizatorul.");
    }
  };

  const handleEdit = (user) => {
    alert(`Editează utilizatorul: ${user?.username}`);
  };

  const handleInsert = async () => {
    setInsertOkMsg("");
    try {
      // trimitem întotdeauna role: "ADMIN"
      await usersApi.post("/users", { ...form, role: "ADMIN" });
      setInsertOkMsg("Inserția a fost realizată cu succes.");
      resetForm();
      setIsAddOpen(false);
      await fetchAdmins();
    } catch (err) {
      setInsertOkMsg(err?.message || "Eroare la inserție.");
    }
  };

  return (
    <div className="user-page">
      <h1 className="up-title">Administratori</h1>

      {/* Lista admini */}
      <div className="card list-card">
        {loading && <div className="info">Se încarcă…</div>}
        {error && <div className="error">{error}</div>}

        {!loading && (
          <ul className="admin-ul">
            {(admins ?? []).map((u) => (
              <li className="admin-li" key={keyOf(u)}>
                <div className="admin-info">
                  <div className="admin-name">
                    <strong>{u?.username}</strong>
                    <span className="admin-role">ADMIN</span>
                  </div>
                  <div className="admin-meta">
                    <span>{u?.email ?? "-"}</span>
                    <span>{u?.phone ?? "-"}</span>
                  </div>
                </div>
                <div className="admin-actions">
                  <button className="btn btn-secondary" onClick={() => handleEdit(u)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(u)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {!loading && (admins ?? []).length === 0 && !error && (
              <li className="empty">Nu există administratori.</li>
            )}
          </ul>
        )}
      </div>

      {/* Caseta de acțiuni (mai mare, fără padding pe card) */}
      <div className="card actions-card">
        <div className="actions-header">
          <button className="btn btn-primary toggle" onClick={() => setIsAddOpen((v) => !v)}>
            {isAddOpen ? "– Închide formularul" : "+ Adaugă user"}
          </button>
        </div>

        {isAddOpen && (
          <div className="form big-form">
            <div className="row">
              <label>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="ex: admin01"
              />
            </div>
            <div className="row">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••"
              />
            </div>
            <div className="row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="mail@exemplu.ro"
              />
            </div>
            <div className="row">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="07xx xxx xxx"
              />
            </div>

            <div className="actions-row">
              <button className="btn btn-success" onClick={handleInsert}>
                Insert
              </button>
            </div>

            {!!insertOkMsg && <div className="ok-msg">{insertOkMsg}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

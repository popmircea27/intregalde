import React, { useEffect, useState } from "react";
import { useUsersApi } from "../../api/UserApi";
import "./dashbordStyle/UserPage.css";

export default function UserPage() {
  const usersApi = useUsersApi();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "ADMIN",
    id: null,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.get("/api/users");
      setUsers(data);
    } catch (err) {
      setError(err.message || "Eroare la încărcarea utilizatorilor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim() || !form.email.trim()) {
      alert("Username, parolă și email sunt obligatorii!");
      return;
    }

    const userData = {
      id: form.id,
      username: form.username,
      password: form.password,
      email: form.email,
      phone: form.phone,
      role: "ADMIN",
    };

    try {
      let newUser;
      if (isEditing && form.id) {
        newUser = await usersApi.put(`/api/users/${form.id}`, userData);
      } else {
        newUser = await usersApi.post("/api/users", userData);
      }

      setForm({
        username: "",
        password: "",
        email: "",
        phone: "",
        role: "ADMIN",
        id: null,
      });
      setIsEditing(false);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Eroare la salvarea adminului");
    }
  };

  const handleEdit = (user) => {
    setForm({
      username: user.username,
      password: "",
      email: user.email,
      phone: user.phone || "",
      role: user.role || "ADMIN",
      id: user.id || user._id,
    });
    setIsEditing(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Sigur vrei să ștergi adminul ${user.username}?`)) return;
    try {
      await usersApi.del(`/api/users/${user.id || user._id}`);
      setUsers((prev) =>
        prev.filter(
          (u) => (u._id || u.id) !== (user._id || user.id)
        )
      );

    } catch (err) {
      alert("Eroare la ștergerea adminului");
    }
  };

  return (
    <div className="user-admin-container">
      <div className="user-form-section">
        <h2>{isEditing ? "Editează Admin" : "Adaugă Admin Nou"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Parolă"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Telefon"
            value={form.phone}
            onChange={handleChange}
          />
          <div className="form-buttons">
            <button type="submit">{isEditing ? "Update" : "Create"}</button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setForm({
                    username: "",
                    password: "",
                    email: "",
                    phone: "",
                    role: "ADMIN",
                    id: null,
                  });
                  setIsEditing(false); 
                }}
              >
                Cancel
              </button>

            )}
          </div>
        </form>
      </div>

      <div className="users-list-section">
        <h2>Lista Adminilor</h2>
        {loading && <p>Se încarcă...</p>}
        {error && <p className="error">{error}</p>}
        <ul className="users-list">
          {users.map((u) => (
            <li key={u._id} className="user-card">
              <h3>{u.username}</h3>
              <p>Email: {u.email}</p>
              <p>Telefon: {u.phone || "—"}</p>
              <p>Rol: {u.role}</p>
              <div className="user-buttons">
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u)}>Delete</button>
              </div>
            </li>
          ))}
          {users.length === 0 && !loading && <p>Nu există admini.</p>}
        </ul>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./dashbordStyle/Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [username, setUsername] = useState("");

  //AM MODIFICAT aici , pt ca mi dadaea forbidden acces(pe langa faptul ca ma arata logat ca guest)
  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) setUsername(user);
  }, []);


  const handleLogout = () => {
    // Șterge cookie-ul username
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirecționează spre login (poți modifica ruta după cum ai nevoie)
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <p className="sidebar-user">Logged in as: {username || "Guest"}</p>
      <ul className="sidebar-menu">
        <li
          className={`menu-item ${activeTab === "addAdmin" ? "active" : ""}`}
          onClick={() => {
            console.log("Ai selectat tab-ul: addAdmin");
            setActiveTab("addAdmin")
          }}
        >
          ➕ Adăugare Admini
        </li>
        <li
          className={`menu-item ${activeTab === "addPost" ? "active" : ""}`}
          onClick={() => setActiveTab("addPost")}
        >
          📝 Adăugare Postare Nouă
        </li>
        <li
          className={`menu-item ${activeTab === "editPosts" ? "active" : ""}`}
          onClick={() => setActiveTab("editPosts")}
        >
          ✏️ Vizualizare & Editare Posturi Vechi
        </li>
        <li
          className={`menu-item ${activeTab === "story" ? "active" : ""}`}
          onClick={() => setActiveTab("story")}
        >
          📖 Editare "Povestea Noastră"
        </li>
        <li
          className={`menu-item ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          📊 Blog Stats
        </li>
      </ul>

      {/* Buton de logout */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

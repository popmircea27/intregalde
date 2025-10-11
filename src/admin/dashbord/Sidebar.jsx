import React, { useEffect, useState } from "react";
import {
  MdPersonAddAlt1,
  MdPostAdd,
  MdEditNote,
  MdLibraryBooks,
  MdBarChart,
  MdLogout,
} from "react-icons/md";
import "./dashbordStyle/Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
  const user = localStorage.getItem("username");
  if (user) {
    const usernamePart = user.includes("@") ? user.split("@")[0] : user;
    setUsername(usernamePart);
  }
}, []);


  const handleLogout = () => {
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <p className="sidebar-user">Logged in as: {username || "Guest"}</p>

      <ul className="sidebar-menu">
        <li
          className={`menu-item ${activeTab === "addAdmin" ? "active" : ""}`}
          onClick={() => setActiveTab("addAdmin")}
        >
          <MdPersonAddAlt1 className="menu-icon" />
          Adăugare Admini
        </li>

       

        <li
          className={`menu-item ${activeTab === "editPosts" ? "active" : ""}`}
          onClick={() => setActiveTab("editPosts")}
        >
          <MdEditNote className="menu-icon" />
          Adăugare Vizualizare & Editare Posturi
        </li>

        <li
          className={`menu-item ${activeTab === "poveste" ? "active" : ""}`}
          onClick={() => setActiveTab("poveste")}
        >
          <MdLibraryBooks className="menu-icon" />
          Povestea Noastră
        </li>

        <li
          className={`menu-item ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          <MdBarChart className="menu-icon" />
          Blog Stats
        </li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        <MdLogout className="menu-icon" />
        Logout
      </button>
    </aside>
  );
}

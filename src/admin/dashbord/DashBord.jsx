// DashBord.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import UserPage from "./UserPage";
import "./dashbordStyle/DashboardLayout.css"; // 👈 nou
import PostsAdmin from "./PostsAdmin"; // ajustează calea
import PovesteaNoastraAdmin from "./PovesteaNoastraAdmin";



export default function DashBord() {
  const [activeTab, setActiveTab] = useState("homepage");

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* zona de conținut NU se mai strânge */}
      <div className="content">
        {/* (opțional) container interior pentru aliniere/centrare */}
        <div className="content-inner">
          {activeTab === "posts" && <PostsAdmin tab="all" />}
          {activeTab === "addPost" && <PostsAdmin tab="add" />}
          {activeTab === "editPosts" && <PostsAdmin tab="edit" />}
          {activeTab === "addAdmin" && <UserPage />}
          {activeTab === "poveste" && <PovesteaNoastraAdmin />}



          {activeTab !== "addAdmin" && activeTab !== "addPost" && activeTab !== "editPosts" && (
            <MainContent activeTab={activeTab} />
          )}
        </div>

      </div>
    </div>
  );
}

// DashBord.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import UserPage from "./UserPage";
import "./dashbordStyle/DashboardLayout.css"; // 👈 nou

export default function DashBord() {
  const [activeTab, setActiveTab] = useState("homepage");

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* zona de conținut NU se mai strânge */}
      <div className="content">
        {/* (opțional) container interior pentru aliniere/centrare */}
        <div className="content-inner">
          {activeTab === "addAdmin" ? (
            <UserPage />
          ) : (
            <MainContent activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
}

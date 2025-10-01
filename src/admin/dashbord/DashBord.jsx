import { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

export default function DashBord() {
  const [activeTab, setActiveTab] = useState("homepage");

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainContent activeTab={activeTab} />
    </div>
  );
}

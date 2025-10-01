export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 rounded-r-2xl">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <p className="mb-4">Logged in as: Admin</p>
      <ul className="space-y-2">
        <li
          className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-700 ${
            activeTab === "homepage" ? "bg-gray-700" : ""
          }`}
          onClick={() => setActiveTab("homepage")}
        >
          Homepage
        </li>
        <li
          className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-700 ${
            activeTab === "posts" ? "bg-gray-700" : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </li>
      </ul>
    </aside>
  );
}

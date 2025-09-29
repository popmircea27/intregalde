import { useState } from "react";
import { usePostsApi } from "../src/api/PostApi";
import { useUsersApi } from "../src/api/UserApi";

export default function ApiPlayground() {
  const postsApi = usePostsApi();
  const usersApi = useUsersApi();

  const [log, setLog] = useState([]);

  const addLog = (label, data) => {
    const time = new Date().toLocaleTimeString();
    setLog((prev) => [{ time, label, data }, ...prev]);
  };

  // ---------- USERS ----------
  const doUsersList = async () => {
    try {
      const users = await usersApi.getAll();
      addLog("users/getAll OK", users);
    } catch (e) {
      addLog("users/getAll ERR", e.message || e.toString());
    }
  };

  const doUserCreate = async () => {
    try {
      const u = {
        username: "john_" + Math.floor(Math.random() * 10000),
        password: "p@ss",
        email: "john@example.com",
        phone: "0700",
        role: "ADMIN",
      };
      const created = await usersApi.create(u);
      addLog("users/create OK", created);
    } catch (e) {
      addLog("users/create ERR", e.message || e.toString());
    }
  };

  // ---------- POSTS ----------
  const doPostsList = async () => {
    try {
      const posts = await postsApi.getAll();
      addLog("posts/getAll OK", posts);
    } catch (e) {
      addLog("posts/getAll ERR", e.message || e.toString());
    }
  };

  const doPostCreate = async () => {
    try {
      const p = {
        title: "Hello " + Math.floor(Math.random() * 10000),
        content: "World",
        author: "admin",
      };
      const created = await postsApi.create(p);
      addLog("posts/create OK", created);
    } catch (e) {
      addLog("posts/create ERR", e.message || e.toString());
    }
  };

  return (
    <div>
      <h2>API Playground</h2>

      <section>
        <h3>Users</h3>
        <div>
          <button onClick={doUsersList}>GET /api/users</button>
          <button onClick={doUserCreate}>POST /api/users (create)</button>
        </div>
      </section>

      <section>
        <h3>Posts</h3>
        <div>
          <button onClick={doPostsList}>GET /api/posts</button>
          <button onClick={doPostCreate}>POST /api/posts (create)</button>
        </div>
      </section>

      <section>
        <h3>Log</h3>
        {log.length === 0 ? (
          <p>Nimic încă…</p>
        ) : (
          <ul>
            {log.map((entry, idx) => (
              <li key={idx}>
                <code>
                  <strong>[{entry.time}] {entry.label}:</strong>
                </code>
                <pre>
                  {typeof entry.data === "string"
                    ? entry.data
                    : JSON.stringify(entry.data, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

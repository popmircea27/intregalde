// MainContent.jsx
import { useEffect, useState } from "react";
import { useHomepagePostsApi } from "../../api/HomepagePostApi";
import { usePostsApi } from "../../api/PostApi";

export default function MainContent({ activeTab }) {
  const homepageApi = useHomepagePostsApi();
  const postsApi = usePostsApi();

  const [homepagePosts, setHomepagePosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  // helper: întoarce mereu un array
  const toArray = (res) =>
    Array.isArray(res?.data) ? res.data :
    Array.isArray(res) ? res : [];

  // Fetch homepage posts
  useEffect(() => {
    if (activeTab !== "homepage") return;
    
    let mounted = true;
    const fetchPosts = async () => {
        try {
            const res = await homepageApi.getAll();
            if (mounted) setHomepagePosts(toArray(res));
        } catch {
            if (mounted) setHomepagePosts([]);
        }
    };
    
    fetchPosts();
    return () => { mounted = false; };
}, [activeTab, homepageApi]); // doar homepageApi, nu metoda

  // Fetch posts
  useEffect(() => {
    if (activeTab !== "posts") return;
    postsApi.getAll()
      .then((res) => setAllPosts(toArray(res)))
      .catch(() => setAllPosts([]));
  }, [activeTab, postsApi]);

  // cheie robustă pentru Mongo: _id.$oid || _id || id
  const keyOf = (x) => x?.id ?? x?._id?.$oid ?? x?._id ?? crypto.randomUUID();

  return (
    <main className="flex-1 bg-gray-100 p-6 rounded-l-2xl">
      {activeTab === "homepage" && (
        <div>
          <h1 className="text-xl font-bold mb-4">Homepage Posts</h1>
          <ul>
            {(homepagePosts ?? []).map((post) => (
              <li key={keyOf(post)} className="mb-2">
                {/* HomepagePost nu are title; afișăm content + author */}
                <div className="font-medium">{post.content ?? "(fără conținut)"}</div>
                {post.author && <div className="text-xs text-gray-600">by {post.author}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "posts" && (
        <div>
          <h1 className="text-xl font-bold mb-4">All Posts</h1>
          <ul>
            {(allPosts ?? []).map((post) => (
              <li key={keyOf(post)} className="mb-2">
                <div className="font-medium">{post.title ?? "(untitled)"}</div>
                {post.author && <div className="text-xs text-gray-600">by {post.author}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

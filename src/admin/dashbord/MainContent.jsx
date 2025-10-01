// MainContent.jsx
import { useEffect, useState } from "react";
import { useHomepagePostsApi } from "../../api/HomepagePostApi";
import { usePostsApi } from "../../api/PostApi";

export default function MainContent({ activeTab }) {
  const homepageApi = useHomepagePostsApi();
  const postsApi = usePostsApi();

  const [homepagePosts, setHomepagePosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  // Fetch homepage posts
  useEffect(() => {
    if (activeTab === "homepage") {
      homepageApi.getAll().then(res => setHomepagePosts(res.data));
    }
  }, [activeTab, homepageApi]);

  // Fetch posts
  useEffect(() => {
    if (activeTab === "posts") {
      postsApi.getAll().then(res => setAllPosts(res.data));
    }
  }, [activeTab, postsApi]);

  return (
    <main className="flex-1 bg-gray-100 p-6 rounded-l-2xl">
      {activeTab === "homepage" && (
        <div>
          <h1 className="text-xl font-bold mb-4">Homepage Posts</h1>
          <ul>
            {homepagePosts.map(post => (
              <li key={post.id} className="mb-2">{post.title}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "posts" && (
        <div>
          <h1 className="text-xl font-bold mb-4">All Posts</h1>
          <ul>
            {allPosts.map(post => (
              <li key={post.id} className="mb-2">{post.title}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

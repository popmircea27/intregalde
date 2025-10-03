import { useMemo } from "react";
import { useUsersApi } from "./UserApi";

export function usePostsApi() {
  const api = useUsersApi(); // ia baseURL din VITE_API_BASE_URL

  return useMemo(() => ({
    /** Listă toate postările */
    getAll: () => api.get("/api/posts"),

    /** Ia o postare după ID */
    getById: (id) => {
      if (!id) throw new Error("id obligatoriu");
      return api.get(`/api/posts/${encodeURIComponent(id)}`);
    },

    /** Creează o postare nouă (doar admin) */
    create: (post) => {
      if (!post) throw new Error("post obligatoriu");
      return api.post("/api/posts", post);
    },

    /** Actualizează o postare */
    update: (id, post) => {
      if (!id) throw new Error("id obligatoriu");
      if (!post) throw new Error("post obligatoriu");
      return api.put(`/api/posts/${encodeURIComponent(id)}`, post);
    },

    /** Șterge o postare */
    remove: (id) => {
      if (!id) throw new Error("id obligatoriu");
      return api.del(`/api/posts/${encodeURIComponent(id)}`);
    }
  }), [api]);
}
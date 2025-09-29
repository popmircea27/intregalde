import { useMemo } from "react";
import { useUsersApi } from "./UserApi";

export function useHomepagePostsApi() {
  const api = useUsersApi(); // ia baseURL din VITE_API_BASE_URL

  return useMemo(() => ({
    /** Listă toate homepage posts */
    getAll: () => api.get("/api/homepage"),

    /** Ia un homepage post după ID */
    getById: (id) => {
      if (!id) throw new Error("id obligatoriu");
      return api.get(`/api/homepage/${encodeURIComponent(id)}`);
    },

    /** Creează un homepage post nou (doar admin) */
    create: (post) => {
      if (!post) throw new Error("post obligatoriu");
      return api.post("/api/homepage", post);
    },

    /** Actualizează un homepage post */
    update: (id, post) => {
      if (!id) throw new Error("id obligatoriu");
      if (!post) throw new Error("post obligatoriu");
      return api.put(`/api/homepage/${encodeURIComponent(id)}`, post);
    },

    /** Șterge un homepage post */
    remove: (id) => {
      if (!id) throw new Error("id obligatoriu");
      return api.del(`/api/homepage/${encodeURIComponent(id)}`);
    }
  }), [api]);
}

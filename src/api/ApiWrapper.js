import Logger from "../utils/logger";

export function wrapApi(api) {
  return {
    get: async (url, options) => {
      Logger.debug("GET request", { url, options });
      try {
        const res = await api.get(url, options);
        Logger.debug("GET response", res);
        return res;
      } catch (err) {
        Logger.error("GET error", { url, err });
        throw err;
      }
    },
    post: async (url, body, options) => {
      Logger.debug("POST request", { url, body, options });
      try {
        const res = await api.post(url, body, options);
        Logger.debug("POST response", res);
        return res;
      } catch (err) {
        Logger.error("POST error", { url, body, err });
        throw err;
      }
    },
    put: async (url, body, options) => {
      Logger.debug("PUT request", { url, body, options });
      try {
        const res = await api.put(url, body, options);
        Logger.debug("PUT response", res);
        return res;
      } catch (err) {
        Logger.error("PUT error", { url, body, err });
        throw err;
      }
    },
    del: async (url, options) => {
      Logger.debug("DELETE request", { url, options });
      try {
        const res = await api.del(url, options);
        Logger.debug("DELETE response", res);
        return res;
      } catch (err) {
        Logger.error("DELETE error", { url, err });
        throw err;
      }
    },
  };
}

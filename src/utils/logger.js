// src/utils/logger.js
const logApiCalls = import.meta.env.VITE_API_LOG === "true";
const Logger = {
  debug: (message, data) => {
    if (logApiCalls) console.log("[API DEBUG]", message, data || "");
  },
  info: (message, data) => {
    if (logApiCalls) console.info("[API INFO]", message, data || "");
  },
  error: (message, data) => {
    if (logApiCalls) console.error("[API ERROR]", message, data || "");
  },
};


export default Logger;

import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

console.log("import.meta.env.VITE_API_BASE", import.meta.env.VITE_API_BASE);

export const api = axios.create({ baseURL: BASE });

export const getConversations = () =>
  api.get("/api/conversations").then((r) => r.data);
export const getMessages = (wa_id) =>
  api.get(`/api/conversations/${wa_id}/messages`).then((r) => r.data);
export const sendMessage = (payload) =>
  api.post("/api/messages", payload).then((r) => r.data);

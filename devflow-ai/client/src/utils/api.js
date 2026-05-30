import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Auth APIs
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Project APIs
export const getProjects = () => API.get("/projects");
export const getProjectById = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post("/projects", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// Chat APIs
export const sendMessage = (data) => API.post("/chat/send", data);
export const getChatHistory = () => API.get("/chat/history");
export const getChatById = (chatId) => API.get(`/chat/${chatId}`);
export const deleteChat = (chatId) => API.delete(`/chat/${chatId}`);

// Dashboard API
export const getDashboardStats = () => API.get("/dashboard/stats");

export default API;

import axios from "axios";
import type { ActionResponse, Container, Stats } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  timeout: 10000,
});

export const fetchContainers = async () => {
  const { data } = await api.get<Container[]>("/containers");
  return data;
};

export const fetchStats = async (id: string) => {
  const { data } = await api.get<Stats>(`/containers/${id}/stats`);
  return data;
};

const postAction = async (path: string) => {
  const { data } = await api.post<ActionResponse>(path);
  return data;
};

export const startContainer = (id: string) =>
  postAction(`/containers/${id}/start`);

export const stopContainer = (id: string) =>
  postAction(`/containers/${id}/stop`);

export const restartContainer = (id: string) =>
  postAction(`/containers/${id}/restart`);

export function openLogSocket(id: string) {
  const configured = import.meta.env.VITE_WS_URL;

  if (configured) {
    return new WebSocket(`${configured.replace(/\/$/, "")}/ws/logs/${id}`);
  }

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.hostname || "localhost";
  const port = ":4000";

  return new WebSocket(`${protocol}://${host}${port}/ws/logs/${id}`);
}

export default api;

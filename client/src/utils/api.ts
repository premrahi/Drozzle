import axios from "axios";
import type { AxiosResponse } from "axios";
import type { ActionResponse, Container, Stats } from "../types";

const api = axios.create({
  baseURL: "http://localhost:5000/containers",
  responseType: "text",                  // don't let axios auto-parse
  transformResponse: [(data) => data],   // keep the raw body, like fetch
  validateStatus: () => true,            // never throw on HTTP status, like fetch
});

function parse<T>(res: AxiosResponse<string>, errorMessage: string): T {
  // same check as fetch's res.ok (200–299)
  if (res.status < 200 || res.status >= 300) throw new Error(errorMessage);
  // same as res.json(): throws on empty or invalid JSON
  return JSON.parse(res.data) as T;
}

export async function fetchContainers(): Promise<Container[]> {
  const res = await api.get<string>(""); // "" -> /containers (no trailing slash)
  return parse<Container[]>(res, "Failed to fetch containers");
}

export async function fetchStats(id: string): Promise<Stats> {
  const res = await api.get<string>(`/${id}/stats`);
  return parse<Stats>(res, "Failed to fetch stats");
}

export async function startContainer(id: string): Promise<ActionResponse> {
  const res = await api.post<string>(`/${id}/start`);
  return parse<ActionResponse>(res, "Failed to start container");
}

export async function stopContainer(id: string): Promise<ActionResponse> {
  const res = await api.post<string>(`/${id}/stop`);
  return parse<ActionResponse>(res, "Failed to stop container");
}

export async function restartContainer(id: string): Promise<ActionResponse> {
  const res = await api.post<string>(`/${id}/restart`);
  return parse<ActionResponse>(res, "Failed to restart container");
}

export function openLogSocket(id: string): WebSocket {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  // Backend runs on :4000 in dev; adjust if you proxy this in vite.config.ts
  return new WebSocket(`${protocol}://localhost:4000/ws/logs/${id}`);
}
import type { Container, Stats, StatsPoint, ActionResponse } from "./types";

export type Theme = "dark" | "light";
export type View = "landing" | "dashboard";
export type ContainerAction = (containerId: string) => Promise<ActionResponse>;

export interface MonitoringState {
  containers: Container[];
  selectedId: string | null;
  history: StatsPoint[];
  statsById: Record<string, Stats>;
  lastRefresh: Date;
  busyId: string | null;
  error: string | null;
}

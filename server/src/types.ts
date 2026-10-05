export interface PortInfo {
  private: number;
  public?: number;
  type: string;
}

export interface ContainerSummary {
  id: string;
  name: string;
  image: string;
  status: string;
  /** "running" | "exited" | "paused" | ... */
  state: string;
  ports: PortInfo[];
}

export interface ContainerStatsSnapshot {
  cpuPercent: number;
  memUsageMB: number;
  memLimitMB: number;
  memPercent: number;
}

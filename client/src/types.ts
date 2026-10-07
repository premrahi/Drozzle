export interface PortInfo {
  private: number;
  public?: number;
  type: string;
}

export interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  ports: PortInfo[];
}

export interface Stats {
  cpuPercent: number;
  memUsageMB: number;
  memLimitMB: number;
  memPercent: number;
  networkRxBytes: number;
  networkTxBytes: number;
  packetsDroppedIn: number;
  packetsDroppedOut: number;
}

export interface StatsPoint extends Stats {
  time: number;
}

export interface ActionResponse {
  ok: boolean;
}

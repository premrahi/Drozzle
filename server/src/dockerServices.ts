import Docker from "dockerode";
import type { ContainerStatsSnapshot, ContainerSummary } from "./types.js";


const docker = new Docker();

export async function listContainers(): Promise<ContainerSummary[]> {
  const containers = await docker.listContainers({ all: true });
  return containers.map((c) => ({
    id: c.Id,
    name: c.Names?.[0]?.replace(/^\//, "") ?? c.Id.slice(0, 12),
    image: c.Image,
    status: c.Status,
    state: c.State, // "running" | "exited" | "paused" | ...
    ports: c.Ports.map((p) => ({
      private: p.PrivatePort,
      public: p.PublicPort,
      type: p.Type,
    })),
  }));
}

export async function startContainer(id: string): Promise<void> {
  const container = docker.getContainer(id);
  await container.start();
}

export async function stopContainer(id: string): Promise<void> {
  const container = docker.getContainer(id);
  await container.stop();
}

export async function restartContainer(id: string): Promise<void> {
  const container = docker.getContainer(id);
  await container.restart();
}


export async function getContainerStats(id: string): Promise<ContainerStatsSnapshot> {
  const container = docker.getContainer(id);
  const stats = await container.stats({ stream: false });

  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const cpuCount = stats.cpu_stats.online_cpus || 1;
  const cpuPercent =
    systemDelta > 0 && cpuDelta > 0
      ? (cpuDelta / systemDelta) * cpuCount * 100
      : 0;

  const memUsage = stats.memory_stats.usage ?? 0;
  const memLimit = stats.memory_stats.limit ?? 1;
  const memPercent = (memUsage / memLimit) * 100;

  return {
    cpuPercent: Number(cpuPercent.toFixed(2)),
    memUsageMB: Number((memUsage / 1024 / 1024).toFixed(1)),
    memLimitMB: Number((memLimit / 1024 / 1024).toFixed(1)),
    memPercent: Number(memPercent.toFixed(2)),
  };
}

export interface LogStreamOptions {
  tail?: number;
}


export function getLogStream(
  id: string,
  { tail = 100 }: LogStreamOptions = {}
): Promise<NodeJS.ReadableStream> {
  const container = docker.getContainer(id);
  return container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    tail,
    timestamps: true,
  });
}

export default docker;

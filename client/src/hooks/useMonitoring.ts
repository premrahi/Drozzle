import { useCallback, useEffect, useState } from "react";
import {
  fetchContainers,
  fetchStats,
  restartContainer,
  startContainer,
  stopContainer,
} from "../api";
import type { Container, Stats, StatsPoint } from "../types";
import type { ContainerAction } from "../appTypes";

const CONTAINER_POLL_MS = 5000;
const STATS_POLL_MS = 3000;
const MAX_HISTORY = 24;

export function useMonitoring(enabled: boolean) {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statsById, setStatsById] = useState<Record<string, Stats>>({});
  const [history, setHistory] = useState<StatsPoint[]>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const nextContainers = await fetchContainers();

      setContainers(nextContainers);
      setSelectedId((current) => {
        if (current && nextContainers.some((item) => item.id === current)) {
          return current;
        }

        return (
          nextContainers.find((item) => item.state === "running")?.id ??
          nextContainers[0]?.id ??
          null
        );
      });
      setLastRefresh(new Date());
      setError(null);
    } catch (error) {
      console.error("Failed to load containers:", error);
      setError("Unable to connect to the Drozzle backend on port 4000.");
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    void refresh();

    const timer = window.setInterval(() => {
      void refresh();
    }, CONTAINER_POLL_MS);

    return () => window.clearInterval(timer);
  }, [enabled, refresh]);

  useEffect(() => {
    if (!enabled || containers.length === 0) return;

    let cancelled = false;

    const collectStats = async () => {
      const running = containers.filter((item) => item.state === "running");

      const results = await Promise.all(
        running.map(async (container) => {
          try {
            return [container.id, await fetchStats(container.id)] as const;
          } catch {
            return null;
          }
        }),
      );

      if (cancelled) return;

      const nextStats: Record<string, Stats> = {};

      for (const result of results) {
        if (result) nextStats[result[0]] = result[1];
      }

      setStatsById(nextStats);

      if (selectedId && nextStats[selectedId]) {
        setHistory((current) => [
          ...current,
          { ...nextStats[selectedId], time: Date.now() },
        ].slice(-MAX_HISTORY));
      }
    };

    void collectStats();

    const timer = window.setInterval(() => {
      void collectStats();
    }, STATS_POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled, containers, selectedId]);

  useEffect(() => {
    setHistory([]);
  }, [selectedId]);

  const handleAction = useCallback(
    async (id: string, action: ContainerAction) => {
      try {
        setBusyId(id);
        setError(null);
        await action(id);
        await refresh();
      } catch (error) {
        console.error("Container action failed:", error);
        setError("Container action failed. Check Docker and try again.");
      } finally {
        setBusyId(null);
      }
    },
    [refresh],
  );

  return {
    containers,
    selectedId,
    setSelectedId,
    statsById,
    history,
    lastRefresh,
    busyId,
    error,
    setError,
    refresh,
    handleAction,
    actions: {
      startContainer,
      stopContainer,
      restartContainer,
    },
  };
}

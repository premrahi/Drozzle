import { useEffect, useState, useCallback } from "react";
import ContainerList from "./components/ContainerList";
import {
  fetchContainers,
  startContainer,
  stopContainer,
  restartContainer,
} from "./utils/api";
import type { ActionResponse, Container } from "./types";
import "./index.css";
import Header from "./components/Header";

const POLL_MS = 3000;

export default function App() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchContainers();
      setContainers(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleAction =
    (action: (id: string) => Promise<ActionResponse>) =>
    async (id: string) => {
      await action(id);
      refresh();
    };

  return (
    <div className="app">
     <Header />
      <main>

        
        <ContainerList
          containers={containers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onStart={handleAction(startContainer)}
          onStop={handleAction(stopContainer)}
          onRestart={handleAction(restartContainer)}
        />


       
      
      </main>
    </div>
  );
}

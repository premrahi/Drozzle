import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { openLogSocket } from "../api";

interface Props {
  containerId: string | null;
}

export default function LogPanel({ containerId }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerId) return;

    setLines([]);

    let socket: WebSocket;

    try {
      socket = openLogSocket(containerId);
    } catch {
      setLines(["-- unable to connect to log server --"]);
      return;
    }

    socket.onmessage = (event) => {
      const nextLines = String(event.data)
        .split("\n")
        .filter(Boolean);

      setLines((current) => [...current, ...nextLines].slice(-500));
    };

    socket.onerror = () => {
      setLines((current) => [
        ...current,
        "-- websocket connection error --",
      ]);
    };

    return () => socket.close();
  }, [containerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  if (!containerId) {
    return (
      <div className="log-panel empty">
        Select a container to view logs.
      </div>
    );
  }

  const visibleLines = filter
    ? lines.filter((line) =>
        line.toLowerCase().includes(filter.toLowerCase()),
      )
    : lines;

  return (
    <div className="log-panel">
      <div className="log-header">
        <div className="log-search">
          <Search size={14} />
          <input
            placeholder="Filter logs..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>

        <span>{visibleLines.length} lines</span>
      </div>

      <pre className="log-output">
        {visibleLines.map((line, index) => (
          <div key={`${index}-${line}`}>{line}</div>
        ))}
        <div ref={bottomRef} />
      </pre>
    </div>
  );
}

import type { Container } from "../types";

interface ContainerListProps {
  containers: Container[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
}

export default function ContainerList({
  containers,
  selectedId,
  onSelect,
  onStart,
  onStop,
  onRestart,
}: ContainerListProps) {
  return (
    <div>
      <h2>Containers</h2>
      <ul>
        {containers.map((c) => (
          <li
            key={c.id}
            className={c.id === selectedId ? "selected" : ""}
            onClick={() => onSelect(c.id)}
          >
            <div className="row">
              <span className={`status-dot ${c.state}`} />
              <span className="name"> {c.name}</span>
            </div>

            <div className="meta">{c.image}</div>
            <div className="meta">{c.status}</div>
            <div className="actions" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onStart(c.id)}>Start</button>
              <button onClick={() => onStop(c.id)}>Stop</button>
              <button onClick={() => onRestart(c.id)}>Restart</button>
            </div>
          </li>
        ))}
        {containers.length === 0 && <p>No Containers found.</p>}
      </ul>
    </div>
  );
}

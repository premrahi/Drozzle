import { Play, RotateCw, XCircle } from "lucide-react";
import type { Container, Stats } from "../../types";
import type { ContainerAction } from "../../appTypes";
import MetaItem from "../common/MetaItem";
import { number, statusLabel } from "../../utils";

interface Props { container: Container; latest?: Stats; busy: boolean; onAction: (id: string, action: ContainerAction) => void; actions: { startContainer: ContainerAction; stopContainer: ContainerAction; restartContainer: ContainerAction }; }

export default function ContainerControl({ container, latest, busy, onAction, actions }: Props) {
  return (
    <div className="panel container-card">
      <div className="panel-header"><div><span className="panel-kicker">Container control</span><h3>{container.name}</h3></div><span className={`status-badge ${container.state}`}>{statusLabel(container.state)}</span></div>
      <div className="container-meta-grid"><MetaItem label="Image" value={container.image} /><MetaItem label="Status" value={container.status} /><MetaItem label="Memory" value={latest ? `${number.format(latest.memUsageMB)} MB` : "—"} /><MetaItem label="CPU" value={latest ? `${number.format(latest.cpuPercent)}%` : "—"} /></div>
      <div className="control-actions">
        <button onClick={() => onAction(container.id, actions.startContainer)} disabled={busy || container.state === "running"}><Play size={15} /> Start</button>
        <button onClick={() => onAction(container.id, actions.stopContainer)} disabled={busy || container.state !== "running"}><XCircle size={15} /> Stop</button>
        <button onClick={() => onAction(container.id, actions.restartContainer)} disabled={busy}><RotateCw size={15} /> Restart</button>
      </div>
    </div>
  );
}

import { RotateCw, Search } from "lucide-react";
import type { Container } from "../../types";
import type { ContainerAction } from "../../appTypes";
import LogPanel from "../LogPanel";

export default function LogsCard({ container, busy, onRestart, action }: { container: Container; busy: boolean; onRestart: ContainerAction; action: (id: string, fn: ContainerAction) => void }) {
  return (
    <div className="panel logs-card">
      <div className="panel-header"><div><span className="panel-kicker">Live stream</span><h3>Logs · {container.name}</h3></div><div className="panel-tools"><Search size={16} /><button onClick={() => action(container.id, onRestart)} disabled={busy}><RotateCw size={14} /> Restart</button></div></div>
      <LogPanel containerId={container.id} />
    </div>
  );
}

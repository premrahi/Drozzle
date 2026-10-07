import { MoreHorizontal, Search } from "lucide-react";
import type { Container, Stats } from "../../types";

export default function PacketsTable({ containers, statsById }: { containers: Container[]; statsById: Record<string, Stats> }) {
  return (
    <div className="panel table-panel">
      <div className="panel-header"><h3>Packets dropped</h3><div className="table-tools"><Search size={16} /><MoreHorizontal size={16} /></div></div>
      <table><thead><tr><th>container.name</th><th>Incoming packets dropped</th><th>Outgoing packets dropped</th></tr></thead>
        <tbody>{containers.map((container) => { const stat = statsById[container.id]; return <tr key={container.id}><td><span className={`status-dot ${container.state}`} />{container.name}</td><td>{stat?.packetsDroppedIn ?? 0}</td><td>{stat?.packetsDroppedOut ?? 0}</td></tr>; })}</tbody>
      </table>
    </div>
  );
}

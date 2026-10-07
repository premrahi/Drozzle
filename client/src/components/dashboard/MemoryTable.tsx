import { MoreHorizontal, Search } from "lucide-react";
import type { Container, Stats } from "../../types";
import { number } from "../../utils";

interface Props { containers: Container[]; statsById: Record<string, Stats>; onSelect: (id: string) => void; }

export default function MemoryTable({ containers, statsById, onSelect }: Props) {
  return (
    <div className="panel table-panel">
      <div className="panel-header"><h3>Mem usage / Mem limit</h3><div className="table-tools"><Search size={16} /><MoreHorizontal size={16} /></div></div>
      <table><thead><tr><th>container.name</th><th>Mem usage (in MB)</th><th>Mem limit (in GB)</th><th>Usage %</th></tr></thead>
        <tbody>{containers.map((container) => { const stat = statsById[container.id]; const usage = stat?.memUsageMB ?? 0; const limit = stat?.memLimitMB ?? 0; return (
          <tr key={container.id} onClick={() => onSelect(container.id)}><td><span className={`status-dot ${container.state}`} />{container.name}</td><td>{number.format(usage)}</td><td>{limit ? number.format(limit / 1024) : "—"}</td><td><div className="usage-cell"><span>{stat ? number.format(stat.memPercent) : "0"}%</span><b><i style={{ width: `${Math.min(stat?.memPercent ?? 0, 100)}%` }} /></b></div></td></tr>
        ); })}</tbody>
      </table>
    </div>
  );
}

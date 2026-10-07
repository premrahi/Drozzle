import type { ReactNode } from "react";
import { Database, FileText, Network, Settings } from "lucide-react";
import type { ContainerAction } from "../../appTypes";
import type { Container, Stats, StatsPoint } from "../../types";
import { formatBytes, formatTime, number, statusLabel } from "../../utils";
import AnalyticsChart from "./AnalyticsChart";
import AnalyticsToolbar from "./AnalyticsToolbar";
import ContainerControl from "./ContainerControl";
import LogsCard from "./LogsCard";
import MemoryTable from "./MemoryTable";
import MetricGrid from "./MetricGrid";
import PacketsTable from "./PacketsTable";

interface Props {
  activeNav: string;
  containers: Container[];
  selected: Container | null;
  selectedId: string | null;
  history: StatsPoint[];
  statsById: Record<string, Stats>;
  busyId: string | null;
  onSelect: (id: string) => void;
  onAction: (id: string, action: ContainerAction) => void;
  actions: {
    startContainer: ContainerAction;
    stopContainer: ContainerAction;
    restartContainer: ContainerAction;
  };
}

function EmptySection({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <section className="empty-section panel">
      <div className="empty-section-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}

function ContainersView({ containers, statsById, selected, selectedId, busyId, onSelect, onAction, actions }: Omit<Props, "activeNav" | "history">) {
  return (
    <>
      <div className="section-heading">
        <div>
          <span className="panel-kicker">Docker environment</span>
          <h2>Containers</h2>
        </div>
        <span className="section-count">{containers.length} total</span>
      </div>

      <div className="panel table-panel">
        <div className="panel-header"><h3>All containers</h3></div>
        <table>
          <thead><tr><th>Name</th><th>Image</th><th>Status</th><th>CPU</th><th>Memory</th><th>Actions</th></tr></thead>
          <tbody>
            {containers.map((container) => {
              const stat = statsById[container.id];
              const active = container.id === selectedId;
              return (
                <tr key={container.id} className={active ? "selected-row" : ""} onClick={() => onSelect(container.id)}>
                  <td><span className={`status-dot ${container.state}`} />{container.name}</td>
                  <td>{container.image}</td>
                  <td><span className={`status-badge ${container.state}`}>{statusLabel(container.state)}</span></td>
                  <td>{stat ? `${number.format(stat.cpuPercent)}%` : "—"}</td>
                  <td>{stat ? `${number.format(stat.memUsageMB)} MB` : "—"}</td>
                  <td>
                    <div className="table-actions" onClick={(event) => event.stopPropagation()}>
                      <button disabled={busyId === container.id || container.state === "running"} onClick={() => onAction(container.id, actions.startContainer)}>Start</button>
                      <button disabled={busyId === container.id || container.state !== "running"} onClick={() => onAction(container.id, actions.stopContainer)}>Stop</button>
                      <button disabled={busyId === container.id} onClick={() => onAction(container.id, actions.restartContainer)}>Restart</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && <ContainerControl container={selected} latest={statsById[selected.id]} busy={busyId === selected.id} onAction={onAction} actions={actions} />}
    </>
  );
}

export default function DashboardContent(props: Props) {
  const { activeNav, containers, selected, selectedId, history, statsById, busyId, onSelect, onAction, actions } = props;
  const running = containers.filter((container) => container.state === "running").length;
  const stopped = containers.length - running;
  const values = Object.values(statsById);
  const totalMemory = values.reduce((sum, stats) => sum + stats.memUsageMB, 0);
  const avgCpu = values.length ? values.reduce((sum, stats) => sum + stats.cpuPercent, 0) / values.length : 0;
  const chartData = history.map((point) => ({ ...point, label: formatTime(point.time) }));
  const networkData = history.map((point) => ({
    label: formatTime(point.time),
    rx: Number((point.networkRxBytes / 1024 ** 3).toFixed(3)),
    tx: Number((point.networkTxBytes / 1024 ** 3).toFixed(3)),
  }));

  if (activeNav === "Containers") {
    return <ContainersView {...props} />;
  }

  if (activeNav === "Metrics") {
    return (
      <>
        <AnalyticsToolbar selected={selected} />
        <MetricGrid running={running} stopped={stopped} avgCpu={avgCpu} memory={formatBytes(totalMemory * 1024 ** 2)} />
        <section className="charts-grid">
          <AnalyticsChart title="Network Bytes Received" data={networkData} keys={["rx", "tx"]} colors={["#1da1ff", "#8b5cf6"]} suffix=" GB" />
          <AnalyticsChart title="Container Memory Percent" data={chartData} keys={["memPercent", "cpuPercent"]} colors={["#1da1ff", "#a855f7"]} suffix="%" />
        </section>
      </>
    );
  }

  if (activeNav === "Logs") {
    return selected
      ? <LogsCard container={selected} busy={busyId === selected.id} onRestart={actions.restartContainer} action={onAction} />
      : <EmptySection icon={<FileText />} title="No container selected" description="Start a container or select one from the Containers section to view live logs." />;
  }

  if (activeNav === "Networks") {
    return <EmptySection icon={<Network />} title="Networks" description="Network details are not exposed by the current backend API yet. The monitoring dashboard will continue using container network statistics." />;
  }

  if (activeNav === "Volumes") {
    return <EmptySection icon={<Database />} title="Volumes" description="Volume management is not exposed by the current backend API yet. This section is ready for a future endpoint." />;
  }

  if (activeNav === "Settings") {
    return <EmptySection icon={<Settings />} title="Settings" description="Use the theme control in the top bar to switch between the dark and light interface." />;
  }

  return (
    <>
      <AnalyticsToolbar selected={selected} />
      <MetricGrid running={running} stopped={stopped} avgCpu={avgCpu} memory={formatBytes(totalMemory * 1024 ** 2)} />
      <section className="charts-grid">
        <AnalyticsChart title="Network Bytes Received" data={networkData} keys={["rx", "tx"]} colors={["#1da1ff", "#8b5cf6"]} suffix=" GB" />
        <AnalyticsChart title="Container Memory Percent" data={chartData} keys={["memPercent", "cpuPercent"]} colors={["#1da1ff", "#a855f7"]} suffix="%" />
      </section>
      <section className="tables-grid">
        <MemoryTable containers={containers} statsById={statsById} onSelect={onSelect} />
        <PacketsTable containers={containers} statsById={statsById} />
      </section>
      {selected && (
        <section className="lower-grid">
          <LogsCard container={selected} busy={busyId === selected.id} onRestart={actions.restartContainer} action={onAction} />
          <ContainerControl container={selected} latest={statsById[selected.id]} busy={busyId === selected.id} onAction={onAction} actions={actions} />
        </section>
      )}
    </>
  );
}

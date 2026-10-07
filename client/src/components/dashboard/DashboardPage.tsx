import { useState } from "react";
import type { ContainerAction, Theme } from "../../appTypes";
import type { Container, Stats, StatsPoint } from "../../types";
import DashboardContent from "./DashboardContent";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

interface Props {
  theme: Theme;
  onThemeToggle: () => void;
  onBack: () => void;
  containers: Container[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  history: StatsPoint[];
  statsById: Record<string, Stats>;
  lastRefresh: Date;
  busyId: string | null;
  error: string | null;
  onDismissError: () => void;
  onRefresh: () => void;
  onAction: (id: string, action: ContainerAction) => void;
  actions: {
    startContainer: ContainerAction;
    stopContainer: ContainerAction;
    restartContainer: ContainerAction;
  };
}

export default function DashboardPage(props: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [range, setRange] = useState("Last 15 minutes");
  const selected = props.containers.find((container) => container.id === props.selectedId) ?? null;

  return (
    <div className="dashboard-shell">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        activeNav={activeNav}
        onCollapse={() => setSidebarCollapsed((value) => !value)}
        onNavigate={setActiveNav}
      />

      <div className="dashboard-main">
        <DashboardTopbar
          theme={props.theme}
          onThemeToggle={props.onThemeToggle}
          lastRefresh={props.lastRefresh}
          onRefresh={props.onRefresh}
          onBack={props.onBack}
          range={range}
          onRangeChange={setRange}
          title={activeNav}
        />

        {props.error && (
          <div className="error-banner">
            <span>⚠ {props.error}</span>
            <button onClick={props.onDismissError}>Dismiss</button>
          </div>
        )}

        <main className="analytics-content">
          <DashboardContent
            activeNav={activeNav}
            containers={props.containers}
            selected={selected}
            selectedId={props.selectedId}
            history={props.history}
            statsById={props.statsById}
            busyId={props.busyId}
            onSelect={props.onSelect}
            onAction={props.onAction}
            actions={props.actions}
          />
        </main>
      </div>
    </div>
  );
}

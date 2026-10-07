import { useMemo, useState } from "react";
import LandingPage from "./components/landing/LandingPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import { useMonitoring } from "./hooks/useMonitoring";
import { useTheme } from "./hooks/useTheme";
import type { View } from "./appTypes";
import "./styles.css";

export default function App() {
  const [view, setView] = useState<View>("landing");
  const { theme, toggleTheme } = useTheme();
  const monitoring = useMonitoring(view === "dashboard");

  const running = useMemo(
    () => monitoring.containers.filter((container) => container.state === "running").length,
    [monitoring.containers],
  );

  if (view === "landing") {
    return (
      <LandingPage
        theme={theme}
        onThemeToggle={toggleTheme}
        onStart={() => setView("dashboard")}
        statsById={monitoring.statsById}
        running={running}
      />
    );
  }

  return (
    <DashboardPage
      theme={theme}
      onThemeToggle={toggleTheme}
      onBack={() => setView("landing")}
      containers={monitoring.containers}
      selectedId={monitoring.selectedId}
      onSelect={monitoring.setSelectedId}
      history={monitoring.history}
      statsById={monitoring.statsById}
      lastRefresh={monitoring.lastRefresh}
      busyId={monitoring.busyId}
      error={monitoring.error}
      onDismissError={() => monitoring.setError(null)}
      onRefresh={monitoring.refresh}
      onAction={monitoring.handleAction}
      actions={monitoring.actions}
    />
  );
}

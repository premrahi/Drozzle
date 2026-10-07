import type { ReactNode } from "react";

export default function MetricCard({ label, value, icon, tone }: { label: string; value: string; icon: ReactNode; tone: string }) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="metric-icon">{icon}</div>
      <div><span>{label}</span><strong>{value}</strong></div>
      <div className="metric-wave" />
    </div>
  );
}

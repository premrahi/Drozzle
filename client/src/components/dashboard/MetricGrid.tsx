import { Container as ContainerIcon, Cpu, Database, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import MetricCard from "../common/MetricCard";

export default function MetricGrid({ running, stopped, avgCpu, memory }: { running: number; stopped: number; avgCpu: number; memory: string }) {
  const cards: Array<[string, string, ReactNode, string]> = [
    ["Running", String(running), <ContainerIcon />, "cyan"],
    ["Stopped", String(stopped), <XCircle />, "red"],
    ["CPU Usage", `${Math.round(avgCpu)}%`, <Cpu />, "blue"],
    ["Memory Usage", memory, <Database />, "purple"],
  ];
  return <section className="metric-cards">{cards.map(([label, value, icon, tone]) => <MetricCard key={label} label={label} value={value} icon={icon} tone={tone} />)}</section>;
}

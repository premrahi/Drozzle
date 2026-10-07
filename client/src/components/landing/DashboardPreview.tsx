import { Activity, Box, Container as ContainerIcon, Database, FileText, LayoutDashboard, Network } from "lucide-react";
import MiniChart from "./MiniChart";

const demo = [
  { label: "00:40", rx: 2.2, tx: 1.4, mem: 5 },
  { label: "00:44", rx: 3.4, tx: 2.1, mem: 4 },
  { label: "00:48", rx: 1.7, tx: 2.7, mem: 6 },
  { label: "00:52", rx: 4.7, tx: 3.4, mem: 12 },
  { label: "00:56", rx: 3.1, tx: 2.2, mem: 13 },
];

const nav = [
  [<LayoutDashboard />, "Overview"], [<ContainerIcon />, "Containers"], [<Activity />, "Metrics"],
  [<FileText />, "Logs"], [<Network />, "Networks"], [<Database />, "Volumes"],
] as const;

export default function DashboardPreview() {
  return (
    <div className="dashboard-preview" id="preview">
      <div className="preview-sidebar">
        <div className="preview-logo"><Box size={15} /> Drozzle</div>
        {nav.map(([icon, label], index) => <div className={`preview-nav ${index === 0 ? "active" : ""}`} key={label}><span>{icon}</span>{label}</div>)}
      </div>
      <div className="preview-main">
        <div className="preview-top"><h3>Container Metrics</h3><span>● Refreshed 12 sec ago</span><button>Last 15 minutes⌄</button></div>
        <div className="preview-filters"><span>container</span><b>$host.name</b><strong>docker-desktop⌄</strong></div>
        <div className="preview-charts"><MiniChart title="Network Bytes Received" data={demo} keyName="rx" /><MiniChart title="Container Memory Percent" data={demo} keyName="mem" /></div>
        <div className="preview-tables">
          <div><h4>Mem usage / Mem limit</h4>{["mysql", "nginx", "apache", "redis"].map((name, i) => <p key={name}><span>{name}</span><span>{[453.9, 120.2, 98.5, 56.1][i]} MB</span><span>{[11.6, 3.1, 2.6, 1.5][i]}%</span></p>)}</div>
          <div><h4>Packets dropped</h4>{["nginx", "apache", "mysql", "redis"].map((name) => <p key={name}><span>{name}</span><span>0</span><span>0</span></p>)}</div>
        </div>
      </div>
    </div>
  );
}

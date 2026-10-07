import { Activity, ChevronLeft, ChevronRight, Container as ContainerIcon, Database, FileText, LayoutDashboard, Network, Settings, Wifi } from "lucide-react";
import Brand from "../common/Brand";
import NavItem from "../common/NavItem";

interface Props { collapsed: boolean; activeNav: string; onCollapse: () => void; onNavigate: (label: string) => void; }

export default function DashboardSidebar({ collapsed, activeNav, onCollapse, onNavigate }: Props) {
  const items = [
    [<LayoutDashboard />, "Overview"], [<ContainerIcon />, "Containers"], [<Activity />, "Metrics"],
    [<FileText />, "Logs"], [<Network />, "Networks"], [<Database />, "Volumes"],
  ] as const;

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <Brand compact={collapsed} />
      <button className="collapse-button" onClick={onCollapse} aria-label="Toggle sidebar">{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
      <nav>{items.map(([icon, label]) => <NavItem key={label} icon={icon} label={label} active={activeNav === label} collapsed={collapsed} onClick={() => onNavigate(label)} />)}</nav>
      <div className="sidebar-bottom">
        <NavItem icon={<Settings />} label="Settings" active={activeNav === "Settings"} collapsed={collapsed} onClick={() => onNavigate("Settings")} />
        {!collapsed && <div className="connection-card"><div className="connection-icon"><Wifi size={15} /></div><div><strong>Docker Connected</strong><span>Local Docker Engine</span></div></div>}
      </div>
    </aside>
  );
}

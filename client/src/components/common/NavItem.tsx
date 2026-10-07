import type { ReactNode } from "react";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export default function NavItem({ icon, label, active, collapsed, onClick }: NavItemProps) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick} title={collapsed ? label : undefined}>
      <span>{icon}</span>
      {!collapsed && <label>{label}</label>}
    </button>
  );
}

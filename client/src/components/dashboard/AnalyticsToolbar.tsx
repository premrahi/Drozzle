import { ChevronDown, Container as ContainerIcon } from "lucide-react";
import type { Container } from "../../types";

export default function AnalyticsToolbar({ selected }: { selected: Container | null }) {
  return (
    <div className="analytics-toolbar">
      <div className="filter-pill"><ContainerIcon size={14} /> container</div>
      <div className="host-filter"><span>$host.name</span><strong>docker-desktop</strong><ChevronDown size={14} /></div>
      <div className="selected-filter"><span>Selected</span><strong>{selected?.name || "All containers"}</strong><ChevronDown size={14} /></div>
    </div>
  );
}

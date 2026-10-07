import { Box } from "lucide-react";

export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <div className="brand-mark"><Box size={18} /></div>
      {!compact && <span>Dr<span>ozzle</span></span>}
    </div>
  );
}

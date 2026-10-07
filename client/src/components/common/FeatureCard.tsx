import type { ReactNode } from "react";

export default function FeatureCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <div><h3>{title}</h3><p>{text}</p></div>
    </div>
  );
}

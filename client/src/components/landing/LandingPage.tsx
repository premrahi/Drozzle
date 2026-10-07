import { useMemo } from "react";
import type { Stats } from "../../types";
import type { Theme } from "../../appTypes";
import LandingHeader from "./LandingHeader";
import HeroSection from "./HeroSection";
import DashboardPreview from "./DashboardPreview";

interface LandingPageProps {
  theme: Theme;
  onThemeToggle: () => void;
  onStart: () => void;
  statsById: Record<string, Stats>;
  running: number;
}

export default function LandingPage({ theme, onThemeToggle, onStart, statsById, running }: LandingPageProps) {
  const latest = useMemo(() => Object.values(statsById)[0], [statsById]);
  const avgCpu = useMemo(() => {
    const stats = Object.values(statsById);
    return stats.length ? stats.reduce((sum, stat) => sum + stat.cpuPercent, 0) / stats.length : 0;
  }, [statsById]);

  return (
    <div className="landing-shell">
      <LandingHeader theme={theme} onThemeToggle={onThemeToggle} onStart={onStart} />
      <main className="landing-content">
        <HeroSection avgCpu={avgCpu} memory={latest} running={running} onStart={onStart} />
        <section className="preview-section">
          <div className="section-heading"><span>Analytics workspace</span><h2>A dashboard built for <em>signal, not noise.</em></h2><p>Inspect container performance at a glance, then drill into a single service when something looks off.</p></div>
          <DashboardPreview />
        </section>
      </main>
    </div>
  );
}

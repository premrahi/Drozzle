import { Activity, ArrowRight, Box, Container as ContainerIcon, Gauge, LayoutDashboard, Sparkles, Terminal, Zap } from "lucide-react";
import FeatureCard from "../common/FeatureCard";
import type { Stats } from "../../types";
import { formatBytes } from "../../utils";

interface HeroSectionProps {
  avgCpu: number;
  memory: Stats | undefined;
  running: number;
  onStart: () => void;
}

export default function HeroSection({ avgCpu, memory, running, onStart }: HeroSectionProps) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> Real-time · Lightweight · Open Source</div>
          <h1>Monitor your Docker containers <span>in real-time.</span></h1>
          <p>Drozzle gives you a clean command center for container health, resource usage and live logs — without the noise.</p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={onStart}>Start Monitoring <ArrowRight size={18} /></button>
            <button className="ghost-button" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Explore features</button>
          </div>
          <div className="hero-proof"><div><span className="live-dot" /> Docker connected</div><div><Zap size={14} /> Refreshes every 5 seconds</div></div>
        </div>

        <div className="hero-visual">
          <div className="orb orb-one" /><div className="orb orb-two" />
          <div className="docker-card">
            <div className="docker-card-top"><Box size={18} /><span>Drozzle</span><span className="card-live">LIVE</span></div>
            <div className="docker-symbol"><ContainerIcon size={78} strokeWidth={1.2} /></div>
            <div className="floating-metric cpu"><span>CPU Usage</span><strong>{Math.round(avgCpu || 42)}%</strong><div className="sparkline" /></div>
            <div className="floating-metric memory"><span>Memory</span><strong>{memory ? formatBytes(memory.memUsageMB * 1024 ** 2) : "1.2 GB"}</strong><div className="sparkline purple" /></div>
            <div className="floating-metric running"><span>Running</span><strong>{running || 4}</strong></div>
          </div>
        </div>
      </section>

      <section className="feature-strip" id="features">
        <FeatureCard icon={<Activity />} title="Real-time Metrics" text="CPU, memory and network visibility." />
        <FeatureCard icon={<Terminal />} title="Container Logs" text="Follow live stdout and stderr streams." />
        <FeatureCard icon={<Gauge />} title="Easy Management" text="Start, stop and restart containers." />
        <FeatureCard icon={<LayoutDashboard />} title="Clean Dashboard" text="Analytics inspired by modern observability tools." />
      </section>
    </>
  );
}

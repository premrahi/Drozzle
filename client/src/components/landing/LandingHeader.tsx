import { ArrowRight } from "lucide-react";
import Brand from "../common/Brand";
import ThemeToggle from "../common/ThemeToggle";
import type { Theme } from "../../appTypes";

interface LandingHeaderProps { theme: Theme; onThemeToggle: () => void; onStart: () => void; }

export default function LandingHeader({ theme, onThemeToggle, onStart }: LandingHeaderProps) {
  return (
    <header className="landing-header">
      <Brand />
      <nav><a href="#features">Features</a><a href="#preview">Dashboard</a><a href="#features">How it works</a></nav>
      <div className="landing-header-actions">
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        <button className="primary-button" onClick={onStart}>Start Monitoring <ArrowRight size={16} /></button>
      </div>
    </header>
  );
}

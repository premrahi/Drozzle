import { useState } from "react";
import {
  Activity,
  ChevronDown,
  Menu,
  MoreHorizontal,
  RotateCw,
  Settings,
  X,
} from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import type { Theme } from "../../appTypes";

interface DashboardTopbarProps {
  theme: Theme;
  onThemeToggle: () => void;
  lastRefresh: Date;
  onRefresh: () => void;
  onBack: () => void;
  range: string;
  onRangeChange?: (range: string) => void;
  title?: string;
  onMobileMenu?: () => void;
}

const RANGES = ["Last 5 minutes", "Last 15 minutes", "Last 30 minutes", "Last 1 hour"];

export default function DashboardTopbar({
  theme,
  onThemeToggle,
  lastRefresh,
  onRefresh,
  onBack,
  range,
  onRangeChange,
  title = "Container Metrics",
  onMobileMenu,
}: DashboardTopbarProps) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [configureOpen, setConfigureOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const secondsAgo = Math.max(
    0,
    Math.round((Date.now() - lastRefresh.getTime()) / 1000),
  );

  const handleRefresh = () => {
    setMoreOpen(false);
    onRefresh();
  };

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-title">
        <button
          type="button"
          className="mobile-menu"
          onClick={onMobileMenu}
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <div className="title-icon">
          <Activity size={18} />
        </div>

        <div>
          <h1>{title}</h1>
          <p>Monitor your Docker environment</p>
        </div>
      </div>

      <div className="topbar-actions">
        <span className="refresh-copy">
          <span className="live-dot" />
          Refreshed {secondsAgo} sec ago
        </span>

        <div className="topbar-popover-wrap">
          <button
            type="button"
            className="select-button"
            onClick={() => {
              setRangeOpen((value) => !value);
              setMoreOpen(false);
              setConfigureOpen(false);
            }}
            aria-expanded={rangeOpen}
          >
            {range}
            <ChevronDown size={14} />
          </button>

          {rangeOpen && (
            <div className="topbar-popover range-menu">
              {RANGES.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={item === range ? "active" : ""}
                  onClick={() => {
                    onRangeChange?.(item);
                    setRangeOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={handleRefresh}
          title="Refresh"
          aria-label="Refresh dashboard"
        >
          <RotateCw size={16} />
        </button>

        <div className="topbar-popover-wrap">
          <button
            type="button"
            className="icon-button"
            onClick={() => {
              setMoreOpen((value) => !value);
              setRangeOpen(false);
              setConfigureOpen(false);
            }}
            title="More options"
            aria-label="More options"
            aria-expanded={moreOpen}
          >
            <MoreHorizontal size={17} />
          </button>

          {moreOpen && (
            <div className="topbar-popover more-menu">
              <button type="button" onClick={handleRefresh}>
                Refresh data
              </button>
              <button type="button" onClick={onBack}>
                Back to home
              </button>
            </div>
          )}
        </div>

        <div className="topbar-popover-wrap">
          <button
            type="button"
            className="configure-button"
            onClick={() => {
              setConfigureOpen((value) => !value);
              setMoreOpen(false);
              setRangeOpen(false);
            }}
            aria-expanded={configureOpen}
          >
            <Settings size={15} />
            Configure
          </button>

          {configureOpen && (
            <div className="topbar-popover configure-menu">
              <strong>Dashboard settings</strong>
              <span>Refresh interval: 3 seconds</span>
              <span>Backend: localhost:4000</span>
              <button type="button" onClick={handleRefresh}>
                Refresh now
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="new-panel"
          onClick={() => setPanelOpen(true)}
        >
          <span>+</span>
          New Panel
        </button>

        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>

      {panelOpen && (
        <div className="panel-modal-backdrop" onClick={() => setPanelOpen(false)}>
          <section
            className="panel-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-panel-title"
          >
            <div className="panel-modal-header">
              <div>
                <span className="panel-kicker">Dashboard</span>
                <h2 id="new-panel-title">Add a monitoring panel</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setPanelOpen(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p>Select a metric view to open in the analytics dashboard.</p>

            <div className="panel-options">
              {[
                ["CPU & Memory", "Resource utilization"],
                ["Network", "RX/TX traffic"],
                ["Packets", "Dropped packet statistics"],
              ].map(([name, description]) => (
                <button
                  type="button"
                  key={name}
                  className="panel-option"
                  onClick={() => setPanelOpen(false)}
                >
                  <strong>{name}</strong>
                  <span>{description}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </header>
  );
}

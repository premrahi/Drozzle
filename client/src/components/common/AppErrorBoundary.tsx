import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Drozzle render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error">
          <div className="app-error-card">
            <h1>Something went wrong</h1>
            <p>
              Drozzle could not render this view. Refresh the page and try
              again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Reload Drozzle
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

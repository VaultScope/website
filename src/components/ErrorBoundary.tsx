import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './Shared';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);

    // Auto-reload once if this was a chunk loading failure from a new deployment,
    // but only if the server is reachable so we never trigger a browser ERR_CONNECTION_REFUSED screen.
    const msg = error?.message || '';
    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('error loading dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes("reading 'default'")
    ) {
      if (!sessionStorage.getItem('chunk_reload_boundary')) {
        sessionStorage.setItem('chunk_reload_boundary', '1');
        fetch('/api/health', { method: 'HEAD', cache: 'no-store' })
          .then((res) => {
            if (res.ok) window.location.reload();
          })
          .catch(() => {
            // Server momentarily unreachable; stay in SPA ErrorBoundary UI
          });
      }
    }
  }

  private handleReload = () => {
    sessionStorage.removeItem('chunk_reload_boundary');
    sessionStorage.removeItem('chunk_reload_triggered');
    window.location.reload();
  };

  private handleGoHome = () => {
    sessionStorage.removeItem('chunk_reload_boundary');
    sessionStorage.removeItem('chunk_reload_triggered');
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-card border border-border p-8 rounded-xl text-left space-y-6">
            <div className="vs-cushion w-11 h-11 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Something went wrong
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The page encountered an unexpected issue while loading. This usually happens after an application update.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-muted/40 border border-border/60 rounded text-[11px] font-mono text-muted-foreground break-words text-left max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                type="button"
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reload Page
              </Button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-4 py-2.5 border border-border text-foreground hover:bg-muted/50 rounded-md text-xs font-medium transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

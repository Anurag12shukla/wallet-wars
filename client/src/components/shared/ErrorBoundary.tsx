import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Wallet Wars UI:', error, errorInfo);

    // If dynamic chunk loading failed due to deployment update, reload once
    if (
      error.message?.includes('dynamically imported module') ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Failed to fetch')
    ) {
      const hasReloaded = sessionStorage.getItem('chunk_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload', 'true');
        window.location.reload();
      }
    }
  }

  private handleReset = () => {
    sessionStorage.removeItem('chunk_reload');
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card border border-brand-gold/30 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(255,215,0,0.15)]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              ⚔️
            </div>
            <h1 className="font-display text-2xl font-bold gradient-gold-text mb-2">
              ARENA RECOVERY
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              The arena encountered an unexpected anomaly while initializing. Reconnect to resume combat.
            </p>
            {this.state.error && (
              <p className="text-xs font-mono text-brand-crimson bg-black/50 p-3 rounded-lg border border-brand-gold/20 mb-6 text-left break-all">
                {this.state.error.message || String(this.state.error)}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="btn-primary w-full py-3 px-6 text-sm"
            >
              🔄 RELOAD ARENA
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
        <div className="min-h-screen bg-robinhood-darker flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-robinhood-card border border-robinhood-border rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-robinhood-green/10 border border-robinhood-green/30 flex items-center justify-center text-3xl">
              ⚔️
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              ROBINHOOD ARENA RECOVERY
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              The arena encountered an unexpected error while initializing. Click below to reconnect to Robinhood Testnet.
            </p>
            {this.state.error && (
              <p className="text-xs font-mono text-robinhood-red bg-black/50 p-3 rounded-lg border border-robinhood-border mb-6 text-left break-all">
                {this.state.error.message || String(this.state.error)}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 rounded-xl bg-robinhood-green text-black font-display font-bold text-sm tracking-wider hover:bg-robinhood-green-light transition-all shadow-[0_0_20px_rgba(0,200,5,0.3)]"
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

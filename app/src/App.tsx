import React, { useEffect, useState } from 'react';
import CommandBarWindow from './windows/CommandBar';
import DashboardWindow from './windows/Dashboard';
import DropdownWindow from './windows/Dropdown';

class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null; info: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Global crash:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'white', background: '#09090b', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ef4444' }}>Fatal React Error</h1>
          <p>The application crashed completely. Here is the stack trace:</p>
          <pre style={{ background: '#111', padding: 20, overflow: 'auto', color: '#f87171', border: '1px solid #ef4444' }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
            {'\n\nComponent Stack:\n'}
            {this.state.info?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [view, setView] = useState<'commandbar' | 'dashboard' | 'dropdown'>('commandbar');

  useEffect(() => {
    // Add dark mode class by default
    document.documentElement.classList.add('dark');

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/dashboard') {
        setView('dashboard');
      } else if (hash === '#/dropdown') {
        setView('dropdown');
      } else {
        setView('commandbar');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <GlobalErrorBoundary>
      {view === 'commandbar' && <CommandBarWindow />}
      {view === 'dashboard' && <DashboardWindow />}
      {view === 'dropdown' && <DropdownWindow />}
    </GlobalErrorBoundary>
  );
}

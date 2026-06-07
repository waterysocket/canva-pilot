import React, { useEffect, useState } from 'react';
import CommandBarWindow from './windows/CommandBar';
import DashboardWindow from './windows/Dashboard';
import DropdownWindow from './windows/Dropdown';

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
    <>
      {view === 'commandbar' && <CommandBarWindow />}
      {view === 'dashboard' && <DashboardWindow />}
      {view === 'dropdown' && <DropdownWindow />}
    </>
  );
}

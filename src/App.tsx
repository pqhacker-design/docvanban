import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { TTSProvider, useTTS } from './contexts/TTSContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';

import { HomePage } from './pages/HomePage';
import { StudioPage } from './pages/StudioPage';
import { FileManager } from './components/files/FileManager';
import { HistoryList } from './components/history/HistoryList';
import { SettingsPage } from './components/settings/SettingsPage';

const MainContent: React.FC = () => {
  const { activeTab } = useTTS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'home' && <HomePage />}
          {activeTab === 'studio' && <StudioPage />}
          {activeTab === 'files' && <FileManager />}
          {activeTab === 'history' && <HistoryList />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Floating Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <TTSProvider>
        <MainContent />
      </TTSProvider>
    </ThemeProvider>
  );
}

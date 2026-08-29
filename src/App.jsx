import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader, BottomNavBar } from './components/Navigation';
import { DailyAllowanceView } from './components/DailyAllowanceView';
import { AllocationDashboard } from './components/AllocationDashboard';
import { QuickTransactionModal } from './components/QuickTransactionModal';
import { MultiAccountView } from './components/MultiAccountView';
import { ReportsView } from './components/ReportsView';
import { SettingsBackup } from './components/SettingsBackup';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const MainScreen = ({ isFullWidth, setIsFullWidth }) => {
  const { activeTab, toastMessage } = useApp();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyAllowanceView />;
      case 'allocation':
        return <AllocationDashboard />;
      case 'reports':
        return <ReportsView />;
      case 'accounts':
        return (
          <>
            <MultiAccountView />
            <div style={{ marginTop: '20px' }}>
              <SettingsBackup />
            </div>
          </>
        );
      default:
        return <DailyAllowanceView />;
    }
  };

  return (
    <div className={`app-container ${isFullWidth ? 'full-width' : ''}`}>
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage.type === 'danger' ? (
            <AlertCircle size={20} color="#f87171" />
          ) : (
            <CheckCircle2 size={20} color="#34d399" />
          )}
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
            {toastMessage.message}
          </span>
        </div>
      )}

      {/* Top Bar Header */}
      <TopHeader isFullWidth={isFullWidth} setIsFullWidth={setIsFullWidth} />

      {/* Main View Area */}
      <div className="app-content">
        {renderTabContent()}
      </div>

      {/* Quick Add Modal */}
      <QuickTransactionModal />

      {/* Bottom Floating Navigation */}
      <BottomNavBar />

    </div>
  );
};

export function App() {
  const [isFullWidth, setIsFullWidth] = useState(false);

  return (
    <AppProvider>
      <MainScreen isFullWidth={isFullWidth} setIsFullWidth={setIsFullWidth} />
    </AppProvider>
  );
}

export default App;

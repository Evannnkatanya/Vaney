import React from 'react';
import { useApp } from '../context/AppContext';
import { getCurrentMonthName } from '../utils/formatters';
import { 
  CalendarDays, 
  PieChart, 
  Plus, 
  BarChart3, 
  Wallet, 
  Sun, 
  Moon, 
  Wifi, 
  Maximize2,
  Minimize2
} from 'lucide-react';

export const TopHeader = ({ isFullWidth, setIsFullWidth }) => {
  const { data, toggleTheme } = useApp();

  return (
    <div style={{
      padding: '16px 20px 12px 20px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: '800',
          fontSize: '1rem',
          boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
        }}>
          V
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
            Vaney
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span>{getCurrentMonthName()}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Offline Ready Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '20px',
          background: 'rgba(16, 185, 129, 0.12)',
          color: '#34d399',
          fontSize: '0.7rem',
          fontWeight: '600'
        }}>
          <Wifi size={12} />
          <span>Offline</span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
          title="Ganti Tema"
        >
          {data?.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Fullscreen desktop frame toggle */}
        <button 
          onClick={() => setIsFullWidth(!isFullWidth)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
          title="Toggle Screen View"
        >
          {isFullWidth ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
};

export const BottomNavBar = () => {
  const { activeTab, setActiveTab, setIsQuickModalOpen } = useApp();

  const navItems = [
    { id: 'daily', label: 'Jatah Harian', icon: CalendarDays },
    { id: 'allocation', label: 'Pot Alokasi', icon: PieChart },
    { id: 'quick', label: '', icon: Plus, isCenter: true },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
    { id: 'accounts', label: 'Akun & Data', icon: Wallet },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '75px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 10px',
      zIndex: 90
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isCenter) {
          return (
            <button
              key="quick-add-btn"
              onClick={() => setIsQuickModalOpen(true)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: '4px solid #0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                transform: 'translateY(-18px)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              className="quick-add-fab"
              title="Input Transaksi Cepat (<3 Tap)"
            >
              <Plus size={28} strokeWidth={2.8} />
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              color: isActive ? '#10b981' : 'var(--text-muted)',
              cursor: 'pointer',
              flex: 1,
              height: '100%',
              transition: 'color 0.2s ease'
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ fontSize: '0.68rem', fontWeight: isActive ? '700' : '500' }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

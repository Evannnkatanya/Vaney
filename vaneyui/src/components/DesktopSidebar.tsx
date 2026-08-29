import React from 'react';
import { TabType } from '../types';

interface DesktopSidebarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenAddTransaction: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onChangeTab,
  onOpenAddTransaction,
}) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'jatah', label: 'Jatah', icon: 'savings' },
    { id: 'laporan', label: 'Laporan', icon: 'insert_chart' },
    { id: 'profil', label: 'Profil & Akun', icon: 'person' },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#ffffff] border-r border-[#e8e8e6] flex-col py-6 px-4 z-30 shadow-[0px_10px_30px_rgba(0,0,0,0.04)]"
    >
      <div className="mb-8 px-3 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#406651] text-[#ffffff] flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[20px] fill">spa</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#406651] tracking-tight">Vaney</h1>
          <p className="text-[11px] text-[#414843] font-medium">Financial Wellness</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 flex-grow">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'bg-[#7da68d] text-[#143b28] shadow-sm font-semibold'
                  : 'text-[#414843] hover:bg-[#f4f4f2]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'fill' : ''
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-[#f4f4f2] mt-auto">
        <button
          id="btn-sidebar-add-tx"
          onClick={onOpenAddTransaction}
          className="w-full bg-[#406651] text-[#ffffff] py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all shadow-[0px_10px_25px_rgba(64,102,81,0.2)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Tambah Transaksi</span>
        </button>
      </div>
    </aside>
  );
};

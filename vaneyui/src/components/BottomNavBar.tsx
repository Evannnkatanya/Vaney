import React from 'react';
import { TabType } from '../types';

interface BottomNavBarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onChangeTab,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 w-full z-50 rounded-t-2xl bg-[#f9f9f7] shadow-[0px_-10px_30px_rgba(0,0,0,0.04)] border-t border-[#e8e8e6] flex justify-around items-center h-16 px-2 pb-[env(safe-area-inset-bottom,0px)] transition-all duration-200"
    >
      {/* Home */}
      <button
        id="nav-tab-home"
        onClick={() => onChangeTab('home')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
          currentTab === 'home'
            ? 'bg-[#7da68d] text-[#143b28] shadow-sm font-semibold scale-[1.02]'
            : 'text-[#414843] hover:bg-[#e2e3e1]/50'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentTab === 'home' ? 'fill' : ''
          }`}
        >
          home
        </span>
        <span className="text-[11px] font-medium mt-0.5 tracking-tight">Home</span>
      </button>

      {/* Jatah */}
      <button
        id="nav-tab-jatah"
        onClick={() => onChangeTab('jatah')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
          currentTab === 'jatah'
            ? 'bg-[#7da68d] text-[#143b28] shadow-sm font-semibold scale-[1.02]'
            : 'text-[#414843] hover:bg-[#e2e3e1]/50'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentTab === 'jatah' ? 'fill' : ''
          }`}
        >
          savings
        </span>
        <span className="text-[11px] font-medium mt-0.5 tracking-tight">Jatah</span>
      </button>

      {/* Center Action Button (+) */}
      <button
        id="nav-tab-tambah"
        onClick={() => onChangeTab('tambah')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
          currentTab === 'tambah'
            ? 'bg-[#7da68d] text-[#143b28] shadow-sm font-semibold scale-[1.02]'
            : 'text-[#406651] hover:bg-[#e2e3e1]/50'
        }`}
        title="Tambah Transaksi"
      >
        <div className="w-8 h-8 rounded-full bg-[#406651] text-[#ffffff] flex items-center justify-center shadow-[0px_4px_12px_rgba(64,102,81,0.25)] hover:scale-105 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[20px]">add</span>
        </div>
        <span className="text-[10px] font-medium mt-0.5 text-[#414843]">Tambah</span>
      </button>

      {/* Laporan */}
      <button
        id="nav-tab-laporan"
        onClick={() => onChangeTab('laporan')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
          currentTab === 'laporan'
            ? 'bg-[#7da68d] text-[#143b28] shadow-sm font-semibold scale-[1.02]'
            : 'text-[#414843] hover:bg-[#e2e3e1]/50'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentTab === 'laporan' ? 'fill' : ''
          }`}
        >
          insert_chart
        </span>
        <span className="text-[11px] font-medium mt-0.5 tracking-tight">Laporan</span>
      </button>

      {/* Profil / Akun */}
      <button
        id="nav-tab-profil"
        onClick={() => onChangeTab('profil')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
          currentTab === 'profil'
            ? 'bg-[#7da68d] text-[#143b28] shadow-sm font-semibold scale-[1.02]'
            : 'text-[#414843] hover:bg-[#e2e3e1]/50'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentTab === 'profil' ? 'fill' : ''
          }`}
        >
          person
        </span>
        <span className="text-[11px] font-medium mt-0.5 tracking-tight">Profil</span>
      </button>
    </nav>
  );
};

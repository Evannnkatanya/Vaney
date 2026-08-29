import React from 'react';
import { USER_AVATAR_URL } from '../data/initialData';
import { TabType } from '../types';

interface TopAppBarProps {
  currentTab: TabType;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onAvatarClick?: () => void;
  onBack?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onOpenNotifications,
  unreadNotificationsCount = 2,
  onAvatarClick,
  onBack,
}) => {
  if (currentTab === 'tambah') {
    return (
      <header className="w-full top-0 sticky z-40 bg-[#f9f9f7] flex justify-between items-center px-5 py-4 transition-all duration-200 border-b border-transparent">
        <button
          id="btn-back-nav"
          onClick={onBack}
          className="flex items-center gap-2 text-[#406651] hover:opacity-80 transition-opacity cursor-pointer group"
          title="Kembali"
        >
          <span className="material-symbols-outlined text-[#406651] text-2xl group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          <h1 className="text-xl font-bold text-[#406651] tracking-tight">
            Tambah Transaksi
          </h1>
        </button>
        <button
          id="btn-avatar-header"
          onClick={onAvatarClick}
          className="w-10 h-10 rounded-full bg-[#e2e3e1] flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-[#406651]/30 transition-all cursor-pointer"
        >
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            src={USER_AVATAR_URL}
          />
        </button>
      </header>
    );
  }

  // Custom titles for different tabs on mobile
  let title = 'Vaney';
  if (currentTab === 'laporan') {
    title = 'Laporan';
  } else if (currentTab === 'profil') {
    title = 'Vaney';
  }

  return (
    <header className="w-full top-0 sticky z-40 bg-[#f9f9f7] flex justify-between items-center px-5 py-4 transition-all duration-200">
      <div className="flex items-center gap-3">
        <button
          id="btn-user-profile-header"
          onClick={onAvatarClick}
          className="w-10 h-10 rounded-full bg-[#e2e3e1] overflow-hidden shrink-0 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] hover:ring-2 hover:ring-[#406651]/40 transition-all cursor-pointer"
          title="Buka Profil & Akun"
        >
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            src={USER_AVATAR_URL}
          />
        </button>
        <h1 className="text-xl font-bold text-[#406651] tracking-tight">
          {title}
        </h1>
      </div>

      <button
        id="btn-notifications"
        onClick={onOpenNotifications}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ffffff] shadow-[0px_10px_30px_rgba(0,0,0,0.04)] text-[#406651] hover:scale-[1.03] active:scale-95 transition-all relative cursor-pointer group"
        title="Notifikasi & Pengingat"
      >
        <span className="material-symbols-outlined text-[#406651] group-hover:scale-105 transition-transform">
          notifications
        </span>
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-[#ffffff]" />
        )}
      </button>
    </header>
  );
};

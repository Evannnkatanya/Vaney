import React from 'react';
import { formatRupiah } from '../data/initialData';
import { Account } from '../types';

interface AkunKeuanganViewProps {
  accounts: Account[];
  onOpenAddAccount: () => void;
  onSelectAccount: (account: Account) => void;
}

export const AkunKeuanganView: React.FC<AkunKeuanganViewProps> = ({
  accounts,
  onOpenAddAccount,
  onSelectAccount,
}) => {
  // Calculate total overall balance (all positive assets + credit)
  const totalNetBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <main
      id="akun-keuangan-canvas"
      className="px-5 py-4 max-w-[1140px] mx-auto md:grid md:grid-cols-12 md:gap-6 md:items-start animate-in fade-in duration-300"
    >
      {/* Header Section */}
      <div className="md:col-span-12 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1c1b] mb-1 tracking-tight">
          Akun Keuangan
        </h2>
        <p className="text-sm text-[#414843]">
          Kelola semua sumber dana Anda dalam satu tampilan yang tenang.
        </p>
      </div>

      {/* Total Balance Card (Bento Style) */}
      <div
        id="card-total-saldo-keseluruhan"
        className="md:col-span-12 bg-[#ffffff] rounded-[24px] p-6 sm:p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] mb-8 relative overflow-hidden group hover:scale-[1.005] transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#c1edd1]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
          <p className="text-xs font-semibold text-[#717973] mb-1.5 uppercase tracking-wider">
            Total Saldo Keseluruhan
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#406651] tracking-tight">
            {formatRupiah(totalNetBalance)}
          </p>
        </div>
      </div>

      {/* Account List Section */}
      <div className="md:col-span-12 flex flex-col gap-4">
        {accounts.map((acc) => {
          const isCredit = acc.isCredit || acc.balance < 0;
          return (
            <div
              key={acc.id}
              id={`account-card-${acc.id}`}
              onClick={() => onSelectAccount(acc)}
              className={`bg-[#ffffff] rounded-[24px] p-4 sm:p-5 flex items-center justify-between shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer ${
                isCredit ? 'border border-[#ffdad6]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${acc.bgColorClass} flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <span
                    className={`material-symbols-outlined ${acc.iconColorClass} fill text-[24px]`}
                  >
                    {acc.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1a1c1b]">
                    {acc.name}
                  </h3>
                  <p className="text-xs text-[#717973] mt-0.5">
                    {acc.subtitle}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-base sm:text-lg font-bold tracking-tight ${
                    isCredit ? 'text-[#ba1a1a]' : 'text-[#406651]'
                  }`}
                >
                  {formatRupiah(acc.balance)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Account Button */}
      <div className="md:col-span-12 mt-6 flex justify-center">
        <button
          id="btn-tambah-akun-baru"
          onClick={onOpenAddAccount}
          className="bg-[#406651] text-[#ffffff] rounded-[16px] px-6 py-3.5 flex items-center gap-2 text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-[0px_15px_40px_rgba(64,102,81,0.2)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah Akun Baru
        </button>
      </div>

      {/* Security & Backup Settings Section */}
      <div className="md:col-span-12 mt-8 mb-16 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Security Lock Card */}
        <div className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a1c1b]">Keamanan & Pengunci Aplikasi</h3>
              <p className="text-xs text-[#717973]">Kunci aplikasi Vaney dengan PIN 4-digit</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-neutral-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-800">Aktifkan Pengunci PIN</span>
              <input
                type="checkbox"
                defaultChecked={true}
                onChange={(e) => {
                  alert(e.target.checked ? 'Pengunci PIN diaktifkan!' : 'Pengunci PIN dinonaktifkan.');
                }}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-800">Buka dengan Biometrik</span>
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>
            <button
              onClick={() => {
                const newPin = prompt('Masukkan 4-digit PIN baru Anda:', '1234');
                if (newPin && newPin.length === 4) {
                  localStorage.setItem('vaney_pin', newPin);
                  alert('PIN berhasil diperbarui!');
                }
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 pt-1 block cursor-pointer"
            >
              Ubah 4-Digit PIN
            </button>
          </div>
        </div>

        {/* Backup & Restore Data Card */}
        <div className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-700">
              <span className="material-symbols-outlined text-[24px]">backup</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a1c1b]">Backup & Restore Data</h3>
              <p className="text-xs text-[#717973]">Simpan atau pulihkan data JSON/CSV offline</p>
            </div>
          </div>

          <p className="text-xs text-neutral-500">
            Jaga keamanan catatan transaksi Anda dengan mengekspor backup lokal berkala.
          </p>

          <button
            onClick={() => {
              // Dispatch custom event or alert to open Backup Modal
              const event = new CustomEvent('open-backup-modal');
              window.dispatchEvent(event);
            }}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs py-3 rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Buka Menu Backup & Restore</span>
          </button>
        </div>
      </div>
    </main>
  );
};


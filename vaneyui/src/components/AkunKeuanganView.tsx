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
      <div className="md:col-span-12 mt-8 mb-16 flex justify-center">
        <button
          id="btn-tambah-akun-baru"
          onClick={onOpenAddAccount}
          className="bg-[#406651] text-[#ffffff] rounded-[16px] px-6 py-3.5 flex items-center gap-2 text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-[0px_15px_40px_rgba(64,102,81,0.2)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah Akun Baru
        </button>
      </div>
    </main>
  );
};

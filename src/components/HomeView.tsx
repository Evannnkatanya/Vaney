import React from 'react';
import { formatRupiah } from '../data/initialData';
import { BudgetPot, TabType, Transaction } from '../types';

interface HomeViewProps {
  totalBalance: number;
  pots: BudgetPot[];
  transactions: Transaction[];
  onNavigate: (tab: TabType) => void;
  onSelectTransaction: (tx: Transaction) => void;
  onOpenAddTransaction: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  totalBalance,
  pots,
  transactions,
  onNavigate,
  onSelectTransaction,
  onOpenAddTransaction,
}) => {
  return (
    <main
      id="home-canvas"
      className="px-5 py-4 max-w-[1140px] mx-auto flex flex-col gap-8 w-full animate-in fade-in duration-300"
    >
      {/* Total Balance Card (Bento Minimalist) */}
      <section
        id="card-total-balance"
        className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center relative overflow-hidden group hover:scale-[1.005] transition-all duration-300"
      >
        {/* Subtle background glow decor */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#c1edd1]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#bde2fe]/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <p className="text-sm font-medium text-[#414843] mb-2 tracking-wide">
          Total Saldo (Semua Akun)
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#406651] tracking-tight mb-4">
          {formatRupiah(totalBalance)}
        </h2>

        <div className="flex flex-wrap gap-4 w-full max-w-sm justify-center items-center pt-1 border-t border-[#f4f4f2]">
          <button
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#c8e6ff]" />
            <span className="text-xs font-medium text-[#414843]">Bank</span>
          </button>
          <button
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#c1edd1]" />
            <span className="text-xs font-medium text-[#414843]">E-Wallet</span>
          </button>
          <button
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#f0e0cb]" />
            <span className="text-xs font-medium text-[#414843]">Cash</span>
          </button>
        </div>
      </section>

      {/* Pot Anggaran Section */}
      <section id="section-pot-anggaran" className="flex flex-col gap-3">
        <div className="flex justify-between items-end mb-1">
          <h3 className="text-lg font-bold text-[#1a1c1b] tracking-tight">
            Pot Anggaran
          </h3>
          <button
            id="btn-link-jatah-detail"
            onClick={() => onNavigate('jatah')}
            className="text-xs font-semibold text-[#406651] hover:underline cursor-pointer transition-colors"
          >
            Lihat Detail
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pots.map((pot) => {
            const pctUsed =
              pot.totalAmount > 0
                ? Math.min(
                    100,
                    Math.round(
                      ((pot.totalAmount - pot.remainingAmount) /
                        pot.totalAmount) *
                        100,
                    ),
                  )
                : 0;

            return (
              <div
                key={pot.id}
                id={`card-${pot.id}`}
                className="bg-[#ffffff] rounded-[20px] p-4 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col gap-2.5 hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${pot.bgIconClass}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {pot.icon}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#1a1c1b]">
                      {pot.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#414843] bg-[#f4f4f2] px-2 py-0.5 rounded-full">
                    {pot.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-[#f4f4f2] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${pot.colorClass}`}
                    style={{ width: `${Math.max(5, pctUsed)}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-[#414843] font-medium pt-0.5">
                  <span>Sisa {formatRupiah(pot.remainingAmount)}</span>
                  <span className="text-[#717973]">
                    Total {formatRupiah(pot.totalAmount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transaksi Terbaru Section */}
      <section id="section-transaksi-terbaru" className="flex flex-col gap-3">
        <div className="flex justify-between items-end mb-1">
          <h3 className="text-lg font-bold text-[#1a1c1b] tracking-tight">
            Transaksi Terbaru
          </h3>
          {transactions.length > 0 && (
            <button
              id="btn-lihat-semua-tx"
              onClick={() => onNavigate('laporan')}
              className="text-xs font-semibold text-[#406651] hover:underline cursor-pointer transition-colors"
            >
              Lihat Semua
            </button>
          )}
        </div>

        <div className="bg-[#ffffff] rounded-[24px] p-2 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col divide-y divide-[#f4f4f2]">
          {transactions.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2.5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              </div>
              <p className="text-sm font-bold text-neutral-800">Belum Ada Transaksi</p>
              <p className="text-xs text-neutral-500 max-w-xs">
                Transaksi yang Anda catat akan otomatis tersimpan aman di perangkat lokal Anda.
              </p>
              <button
                type="button"
                onClick={onOpenAddTransaction}
                className="mt-2 px-5 py-2.5 bg-[#406651] hover:bg-[#284e3a] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Catat Pengeluaran Baru</span>
              </button>
            </div>
          ) : (
            transactions.slice(0, 6).map((tx) => {
              const isExpense = tx.type === 'expense';
              return (
                <div
                  key={tx.id}
                  id={`tx-row-${tx.id}`}
                  onClick={() => onSelectTransaction(tx)}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#f9f9f7] transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${tx.categoryBgClass}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {tx.categoryIcon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a1c1b] group-hover:text-[#406651] transition-colors">
                        {tx.title}
                      </p>
                      <p className="text-xs text-[#717973] mt-0.5">
                        {tx.timeStr || tx.date}
                        {tx.note && ` • ${tx.note}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-bold tracking-tight ${
                        isExpense ? 'text-[#ba1a1a]' : 'text-[#406651]'
                      }`}
                    >
                      {isExpense
                        ? `- ${formatRupiah(tx.amount)}`
                        : `+ ${formatRupiah(tx.amount)}`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Quick Add floating button on mobile */}
      <div className="md:hidden pt-2 pb-2 flex justify-center">
        <button
          id="btn-home-quick-add"
          onClick={onOpenAddTransaction}
          className="bg-[#406651] text-[#ffffff] px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-[0px_10px_25px_rgba(64,102,81,0.25)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Catat Pengeluaran Baru
        </button>
      </div>
    </main>
  );
};

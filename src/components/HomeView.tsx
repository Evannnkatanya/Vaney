import React, { useMemo } from 'react';
import { formatRupiah } from '../data/initialData';
import { Account, BudgetPot, TabType, Transaction } from '../types';

interface HomeViewProps {
  totalBalance: number;
  accounts: Account[];
  pots: BudgetPot[];
  transactions: Transaction[];
  onNavigate: (tab: TabType) => void;
  onOpenAddTransaction: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  totalBalance,
  accounts,
  pots,
  transactions,
  onNavigate,
  onOpenAddTransaction,
  onSelectTransaction,
}) => {
  // Find accounts
  const bcaAcc = accounts.find((a) => a.id === 'bca') || accounts[0];
  const gopayAcc = accounts.find((a) => a.id === 'ewallet') || accounts[1];
  const cashAcc = accounts.find((a) => a.id === 'cash') || accounts[2];

  // Dynamic monthly pot spending & savings calculation
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();
  const currentMonthCode = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`;

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(
      (t) => t.date && t.date.startsWith(currentMonthCode)
    );
  }, [transactions, currentMonthCode]);

  // Helper to recognize savings/tabungan transactions
  const isTabungTx = (t: Transaction) =>
    t.type === 'savings' ||
    t.potType === 'nabung' ||
    t.categoryName?.toLowerCase().includes('tabung') ||
    t.title?.toLowerCase().includes('tabung');

  const spentHarian = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => !isTabungTx(t) && t.type === 'expense' && (t.potType === 'harian' || (!t.potType && t.categoryName?.toLowerCase() !== 'tagihan' && t.categoryName?.toLowerCase() !== 'hiburan')))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const spentBulanan = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => !isTabungTx(t) && t.type === 'expense' && (t.potType === 'bulanan' || (!t.potType && (t.categoryName?.toLowerCase() === 'tagihan' || t.categoryName?.toLowerCase() === 'hiburan'))))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const collectedNabung = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => isTabungTx(t))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  return (
    <main
      id="home-canvas"
      className="max-w-[1140px] mx-auto px-5 py-2 space-y-6 animate-in fade-in duration-300"
    >
      {/* Total Balance Hero Card */}
      <section
        id="card-total-saldo"
        className="bg-[#ffffff] rounded-[28px] p-6 sm:p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:scale-[1.005] transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c1edd1]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#f0e0cb]/30 rounded-full blur-2xl pointer-events-none" />

        <p className="text-xs font-semibold text-[#717973] uppercase tracking-wider mb-2">
          Total Saldo Rekening & Dompet
        </p>

        <h2
          id="total-saldo-display"
          className="text-4xl sm:text-5xl font-extrabold text-[#1a1c1b] tracking-tight mb-4"
        >
          {formatRupiah(totalBalance)}
        </h2>

        {/* Compact Account Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-2 border-t border-[#f4f4f2] w-full max-w-md">
          <button
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#bde2fe]" />
            <span className="text-xs font-medium text-[#414843]">
              BCA: {formatRupiah(bcaAcc?.balance || 0)}
            </span>
          </button>
          <button
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#c1edd1]" />
            <span className="text-xs font-medium text-[#414843]">
              GoPay: {formatRupiah(gopayAcc?.balance || 0)}
            </span>
          </button>
          <button
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#f0e0cb]" />
            <span className="text-xs font-medium text-[#414843]">
              Cash: {formatRupiah(cashAcc?.balance || 0)}
            </span>
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
            const isSavingsPot = pot.id === 'pot-nabung';
            const isHarianPot = pot.id === 'pot-harian';

            let pctValue = 0;
            let mainLabel = '';
            let subLabel = '';

            if (isSavingsPot) {
              const target = pot.totalAmount || 0;
              pctValue = target > 0 ? Math.min(100, Math.round((collectedNabung / target) * 100)) : 0;
              mainLabel = `Terkumpul ${formatRupiah(collectedNabung)}`;
              subLabel = `Target ${formatRupiah(target)}`;
            } else if (isHarianPot) {
              const total = pot.totalAmount || 0;
              const remaining = Math.max(0, total - spentHarian);
              pctValue = total > 0 ? Math.min(100, Math.round((spentHarian / total) * 100)) : 0;
              mainLabel = `Sisa ${formatRupiah(remaining)}`;
              subLabel = `Total ${formatRupiah(total)}`;
            } else {
              // pot-bulanan
              const total = pot.totalAmount || 0;
              const remaining = Math.max(0, total - spentBulanan);
              pctValue = total > 0 ? Math.min(100, Math.round((spentBulanan / total) * 100)) : 0;
              mainLabel = `Sisa ${formatRupiah(remaining)}`;
              subLabel = `Total ${formatRupiah(total)}`;
            }

            return (
              <div
                key={pot.id}
                id={`card-${pot.id}`}
                onClick={() => onNavigate('jatah')}
                className="bg-[#ffffff] rounded-[20px] p-4 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col gap-2.5 hover:scale-[1.01] transition-all cursor-pointer border border-neutral-100/80"
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
                <div className="w-full h-2.5 bg-[#f4f4f2] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${pot.colorClass}`}
                    style={{ width: `${pctValue}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-[#414843] font-medium pt-0.5">
                  {isSavingsPot ? (
                    <>
                      <span className="text-[#685d4c] font-bold">
                        {mainLabel}
                      </span>
                      <span className="text-[#717973]">
                        {subLabel}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{mainLabel}</span>
                      <span className="text-[#717973]">
                        {subLabel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Transactions List */}
      <section id="section-transaksi-terbaru" className="space-y-3">
        <div className="flex justify-between items-end">
          <h3 className="text-lg font-bold text-[#1a1c1b] tracking-tight">
            Transaksi Terbaru
          </h3>
          <button
            id="btn-link-semua-transaksi"
            onClick={() => onNavigate('laporan')}
            className="text-xs font-semibold text-[#406651] hover:underline cursor-pointer transition-colors"
          >
            Lihat Semua
          </button>
        </div>

        <div className="bg-[#ffffff] rounded-[24px] p-3 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] divide-y divide-[#f4f4f2] border border-neutral-100/80">
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
                <span>Catat Transaksi Baru</span>
              </button>
            </div>
          ) : (
            transactions.slice(0, 6).map((tx) => {
              const isExpense = tx.type === 'expense';
              const isSavings = tx.type === 'savings';

              return (
                <div
                  key={tx.id}
                  id={`tx-row-${tx.id}`}
                  onClick={() => onSelectTransaction(tx)}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#f9f9f7] transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isSavings
                          ? 'bg-[#f0e0cb]/50 text-[#685d4c]'
                          : tx.categoryBgClass
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isSavings ? 'savings' : tx.categoryIcon}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-[#1a1c1b] group-hover:text-[#406651] transition-colors">
                          {tx.title}
                        </p>
                        {isSavings && (
                          <span className="px-2 py-0.5 rounded-md bg-[#f0e0cb]/60 text-[#685d4c] font-bold text-[10px]">
                            Setoran
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#717973] mt-0.5">
                        {tx.timeStr || tx.date}
                        {tx.note && ` • ${tx.note}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-bold tracking-tight ${
                        isSavings
                          ? 'text-[#685d4c]'
                          : isExpense
                          ? 'text-[#ba1a1a]'
                          : 'text-[#406651]'
                      }`}
                    >
                      {isIncome(tx.type)
                        ? `+ ${formatRupiah(tx.amount)}`
                        : `- ${formatRupiah(tx.amount)}`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
};

function isIncome(type: string): boolean {
  return type === 'income';
}

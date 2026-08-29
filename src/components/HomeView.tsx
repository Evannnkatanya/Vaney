import React, { useState, useMemo } from 'react';
import { formatRupiah } from '../data/initialData';
import { Account, BudgetPot, TabType, Transaction } from '../types';
import { Search, Filter, Plus, ArrowUpRight, ArrowDownLeft, PiggyBank, ReceiptText } from 'lucide-react';

interface HomeViewProps {
  totalBalance: number;
  accounts: Account[];
  pots: BudgetPot[];
  transactions: Transaction[];
  onNavigate: (tab: TabType) => void;
  onOpenAddTransaction: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

type TxFilter = 'all' | 'expense' | 'income' | 'savings';

export const HomeView: React.FC<HomeViewProps> = ({
  totalBalance,
  accounts,
  transactions,
  onNavigate,
  onOpenAddTransaction,
  onSelectTransaction,
}) => {
  const [filterType, setFilterType] = useState<TxFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find accounts
  const bcaAcc = accounts.find((a) => a.id === 'bca') || accounts[0];
  const gopayAcc = accounts.find((a) => a.id === 'ewallet') || accounts[1];
  const cashAcc = accounts.find((a) => a.id === 'cash') || accounts[2];

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (filterType === 'expense' && tx.type !== 'expense') return false;
      if (filterType === 'income' && tx.type !== 'income') return false;
      if (filterType === 'savings' && tx.type !== 'savings') return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = tx.title.toLowerCase().includes(query);
        const noteMatch = tx.note?.toLowerCase().includes(query);
        const catMatch = tx.categoryName.toLowerCase().includes(query);
        const amountMatch = tx.amount.toString().includes(query);
        return titleMatch || noteMatch || catMatch || amountMatch;
      }

      return true;
    });
  }, [transactions, filterType, searchQuery]);

  // Group transactions by Date for beautiful scannability
  const groupedTransactions = useMemo(() => {
    const groups: { [dateStr: string]: Transaction[] } = {};
    filteredTransactions.forEach((tx) => {
      const dateKey = tx.date || 'Hari Ini';
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    if (dateStr === today) return 'Hari Ini';
    if (dateStr === yesterday) return 'Kemarin';

    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <main
      id="home-canvas"
      className="max-w-[1140px] mx-auto px-4 sm:px-5 py-3 sm:py-4 space-y-6 animate-in fade-in duration-300"
    >
      {/* Total Balance Hero Card */}
      <section
        id="card-total-saldo"
        className="bg-[#ffffff] rounded-[28px] p-6 sm:p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:scale-[1.005] transition-all duration-300 border border-neutral-100"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#c1edd1]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#f0e0cb]/30 rounded-full blur-2xl pointer-events-none" />

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
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 pt-3 border-t border-[#f4f4f2] w-full max-w-lg">
          <button
            type="button"
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#bde2fe]/30 hover:bg-[#bde2fe]/60 transition-all cursor-pointer text-neutral-800"
          >
            <div className="w-2 h-2 rounded-full bg-[#41657d]" />
            <span className="text-xs font-bold">
              BCA: {formatRupiah(bcaAcc?.balance || 0)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c1edd1]/30 hover:bg-[#c1edd1]/60 transition-all cursor-pointer text-neutral-800"
          >
            <div className="w-2 h-2 rounded-full bg-[#406651]" />
            <span className="text-xs font-bold">
              GoPay: {formatRupiah(gopayAcc?.balance || 0)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0e0cb]/40 hover:bg-[#f0e0cb]/70 transition-all cursor-pointer text-neutral-800"
          >
            <div className="w-2 h-2 rounded-full bg-[#685d4c]" />
            <span className="text-xs font-bold">
              Cash: {formatRupiah(cashAcc?.balance || 0)}
            </span>
          </button>
        </div>
      </section>

      {/* Riwayat Transaksi Section */}
      <section id="section-riwayat-transaksi" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a1c1b] tracking-tight">
              Riwayat Transaksi
            </h3>
            <p className="text-xs text-[#717973]">
              {transactions.length} total transaksi tercatat di perangkat Anda
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddTransaction}
            className="px-4 py-2.5 bg-[#406651] hover:bg-[#284e3a] text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-[#406651]/20 active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi</span>
          </button>
        </div>

        {/* Search & Filter Pills */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, toko, kategori, nominal..."
              className="w-full bg-white border border-[#e2e3e1] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-neutral-800 placeholder:text-neutral-400 focus:ring-2 focus:ring-[#406651] outline-none shadow-2xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#f0f1ee] p-1 rounded-2xl overflow-x-auto no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-white text-[#406651] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterType === 'expense'
                  ? 'bg-white text-[#ba1a1a] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ArrowUpRight className="w-3 h-3" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('savings')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterType === 'savings'
                  ? 'bg-white text-[#685d4c] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <PiggyBank className="w-3 h-3" />
              <span>Setoran Tabungan</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterType === 'income'
                  ? 'bg-white text-[#406651] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ArrowDownLeft className="w-3 h-3" />
              <span>Pemasukan</span>
            </button>
          </div>
        </div>

        {/* Transaction History List grouped by date */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-[24px] p-10 text-center flex flex-col items-center justify-center gap-3 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#406651] flex items-center justify-center">
              <ReceiptText className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="text-base font-bold text-neutral-800">
                {searchQuery ? 'Tidak Ada Transaksi yang Cocok' : 'Belum Ada Riwayat Transaksi'}
              </p>
              <p className="text-xs text-neutral-500">
                {searchQuery
                  ? 'Coba ganti kata kunci pencarian atau reset filter'
                  : 'Mulai catat transaksi pengeluaran, pemasukan, atau setoran tabungan Anda.'}
              </p>
            </div>
            {!searchQuery && (
              <button
                type="button"
                onClick={onOpenAddTransaction}
                className="mt-2 px-5 py-2.5 bg-[#406651] hover:bg-[#284e3a] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Catat Transaksi Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedTransactions).map(([dateKey, txList]) => (
              <div key={dateKey} className="space-y-2">
                {/* Date Group Header */}
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-bold text-neutral-600">
                    {formatDateLabel(dateKey)}
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-400">
                    {txList.length} transaksi
                  </span>
                </div>

                {/* Date Group Transaction Rows */}
                <div className="bg-[#ffffff] rounded-[24px] p-2.5 sm:p-3 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] divide-y divide-[#f4f4f2] border border-neutral-100">
                  {txList.map((tx) => {
                    const isExpense = tx.type === 'expense';
                    const isSavings = tx.type === 'savings';
                    const isIncome = tx.type === 'income';

                    return (
                      <div
                        key={tx.id}
                        id={`tx-row-${tx.id}`}
                        onClick={() => onSelectTransaction(tx)}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f9f9f7] transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                              isSavings
                                ? 'bg-[#f0e0cb]/50 text-[#685d4c]'
                                : isIncome
                                ? 'bg-[#c1edd1]/40 text-[#406651]'
                                : tx.categoryBgClass
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {isSavings ? 'savings' : isIncome ? 'payments' : tx.categoryIcon}
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
                              {isIncome && (
                                <span className="px-2 py-0.5 rounded-md bg-[#c1edd1]/60 text-[#406651] font-bold text-[10px]">
                                  Masuk
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#717973] mt-0.5">
                              <span className="font-medium text-neutral-600">{tx.categoryName}</span>
                              {tx.timeStr && ` • ${tx.timeStr}`}
                              {tx.note && ` • ${tx.note}`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-sm sm:text-base font-bold tracking-tight ${
                              isSavings
                                ? 'text-[#685d4c]'
                                : isExpense
                                ? 'text-[#ba1a1a]'
                                : 'text-[#406651]'
                            }`}
                          >
                            {isIncome
                              ? `+ ${formatRupiah(tx.amount)}`
                              : `- ${formatRupiah(tx.amount)}`}
                          </p>
                          <span className="text-[10px] text-neutral-400 font-medium capitalize">
                            {tx.potType && tx.potType !== 'tidak' ? `Pot ${tx.potType}` : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

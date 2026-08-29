import React, { useState } from 'react';
import { formatRupiah } from '../data/initialData';
import { Transaction } from '../types';

interface LaporanViewProps {
  transactions: Transaction[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'kategori'>('ringkasan');

  // Compute total monthly spending & income from real transactions
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const incomeTransactions = transactions.filter((t) => t.type === 'income');

  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Compute category breakdown dynamically
  const categoryTotals: Record<string, { amount: number; count: number }> = {};
  expenseTransactions.forEach((tx) => {
    const cat = tx.categoryName || 'Lainnya';
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = { amount: 0, count: 0 };
    }
    categoryTotals[cat].amount += tx.amount;
    categoryTotals[cat].count += 1;
  });

  const categoryEntries = Object.entries(categoryTotals).map(([name, data]) => {
    const percentage = totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100) : 0;
    let color = '#406651';
    if (name.toLowerCase().includes('makan')) color = '#406651';
    else if (name.toLowerCase().includes('transport')) color = '#3f627a';
    else if (name.toLowerCase().includes('belanja')) color = '#685d4c';
    else if (name.toLowerCase().includes('tagihan')) color = '#ba1a1a';
    else if (name.toLowerCase().includes('hiburan')) color = '#a7cbe7';
    return { name, amount: data.amount, percentage, count: data.count, color };
  });

  // Sort categories by highest spend
  categoryEntries.sort((a, b) => b.amount - a.amount);

  return (
    <main
      id="laporan-canvas"
      className="max-w-[1140px] mx-auto px-5 py-4 space-y-6 animate-in fade-in duration-300"
    >
      {/* Tab Navigation for Reports */}
      <div
        id="laporan-tabs"
        className="flex justify-start gap-6 border-b border-[#e2e3e1] overflow-x-auto no-scrollbar pb-1"
      >
        <button
          id="tab-ringkasan"
          onClick={() => setActiveTab('ringkasan')}
          className={`pb-2.5 font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'ringkasan'
              ? 'border-b-2 border-[#406651] text-[#406651]'
              : 'border-b-2 border-transparent text-[#717973] hover:text-[#1a1c1b]'
          }`}
        >
          Ringkasan Keuangan
        </button>
        <button
          id="tab-kategori-khusus"
          onClick={() => setActiveTab('kategori')}
          className={`pb-2.5 font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'kategori'
              ? 'border-b-2 border-[#406651] text-[#406651]'
              : 'border-b-2 border-transparent text-[#717973] hover:text-[#1a1c1b]'
          }`}
        >
          Rincian Kategori
        </button>
      </div>

      {/* Insight Cerdas Banner */}
      <section id="section-insight-cerdas">
        <div className="bg-[#ffffff] rounded-[24px] p-5 sm:p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex gap-4 items-start border border-[#bde2fe]/30 hover:shadow-md transition-shadow">
          <div className="p-3 bg-[#bde2fe] text-[#41657d] rounded-full flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px] fill">
              lightbulb
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-[#1a1c1b]">
                Insight Real-Time
              </h3>
              <span className="bg-[#c1edd1] text-[#002112] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Lokal Aktif
              </span>
            </div>
            <p className="text-sm text-[#414843] leading-relaxed">
              {totalExpense === 0
                ? 'Belum ada transaksi pengeluaran yang dicatat. Catat pengeluaran harian Anda agar Vaney dapat menghitung rasio anggaran!'
                : `Total pengeluaran tercatat adalah ${formatRupiah(totalExpense)} dari ${expenseTransactions.length} transaksi.`}
            </p>
          </div>
        </div>
      </section>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500">Total Pemasukan</p>
            <p className="text-xl font-bold text-[#406651] mt-1">{formatRupiah(totalIncome)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_downward</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[20px] shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500">Total Pengeluaran</p>
            <p className="text-xl font-bold text-[#ba1a1a] mt-1">{formatRupiah(totalExpense)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_upward</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Breakdown & Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Category Breakdown Card */}
        <section
          id="card-donut-pengeluaran"
          className="lg:col-span-12 bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#1a1c1b]">Distribusi Pengeluaran Per Kategori</h2>
            <span className="text-xs font-semibold text-[#414843] bg-[#f4f4f2] px-3 py-1 rounded-full">
              {expenseTransactions.length} Transaksi
            </span>
          </div>

          {categoryEntries.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              Belum ada data pengeluaran untuk ditampilkan.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryEntries.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name} ({cat.count}x)
                    </span>
                    <span className="text-neutral-900">{formatRupiah(cat.amount)} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, cat.percentage)}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Extra Detail for Kategori Khusus */}
      {activeTab === 'kategori' && (
        <section className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-[#1a1c1b] mb-4">
            Semua Kategori & Nominal
          </h3>
          {categoryEntries.length === 0 ? (
            <p className="text-xs text-neutral-500">Belum ada kategori dengan transaksi.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryEntries.map((c) => (
                <div key={c.name} className="p-4 bg-[#f9f9f7] rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#1a1c1b]">{c.name}</p>
                    <p className="text-xs text-[#717973]">{c.count} Transaksi dicatat</p>
                  </div>
                  <span className="text-sm font-bold text-[#406651]">{formatRupiah(c.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

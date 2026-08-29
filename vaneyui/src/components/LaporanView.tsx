import React, { useState } from 'react';
import {
  INITIAL_CATEGORY_SPENDING,
  INITIAL_MONTHLY_TRENDS,
  formatRupiah,
} from '../data/initialData';
import { Transaction } from '../types';

interface LaporanViewProps {
  transactions: Transaction[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState<
    'ringkasan' | 'tren' | 'kategori'
  >('ringkasan');
  const [hoveredTrendMonth, setHoveredTrendMonth] = useState<string | null>(null);

  // Compute total monthly spending from transactions if available
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const displayTotalText =
    totalExpense > 0 ? formatRupiah(totalExpense) : 'Rp 4.5Jt';

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
          Ringkasan Bulan Ini
        </button>
        <button
          id="tab-tren"
          onClick={() => setActiveTab('tren')}
          className={`pb-2.5 font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'tren'
              ? 'border-b-2 border-[#406651] text-[#406651]'
              : 'border-b-2 border-transparent text-[#717973] hover:text-[#1a1c1b]'
          }`}
        >
          Tren 6 Bulan
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
          Kategori Khusus
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
                Insight Cerdas
              </h3>
              <span className="bg-[#c1edd1] text-[#002112] text-[10px] font-bold px-2 py-0.5 rounded-full">
                AI Suggestion
              </span>
            </div>
            <p className="text-sm text-[#414843] leading-relaxed">
              Pengeluaran makanmu naik 15% minggu ini. Coba bawa bekal ya! Ini
              bisa menghemat sekitar <strong>Rp 150.000,-</strong> per minggu.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Donut Chart & Spline Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Donut Chart Card (Current Month Spending) */}
        <section
          id="card-donut-pengeluaran"
          className="lg:col-span-5 bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#1a1c1b]">Pengeluaran</h2>
            <span className="text-xs font-semibold text-[#414843] bg-[#f4f4f2] px-3 py-1 rounded-full">
              Bulan Ini
            </span>
          </div>

          {/* SVG Donut Chart */}
          <div className="relative flex-grow flex items-center justify-center min-h-[220px] my-2">
            <svg
              className="w-52 h-52 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                className="stroke-[#e8e8e6]"
                strokeWidth="11"
              />
              {/* Makanan 45% -> 2*PI*38 = 238.76. 45% is 107.44 */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                className="stroke-[#406651] transition-all duration-700"
                strokeWidth="11"
                strokeDasharray="238.76"
                strokeDashoffset={238.76 * 0.55}
                strokeLinecap="round"
              />
              {/* Transportasi 25% -> rotated */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                className="stroke-[#3f627a] transition-all duration-700"
                strokeWidth="11"
                strokeDasharray="238.76"
                strokeDashoffset={238.76 * 0.75}
                strokeLinecap="round"
                transform="rotate(162 50 50)"
              />
              {/* Hiburan 15% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                className="stroke-[#a99b88] transition-all duration-700"
                strokeWidth="11"
                strokeDasharray="238.76"
                strokeDashoffset={238.76 * 0.85}
                strokeLinecap="round"
                transform="rotate(252 50 50)"
              />
            </svg>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-semibold text-[#717973]">
                Total
              </span>
              <span className="text-xl font-bold text-[#1a1c1b] tracking-tight">
                {displayTotalText}
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="mt-4 space-y-2.5 pt-3 border-t border-[#f4f4f2]">
            {INITIAL_CATEGORY_SPENDING.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-[#414843]">
                    {cat.name}
                  </span>
                </div>
                <span className="font-bold text-[#1a1c1b]">
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Line Chart Card (Income vs Expense Trend) */}
        <section
          id="card-line-tren-keuangan"
          className="lg:col-span-7 bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#1a1c1b]">
                Tren Keuangan
              </h2>
              <span className="text-xs font-semibold text-[#414843] bg-[#f4f4f2] px-3 py-1 rounded-full">
                6 Bulan
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#7da68d]" />
                <span className="text-xs font-medium text-[#414843]">
                  Pemasukan
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#ffdad6] border border-[#ba1a1a]/30" />
                <span className="text-xs font-medium text-[#414843]">
                  Pengeluaran
                </span>
              </div>
            </div>
          </div>

          {/* Spline Line Chart Canvas */}
          <div className="w-full flex flex-col mt-2">
            <div className="relative w-full h-52 border-b border-l border-[#e2e3e1]/60 flex items-end">
              {/* Y-Axis labels */}
              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[10px] font-semibold text-[#717973] select-none">
                <span>10Jt</span>
                <span>5Jt</span>
                <span>0</span>
              </div>

              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="pemasukanGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#7da68d" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#7da68d" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient
                    id="pengeluaranGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ffdad6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ffdad6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Pemasukan Area Gradient */}
                <path
                  d="M0,18 C15,18 20,24 35,24 C50,24 55,14 70,14 C85,14 90,8 100,8 L100,50 L0,50 Z"
                  fill="url(#pemasukanGrad)"
                />

                {/* Pemasukan Line (Smoothed Spline) */}
                <path
                  d="M0,18 C15,18 20,24 35,24 C50,24 55,14 70,14 C85,14 90,8 100,8"
                  fill="none"
                  stroke="#406651"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Pengeluaran Line (Smoothed Spline) */}
                <path
                  d="M0,38 C15,38 20,32 35,32 C50,32 55,42 70,42 C85,42 90,28 100,28"
                  fill="none"
                  stroke="#ba1a1a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between w-full mt-2 px-1">
              {INITIAL_MONTHLY_TRENDS.map((item) => (
                <button
                  key={item.month}
                  onMouseEnter={() => setHoveredTrendMonth(item.month)}
                  onMouseLeave={() => setHoveredTrendMonth(null)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    hoveredTrendMonth === item.month
                      ? 'bg-[#c1edd1] text-[#002112]'
                      : 'text-[#717973] hover:text-[#1a1c1b]'
                  }`}
                >
                  {item.month}
                </button>
              ))}
            </div>

            {/* Interactive Trend tooltip */}
            {hoveredTrendMonth && (
              <div className="mt-3 p-3 bg-[#f4f4f2] rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
                <span className="font-bold text-[#1a1c1b]">
                  Bulan {hoveredTrendMonth}
                </span>
                <div className="flex gap-4">
                  <span className="text-[#406651] font-semibold">
                    Masuk: Rp 8.900.000
                  </span>
                  <span className="text-[#ba1a1a] font-semibold">
                    Keluar: Rp 4.500.000
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Extra Detail for Kategori Khusus or Tab Switch */}
      {activeTab === 'kategori' && (
        <section className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-[#1a1c1b] mb-4">
            Rincian Kategori Khusus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#f9f9f7] rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#1a1c1b]">
                  Makanan & Kopi Harian
                </p>
                <p className="text-xs text-[#717973]">
                  Rata-rata Rp 45.000/hari
                </p>
              </div>
              <span className="text-sm font-bold text-[#406651]">
                Rp 1.350.000
              </span>
            </div>
            <div className="p-4 bg-[#f9f9f7] rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#1a1c1b]">
                  Langganan & Hiburan
                </p>
                <p className="text-xs text-[#717973]">Netflix, Spotify, Bioskop</p>
              </div>
              <span className="text-sm font-bold text-[#3f627a]">
                Rp 450.000
              </span>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

import React, { useState, useEffect } from 'react';
import { formatRupiah } from '../data/initialData';
import { AllocationHistory, BudgetPot, CategoryMapping } from '../types';
import { Check, Sparkles, Sliders, RefreshCw, Plus, Trash2, Wallet } from 'lucide-react';

interface JatahViewProps {
  categories: CategoryMapping[];
  budgetPots: BudgetPot[];
  onUpdateBudgetPots: (newPots: BudgetPot[]) => void;
  onOpenAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
}

export const JatahView: React.FC<JatahViewProps> = ({
  categories,
  budgetPots,
  onUpdateBudgetPots,
  onOpenAddCategory,
  onDeleteCategory,
}) => {
  // Find current pot percentages or default to 50/30/20
  const potHarian = budgetPots.find((p) => p.id === 'pot-harian') || budgetPots[0];
  const potBulanan = budgetPots.find((p) => p.id === 'pot-bulanan') || budgetPots[1];
  const potNabung = budgetPots.find((p) => p.id === 'pot-nabung') || budgetPots[2];

  const initialTotalBudget = budgetPots.reduce((sum, p) => sum + p.totalAmount, 0);

  const [totalBudgetInput, setTotalBudgetInput] = useState<string>(
    initialTotalBudget > 0 ? initialTotalBudget.toString() : '5000000'
  );
  const [kebutuhanPct, setKebutuhanPct] = useState<number>(potHarian?.percentage || 50);
  const [keinginanPct, setKeinginanPct] = useState<number>(potBulanan?.percentage || 30);
  const [tabunganPct, setTabunganPct] = useState<number>(potNabung?.percentage || 20);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [rebalanceMsg, setRebalanceMsg] = useState<string | null>(null);

  const totalBudgetNum = parseInt(totalBudgetInput.replace(/\D/g, ''), 10) || 0;
  const totalPct = kebutuhanPct + keinginanPct + tabunganPct;

  // Calculated nominal per pot
  const harianNominal = Math.round((kebutuhanPct / 100) * totalBudgetNum);
  const bulananNominal = Math.round((keinginanPct / 100) * totalBudgetNum);
  const nabungNominal = Math.round((tabunganPct / 100) * totalBudgetNum);

  // History bars
  const historyData: AllocationHistory[] = [
    { month: 'Okt', alokasi: 80, realisasi: 75 },
    { month: 'Nov', alokasi: 80, realisasi: 85 },
    { month: 'Des', alokasi: 80, realisasi: 60 },
  ];

  // Save budget configuration to budgetPots & localStorage
  const handleSaveBudget = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (totalBudgetNum <= 0) {
      alert('Mohon masukkan total anggaran bulanan yang valid.');
      return;
    }

    const updatedPots: BudgetPot[] = [
      {
        id: 'pot-harian',
        name: `Kebutuhan Harian (${kebutuhanPct}%)`,
        percentage: kebutuhanPct,
        totalAmount: harianNominal,
        remainingAmount: harianNominal,
        icon: 'coffee',
        colorClass: 'bg-[#3f627a]',
        bgTrackClass: 'bg-[#c8e6ff]/30',
        bgIconClass: 'bg-[#c8e6ff]/40 text-[#3f627a]',
      },
      {
        id: 'pot-bulanan',
        name: `Kebutuhan Bulanan (${keinginanPct}%)`,
        percentage: keinginanPct,
        totalAmount: bulananNominal,
        remainingAmount: bulananNominal,
        icon: 'home_work',
        colorClass: 'bg-[#406651]',
        bgTrackClass: 'bg-[#c1edd1]/30',
        bgIconClass: 'bg-[#c1edd1]/40 text-[#406651]',
      },
      {
        id: 'pot-nabung',
        name: `Tabungan & Investasi (${tabunganPct}%)`,
        percentage: tabunganPct,
        totalAmount: nabungNominal,
        remainingAmount: nabungNominal,
        icon: 'trending_up',
        colorClass: 'bg-[#685d4c]',
        bgTrackClass: 'bg-[#f0e0cb]/30',
        bgIconClass: 'bg-[#f0e0cb]/40 text-[#685d4c]',
      },
    ];

    onUpdateBudgetPots(updatedPots);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  // Rebalance remaining daily allowance for the remaining days of month
  const handleRebalanceDaily = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = Math.max(1, daysInMonth - now.getDate() + 1);

    const currentHarianRemaining = potHarian?.remainingAmount || harianNominal;
    const dailyLimit = Math.round(currentHarianRemaining / remainingDays);

    const msg = `Jatah harian telah dihitung ulang: ${formatRupiah(dailyLimit)} / hari (tersisa ${remainingDays} hari lagi di bulan ini).`;
    setRebalanceMsg(msg);
  };

  return (
    <main
      id="jatah-canvas"
      className="max-w-[1140px] mx-auto px-5 py-4 space-y-6 animate-in fade-in duration-300"
    >
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#406651] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-semibold">
            Pengaturan Jatah & Pot Anggaran Berhasil Disimpan!
          </span>
        </div>
      )}

      {/* Header Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a1c1b] tracking-tight">
          Pengaturan Jatah & Anggaran Bulanan
        </h2>
        <p className="text-xs sm:text-sm text-[#414843] mt-1">
          Bagi penghasilan bulanan ke dalam pot anggaran harian, bulanan, dan tabungan.
        </p>
      </div>

      {/* Card 1: Total Anggaran Bulanan Input */}
      <section
        id="card-total-budget-input"
        className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Total Anggaran / Pemasukan Bulanan (Rp)
            </label>
            <p className="text-[11px] text-neutral-500">
              Uang yang akan dialokasikan ke masing-masing pot jatah
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[3000000, 5000000, 10000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTotalBudgetInput(preset.toString())}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-emerald-100 text-neutral-800 font-bold text-xs transition-colors cursor-pointer"
              >
                {formatRupiah(preset)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#406651] text-base">
              Rp
            </span>
            <input
              type="number"
              value={totalBudgetInput}
              onChange={(e) => setTotalBudgetInput(e.target.value)}
              placeholder="5000000"
              className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-lg sm:text-xl font-extrabold rounded-[18px] pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#406651] outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveBudget}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#406651] hover:bg-[#284e3a] text-white font-bold text-xs sm:text-sm rounded-[18px] shadow-md shadow-[#406651]/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Check className="w-4 h-4" />
            <span>Simpan & Terapkan Jatah</span>
          </button>
        </div>
      </section>

      {/* Section: Setup Persentase */}
      <section id="section-setup-persentase" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1a1c1b] tracking-tight">
              Alokasi Pot Persentase (Metode 50 / 30 / 20)
            </h3>
            <p className="text-xs text-[#414843]">
              Geser slider untuk menyesuaikan proporsi anggaran.
            </p>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              totalPct === 100
                ? 'bg-emerald-100 text-emerald-800'
                : totalPct > 100
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            Total: {totalPct}% {totalPct === 100 ? '✓ Pas' : '(Harus 100%)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kebutuhan Harian */}
          <div
            id="card-alloc-kebutuhan"
            className="bg-[#ffffff] rounded-[24px] p-5 sm:p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between border border-neutral-100 hover:scale-[1.005] transition-transform duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#3f627a]/15 text-[#3f627a]">
                <span className="material-symbols-outlined text-[22px]">coffee</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#3f627a] tracking-tight block">
                  {kebutuhanPct}%
                </span>
                <span className="text-xs font-extrabold text-neutral-800">
                  {formatRupiah(harianNominal)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1a1c1b]">Jatah Harian</h3>
              <p className="text-xs text-[#414843] mb-3">Makan, kopi, bensin, harian</p>
              <input
                id="slider-kebutuhan"
                type="range"
                min="0"
                max="100"
                value={kebutuhanPct}
                onChange={(e) => setKebutuhanPct(Number(e.target.value))}
                className="w-full accent-[#3f627a] cursor-pointer"
              />
            </div>
          </div>

          {/* Kebutuhan Bulanan */}
          <div
            id="card-alloc-keinginan"
            className="bg-[#ffffff] rounded-[24px] p-5 sm:p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between border border-neutral-100 hover:scale-[1.005] transition-transform duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#406651]/15 text-[#406651]">
                <span className="material-symbols-outlined text-[22px]">home_work</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#406651] tracking-tight block">
                  {keinginanPct}%
                </span>
                <span className="text-xs font-extrabold text-neutral-800">
                  {formatRupiah(bulananNominal)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1a1c1b]">Jatah Bulanan</h3>
              <p className="text-xs text-[#414843] mb-3">Sewa kos, tagihan, wifi, listrik</p>
              <input
                id="slider-keinginan"
                type="range"
                min="0"
                max="100"
                value={keinginanPct}
                onChange={(e) => setKeinginanPct(Number(e.target.value))}
                className="w-full accent-[#406651] cursor-pointer"
              />
            </div>
          </div>

          {/* Tabungan & Investasi */}
          <div
            id="card-alloc-tabungan"
            className="bg-[#ffffff] rounded-[24px] p-5 sm:p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between border border-neutral-100 hover:scale-[1.005] transition-transform duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#685d4c]/15 text-[#685d4c]">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#685d4c] tracking-tight block">
                  {tabunganPct}%
                </span>
                <span className="text-xs font-extrabold text-neutral-800">
                  {formatRupiah(nabungNominal)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1a1c1b]">Tabungan & Investasi</h3>
              <p className="text-xs text-[#414843] mb-3">Dana darurat & investasi</p>
              <input
                id="slider-tabungan"
                type="range"
                min="0"
                max="100"
                value={tabunganPct}
                onChange={(e) => setTabunganPct(Number(e.target.value))}
                className="w-full accent-[#685d4c] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section: Control & Rebalancing Jatah Harian */}
        <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white rounded-[24px] p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <RefreshCw className="w-4 h-4" />
              <span>Fitur Disiplin Keuangan</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Rata Ulang Jatah Harian</h3>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">
              Hitung batas aman pengeluaran harian per hari berdasarkan sisa hari di bulan ini agar uang cukup sampai akhir bulan.
            </p>
            {rebalanceMsg && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-800/80 border border-emerald-600 text-emerald-100 text-xs font-semibold">
                {rebalanceMsg}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleRebalanceDaily}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Rata Ulang Sekarang</span>
          </button>
        </div>
      </section>

      {/* Section: Alokasi vs Realisasi Chart */}
      <section
        id="section-alokasi-vs-realisasi"
        className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100"
      >
        <h2 className="text-base sm:text-lg font-bold text-[#1a1c1b] mb-0.5">
          Alokasi vs Realisasi
        </h2>
        <p className="text-xs text-[#414843] mb-6">
          Perbandingan tren anggaran 3 bulan terakhir.
        </p>

        {/* Visual Bar Chart */}
        <div className="h-56 flex items-end justify-around pt-4 pb-2 px-2 border-b border-[#f4f4f2]">
          {historyData.map((item) => (
            <div
              key={item.month}
              className="flex flex-col items-center gap-1.5 w-1/4 group"
            >
              <div className="flex items-end gap-2 w-full justify-center h-40">
                {/* Alokasi bar */}
                <div
                  className="w-5 sm:w-7 bg-[#a6d0b5] rounded-t-full transition-all duration-500 ease-out hover:opacity-90 relative"
                  style={{ height: `${item.alokasi}%` }}
                  title={`Alokasi ${item.month}: ${item.alokasi}%`}
                />
                {/* Realisasi bar */}
                <div
                  className="w-5 sm:w-7 bg-[#406651] rounded-t-full transition-all duration-500 ease-out hover:opacity-90 relative"
                  style={{ height: `${item.realisasi}%` }}
                  title={`Realisasi ${item.month}: ${item.realisasi}%`}
                />
              </div>
              <span className="text-xs font-semibold text-[#414843] mt-2">
                {item.month}
              </span>
            </div>
          ))}
        </div>

        {/* Chart Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#a6d0b5]" />
            <span className="text-xs font-medium text-[#414843]">Alokasi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#406651]" />
            <span className="text-xs font-medium text-[#414843]">Realisasi</span>
          </div>
        </div>
      </section>

      {/* Section: Mapping Kategori */}
      <section id="section-mapping-kategori">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1a1c1b]">Mapping Kategori Pos Anggaran</h2>
            <p className="text-xs text-neutral-500">{categories.length} Kategori terdaftar</p>
          </div>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              className="bg-[#ffffff] rounded-[20px] p-4 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 flex items-center justify-between group hover:bg-[#f9f9f7] transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${cat.bgIconClass} ${cat.colorClass}`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {cat.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a1c1b]">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#717973] mt-0.5">
                    {cat.monthlyAmount > 0 ? `${formatRupiah(cat.monthlyAmount)} / bln` : 'Sesuai kebutuhan'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#f4f4f2] px-3 py-1 rounded-full text-xs font-semibold text-[#1a1c1b]">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      cat.category === 'Kebutuhan'
                        ? 'bg-[#3f627a]'
                        : cat.category === 'Keinginan'
                        ? 'bg-[#406651]'
                        : 'bg-[#685d4c]'
                    }`}
                  />
                  <span>{cat.category}</span>
                </div>
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#717973] hover:text-[#ba1a1a] p-1 transition-all cursor-pointer"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          id="btn-tambah-kategori-trigger"
          onClick={onOpenAddCategory}
          className="w-full mt-4 bg-[#ffffff] border border-dashed border-[#c1c8c1] text-[#406651] font-semibold text-sm py-3.5 rounded-2xl hover:bg-[#f4f4f2] hover:border-[#406651] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </section>
    </main>
  );
};

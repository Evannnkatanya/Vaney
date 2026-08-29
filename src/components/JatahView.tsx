import React, { useState } from 'react';
import { formatRupiah } from '../data/initialData';
import { AllocationHistory, BudgetPot, CategoryMapping } from '../types';
import {
  Check,
  Sliders,
  RefreshCw,
  Plus,
  Trash2,
  PieChart,
  Layers,
  BarChart3,
  Settings2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Info,
  Calendar,
} from 'lucide-react';

type JatahSubTab = 'ringkasan' | 'persentase' | 'kategori' | 'analisis';

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
  const [activeSubTab, setActiveSubTab] = useState<JatahSubTab>('ringkasan');

  // Find pot references
  const potHarian = budgetPots.find((p) => p.id === 'pot-harian') || budgetPots[0];
  const potBulanan = budgetPots.find((p) => p.id === 'pot-bulanan') || budgetPots[1];
  const potNabung = budgetPots.find((p) => p.id === 'pot-nabung') || budgetPots[2];

  const initialTotalBudget = budgetPots.reduce((sum, p) => sum + p.totalAmount, 0);

  // Setup Persentase State
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

  // Real-time calculations
  const harianNominal = Math.round((kebutuhanPct / 100) * totalBudgetNum);
  const bulananNominal = Math.round((keinginanPct / 100) * totalBudgetNum);
  const nabungNominal = Math.round((tabunganPct / 100) * totalBudgetNum);

  // Rebalance calculations
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay + 1);
  const currentHarianRemaining = potHarian?.remainingAmount ?? harianNominal;
  const currentHarianTotal = potHarian?.totalAmount || harianNominal || 1;
  const dailyAllowance = Math.round(currentHarianRemaining / remainingDays);
  const usedHarianPct = Math.min(
    100,
    Math.max(0, Math.round(((currentHarianTotal - currentHarianRemaining) / currentHarianTotal) * 100))
  );
  const isHighDailyUsage = usedHarianPct >= 80;

  // History bars for analysis
  const historyData: AllocationHistory[] = [
    { month: 'Okt', alokasi: 80, realisasi: 75 },
    { month: 'Nov', alokasi: 80, realisasi: 85 },
    { month: 'Des', alokasi: 80, realisasi: 60 },
  ];

  // Save budget configuration
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

  // Rebalance daily allowance
  const handleRebalanceDaily = () => {
    const msg = `Jatah harian telah dirata-ulang: ${formatRupiah(dailyAllowance)} / hari untuk sisa ${remainingDays} hari bulan ini.`;
    setRebalanceMsg(msg);
  };

  return (
    <main
      id="jatah-canvas"
      className="max-w-[1140px] mx-auto px-4 sm:px-5 py-3 sm:py-4 space-y-5 animate-in fade-in duration-300"
    >
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#406651] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-semibold">
            Pengaturan Jatah Bulanan Berhasil Disimpan!
          </span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1c1b] tracking-tight">
            Jatah Bulanan
          </h2>
          <p className="text-xs text-[#717973] mt-0.5">
            Monitoring disiplin pengeluaran & alokasi anggaran
          </p>
        </div>

        {/* Quick Settings Shortcut Button */}
        <button
          type="button"
          onClick={() => setActiveSubTab('persentase')}
          className="p-2.5 rounded-2xl bg-white hover:bg-neutral-100 border border-neutral-200/80 text-neutral-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          title="Buka Pengaturan Persentase"
        >
          <Settings2 className="w-4 h-4 text-[#406651]" />
          <span className="text-xs font-bold hidden sm:inline">Atur Anggaran</span>
        </button>
      </div>

      {/* 4 Horizontal Navigation Tabs */}
      <div className="bg-[#f0f1ee] p-1 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('ringkasan')}
          className={`flex-1 min-w-[95px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'ringkasan'
              ? 'bg-white text-[#406651] shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ringkasan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('persentase')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'persentase'
              ? 'bg-white text-[#406651] shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Atur Persentase</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('kategori')}
          className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'kategori'
              ? 'bg-white text-[#406651] shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Kategori</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('analisis')}
          className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'analisis'
              ? 'bg-white text-[#406651] shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analisis</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RINGKASAN (Overview, Sticky Rata Ulang CTA, Progress Bar Pots)     */}
      {/* ========================================================================= */}
      {activeSubTab === 'ringkasan' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sticky / Top Smart Banner for Rata Ulang Jatah Harian */}
          <div
            id="banner-rata-ulang-jatah"
            className={`rounded-[24px] p-5 sm:p-6 shadow-md transition-all ${
              isHighDailyUsage
                ? 'bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white border border-rose-700/50'
                : 'bg-gradient-to-r from-emerald-950 via-teal-950 to-[#284e3a] text-white border border-emerald-800/40'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  {isHighDailyUsage ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400 text-rose-200 text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Pemakaian Jatah Harian {usedHarianPct}%
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Status Jatah Terkendali
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {isHighDailyUsage
                    ? 'Peringatan: Jatah Harian Mendekati Batas!'
                    : 'Batas Aman Jatah Harian Anda'}
                </h3>

                <p className="text-xs text-neutral-200/90 max-w-xl">
                  {isHighDailyUsage
                    ? `Anda telah memakai ${usedHarianPct}% jatah harian. Rata-ulang sekarang agar sisa saldo ${formatRupiah(
                        currentHarianRemaining
                      )} cukup untuk ${remainingDays} hari ke depan.`
                    : `Sisa jatah harian ${formatRupiah(
                        currentHarianRemaining
                      )} setara dengan batas aman ${formatRupiah(
                        dailyAllowance
                      )} / hari untuk sisa ${remainingDays} hari bulan ini.`}
                </p>

                {rebalanceMsg && (
                  <div className="mt-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-white text-xs font-semibold animate-in fade-in">
                    {rebalanceMsg}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRebalanceDaily}
                className={`px-5 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all active:scale-95 shrink-0 flex items-center justify-center gap-2 cursor-pointer ${
                  isHighDailyUsage
                    ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-emerald-400/30'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Rata Ulang Sekarang</span>
              </button>
            </div>
          </div>

          {/* Section Header: Progress Bulan Ini */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1a1c1b]">
                  Progress Alokasi Pot Bulan Ini
                </h3>
                <p className="text-xs text-neutral-500">
                  Total Anggaran Terdaftar: {formatRupiah(totalBudgetNum)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('persentase')}
                className="text-xs font-bold text-[#406651] hover:underline cursor-pointer"
              >
                Edit Alokasi →
              </button>
            </div>

            {/* 3 Main Pot Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgetPots.map((pot) => {
                const total = pot.totalAmount || 1;
                const remaining = pot.remainingAmount ?? total;
                const spent = Math.max(0, total - remaining);
                const percentSpent = Math.min(100, Math.round((spent / total) * 100));

                return (
                  <div
                    key={pot.id}
                    className="bg-white rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col justify-between space-y-4 hover:scale-[1.005] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${pot.bgIconClass}`}
                        >
                          <span className="material-symbols-outlined text-[22px]">
                            {pot.icon}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#1a1c1b]">{pot.name}</h4>
                          <span className="text-[11px] text-neutral-500">
                            Terpakai {percentSpent}%
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-full">
                        {pot.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${pot.colorClass}`}
                          style={{ width: `${percentSpent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-semibold text-neutral-500">
                        <span>Sisa: {formatRupiah(remaining)}</span>
                        <span>Total: {formatRupiah(pot.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#f9f9f7] rounded-[24px] p-4 sm:p-5 border border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-[#406651]">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-xs text-neutral-600">
                Ingin mengubah proporsi persentase atau menambah kategori pos belanja?
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveSubTab('persentase')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 transition-colors cursor-pointer text-center"
              >
                Ubah Persentase
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('kategori')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#406651] hover:bg-[#284e3a] text-xs font-bold text-white transition-colors cursor-pointer text-center"
              >
                Lihat Kategori
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ATUR PERSENTASE (Slider 50/30/20, Input Pemasukan, Preset Chips)  */}
      {/* ========================================================================= */}
      {activeSubTab === 'persentase' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Section 1: Input Total Pemasukan / Anggaran Bulanan */}
          <section
            id="card-total-budget-input"
            className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                  Total Anggaran / Pemasukan Bulanan
                </h3>
                <p className="text-xs text-neutral-500">
                  Nominal uang yang akan dibagi ke dalam pot persentase
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

          {/* Section 2: Slider Alokasi Persentase */}
          <section id="section-slider-persentase" className="space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200/60 pb-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1a1c1b]">
                  Konfigurasi Slider Persentase (50 / 30 / 20)
                </h3>
                <p className="text-xs text-[#717973]">
                  Sesuaikan rasio pembagian untuk kebutuhan harian, bulanan, dan tabungan
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
                Total: {totalPct}% {totalPct === 100 ? '✓ Pas 100%' : '(Wajib 100%)'}
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
                  <h4 className="text-sm sm:text-base font-bold text-[#1a1c1b]">Jatah Harian</h4>
                  <p className="text-xs text-[#717973] mb-3">Makan harian, kopi, transport harian</p>
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
                  <h4 className="text-sm sm:text-base font-bold text-[#1a1c1b]">Jatah Bulanan</h4>
                  <p className="text-xs text-[#717973] mb-3">Sewa kos/rumah, tagihan, wifi, listrik</p>
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
                  <h4 className="text-sm sm:text-base font-bold text-[#1a1c1b]">Tabungan & Investasi</h4>
                  <p className="text-xs text-[#717973] mb-3">Dana darurat & tabungan jangka panjang</p>
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
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KATEGORI (Single Source of Truth, Pos Anggaran, Tambah Kategori)   */}
      {/* ========================================================================= */}
      {activeSubTab === 'kategori' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1a1c1b]">
                Daftar Kategori & Pot Tujuan
              </h3>
              <p className="text-xs text-[#717973]">
                {categories.length} Kategori terdaftar sebagai acuan pengeluaran
              </p>
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
                    <h4 className="text-sm font-bold text-[#1a1c1b]">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-[#717973] mt-0.5">
                      {cat.monthlyAmount > 0
                        ? `${formatRupiah(cat.monthlyAmount)} / bln`
                        : 'Sesuai kebutuhan'}
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
                    type="button"
                    onClick={() => onDeleteCategory(cat.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#717973] hover:text-[#ba1a1a] p-1.5 rounded-lg hover:bg-neutral-100 transition-all cursor-pointer"
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
            type="button"
            onClick={onOpenAddCategory}
            className="w-full mt-3 bg-[#ffffff] border border-dashed border-[#c1c8c1] text-[#406651] font-semibold text-sm py-3.5 rounded-2xl hover:bg-[#f4f4f2] hover:border-[#406651] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kategori Baru</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ANALISIS (Grafik Alokasi vs Realisasi, Tren & Evaluasi)            */}
      {/* ========================================================================= */}
      {activeSubTab === 'analisis' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <section
            id="section-alokasi-vs-realisasi"
            className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-neutral-100 space-y-4"
          >
            <div className="border-b border-neutral-200/60 pb-3">
              <h3 className="text-base font-bold text-[#1a1c1b]">
                Tren Alokasi vs Realisasi
              </h3>
              <p className="text-xs text-[#717973] mt-0.5">
                Perbandingan ketepatan alokasi anggaran dalam 3 bulan terakhir
              </p>
            </div>

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
                      className="w-6 sm:w-8 bg-[#a6d0b5] rounded-t-full transition-all duration-500 ease-out hover:opacity-90 relative"
                      style={{ height: `${item.alokasi}%` }}
                      title={`Alokasi ${item.month}: ${item.alokasi}%`}
                    />
                    {/* Realisasi bar */}
                    <div
                      className="w-6 sm:w-8 bg-[#406651] rounded-t-full transition-all duration-500 ease-out hover:opacity-90 relative"
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
            <div className="flex justify-center gap-6 pt-2">
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

          {/* Evaluasi Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-[#c1edd1]/30 rounded-[24px] p-5 border border-emerald-200/80 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shrink-0 shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-950">
                Evaluasi Disiplin Keuangan
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Rasio realisasi rata-rata Anda berada di angka yang sehat. Pastikan jatah harian selalu dirata-ulang jika terjadi lonjakan pengeluaran tidak terduga di awal bulan.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

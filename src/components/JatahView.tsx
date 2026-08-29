import React, { useState } from 'react';
import { formatRupiah } from '../data/initialData';
import { AllocationHistory, CategoryMapping } from '../types';

interface JatahViewProps {
  categories: CategoryMapping[];
  onOpenAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
}

export const JatahView: React.FC<JatahViewProps> = ({
  categories,
  onOpenAddCategory,
  onDeleteCategory,
}) => {
  // Percentages state for the 3 main pots
  const [kebutuhanPct, setKebutuhanPct] = useState<number>(50);
  const [keinginanPct, setKeinginanPct] = useState<number>(30);
  const [tabunganPct, setTabunganPct] = useState<number>(20);

  // History bars
  const historyData: AllocationHistory[] = [
    { month: 'Okt', alokasi: 80, realisasi: 75 },
    { month: 'Nov', alokasi: 80, realisasi: 85 },
    { month: 'Des', alokasi: 80, realisasi: 60 },
  ];

  const totalPct = kebutuhanPct + keinginanPct + tabunganPct;

  return (
    <main
      id="jatah-canvas"
      className="max-w-[1140px] mx-auto px-5 py-4 space-y-8 animate-in fade-in duration-300"
    >
      {/* Section: Setup Persentase */}
      <section id="section-setup-persentase">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1c1b] tracking-tight">
              Setup Persentase
            </h2>
            <p className="text-sm text-[#414843] mt-1">
              Atur alokasi ideal bulanan kamu.
            </p>
          </div>
          {totalPct !== 100 && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                totalPct > 100
                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                  : 'bg-[#c1edd1] text-[#002112]'
              }`}
            >
              Total: {totalPct}%
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kebutuhan */}
          <div
            id="card-alloc-kebutuhan"
            className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#406651]/15 text-[#406651]">
                <span className="material-symbols-outlined text-[24px]">
                  restaurant
                </span>
              </div>
              <span className="text-3xl font-bold text-[#406651] tracking-tight">
                {kebutuhanPct}%
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a1c1b]">Kebutuhan</h3>
              <p className="text-xs text-[#414843] mb-4">
                Sewa, Makanan, Transport
              </p>
              <input
                id="slider-kebutuhan"
                type="range"
                min="0"
                max="100"
                value={kebutuhanPct}
                onChange={(e) => setKebutuhanPct(Number(e.target.value))}
                className="custom-slider"
              />
            </div>
          </div>

          {/* Keinginan */}
          <div
            id="card-alloc-keinginan"
            className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#3f627a]/15 text-[#3f627a]">
                <span className="material-symbols-outlined text-[24px]">
                  shopping_bag
                </span>
              </div>
              <span className="text-3xl font-bold text-[#3f627a] tracking-tight">
                {keinginanPct}%
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a1c1b]">Keinginan</h3>
              <p className="text-xs text-[#414843] mb-4">
                Hiburan, Belanja, Hobi
              </p>
              <input
                id="slider-keinginan"
                type="range"
                min="0"
                max="100"
                value={keinginanPct}
                onChange={(e) => setKeinginanPct(Number(e.target.value))}
                className="custom-slider"
              />
            </div>
          </div>

          {/* Tabungan */}
          <div
            id="card-alloc-tabungan"
            className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#685d4c]/15 text-[#685d4c]">
                <span className="material-symbols-outlined text-[24px]">
                  savings
                </span>
              </div>
              <span className="text-3xl font-bold text-[#685d4c] tracking-tight">
                {tabunganPct}%
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a1c1b]">Tabungan</h3>
              <p className="text-xs text-[#414843] mb-4">
                Investasi, Dana Darurat
              </p>
              <input
                id="slider-tabungan"
                type="range"
                min="0"
                max="100"
                value={tabunganPct}
                onChange={(e) => setTabunganPct(Number(e.target.value))}
                className="custom-slider"
              />
            </div>
          </div>
        </div>

        {/* Section: Control & Rebalancing Jatah Harian */}
        <div className="mt-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-[24px] p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[18px]">autorenew</span>
              <span>Fitur Disiplin Keuangan</span>
            </div>
            <h3 className="text-lg font-bold text-white">Rata Ulang Jatah Harian</h3>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">
              Jika pengeluaran di awal bulan boros, hitung ulang jatah harian secara merata untuk sisa hari tersisa bulan ini agar anggaran tetap terkontrol.
            </p>
          </div>
          <button
            onClick={() => {
              const now = new Date();
              const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
              const remainingDays = Math.max(1, daysInMonth - now.getDate() + 1);
              alert(`Jatah harian telah dirata-ulang! Sisa ${remainingDays} hari lagi bulan ini.`);
            }}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Rata Ulang Sekarang</span>
          </button>
        </div>
      </section>

      {/* Section: Alokasi vs Realisasi Chart */}
      <section
        id="section-alokasi-vs-realisasi"
        className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)]"
      >
        <h2 className="text-lg font-bold text-[#1a1c1b] mb-0.5">
          Alokasi vs Realisasi
        </h2>
        <p className="text-xs text-[#414843] mb-6">
          Perbandingan 3 bulan terakhir.
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
          <h2 className="text-lg font-bold text-[#1a1c1b]">Mapping Kategori</h2>
          <span className="text-xs text-[#717973]">
            {categories.length} Kategori terdaftar
          </span>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              className="bg-[#ffffff] rounded-[20px] p-4 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex items-center justify-between group hover:bg-[#f9f9f7] transition-all duration-200"
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
                    {formatRupiah(cat.monthlyAmount)} / bln
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#f4f4f2] px-3 py-1 rounded-full text-xs font-semibold text-[#1a1c1b]">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      cat.category === 'Kebutuhan'
                        ? 'bg-[#406651]'
                        : cat.category === 'Keinginan'
                        ? 'bg-[#3f627a]'
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
                  <span className="material-symbols-outlined text-[18px]">
                    delete
                  </span>
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
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Tambah Kategori</span>
        </button>
      </section>
    </main>
  );
};

import React, { useState } from 'react';
import { CategoryMapping, PotCategoryType } from '../types';

interface ModalAddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCategory: (category: Omit<CategoryMapping, 'id'>) => void;
}

export const ModalAddCategory: React.FC<ModalAddCategoryProps> = ({
  isOpen,
  onClose,
  onSaveCategory,
}) => {
  const [name, setName] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [category, setCategory] = useState<PotCategoryType>('Kebutuhan');
  const [icon, setIcon] = useState('lunch_dining');

  if (!isOpen) return null;

  const iconOptions = [
    { name: 'lunch_dining', label: 'Makanan' },
    { name: 'movie', label: 'Hiburan' },
    { name: 'trending_up', label: 'Investasi' },
    { name: 'directions_car', label: 'Transport' },
    { name: 'shopping_bag', label: 'Belanja' },
    { name: 'fitness_center', label: 'Kebugaran' },
    { name: 'medical_services', label: 'Kesehatan' },
    { name: 'home', label: 'Tempat Tinggal' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !monthlyAmount.trim()) {
      alert('Mohon isi nama kategori dan target nominal per bulan.');
      return;
    }

    let colorClass = 'text-[#406651]';
    let bgIconClass = 'bg-[#406651]/15';

    if (category === 'Keinginan') {
      colorClass = 'text-[#3f627a]';
      bgIconClass = 'bg-[#3f627a]/15';
    } else if (category === 'Tabungan') {
      colorClass = 'text-[#685d4c]';
      bgIconClass = 'bg-[#685d4c]/15';
    }

    onSaveCategory({
      name: name.trim(),
      monthlyAmount: parseFloat(monthlyAmount) || 0,
      category,
      icon,
      colorClass,
      bgIconClass,
    });

    setName('');
    setMonthlyAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-[24px] max-w-md w-full p-6 shadow-[0px_15px_40px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-[#1a1c1b]">
            Tambah Kategori Baru
          </h3>
          <button
            onClick={onClose}
            className="text-[#717973] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f4f4f2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#414843] block mb-1">
              Nama Kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Belanja Mingguan / Gym"
              className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-sm font-medium rounded-[16px] px-3.5 py-2.5 focus:ring-2 focus:ring-[#406651] outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#414843] block mb-1">
              Alokasi Pot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Kebutuhan', 'Keinginan', 'Tabungan'] as PotCategoryType[]).map(
                (pot) => (
                  <button
                    key={pot}
                    type="button"
                    onClick={() => setCategory(pot)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      category === pot
                        ? 'bg-[#7da68d] text-[#143b28] shadow-sm'
                        : 'bg-[#f4f4f2] text-[#414843] hover:bg-[#e2e3e1]'
                    }`}
                  >
                    {pot}
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#414843] block mb-1">
              Perkiraan Nominal / Bulan (Rp)
            </label>
            <input
              type="number"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
              placeholder="Contoh: 500000"
              className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-sm font-medium rounded-[16px] px-3.5 py-2.5 focus:ring-2 focus:ring-[#406651] outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#414843] block mb-1.5">
              Pilih Ikon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setIcon(opt.name)}
                  className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    icon === opt.name
                      ? 'bg-[#406651] text-[#ffffff] shadow-sm scale-105'
                      : 'bg-[#f4f4f2] text-[#414843] hover:bg-[#e2e3e1]'
                  }`}
                  title={opt.label}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {opt.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#f4f4f2] text-[#414843] font-semibold text-sm py-3 rounded-[16px] hover:bg-[#e2e3e1] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#406651] text-[#ffffff] font-semibold text-sm py-3 rounded-[16px] hover:scale-[1.02] active:scale-98 shadow-md transition-all cursor-pointer"
            >
              Simpan Kategori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

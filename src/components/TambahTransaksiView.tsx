import React, { useState } from 'react';
import { TRANSACTION_CATEGORIES } from '../data/initialData';
import { Account, Transaction } from '../types';
import { OCRScanModal } from './OCRScanModal';
import { VoiceInputModal } from './VoiceInputModal';
import { Camera, Volume2, Sparkles } from 'lucide-react';

interface TambahTransaksiViewProps {
  accounts: Account[];
  onSaveTransaction: (transaction: Omit<Transaction, 'id' | 'timeStr'>) => void;
  onCancel: () => void;
}

export const TambahTransaksiView: React.FC<TambahTransaksiViewProps> = ({
  accounts,
  onSaveTransaction,
  onCancel,
}) => {
  const [rawAmount, setRawAmount] = useState<string>('0');
  const [selectedCategory, setSelectedCategory] = useState<string>('makan');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id || 'bca',
  );
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [note, setNote] = useState<string>('');
  const [potType, setPotType] = useState<'tidak' | 'harian' | 'bulanan'>('harian');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Smart Input Modals state
  const [isOCROpen, setIsOCROpen] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);

  // Currency formatting helper
  const formatNumber = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handleAppendNumber = (num: string) => {
    if (rawAmount === '0' && num !== '000' && num !== '0') {
      setRawAmount(num);
    } else if (rawAmount !== '0') {
      if (rawAmount.length < 11) {
        setRawAmount(rawAmount + num);
      }
    }
  };

  const handleDeleteNumber = () => {
    if (rawAmount.length > 1) {
      setRawAmount(rawAmount.slice(0, -1));
    } else {
      setRawAmount('0');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseInt(rawAmount, 10);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert('Silakan masukkan jumlah nominal transaksi yang valid.');
      return;
    }

    const catObj =
      TRANSACTION_CATEGORIES.find((c) => c.id === selectedCategory) ||
      TRANSACTION_CATEGORIES[0];

    const title =
      note.trim() ||
      (selectedCategory === 'makan'
        ? 'Makan Siang'
        : selectedCategory === 'transport'
        ? 'Transportasi'
        : selectedCategory === 'belanja'
        ? 'Belanja'
        : selectedCategory === 'tagihan'
        ? 'Tagihan Listrik / Air'
        : selectedCategory === 'hiburan'
        ? 'Hiburan'
        : 'Pengeluaran');

    onSaveTransaction({
      title,
      amount: amountVal,
      type: 'expense',
      date,
      categoryName: catObj.name,
      categoryIcon: catObj.icon,
      categoryBgClass: `${catObj.bgClass} ${catObj.textClass}`,
      categoryTextClass: catObj.textClass,
      accountId: selectedAccountId,
      potType,
      note: note.trim(),
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onCancel();
    }, 800);
  };

  return (
    <main
      id="tambah-transaksi-canvas"
      className="px-5 pt-2 pb-12 max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-300 relative"
    >
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#406651] text-[#ffffff] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-[22px]">
            check_circle
          </span>
          <span className="text-sm font-semibold">
            Transaksi berhasil dicatat!
          </span>
        </div>
      )}

      {/* Main Left Column: Amount + Numpad + Categories */}
      <div className="md:col-span-7 flex flex-col gap-6">
        {/* Smart Input Quick Bar (OCR & Voice) */}
        <div className="flex items-center justify-between gap-3 bg-[#ffffff] p-3 rounded-[20px] shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-neutral-100">
          <div className="flex items-center gap-2 pl-2">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-xs font-bold text-neutral-800">Smart Input Cepat</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOCROpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center gap-1.5 border border-emerald-200/60 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Scan Struk</span>
            </button>
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold text-xs flex items-center gap-1.5 border border-purple-200/60 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Input Suara</span>
            </button>
          </div>
        </div>

        {/* Amount Input Area */}
        <section
          id="amount-display-card"
          className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#c1edd1]/20 rounded-full blur-xl pointer-events-none" />
          <p className="text-sm font-medium text-[#414843] mb-2">
            Total Pengeluaran
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#406651]">Rp</span>
            <span
              id="amountInput"
              className="text-4xl sm:text-5xl font-extrabold text-[#1a1c1b] tracking-tight"
            >
              {formatNumber(rawAmount)}
            </span>
          </div>
        </section>

        {/* Numpad */}
        <section
          id="numpad-container"
          className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto w-full"
        >
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              id={`btn-numpad-${digit}`}
              type="button"
              onClick={() => handleAppendNumber(digit)}
              className="bg-[#ffffff] rounded-[18px] h-14 flex items-center justify-center text-xl font-bold text-[#1a1c1b] shadow-[0px_4px_12px_rgba(0,0,0,0.02)] active:scale-95 active:bg-[#f4f4f2] transition-all cursor-pointer select-none"
            >
              {digit}
            </button>
          ))}
          <button
            id="btn-numpad-000"
            type="button"
            onClick={() => handleAppendNumber('000')}
            className="bg-[#ffffff] rounded-[18px] h-14 flex items-center justify-center text-lg font-bold text-[#414843] shadow-[0px_4px_12px_rgba(0,0,0,0.02)] active:scale-95 active:bg-[#f4f4f2] transition-all cursor-pointer select-none"
          >
            000
          </button>
          <button
            id="btn-numpad-0"
            type="button"
            onClick={() => handleAppendNumber('0')}
            className="bg-[#ffffff] rounded-[18px] h-14 flex items-center justify-center text-xl font-bold text-[#1a1c1b] shadow-[0px_4px_12px_rgba(0,0,0,0.02)] active:scale-95 active:bg-[#f4f4f2] transition-all cursor-pointer select-none"
          >
            0
          </button>
          <button
            id="btn-numpad-backspace"
            type="button"
            onClick={handleDeleteNumber}
            className="bg-[#ffffff] rounded-[18px] h-14 flex items-center justify-center text-[#414843] shadow-[0px_4px_12px_rgba(0,0,0,0.02)] active:scale-95 active:bg-[#f4f4f2] transition-all cursor-pointer select-none"
            title="Hapus Digit"
          >
            <span className="material-symbols-outlined text-[24px]">
              backspace
            </span>
          </button>
        </section>

        {/* Category Grid */}
        <section id="category-picker-section" className="flex flex-col gap-2.5">
          <h2 className="text-xs font-bold text-[#414843] uppercase tracking-wider px-1">
            Kategori
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {TRANSACTION_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-chip-${cat.id}`}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-[18px] p-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#7da68d] text-[#143b28] shadow-md scale-[1.03]'
                      : 'bg-[#ffffff] text-[#1a1c1b] shadow-[0px_4px_12px_rgba(0,0,0,0.02)] hover:bg-[#f4f4f2]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#ffffff]/30 text-[#143b28]' : `${cat.bgClass} ${cat.textClass}`
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {cat.icon}
                    </span>
                  </div>
                  <span className="text-xs font-semibold">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Right Column: Transaction Options & Confirm CTA */}
      <div className="md:col-span-5 flex flex-col gap-6">
        <section
          id="transaction-details-card"
          className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col gap-4"
        >
          {/* Sumber Dana */}
          <div>
            <label className="text-xs font-bold text-[#414843] mb-1.5 block">
              Sumber Dana
            </label>
            <div className="relative">
              <select
                id="select-sumber-dana"
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-sm font-medium rounded-[16px] px-4 py-3 appearance-none focus:ring-2 focus:ring-[#406651] outline-none cursor-pointer"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.subtitle})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#414843]">
                <span className="material-symbols-outlined text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Date & Note Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#414843] mb-1.5 block">
                Tanggal
              </label>
              <input
                id="input-tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-sm font-medium rounded-[16px] px-3.5 py-2.5 focus:ring-2 focus:ring-[#406651] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#414843] mb-1.5 block">
                Catatan (Opsional)
              </label>
              <input
                id="input-tx-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Makan siang..."
                className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-sm font-medium rounded-[16px] px-3.5 py-2.5 focus:ring-2 focus:ring-[#406651] outline-none placeholder:text-[#717973]"
              />
            </div>
          </div>

          {/* Segmented Control for Auto-Pot */}
          <div>
            <label className="text-xs font-bold text-[#414843] mb-1.5 flex items-center justify-between">
              <span>Ambil dari Jatah?</span>
              <span
                className="material-symbols-outlined text-[16px] text-[#717973] cursor-help"
                title="Potong saldo jatah yang sudah dialokasikan pada pot bulanan"
              >
                info
              </span>
            </label>
            <div className="flex bg-[#f4f4f2] rounded-[16px] p-1 gap-1">
              <button
                type="button"
                onClick={() => setPotType('tidak')}
                className={`flex-1 py-2 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                  potType === 'tidak'
                    ? 'bg-[#ffffff] text-[#1a1c1b] shadow-sm'
                    : 'text-[#414843] hover:bg-[#e2e3e1]/50'
                }`}
              >
                Tidak
              </button>
              <button
                type="button"
                onClick={() => setPotType('harian')}
                className={`flex-1 py-2 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                  potType === 'harian'
                    ? 'bg-[#7da68d] text-[#143b28] shadow-sm'
                    : 'text-[#414843] hover:bg-[#e2e3e1]/50'
                }`}
              >
                Harian
              </button>
              <button
                type="button"
                onClick={() => setPotType('bulanan')}
                className={`flex-1 py-2 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                  potType === 'bulanan'
                    ? 'bg-[#7da68d] text-[#143b28] shadow-sm'
                    : 'text-[#414843] hover:bg-[#e2e3e1]/50'
                }`}
              >
                Bulanan
              </button>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <button
          id="btn-submit-save-tx"
          type="button"
          onClick={handleSubmit}
          className="w-full bg-[#406651] text-[#ffffff] font-bold text-base py-4 rounded-[18px] hover:scale-[1.01] active:scale-98 transition-all shadow-[0px_15px_40px_rgba(64,102,81,0.25)] cursor-pointer mt-auto"
        >
          Simpan Transaksi
        </button>
      </div>

      {/* Smart Input Modals */}
      <OCRScanModal
        isOpen={isOCROpen}
        onClose={() => setIsOCROpen(false)}
        onApplyData={(scanned) => {
          setRawAmount(scanned.amount.toString());
          setNote(scanned.merchant);
          if (scanned.date) setDate(scanned.date);
          // find matching category
          const found = TRANSACTION_CATEGORIES.find(
            (c) => c.name.toLowerCase() === scanned.category.toLowerCase(),
          );
          if (found) setSelectedCategory(found.id);
        }}
      />

      <VoiceInputModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onApplyData={(parsed) => {
          setRawAmount(parsed.amount.toString());
          setNote(parsed.merchant);
          const found = TRANSACTION_CATEGORIES.find(
            (c) => c.name.toLowerCase() === parsed.category.toLowerCase(),
          );
          if (found) setSelectedCategory(found.id);
        }}
      />
    </main>
  );
};


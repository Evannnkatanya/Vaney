import React, { useState, useEffect } from 'react';
import { TRANSACTION_CATEGORIES } from '../data/initialData';
import { Account, Transaction } from '../types';
import { OCRScanModal } from './OCRScanModal';
import { VoiceInputModal } from './VoiceInputModal';
import { Camera, Volume2, PiggyBank, ArrowUpRight } from 'lucide-react';

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
  const [txType, setTxType] = useState<'expense' | 'savings'>('expense');
  const [rawAmount, setRawAmount] = useState<string>('0');
  const [selectedCategory, setSelectedCategory] = useState<string>('makan');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id || 'bca',
  );
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [note, setNote] = useState<string>('');
  const [potType, setPotType] = useState<'tidak' | 'harian' | 'bulanan' | 'nabung'>('harian');
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amountVal = parseInt(rawAmount, 10);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert('Silakan masukkan jumlah nominal transaksi yang valid.');
      return;
    }

    const catObj =
      TRANSACTION_CATEGORIES.find((c) => c.id === selectedCategory) ||
      TRANSACTION_CATEGORIES[0];

    const isSavings = txType === 'savings';

    const defaultTitle = isSavings
      ? 'Setoran Tabungan & Investasi'
      : selectedCategory === 'makan'
      ? 'Makan'
      : selectedCategory === 'transport'
      ? 'Transportasi'
      : selectedCategory === 'belanja'
      ? 'Belanja'
      : selectedCategory === 'tagihan'
      ? 'Tagihan'
      : selectedCategory === 'hiburan'
      ? 'Hiburan'
      : selectedCategory === 'tabungan'
      ? 'Tabungan'
      : 'Pengeluaran';

    const title = note.trim() || defaultTitle;
    const targetAccId = selectedAccountId || accounts[0]?.id || 'bca';

    onSaveTransaction({
      title,
      amount: amountVal,
      type: txType,
      date,
      categoryName: isSavings ? 'Tabungan & Investasi' : catObj.name,
      categoryIcon: isSavings ? 'savings' : catObj.icon,
      categoryBgClass: isSavings ? 'bg-[#f0e0cb]/50 text-[#685d4c]' : `${catObj.bgClass} ${catObj.textClass}`,
      categoryTextClass: isSavings ? 'text-[#685d4c]' : catObj.textClass,
      accountId: targetAccId,
      potType: isSavings ? 'nabung' : potType,
      note: note.trim(),
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onCancel();
    }, 600);
  };

  useEffect(() => {
    const handleTriggerSave = () => {
      handleSubmit();
    };

    window.addEventListener('vaney-submit-tx', handleTriggerSave);
    return () => {
      window.removeEventListener('vaney-submit-tx', handleTriggerSave);
    };
  });

  // Direct Save handler from OCR Scan
  const handleDirectSaveScanned = (scanned: {
    merchant: string;
    amount: number;
    category: string;
    date?: string;
  }) => {
    const catObj =
      TRANSACTION_CATEGORIES.find(
        (c) => c.name.toLowerCase() === scanned.category.toLowerCase(),
      ) ||
      TRANSACTION_CATEGORIES.find((c) => c.id === 'belanja') ||
      TRANSACTION_CATEGORIES[0];

    const targetAccId = selectedAccountId || accounts[0]?.id || 'bca';

    onSaveTransaction({
      title: scanned.merchant || 'Struk Belanja',
      amount: scanned.amount,
      type: 'expense',
      date: scanned.date || date,
      categoryName: catObj.name,
      categoryIcon: catObj.icon,
      categoryBgClass: `${catObj.bgClass} ${catObj.textClass}`,
      categoryTextClass: catObj.textClass,
      accountId: targetAccId,
      potType: potType === 'nabung' ? 'harian' : potType,
      note: `Struk: ${scanned.merchant}`,
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onCancel();
    }, 600);
  };

  // Direct Save handler from Voice Input
  const handleDirectSaveVoice = (parsed: {
    merchant: string;
    amount: number;
    category: string;
  }) => {
    const catObj =
      TRANSACTION_CATEGORIES.find(
        (c) => c.name.toLowerCase() === parsed.category.toLowerCase(),
      ) ||
      TRANSACTION_CATEGORIES.find((c) => c.id === 'makan') ||
      TRANSACTION_CATEGORIES[0];

    const targetAccId = selectedAccountId || accounts[0]?.id || 'bca';

    onSaveTransaction({
      title: parsed.merchant || 'Pengeluaran Suara',
      amount: parsed.amount,
      type: 'expense',
      date,
      categoryName: catObj.name,
      categoryIcon: catObj.icon,
      categoryBgClass: `${catObj.bgClass} ${catObj.textClass}`,
      categoryTextClass: catObj.textClass,
      accountId: targetAccId,
      potType: potType === 'nabung' ? 'harian' : potType,
      note: `Suara: ${parsed.merchant}`,
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onCancel();
    }, 600);
  };

  return (
    <main
      id="tambah-transaksi-canvas"
      className="px-5 pt-2 pb-36 max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-300 relative overflow-y-auto"
    >
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#406651] text-[#ffffff] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-[22px]">
            check_circle
          </span>
          <span className="text-sm font-semibold">
            {txType === 'savings'
              ? 'Setoran tabungan berhasil dicatat ke pot tabungan!'
              : 'Transaksi berhasil dicatat ke laporan!'}
          </span>
        </div>
      )}

      {/* Main Left Column: Type + Amount + Numpad + Categories */}
      <div className="md:col-span-7 flex flex-col gap-5">
        {/* Transaction Type Selector (Pengeluaran vs Setoran Tabungan) */}
        <div className="bg-[#f0f1ee] p-1.5 rounded-2xl flex items-center gap-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setTxType('expense');
              setPotType('harian');
              if (selectedCategory === 'tabungan') setSelectedCategory('makan');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              txType === 'expense'
                ? 'bg-[#ffffff] text-[#ba1a1a] shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Pengeluaran</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTxType('savings');
              setPotType('nabung');
              setSelectedCategory('tabungan');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              txType === 'savings'
                ? 'bg-[#406651] text-[#ffffff] shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <PiggyBank className="w-4 h-4" />
            <span>Setoran Tabungan</span>
          </button>
        </div>

        {/* Smart Input Prominent Action Cards (OCR & Voice) - Only for Expenses */}
        {txType === 'expense' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsOCROpen(true)}
              className="p-3.5 rounded-2xl bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200 flex items-center justify-center gap-2.5 text-emerald-950 font-bold text-xs shadow-sm transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xs leading-tight">Scan Struk</p>
                <p className="text-[10px] text-emerald-700 font-medium">Kamera / Galeri</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="p-3.5 rounded-2xl bg-purple-50/90 hover:bg-purple-100/90 border border-purple-200 flex items-center justify-center gap-2.5 text-purple-950 font-bold text-xs shadow-sm transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xs leading-tight">Input Suara</p>
                <p className="text-[10px] text-purple-700 font-medium">Bicara nominal</p>
              </div>
            </button>
          </div>
        )}

        {/* Amount Input Area */}
        <section
          id="amount-display-card"
          className="bg-[#ffffff] rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#c1edd1]/20 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-[#717973] uppercase tracking-wider mb-1.5">
            {txType === 'savings' ? 'Nominal Setoran Tabungan' : 'Total Pengeluaran'}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${
                txType === 'savings' ? 'text-[#685d4c]' : 'text-[#406651]'
              }`}
            >
              Rp
            </span>
            <span
              id="amountInput"
              className="text-4xl sm:text-5xl font-extrabold text-[#1a1c1b] tracking-tight"
            >
              {formatNumber(rawAmount)}
            </span>
          </div>
        </section>

        {/* Keypad */}
        <section
          id="numpad-container"
          className="bg-[#ffffff] rounded-[24px] p-4 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] grid grid-cols-3 gap-2"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleAppendNumber(num.toString())}
              className="h-13 sm:h-14 rounded-[16px] bg-[#f4f4f2] text-xl font-bold text-[#1a1c1b] hover:bg-[#e2e3e1] active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleAppendNumber('000')}
            className="h-13 sm:h-14 rounded-[16px] bg-[#f4f4f2] text-base font-bold text-[#1a1c1b] hover:bg-[#e2e3e1] active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
          >
            000
          </button>
          <button
            type="button"
            onClick={() => handleAppendNumber('0')}
            className="h-13 sm:h-14 rounded-[16px] bg-[#f4f4f2] text-xl font-bold text-[#1a1c1b] hover:bg-[#e2e3e1] active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDeleteNumber}
            className="h-13 sm:h-14 rounded-[16px] bg-[#f0e0cb]/40 text-[#685d4c] hover:bg-[#f0e0cb]/70 active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
          >
            <span className="material-symbols-outlined text-[24px]">
              backspace
            </span>
          </button>
        </section>

        {/* Categories (Only if expense) */}
        {txType === 'expense' && (
          <section
            id="category-selector"
            className="bg-[#ffffff] rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.04)]"
          >
            <label className="text-xs font-bold text-[#414843] mb-3 block uppercase tracking-wider">
              Pilih Kategori
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {TRANSACTION_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-[18px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#406651] text-[#ffffff] shadow-md shadow-[#406651]/20 scale-102'
                        : 'bg-[#f9f9f7] text-[#414843] hover:bg-[#f4f4f2]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px] mb-1">
                      {cat.icon}
                    </span>
                    <span className="text-xs font-bold truncate max-w-full">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Right Column: Account, Date, Note, Pot Settings */}
      <div className="md:col-span-5 flex flex-col gap-5">
        <section
          id="detail-form-card"
          className="bg-[#ffffff] rounded-[24px] p-5 sm:p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] space-y-4"
        >
          {/* Account Selection */}
          <div>
            <label className="text-xs font-bold text-[#414843] mb-1.5 block">
              {txType === 'savings' ? 'Sumber Dana Rekening / Dompet' : 'Pilih Akun Sumber Dana'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {accounts.map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`flex items-center justify-between p-3 rounded-[16px] border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#406651] bg-[#c1edd1]/15 text-[#143b28] font-bold shadow-2xs'
                        : 'border-[#e2e3e1] bg-transparent text-[#414843] hover:bg-[#f4f4f2]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-[#406651]">
                        {acc.icon}
                      </span>
                      <div>
                        <span className="text-xs font-bold block">{acc.name}</span>
                        <span className="text-[10px] text-neutral-500 font-normal">
                          {acc.subtitle}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[#406651] text-[20px]">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs font-bold text-[#414843] mb-1.5 block">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-xs font-semibold rounded-[14px] px-3.5 py-2.5 focus:ring-2 focus:ring-[#406651] outline-none cursor-pointer"
            />
          </div>

          {/* Note Input */}
          <div>
            <label className="text-xs font-bold text-[#414843] mb-1.5 block">
              Catatan / Keterangan
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                txType === 'savings'
                  ? 'Contoh: Nabung untuk dana darurat / reksadana'
                  : 'Contoh: Nasi padang + es teh'
              }
              className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-xs font-medium rounded-[14px] px-3.5 py-2.5 focus:ring-2 focus:ring-[#406651] outline-none"
            />
          </div>

          {/* Pot Type Selection */}
          {txType === 'expense' ? (
            <div>
              <label className="text-xs font-bold text-[#414843] mb-1.5 flex items-center justify-between">
                <span>Ambil dari Jatah Pot?</span>
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
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <PiggyBank className="w-4 h-4 text-amber-700" />
                <span>Masuk ke Pot Tabungan & Investasi</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Uang akan dipindahkan dari saldo akun sumber dana ke dalam pot target tabungan bulanan Anda.
              </p>
            </div>
          )}
        </section>

        {/* Save Button */}
        <button
          id="btn-submit-save-tx"
          type="button"
          onClick={handleSubmit}
          className="w-full bg-[#406651] hover:bg-[#284e3a] text-[#ffffff] font-bold text-base py-4 rounded-[18px] hover:scale-[1.01] active:scale-98 transition-all shadow-[0px_15px_40px_rgba(64,102,81,0.25)] cursor-pointer mt-auto"
        >
          {txType === 'savings' ? 'Simpan Setoran Tabungan' : 'Simpan Transaksi'}
        </button>
      </div>

      {/* Smart Input Modals */}
      {isOCROpen && (
        <OCRScanModal
          isOpen={isOCROpen}
          onClose={() => setIsOCROpen(false)}
          onApplyData={(scanned) => {
            setRawAmount(scanned.amount.toString());
            setNote(scanned.merchant);
            if (scanned.date) setDate(scanned.date);
            const found = TRANSACTION_CATEGORIES.find(
              (c) => c.name.toLowerCase() === scanned.category.toLowerCase(),
            );
            if (found) setSelectedCategory(found.id);
          }}
          onDirectSave={handleDirectSaveScanned}
        />
      )}

      {isVoiceOpen && (
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
          onDirectSave={handleDirectSaveVoice}
        />
      )}
    </main>
  );
};

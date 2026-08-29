import React, { useState, useEffect } from 'react';
import { X, Mic, CheckCircle2, Volume2, Save, Edit3 } from 'lucide-react';
import { TRANSACTION_CATEGORIES } from '../data/initialData';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: { merchant: string; amount: number; category: string }) => void;
  onDirectSave?: (data: { merchant: string; amount: number; category: string }) => void;
}

export function VoiceInputModal({ isOpen, onClose, onApplyData, onDirectSave }: VoiceInputModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Editable fields in modal
  const [merchantInput, setMerchantInput] = useState('Kopi / Makan');
  const [amountInput, setAmountInput] = useState<string>('50000');
  const [categoryInput, setCategoryInput] = useState('Makan');
  const [hasCaptured, setHasCaptured] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setHasCaptured(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const parseSpeechText = (text: string) => {
    const lower = text.toLowerCase();
    let amount = 0;
    let merchant = 'Pengeluaran';
    let category = 'Makan';

    // Parse numbers & shorthand (e.g. 50 ribu, 15000, 1.5 juta)
    const jutaMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*juta/);
    const ribuMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*ribu/);
    const plainNumMatch = lower.match(/\b\d{4,8}\b/);

    if (jutaMatch) {
      const num = parseFloat(jutaMatch[1].replace(',', '.'));
      amount = Math.round(num * 1000000);
    } else if (ribuMatch) {
      const num = parseFloat(ribuMatch[1].replace(',', '.'));
      amount = Math.round(num * 1000);
    } else if (plainNumMatch) {
      amount = parseInt(plainNumMatch[0], 10);
    } else if (lower.includes('seratus ribu')) {
      amount = 100000;
    } else if (lower.includes('lima puluh ribu')) {
      amount = 50000;
    } else if (lower.includes('dua puluh lima ribu')) {
      amount = 25000;
    } else if (lower.includes('dua puluh ribu')) {
      amount = 20000;
    } else if (lower.includes('lima belas ribu')) {
      amount = 15000;
    } else if (lower.includes('sepuluh ribu')) {
      amount = 10000;
    } else if (lower.includes('tiga puluh ribu')) {
      amount = 30000;
    } else if (lower.includes('tujuh puluh lima ribu')) {
      amount = 75000;
    } else if (lower.includes('dua ratus ribu')) {
      amount = 200000;
    }

    // Parse merchant & category keywords
    if (lower.includes('starbucks') || lower.includes('kopi') || lower.includes('makan') || lower.includes('resto') || lower.includes('nasi')) {
      merchant = lower.includes('starbucks') ? 'Starbucks' : lower.includes('kopi') ? 'Kopi Harian' : 'Makan Siang';
      category = 'Makan';
    } else if (lower.includes('indomaret') || lower.includes('alfamart') || lower.includes('belanja') || lower.includes('pasar') || lower.includes('supermarket')) {
      merchant = lower.includes('indomaret') ? 'Indomaret' : lower.includes('alfamart') ? 'Alfamart' : 'Belanja Harian';
      category = 'Belanja';
    } else if (lower.includes('bensin') || lower.includes('pertamina') || lower.includes('gojek') || lower.includes('grab') || lower.includes('ojek') || lower.includes('tol')) {
      merchant = lower.includes('gojek') ? 'Gojek Ride' : lower.includes('grab') ? 'Grab Ride' : 'SPBU Pertamina';
      category = 'Transport';
    } else if (lower.includes('listrik') || lower.includes('air') || lower.includes('wifi') || lower.includes('pulsa') || lower.includes('tagihan')) {
      merchant = lower.includes('listrik') ? 'PLN Token' : lower.includes('pulsa') ? 'Pulsa / Paket Data' : 'Tagihan Bulanan';
      category = 'Tagihan';
    } else if (lower.includes('bioskop') || lower.includes('nonton') || lower.includes('netflix') || lower.includes('spotify') || lower.includes('game')) {
      merchant = lower.includes('netflix') ? 'Netflix' : lower.includes('bioskop') ? 'Cinema XXI' : 'Hiburan';
      category = 'Hiburan';
    }

    setMerchantInput(merchant);
    if (amount > 0) setAmountInput(amount.toString());
    setCategoryInput(category);
    setHasCaptured(true);
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const currentText = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setTranscript(currentText);
          parseSpeechText(currentText);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition event error:', event);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('Web Speech API start error, fallback to simulation:', e);
      }
    }

    // Fallback simulated voice listening for browsers without speech recognition
    setTimeout(() => {
      const sampleText = 'Beli kopi Starbucks lima puluh ribu';
      setTranscript(sampleText);
      parseSpeechText(sampleText);
      setIsListening(false);
    }, 1500);
  };

  const handleApplyToForm = () => {
    const finalAmount = parseInt(amountInput.replace(/\D/g, ''), 10) || 0;
    if (finalAmount <= 0) {
      alert('Mohon masukkan nominal pengeluaran yang valid.');
      return;
    }

    onApplyData({
      merchant: merchantInput.trim() || 'Pengeluaran Suara',
      amount: finalAmount,
      category: categoryInput,
    });
    onClose();
  };

  const handleDirectSave = () => {
    const finalAmount = parseInt(amountInput.replace(/\D/g, ''), 10) || 0;
    if (finalAmount <= 0) {
      alert('Mohon masukkan nominal pengeluaran yang valid.');
      return;
    }

    const payload = {
      merchant: merchantInput.trim() || 'Pengeluaran Suara',
      amount: finalAmount,
      category: categoryInput,
    };

    if (onDirectSave) {
      onDirectSave(payload);
    } else {
      onApplyData(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 border border-neutral-100 flex flex-col max-h-[90dvh] sm:max-h-[85vh]">
        {/* Header with Top Simpan Button */}
        <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-[#f9f9f7] shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">Input Suara</h2>
              <p className="text-[10px] text-neutral-500">Bicara pengeluaran</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDirectSave}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-200/60 text-neutral-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Big Mic Button */}
          <button
            type="button"
            onClick={startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/20 scale-105'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30 active:scale-95'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8 animate-bounce" /> : <Mic className="w-8 h-8" />}
          </button>

          <p className="text-xs font-bold text-neutral-700">
            {isListening ? 'Mendengarkan... Silakan bicara...' : 'Tekan tombol mikrofon untuk mulai bicara'}
          </p>

          {/* Quick Voice Prompt Examples */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              'Kopi 25 ribu',
              'Makan siang 45 ribu',
              'Bensin 50 ribu',
              'Belanja 100 ribu',
            ].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setTranscript(sample);
                  parseSpeechText(sample);
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-purple-100 text-neutral-700 font-semibold text-[11px] transition-colors cursor-pointer"
              >
                "{sample}"
              </button>
            ))}
          </div>

          {/* Live Transcript Output */}
          {transcript && (
            <div className="w-full bg-purple-50/70 border border-purple-200 p-3 rounded-2xl text-xs text-purple-950 font-medium text-left">
              <span className="font-bold text-purple-700">Teks Suara:</span> "{transcript}"
            </div>
          )}

          {/* Result Card - Always visible and editable */}
          <div className="w-full p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Rincian Transaksi Suara</span>
              </span>
              <span className="text-[10px] font-semibold text-neutral-500 flex items-center gap-1">
                <Edit3 className="w-3 h-3" />
                <span>Bisa diedit</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">
                  Nama Pengeluaran
                </label>
                <input
                  type="text"
                  value={merchantInput}
                  onChange={(e) => setMerchantInput(e.target.value)}
                  className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold text-purple-700 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">
                  Kategori Pengeluaran
                </label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                >
                  {TRANSACTION_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Direct Save and Apply */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyToForm}
              className="px-3.5 py-2.5 rounded-xl border border-purple-300 text-purple-800 bg-purple-50 hover:bg-purple-100 font-bold text-xs transition-all cursor-pointer"
            >
              Isi ke Formulir
            </button>
            <button
              type="button"
              onClick={handleDirectSave}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Langsung</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

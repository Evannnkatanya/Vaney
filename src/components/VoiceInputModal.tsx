import React, { useState, useEffect } from 'react';
import { X, Mic, CheckCircle2, Volume2, Save } from 'lucide-react';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: { merchant: string; amount: number; category: string }) => void;
  onDirectSave?: (data: { merchant: string; amount: number; category: string }) => void;
}

export function VoiceInputModal({ isOpen, onClose, onApplyData, onDirectSave }: VoiceInputModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedResult, setParsedResult] = useState<{
    merchant: string;
    amount: number;
    category: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setParsedResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setParsedResult(null);

    // Try Web Speech API if supported
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

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('Web Speech API error, falling back to simulation:', e);
      }
    }

    // Fallback simulated voice listening
    setTimeout(() => {
      const sampleText = 'Beli kopi Starbucks lima puluh ribu';
      setTranscript(sampleText);
      parseSpeechText(sampleText);
      setIsListening(false);
    }, 2000);
  };

  const parseSpeechText = (text: string) => {
    const lower = text.toLowerCase();
    let amount = 0;
    let merchant = 'Pengeluaran Umum';
    let category = 'Makan';

    // Parse numbers & shorthand (e.g. 50 ribu, 15000)
    const ribuMatch = lower.match(/(\d+)\s*ribu/);
    const jutaMatch = lower.match(/(\d+)\s*juta/);
    const plainNumMatch = lower.match(/\b\d{4,7}\b/);

    if (jutaMatch) {
      amount = parseInt(jutaMatch[1], 10) * 1000000;
    } else if (ribuMatch) {
      amount = parseInt(ribuMatch[1], 10) * 1000;
    } else if (plainNumMatch) {
      amount = parseInt(plainNumMatch[0], 10);
    } else if (lower.includes('lima puluh ribu')) {
      amount = 50000;
    } else if (lower.includes('dua puluh ribu')) {
      amount = 20000;
    } else if (lower.includes('seratus ribu')) {
      amount = 100000;
    } else if (lower.includes('dua puluh lima ribu')) {
      amount = 25000;
    }

    // Parse merchant & category keywords
    if (lower.includes('starbucks') || lower.includes('kopi') || lower.includes('makan')) {
      merchant = lower.includes('starbucks') ? 'Starbucks' : lower.includes('kopi') ? 'Kopi Shop' : 'Makan';
      category = 'Makan';
    } else if (lower.includes('indomaret') || lower.includes('alfamart') || lower.includes('belanja')) {
      merchant = lower.includes('indomaret') ? 'Indomaret' : 'Alfamart';
      category = 'Belanja';
    } else if (lower.includes('bensin') || lower.includes('pertamina') || lower.includes('gojek') || lower.includes('grab')) {
      merchant = lower.includes('gojek') ? 'Gojek Ride' : 'SPBU Pertamina';
      category = 'Transport';
    }

    setParsedResult({
      merchant,
      amount: amount || 50000,
      category,
    });
  };

  const handleApplyToForm = () => {
    if (!parsedResult) return;
    onApplyData(parsedResult);
    onClose();
  };

  const handleDirectSave = () => {
    if (!parsedResult) return;
    if (onDirectSave) {
      onDirectSave(parsedResult);
    } else {
      onApplyData(parsedResult);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 border border-neutral-100 flex flex-col max-h-[90dvh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#f9f9f7] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Input Transaksi Suara</h2>
              <p className="text-xs text-neutral-500">Ucapkan rincian pengeluaran Anda</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/60 text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-5 overflow-y-auto flex-1">
          {/* Big Mic Button */}
          <button
            type="button"
            onClick={startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/20 scale-105'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-95'
            }`}
          >
            {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
          </button>

          <p className="text-xs font-semibold text-neutral-500">
            {isListening ? 'Mendengarkan... Silakan bicara...' : 'Tekan tombol mikrofon untuk mulai bicara'}
          </p>

          {/* Preset voice prompt tips */}
          <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/60 text-left w-full text-xs">
            <p className="font-bold text-neutral-700 mb-1">Contoh Pengucapan:</p>
            <p className="text-neutral-500 italic">"Beli Kopi Starbucks lima puluh ribu"</p>
            <p className="text-neutral-500 italic">"Belanja di Indomaret seratus ribu"</p>
          </div>

          {/* Live Transcript Output */}
          {transcript && (
            <div className="w-full bg-purple-50/70 border border-purple-200 p-3.5 rounded-2xl text-xs text-purple-950 font-medium">
              <span className="font-bold text-purple-700">Teks Suara:</span> "{transcript}"
            </div>
          )}

          {/* Parsed Result */}
          {parsedResult && !isListening && (
            <div className="w-full p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hasil Analisis Suara
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-neutral-400 text-[10px] uppercase font-semibold">Nama Pengeluaran</p>
                  <p className="font-bold text-neutral-800 text-sm mt-0.5">{parsedResult.merchant}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-neutral-400 text-[10px] uppercase font-semibold">Nominal</p>
                  <p className="font-bold text-emerald-600 text-sm mt-0.5">
                    Rp {parsedResult.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Direct Save and Apply */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex flex-wrap items-center justify-between gap-2">
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
              disabled={!parsedResult || isListening}
              className="px-3.5 py-2.5 rounded-xl border border-purple-300 text-purple-800 bg-purple-50 hover:bg-purple-100 font-bold text-xs disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              Isi ke Formulir
            </button>
            <button
              type="button"
              onClick={handleDirectSave}
              disabled={!parsedResult || isListening}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1.5"
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

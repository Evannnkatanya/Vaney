import React, { useState } from 'react';
import { X, Camera, Upload, CheckCircle2, Sparkles, AlertCircle, FileText } from 'lucide-react';

interface OCRScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: { merchant: string; amount: number; category: string }) => void;
}

const MOCK_RECEIPTS = [
  {
    name: 'Struk Indomaret',
    merchant: 'Indomaret Point',
    amount: 45000,
    category: 'Belanja Harian',
    previewText: 'INDOMARET POINT\n1x KOPI BOTTLE 18.000\n1x ROTI SOBO 15.000\n1x CHIPS 12.000\nTOTAL: Rp 45.000',
  },
  {
    name: 'Struk Starbucks',
    merchant: 'Starbucks Coffee',
    amount: 68000,
    category: 'Makanan & Minuman',
    previewText: 'STARBUCKS COFFEE\n1x CARAMEL MACCHIATO 68.000\nTOTAL: Rp 68.000',
  },
  {
    name: 'Struk SPBU Pertamina',
    merchant: 'SPBU Pertamina',
    amount: 150000,
    category: 'Transportasi',
    previewText: 'SPBU PERTAMINA 34.12304\nPERTAMAX 11.2 LITER\nTOTAL: Rp 150.000',
  },
];

export function OCRScanModal({ isOpen, onClose, onApplyData }: OCRScanModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<{
    merchant: string;
    amount: number;
    category: string;
    confidence: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    simulateScan(file.name);
  };

  const handleSelectMock = (receipt: typeof MOCK_RECEIPTS[0]) => {
    setIsScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        merchant: receipt.merchant,
        amount: receipt.amount,
        category: receipt.category,
        confidence: 94,
      });
    }, 1200);
  };

  const simulateScan = (filename: string) => {
    setIsScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsScanning(false);
      // Generate realistic extracted data based on filename or defaults
      setScannedResult({
        merchant: filename.toLowerCase().includes('kopi') ? 'Kopi Kenangan' : 'Superindo Supermarket',
        amount: filename.toLowerCase().includes('kopi') ? 35000 : 124500,
        category: filename.toLowerCase().includes('kopi') ? 'Makanan & Minuman' : 'Belanja Harian',
        confidence: 91,
      });
    }, 1500);
  };

  const handleConfirm = () => {
    if (!scannedResult) return;
    onApplyData({
      merchant: scannedResult.merchant,
      amount: scannedResult.amount,
      category: scannedResult.category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#f9f9f7]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Scan Struk Belanja (OCR)</h2>
              <p className="text-xs text-neutral-500">Ekstraksi otomatis nominal & merchant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/60 text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-neutral-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-neutral-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                <img src={imagePreview} alt="Struk Preview" className="h-full object-contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-neutral-800">Unggah atau Foto Struk</p>
                <p className="text-xs text-neutral-400">Format PNG, JPG, atau WEBP</p>
              </div>
            )}
          </div>

          {/* Preset Mock Receipts for Easy Testing */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Atau Pilih Contoh Struk
            </p>
            <div className="grid grid-cols-3 gap-2">
              {MOCK_RECEIPTS.map((receipt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectMock(receipt)}
                  className="p-2.5 rounded-xl border border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all text-xs"
                >
                  <p className="font-bold text-neutral-800 truncate">{receipt.merchant}</p>
                  <p className="text-neutral-500 mt-0.5">Rp {receipt.amount.toLocaleString('id-ID')}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Scanning Progress state */}
          {isScanning && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center gap-3 animate-pulse">
              <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Menganalisis Teks Struk...</p>
                <p className="text-[11px] text-emerald-700">Mengekstraksi merchant, tanggal & nominal total</p>
              </div>
            </div>
          )}

          {/* OCR Scanned Result */}
          {scannedResult && !isScanning && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hasil Deteksi OCR ({scannedResult.confidence}% Akurat)
                </span>
                <span className="text-[10px] font-semibold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                  Siap Dimasukkan
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-neutral-400 text-[10px] uppercase font-semibold">Merchant</p>
                  <p className="font-bold text-neutral-800 text-sm mt-0.5">{scannedResult.merchant}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-neutral-400 text-[10px] uppercase font-semibold">Nominal Total</p>
                  <p className="font-bold text-emerald-600 text-sm mt-0.5">
                    Rp {scannedResult.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!scannedResult || isScanning}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            Gunakan Hasil OCR
          </button>
        </div>
      </div>
    </div>
  );
}

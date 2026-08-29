import React, { useState } from 'react';
import { X, Download, Upload, FileSpreadsheet, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Account, BudgetPot, CategoryMapping, Transaction } from '../types';

interface ModalBackupRestoreProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  budgetPots: BudgetPot[];
  categoryMappings: CategoryMapping[];
  transactions: Transaction[];
  onRestoreData: (data: {
    accounts?: Account[];
    budgetPots?: BudgetPot[];
    categoryMappings?: CategoryMapping[];
    transactions?: Transaction[];
  }) => void;
}

export function ModalBackupRestore({
  isOpen,
  onClose,
  accounts,
  budgetPots,
  categoryMappings,
  transactions,
  onRestoreData,
}: ModalBackupRestoreProps) {
  const [restoreStatus, setRestoreStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  // Export JSON
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      accounts,
      budgetPots,
      categoryMappings,
      transactions,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vaney_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Judul Transaksi', 'Nominal', 'Tipe', 'Tanggal', 'Kategori', 'ID Akun', 'Pot Target'];
    const rows = transactions.map((tx) => [
      tx.id,
      `"${tx.title.replace(/"/g, '""')}"`,
      tx.amount,
      tx.type,
      tx.date,
      `"${tx.categoryName}"`,
      tx.accountId,
      tx.potType,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `vaney_transaksi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON File
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          onRestoreData(parsed);
          setRestoreStatus({
            type: 'success',
            message: `Berhasil mengimpor ${parsed.transactions.length} transaksi & data akun!`,
          });
        } else {
          setRestoreStatus({
            type: 'error',
            message: 'Format file JSON tidak valid. Pastikan file backup Vaney resmi.',
          });
        }
      } catch (err) {
        setRestoreStatus({
          type: 'error',
          message: 'Gagal membaca file JSON. Pastikan file tidak rusak.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 border border-neutral-100 flex flex-col max-h-[90dvh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#f9f9f7] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Backup & Restore Data</h2>
              <p className="text-xs text-neutral-500">Ekspor atau Impor data keuangan lokal</p>
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
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Status Alert */}
          {restoreStatus && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                restoreStatus.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {restoreStatus.type === 'error' && <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />}
              <span>{restoreStatus.message}</span>
            </div>
          )}

          {/* Section 1: Export Data */}
          <div>
            <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
              Ekspor Backup Data
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportJSON}
                className="p-3.5 rounded-2xl border border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-1.5 transition-all group"
              >
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800">Ekspor JSON</span>
                <span className="text-[10px] text-neutral-400">Backup Lengkap</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="p-3.5 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:bg-blue-50/30 flex flex-col items-center justify-center gap-1.5 transition-all group"
              >
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800">Ekspor CSV</span>
                <span className="text-[10px] text-neutral-400">Format Excel</span>
              </button>
            </div>
          </div>

          {/* Section 2: Import / Restore Data */}
          <div className="pt-2 border-t border-neutral-100">
            <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
              Impor / Restore Data
            </p>
            <div className="relative border-2 border-dashed border-neutral-300 hover:border-blue-500 rounded-2xl p-5 text-center transition-colors bg-neutral-50/50">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-1.5 text-neutral-500">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-neutral-800">Pilih File JSON Backup</p>
                <p className="text-[11px] text-neutral-400">Pulihkan data transaksi & saldo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-md transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

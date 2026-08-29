import React, { useState, useEffect } from 'react';
import { X, Cloud, CloudUpload, CloudDownload, CheckCircle2, AlertCircle, RefreshCw, Key, Link2, ExternalLink } from 'lucide-react';
import { getSupabaseConfig, resetSupabaseClient } from '../lib/supabaseClient';
import { SupabaseService } from '../services/supabaseService';
import { Account, BudgetPot, CategoryMapping, Transaction } from '../types';

interface ModalSupabaseSyncProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  budgetPots: BudgetPot[];
  categoryMappings: CategoryMapping[];
  transactions: Transaction[];
  onApplyCloudData: (data: {
    accounts?: Account[];
    budgetPots?: BudgetPot[];
    categoryMappings?: CategoryMapping[];
    transactions?: Transaction[];
  }) => void;
}

export function ModalSupabaseSync({
  isOpen,
  onClose,
  accounts,
  budgetPots,
  categoryMappings,
  transactions,
  onApplyCloudData,
}: ModalSupabaseSyncProps) {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setSupabaseUrl(config.url);
      setSupabaseKey(config.key);
      if (config.isConfigured) {
        checkStatus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const checkStatus = async () => {
    setIsLoading(true);
    const res = await SupabaseService.testConnection();
    setIsLoading(false);
    setIsConnected(res.connected);
    if (res.connected) {
      setStatusMsg({ type: 'success', message: 'Terhubung ke Supabase PostgreSQL!' });
    } else if (res.error) {
      setStatusMsg({ type: 'error', message: res.error });
    }
  };

  const handleSaveConfig = () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setStatusMsg({ type: 'error', message: 'Mohon masukkan URL dan Anon Key yang valid.' });
      return;
    }
    localStorage.setItem('vaney_supabase_url', supabaseUrl.trim());
    localStorage.setItem('vaney_supabase_anon_key', supabaseKey.trim());
    resetSupabaseClient();
    setStatusMsg({ type: 'info', message: 'Kredensial disimpan. Menguji koneksi...' });
    checkStatus();
  };

  const handlePushToCloud = async () => {
    setIsLoading(true);
    setStatusMsg({ type: 'info', message: 'Mengunggah data ke Supabase...' });
    const result = await SupabaseService.pushAllToCloud({
      accounts,
      budgetPots,
      categoryMappings,
      transactions,
    });
    setIsLoading(false);
    setStatusMsg({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
  };

  const handlePullFromCloud = async () => {
    setIsLoading(true);
    setStatusMsg({ type: 'info', message: 'Mengunduh data dari Supabase...' });
    const result = await SupabaseService.pullAllFromCloud();
    setIsLoading(false);
    if (result.success && result.data) {
      onApplyCloudData(result.data);
      setStatusMsg({ type: 'success', message: result.message });
    } else {
      setStatusMsg({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 border border-neutral-100 flex flex-col max-h-[90dvh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#f9f9f7] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Supabase Cloud Sync</h2>
              <p className="text-xs text-neutral-500">Sinkronisasi data offline ke PostgreSQL</p>
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Connection Status Banner */}
          {statusMsg && (
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-2 font-medium ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : statusMsg.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              {statusMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {statusMsg.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {statusMsg.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />}
              <span>{statusMsg.message}</span>
            </div>
          )}

          {/* Form Credentials */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Konfigurasi Proyek Supabase
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 underline underline-offset-2"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                Project URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none pl-8"
                />
                <Link2 className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                Project Anon / Public API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="eyJh..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none pl-8"
                />
                <Key className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Simpan & Tes Koneksi
            </button>
          </div>

          {/* Sync Actions */}
          <div>
            <p className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-2.5">
              Aksi Sinkronisasi Data
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePushToCloud}
                disabled={isLoading}
                className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
              >
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <span className="font-bold text-neutral-900">Upload ke Cloud</span>
                <span className="text-[10px] text-neutral-500">Kirim {transactions.length} transaksi</span>
              </button>

              <button
                onClick={handlePullFromCloud}
                disabled={isLoading}
                className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-500 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
              >
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700 group-hover:scale-110 transition-transform">
                  <CloudDownload className="w-5 h-5" />
                </div>
                <span className="font-bold text-neutral-900">Tarik dari Cloud</span>
                <span className="text-[10px] text-neutral-500">Pulihkan ke lokal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-neutral-500">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
            <span className="text-[11px]">{isConnected ? 'Cloud Aktif' : 'Offline Mode'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

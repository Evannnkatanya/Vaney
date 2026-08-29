import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Download, 
  Upload, 
  ShieldCheck, 
  RotateCcw, 
  Wifi, 
  FileText,
  UserCheck,
  Smartphone,
  Lock,
  Sparkles
} from 'lucide-react';

export const SettingsBackup = () => {
  const { 
    exportBackupJSON, 
    importData, 
    showToast,
    data
  } = useApp();

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importData(parsed);
      } catch (err) {
        showToast('Gagal membaca file JSON backup', 'danger');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>

      {/* User Persona & App Info Header */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '800',
            fontSize: '1.2rem'
          }}>
            R
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Pengguna Terverifikasi</h3>
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '600' }}>
              Mode Offline Aktif • Enkripsi Lokal
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5', marginTop: '8px' }}>
          Aplikasi pencatat keuangan pribadi <strong>Vaney</strong> membantu Anda mengelola pemasukan dan pengeluaran secara otomatis sesuai prinsip 50/30/20.
        </div>
      </div>

      {/* Backup & Security Section */}
      <div className="glass-card">
        <h3 className="title-md" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={18} color="#10b981" />
          <span>Keamanan & Cadangan Data (Backup)</span>
        </h3>
        <p className="subtitle" style={{ marginBottom: '14px' }}>
          Simpan cadangan data keuangan secara lokal tanpa tergantung server pihak ketiga
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={exportBackupJSON}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Download size={18} />
            <span>Ekspor Cadangan Data (.JSON)</span>
          </button>

          <input 
            type="file" 
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Upload size={18} />
            <span>Impor / Pulihkan Data (.JSON)</span>
          </button>
        </div>
      </div>

      {/* App Specifications Summary */}
      <div className="glass-card">
        <h3 className="title-md" style={{ marginBottom: '10px' }}>
          Spesifikasi & Fitur PRD Vaney
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Kecepatan Input:</span>
            <span style={{ fontWeight: '700', color: '#10b981' }}>Maksimal 3 Tap</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Formula Alokasi:</span>
            <span style={{ fontWeight: '700', color: '#38bdf8' }}>50% Harian / 30% Bulanan / 20% Tabungan</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Fitur Unggulan:</span>
            <span style={{ fontWeight: '700' }}>OCR Struk + Input Suara ID</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span style={{ color: 'var(--text-muted)' }}>Penyimpanan:</span>
            <span style={{ fontWeight: '700', color: '#a855f7' }}>100% Offline LocalStorage</span>
          </div>
        </div>
      </div>

    </div>
  );
};

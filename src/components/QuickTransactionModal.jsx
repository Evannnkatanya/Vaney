import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { startVoiceRecognition, isVoiceSupported } from '../utils/voiceRecognition';
import { CATEGORY_POT_MAPPING } from '../utils/storage';
import { formatRupiah } from '../utils/formatters';
import { 
  X, 
  Camera, 
  Mic, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Upload, 
  Zap,
  ShoppingBag
} from 'lucide-react';

export const QuickTransactionModal = () => {
  const { 
    isQuickModalOpen, 
    setIsQuickModalOpen, 
    addTransaction, 
    data,
    todayRemaining
  } = useApp();

  const [inputTab, setInputTab] = useState('quick'); // 'quick', 'ocr', 'voice'
  const [title, setTitle] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [category, setCategory] = useState('Makanan & Minuman');
  const [accountId, setAccountId] = useState(data?.accounts[0]?.id || 'acc-1');
  const [potId, setPotId] = useState('daily');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  // OCR state
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  // Auto-categorize based on merchant typing
  useEffect(() => {
    if (!merchant) return;
    const lower = merchant.toLowerCase();
    
    if (lower.includes('indomaret') || lower.includes('alfamart') || lower.includes('supermarket')) {
      setCategory('Belanja Harian');
      setPotId('daily');
      if (!title) setTitle(`Belanja ${merchant}`);
    } else if (lower.includes('starbucks') || lower.includes('kopi') || lower.includes('resto') || lower.includes('makan')) {
      setCategory('Makanan & Minuman');
      setPotId('daily');
      if (!title) setTitle(`Makan di ${merchant}`);
    } else if (lower.includes('pertamina') || lower.includes('bensin') || lower.includes('gojek') || lower.includes('grab')) {
      setCategory('Transportasi');
      setPotId('daily');
      if (!title) setTitle(`Transport ${merchant}`);
    } else if (lower.includes('pln') || lower.includes('listrik')) {
      setCategory('Tagihan Listrik & Air');
      setPotId('monthly');
      if (!title) setTitle(`Bayar ${merchant}`);
    } else if (lower.includes('bibit') || lower.includes('bareksa') || lower.includes('saham')) {
      setCategory('Reksadana');
      setPotId('savings');
      if (!title) setTitle(`Investasi ${merchant}`);
    }
  }, [merchant]);

  if (!isQuickModalOpen) return null;

  const numAmount = Number(amount) || 0;
  const isOverBudget = type === 'expense' && potId === 'daily' && numAmount > todayRemaining && todayRemaining > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || numAmount <= 0) return;

    addTransaction({
      date: new Date().toISOString().slice(0, 10),
      title: title || merchant || 'Transaksi Quick Input',
      amount: numAmount,
      type,
      category,
      accountId,
      potId,
      merchant: merchant || 'Umum'
    });

    // Reset & Close
    setTitle('');
    setMerchant('');
    setAmount('');
    setIsQuickModalOpen(false);
  };

  const handleVoiceListen = () => {
    setIsRecording(true);
    setVoiceText('Mendengarkan ucapan Anda...');

    startVoiceRecognition(
      (result) => {
        setIsRecording(false);
        setVoiceText(`" ${result.rawText} "`);
        if (result.amount > 0) setAmount(result.amount);
        if (result.merchant) setMerchant(result.merchant);
        if (result.category) setCategory(result.category);
        if (!title && result.merchant) setTitle(`Transaksi ${result.merchant}`);
      },
      (err) => {
        setIsRecording(false);
        setVoiceText(`Terjadi kesalahan: ${err}`);
      }
    );
  };

  const handleOcrFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsOcrProcessing(true);
    
    // Simulate smart OCR receipt text extraction
    setTimeout(() => {
      setIsOcrProcessing(false);
      
      // Auto-extract demo merchant & amount from uploaded receipt
      const demoMerchants = ['Indomaret Point', 'Starbucks Coffee', 'Pertamina SPBU', 'Farmers Market'];
      const randomMerchant = demoMerchants[Math.floor(Math.random() * demoMerchants.length)];
      const demoAmounts = [35000, 48000, 75000, 120000];
      const randomAmount = demoAmounts[Math.floor(Math.random() * demoAmounts.length)];

      setMerchant(randomMerchant);
      setAmount(randomAmount);
      setTitle(`Scan Struk: ${randomMerchant}`);
      setInputTab('quick');
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ animation: 'slideUp 0.3s ease' }}>
        
        {/* Header & Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={18} color="#10b981" />
              <span>Input Transaksi Cepat</span>
            </h3>
            <p className="subtitle">Maksimal 3 tap dengan auto-kategorisasi</p>
          </div>
          <button 
            onClick={() => setIsQuickModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Input Mode Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '16px'
        }}>
          <button 
            onClick={() => setInputTab('quick')}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: inputTab === 'quick' ? 'var(--bg-surface)' : 'transparent',
              color: inputTab === 'quick' ? '#10b981' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Quick 3-Tap
          </button>
          <button 
            onClick={() => setInputTab('ocr')}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: inputTab === 'ocr' ? 'var(--bg-surface)' : 'transparent',
              color: inputTab === 'ocr' ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Camera size={13} />
            <span>Scan Struk</span>
          </button>
          <button 
            onClick={() => setInputTab('voice')}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: inputTab === 'voice' ? 'var(--bg-surface)' : 'transparent',
              color: inputTab === 'voice' ? '#a855f7' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Mic size={13} />
            <span>Input Suara</span>
          </button>
        </div>

        {/* OCR Tab Content */}
        {inputTab === 'ocr' && (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div style={{
              border: '2px dashed var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '30px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer'
            }}>
              <Upload size={36} color="#38bdf8" style={{ marginBottom: '10px' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Unggah / Ambil Foto Struk</h4>
              <p className="subtitle" style={{ marginTop: '4px' }}>
                Teknologi OCR Vaney akan mengekstrak merchant & total nominal secara otomatis
              </p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleOcrFileSelect}
                style={{ display: 'none' }}
                id="ocr-file-input"
              />
              <label 
                htmlFor="ocr-file-input" 
                className="btn btn-secondary"
                style={{ marginTop: '16px', display: 'inline-flex' }}
              >
                {isOcrProcessing ? 'Menganalisis Struk...' : 'Pilih Foto Struk'}
              </label>
            </div>
          </div>
        )}

        {/* Voice Tab Content */}
        {inputTab === 'voice' && (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <button
              onClick={handleVoiceListen}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: isRecording ? 'rgba(239, 68, 68, 0.3)' : 'rgba(168, 85, 247, 0.2)',
                border: `3px solid ${isRecording ? '#ef4444' : '#a855f7'}`,
                color: isRecording ? '#ef4444' : '#a855f7',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginBottom: '16px',
                boxShadow: isRecording ? '0 0 30px rgba(239, 68, 68, 0.5)' : '0 0 20px rgba(168, 85, 247, 0.3)'
              }}
            >
              <Mic size={36} />
            </button>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>
              {isRecording ? 'Mendengarkan Bahasa Indonesia...' : 'Tekan Tombol Mik & Ucapkan Transaksi'}
            </h4>
            <p className="subtitle" style={{ marginTop: '4px' }}>
              Contoh: "Beli kopi tiga puluh ribu di Starbucks"
            </p>

            {voiceText && (
              <div style={{
                marginTop: '16px',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontStyle: 'italic'
              }}>
                {voiceText}
              </div>
            )}
          </div>
        )}

        {/* Main Quick Input Form */}
        {(inputTab === 'quick' || amount > 0) && (
          <form onSubmit={handleSubmit}>
            
            {/* Amount Field + Preset Tap Buttons */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                NOMINAL TRANSAKSI
              </label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '12px', fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>
                  Rp
                </span>
                <input 
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 42px',
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff'
                  }}
                />
              </div>

              {/* Quick Tap Amount Chips */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {[10000, 20000, 50000, 100000, 200000].map(val => (
                  <button 
                    key={val} 
                    type="button"
                    onClick={() => setAmount(val)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-main)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    +{val / 1000}rb
                  </button>
                ))}
              </div>
            </div>

            {/* Merchant & Title */}
            <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                  MERCHANT / TOKO
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Indomaret, Starbucks"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.85rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    marginTop: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                  KATEGORI (AUTO)
                </label>
                <select 
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPotId(CATEGORY_POT_MAPPING[e.target.value] || 'daily');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.85rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    marginTop: '4px'
                  }}
                >
                  {Object.keys(CATEGORY_POT_MAPPING).map(cat => (
                    <option key={cat} value={cat} style={{ background: '#1e293b' }}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Account & Pot selection */}
            <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                  SUMBER AKUN
                </label>
                <select 
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.85rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    marginTop: '4px'
                  }}
                >
                  {(data?.accounts || []).map(acc => (
                    <option key={acc.id} value={acc.id} style={{ background: '#1e293b' }}>
                      {acc.name} ({formatRupiah(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                  POT DANA
                </label>
                <select 
                  value={potId}
                  onChange={(e) => setPotId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.85rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    marginTop: '4px'
                  }}
                >
                  <option value="daily" style={{ background: '#1e293b' }}>Pot Harian (50%)</option>
                  <option value="monthly" style={{ background: '#1e293b' }}>Pot Bulanan (30%)</option>
                  <option value="savings" style={{ background: '#1e293b' }}>Pot Tabungan (20%)</option>
                </select>
              </div>
            </div>

            {/* Warning Alert if over daily budget */}
            {isOverBudget && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#f87171',
                fontSize: '0.8rem'
              }}>
                <AlertTriangle size={18} flexShrink={0} />
                <span>
                  <strong>Peringatan:</strong> Nominal Rp {numAmount.toLocaleString('id-ID')} akan melebihi sisa jatah harian ({formatRupiah(todayRemaining)}).
                </span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => setIsQuickModalOpen(false)}
                className="btn btn-secondary"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Simpan Transaksi
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

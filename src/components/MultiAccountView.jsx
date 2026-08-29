import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { 
  Landmark, 
  Wallet, 
  Smartphone, 
  Coins, 
  CreditCard, 
  Building2, 
  Plus, 
  ArrowLeftRight, 
  Check, 
  X
} from 'lucide-react';

export const MultiAccountView = () => {
  const { data, addAccount, transferBetweenAccounts } = useApp();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Add Account form state
  const [accName, setAccName] = useState('');
  const [accType, setAccType] = useState('bank');
  const [accBalance, setAccBalance] = useState('');
  const [accNumber, setAccNumber] = useState('');

  // Transfer form state
  const [fromId, setFromId] = useState(data?.accounts[0]?.id || '');
  const [toId, setToId] = useState(data?.accounts[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');

  // Calculate Net Worth
  const totalNetWorth = (data?.accounts || []).reduce((sum, acc) => sum + Number(acc.balance), 0);

  const getAccountIcon = (type) => {
    switch (type) {
      case 'bank': return Landmark;
      case 'ewallet': return Wallet;
      case 'cash': return Coins;
      case 'credit_card': return CreditCard;
      default: return Building2;
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!accName) return;

    addAccount({
      name: accName,
      type: accType,
      balance: Number(accBalance) || 0,
      accountNumber: accNumber || 'XXXX-XXXX',
      icon: 'Landmark'
    });

    setAccName('');
    setAccBalance('');
    setAccNumber('');
    setIsAddOpen(false);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferAmount || fromId === toId) return;

    transferBetweenAccounts(fromId, toId, transferAmount);
    setTransferAmount('');
    setIsTransferOpen(false);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>

      {/* Net Worth Aggregate Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid var(--glass-border)'
      }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
          TOTAL KEKAYAAN (NET WORTH)
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '4px', letterSpacing: '-0.03em' }}>
          {formatRupiah(totalNetWorth)}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '8px 12px' }}
          >
            <Plus size={16} />
            <span>Tambah Akun</span>
          </button>
          <button 
            onClick={() => setIsTransferOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 12px' }}
          >
            <ArrowLeftRight size={16} />
            <span>Transfer Akun</span>
          </button>
        </div>
      </div>

      {/* Account List Grid */}
      <h3 className="title-md" style={{ marginBottom: '12px', marginTop: '8px' }}>
        Daftar Sumber Dana ({data?.accounts?.length || 0})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {(data?.accounts || []).map(acc => {
          const Icon = getAccountIcon(acc.type);
          const isNegative = acc.balance < 0;

          return (
            <div key={acc.id} className="glass-card" style={{ marginBottom: 0, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399'
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{acc.name}</h4>
                    <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                      {acc.type.toUpperCase()} • {acc.accountNumber}
                    </span>
                  </div>
                </div>

                <div style={{
                  fontSize: '1rem',
                  fontWeight: '800',
                  color: isNegative ? '#f87171' : 'var(--text-main)'
                }}>
                  {formatRupiah(acc.balance)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Akun */}
      {isAddOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 className="title-md">Tambah Akun Keuangan Baru</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Nama Akun</label>
                <input 
                  type="text" 
                  placeholder="e.g. BCA Digital / GoPay Tabungan"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  required
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

              <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Jenis Akun</label>
                  <select 
                    value={accType}
                    onChange={(e) => setAccType(e.target.value)}
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
                    <option value="bank" style={{ background: '#1e293b' }}>Bank</option>
                    <option value="ewallet" style={{ background: '#1e293b' }}>E-Wallet</option>
                    <option value="cash" style={{ background: '#1e293b' }}>Kas Tunai</option>
                    <option value="credit_card" style={{ background: '#1e293b' }}>Kartu Kredit</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Saldo Awal</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={accBalance}
                    onChange={(e) => setAccBalance(e.target.value)}
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Transfer Antar Akun */}
      {isTransferOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 className="title-md">Transfer Antar Akun</h3>
              <button 
                onClick={() => setIsTransferOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Akun Asal (Pengirim)</label>
                <select 
                  value={fromId}
                  onChange={(e) => setFromId(e.target.value)}
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

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Akun Tujuan (Penerima)</label>
                <select 
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Nominal Transfer</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    marginTop: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button type="button" onClick={() => setIsTransferOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Proses Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

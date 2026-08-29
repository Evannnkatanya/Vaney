import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { 
  PieChart, 
  Sliders, 
  ShoppingBag, 
  Home, 
  PiggyBank, 
  Edit3, 
  Check, 
  AlertCircle, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const AllocationDashboard = () => {
  const { 
    baseIncome, 
    updateMonthlyIncome, 
    updatePotPercentages, 
    data,
    dailyTarget,
    monthlyTarget,
    savingsTarget,
    dailySpent,
    monthlySpent,
    savingsSpent,
    showToast
  } = useApp();

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState(baseIncome);

  const [isCustomizePotsOpen, setIsCustomizePotsOpen] = useState(false);
  const [dailyPct, setDailyPct] = useState(data?.pots?.daily?.percentage || 50);
  const [monthlyPct, setMonthlyPct] = useState(data?.pots?.monthly?.percentage || 30);
  const [savingsPct, setSavingsPct] = useState(data?.pots?.savings?.percentage || 20);

  const pots = [
    {
      id: 'daily',
      name: 'Kebutuhan Harian',
      pct: data?.pots?.daily?.percentage || 50,
      target: dailyTarget,
      spent: dailySpent,
      color: '#10b981',
      icon: ShoppingBag,
      desc: 'Makan, transport, hiburan, & belanja harian'
    },
    {
      id: 'monthly',
      name: 'Kebutuhan Bulanan',
      pct: data?.pots?.monthly?.percentage || 30,
      target: monthlyTarget,
      spent: monthlySpent,
      color: '#3b82f6',
      icon: Home,
      desc: 'Sewa, listrik, air, internet, & asuransi'
    },
    {
      id: 'savings',
      name: 'Tabungan & Investasi',
      pct: data?.pots?.savings?.percentage || 20,
      target: savingsTarget,
      spent: savingsSpent,
      color: '#8b5cf6',
      icon: PiggyBank,
      desc: 'Dana darurat, saham, reksadana, & emas'
    }
  ];

  const handleSaveIncome = (e) => {
    e.preventDefault();
    updateMonthlyIncome(Number(incomeInput));
    setIsEditingIncome(false);
  };

  const handleSavePots = (e) => {
    e.preventDefault();
    if (dailyPct + monthlyPct + savingsPct !== 100) {
      showToast('Total persentase alokasi pot harus pas 100%', 'danger');
      return;
    }
    updatePotPercentages(dailyPct, monthlyPct, savingsPct);
    setIsCustomizePotsOpen(false);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>

      {/* Header Income Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
              PEMASUKAN BULANAN
            </span>
            {isEditingIncome ? (
              <form onSubmit={handleSaveIncome} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input 
                  type="number" 
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid var(--glass-border)',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    width: '180px'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px' }}>
                  <Check size={16} />
                </button>
              </form>
            ) : (
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '2px', letterSpacing: '-0.02em' }}>
                {formatRupiah(baseIncome)}
              </h2>
            )}
          </div>

          {!isEditingIncome && (
            <button 
              onClick={() => { setIncomeInput(baseIncome); setIsEditingIncome(true); }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Formula Alokasi Default: <strong style={{ color: '#10b981' }}>{data?.pots?.daily?.percentage || 50}/{data?.pots?.monthly?.percentage || 30}/{data?.pots?.savings?.percentage || 20}</strong>
          </div>
          <button 
            onClick={() => setIsCustomizePotsOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sliders size={14} />
            <span>Kustomisasi Pot</span>
          </button>
        </div>
      </div>

      {/* Pots Progress Cards */}
      <h3 className="title-md" style={{ marginBottom: '12px', marginTop: '8px' }}>
        Status 3 Pot Alokasi
      </h3>

      {pots.map((pot) => {
        const Icon = pot.icon;
        const remaining = pot.target - pot.spent;
        const pctUsed = pot.target > 0 ? Math.min(100, Math.round((pot.spent / pot.target) * 100)) : 0;
        
        let progressClass = 'progress-good';
        let alertBadge = null;

        if (pctUsed >= 90) {
          progressClass = 'progress-danger';
          alertBadge = <span className="badge badge-danger">Kritis (≥90%)</span>;
        } else if (pctUsed >= 75) {
          progressClass = 'progress-warn';
          alertBadge = <span className="badge badge-warn">Waspada (≥75%)</span>;
        } else {
          alertBadge = <span className="badge badge-good">Aman</span>;
        }

        return (
          <div key={pot.id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: `${pot.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: pot.color
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>
                    {pot.name} ({pot.pct}%)
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {pot.desc}
                  </p>
                </div>
              </div>
              {alertBadge}
            </div>

            {/* Target vs Spent */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', background: 'rgba(0,0,0,0.15)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target Alokasi</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{formatRupiah(pot.target)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Terpakai</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: pot.spent > pot.target ? '#f87171' : 'var(--text-main)' }}>
                  {formatRupiah(pot.spent)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-container" style={{ height: '8px' }}>
              <div 
                className={`progress-bar-fill ${progressClass}`}
                style={{ width: `${pctUsed}%`, backgroundColor: pot.color }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>{pctUsed}% terpakai</span>
              <span style={{ color: remaining >= 0 ? '#34d399' : '#f87171', fontWeight: '600' }}>
                {remaining >= 0 ? `Sisa: ${formatRupiah(remaining)}` : `Minus: ${formatRupiah(Math.abs(remaining))}`}
              </span>
            </div>
          </div>
        );
      })}

      {/* End of Period Rules Section */}
      <div className="glass-card" style={{ marginTop: '16px' }}>
        <h3 className="title-md" style={{ marginBottom: '6px' }}>
          Pengaturan Sisa Dana Akhir Periode
        </h3>
        <p className="subtitle" style={{ marginBottom: '12px' }}>
          Tentukan perlakuan sisa dana saat berganti bulan:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'savings', label: 'Otomatis Masuk Tabungan / Investasi (Direkomendasikan)', desc: 'Sisa dana akan dipindahkan ke pot Tabungan' },
            { id: 'carry', label: 'Bawa ke Bulan Depan (Rollover)', desc: 'Menambah target jatah harian bulan berikutnya' },
            { id: 'expire', label: 'Hangus / Reset Netral', desc: 'Sisa dana di-reset kembali ke persentase default' }
          ].map(rule => (
            <label key={rule.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: data?.endPeriodChoice === rule.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${data?.endPeriodChoice === rule.id ? 'rgba(16, 185, 129, 0.4)' : 'var(--glass-border)'}`,
              cursor: 'pointer'
            }}>
              <input 
                type="radio" 
                name="endPeriodChoice" 
                checked={data?.endPeriodChoice === rule.id}
                onChange={() => showToast(` Aturan akhir periode diubah ke: ${rule.label}`, 'good')}
                style={{ marginTop: '3px' }}
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{rule.label}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{rule.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Modal Kustomisasi Persentase Pot */}
      {isCustomizePotsOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="title-md" style={{ marginBottom: '4px' }}>Kustomisasi Persentase Pot</h3>
            <p className="subtitle" style={{ marginBottom: '16px' }}>
              Atur persentase sesuai prinsip keuangan Anda (Total harus 100%)
            </p>

            <form onSubmit={handleSavePots}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Kebutuhan Harian</span>
                  <span style={{ color: '#10b981' }}>{dailyPct}%</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  step="5"
                  value={dailyPct}
                  onChange={(e) => setDailyPct(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Kebutuhan Bulanan</span>
                  <span style={{ color: '#3b82f6' }}>{monthlyPct}%</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  step="5"
                  value={monthlyPct}
                  onChange={(e) => setMonthlyPct(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tabungan & Investasi</span>
                  <span style={{ color: '#8b5cf6' }}>{savingsPct}%</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="5"
                  value={savingsPct}
                  onChange={(e) => setSavingsPct(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>

              <div style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: dailyPct + monthlyPct + savingsPct === 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: dailyPct + monthlyPct + savingsPct === 100 ? '#34d399' : '#f87171',
                fontSize: '0.8rem',
                fontWeight: '700',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                Total Persentase: {dailyPct + monthlyPct + savingsPct}% 
                {dailyPct + monthlyPct + savingsPct !== 100 && ' (Harus 100%)'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsCustomizePotsOpen(false)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={dailyPct + monthlyPct + savingsPct !== 100}
                >
                  Simpan Formula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

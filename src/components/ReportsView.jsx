import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { 
  TrendingUp, 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lightbulb,
  Bell
} from 'lucide-react';

export const ReportsView = () => {
  const { 
    data, 
    dailyTarget, 
    monthlyTarget, 
    savingsTarget, 
    dailySpent, 
    monthlySpent, 
    savingsSpent,
    showToast
  } = useApp();

  const transactions = data?.transactions || [];
  
  // Calculate expenses per category
  const categoryTotals = {};
  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + Number(tx.amount);
    });

  const totalExpense = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  // Top spending category
  let topCategory = { name: 'Makanan & Minuman', amount: 0 };
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topCategory.amount) topCategory = { name: cat, amount: amt };
  });

  // Calculate Plan vs Actual percentages
  const baseIncome = data?.monthlyIncome || 12000000;
  const actualDailyPct = baseIncome > 0 ? Math.round((dailySpent / baseIncome) * 100) : 0;
  const actualMonthlyPct = baseIncome > 0 ? Math.round((monthlySpent / baseIncome) * 100) : 0;
  const actualSavingsPct = baseIncome > 0 ? Math.round((savingsSpent / baseIncome) * 100) : 0;

  const planVsActual = [
    { name: 'Kebutuhan Harian', plan: data?.pots?.daily?.percentage || 50, actual: actualDailyPct, spent: dailySpent, target: dailyTarget, color: '#10b981' },
    { name: 'Kebutuhan Bulanan', plan: data?.pots?.monthly?.percentage || 30, actual: actualMonthlyPct, spent: monthlySpent, target: monthlyTarget, color: '#3b82f6' },
    { name: 'Tabungan & Investasi', plan: data?.pots?.savings?.percentage || 20, actual: actualSavingsPct, spent: savingsSpent, target: savingsTarget, color: '#8b5cf6' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>

      {/* Spending Insights Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Lightbulb size={20} color="#a855f7" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#c084fc' }}>
            Insight Tren Pengeluaran
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
          Kategori pengeluaran tertinggi Anda bulan ini adalah <strong>{topCategory.name}</strong> sebesar <strong>{formatRupiah(topCategory.amount)}</strong>.
        </p>
        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Tip Disiplin: Hemat 10% pada kategori hiburan untuk menambah pot Tabungan Anda.
        </div>
      </div>

      {/* Plan vs Actual Realization Report */}
      <div className="glass-card">
        <h3 className="title-md" style={{ marginBottom: '4px' }}>
          Perbandingan Rencana vs Realisasi
        </h3>
        <p className="subtitle" style={{ marginBottom: '14px' }}>
          Evaluasi persentase alokasi 50/30/20 terhadap pengeluaran nyata
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {planVsActual.map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                <span style={{ color: item.color }}>{item.name}</span>
                <span>Rencana {item.plan}% vs Realisasi {item.actual}%</span>
              </div>

              <div className="progress-bar-container" style={{ height: '8px', marginBottom: '6px' }}>
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${Math.min(100, item.actual)}%`, backgroundColor: item.color }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                <span>Target: {formatRupiah(item.target)}</span>
                <span>Terpakai: {formatRupiah(item.spent)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Expense Breakdown List */}
      <div className="glass-card">
        <h3 className="title-md" style={{ marginBottom: '12px' }}>
          Rincian Pengeluaran per Kategori
        </h3>

        {Object.keys(categoryTotals).length === 0 ? (
          <p className="subtitle">Belum ada data pengeluaran terdeteksi.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([catName, amt]) => {
                const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : 0;
                return (
                  <div key={catName} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{catName}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{pct}% dari total pengeluaran</div>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f87171' }}>
                      {formatRupiah(amt)}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Recurring Bill Reminders Section */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell size={18} color="#38bdf8" />
              <span>Reminder Tagihan Berulang</span>
            </h3>
            <p className="subtitle">Pengingat pembayaran jatuh tempo bulanan</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(data?.recurringBills || []).map(bill => (
            <div key={bill.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: bill.isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${bill.isPaid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{bill.name}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Jatuh Tempo: Tgl {bill.dueDate} • <span style={{ color: bill.isPaid ? '#34d399' : '#fbbf24' }}>{bill.isPaid ? 'Lunas' : 'Belum Dibayar'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>
                  {formatRupiah(bill.amount)}
                </div>
                {!bill.isPaid && (
                  <button 
                    onClick={() => showToast(` Tagihan ${bill.name} berhasil dibayar!`, 'good')}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Bayar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

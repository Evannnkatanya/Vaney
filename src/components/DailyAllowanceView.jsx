import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, getDaysInCurrentMonth } from '../utils/formatters';
import { 
  Sun, 
  TrendingDown, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle,
  Sparkles,
  ChevronRight,
  Trash2
} from 'lucide-react';

export const DailyAllowanceView = () => {
  const { 
    todayAllowance, 
    todaySpent, 
    todayRemaining, 
    remainingDays, 
    recalculateDailyAllowance,
    data,
    deleteTransaction,
    setIsQuickModalOpen
  } = useApp();

  const now = new Date();
  const daysInMonth = getDaysInCurrentMonth();
  const currentDayNum = now.getDate();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Transactions for today
  const todayStr = now.toISOString().slice(0, 10);
  const todayTransactions = (data?.transactions || []).filter(tx => tx.date === todayStr);

  // Percentage used today
  const usagePercentage = todayAllowance > 0 ? Math.min(100, Math.round((todaySpent / todayAllowance) * 100)) : 0;
  
  let statusBadge = { label: 'Hemat 🟢', class: 'badge-good' };
  if (usagePercentage >= 100) {
    statusBadge = { label: 'Boros 🔴', class: 'badge-danger' };
  } else if (usagePercentage >= 80) {
    statusBadge = { label: 'Pas 🟡', class: 'badge-warn' };
  }

  // Calculate day spending for calendar visualization
  const getDaySpendingStatus = (dayNumber) => {
    const dayDateStr = `${currentMonthStr}-${String(dayNumber).padStart(2, '0')}`;
    const dayTxs = (data?.transactions || []).filter(tx => tx.date === dayDateStr && tx.type === 'expense');
    const totalDaySpent = dayTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);

    if (totalDaySpent === 0) return { class: 'status-empty-bg', spent: 0 };
    if (totalDaySpent > todayAllowance * 1.1) return { class: 'status-danger-bg', spent: totalDaySpent };
    if (totalDaySpent >= todayAllowance * 0.8) return { class: 'status-warn-bg', spent: totalDaySpent };
    return { class: 'status-good-bg', spent: totalDaySpent };
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* Morning Notification Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#10b981',
          flexShrink: 0
        }}>
          <Sun size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '700' }}>
            NOTIFIKASI PAGI JATAH HARIAN
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>
            Jatah pengeluaran harian Anda hari ini adalah <strong>{formatRupiah(todayAllowance)}</strong>. Tetap disiplin!
          </div>
        </div>
      </div>

      {/* Today Allowance Main Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: usagePercentage >= 100 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              JATAH HARI INI
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '4px', letterSpacing: '-0.03em' }}>
              {formatRupiah(todayAllowance)}
            </h2>
          </div>
          <span className={`badge ${statusBadge.class}`}>
            {statusBadge.label}
          </span>
        </div>

        {/* Real-time Usage Progress */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Terpakai: <strong>{formatRupiah(todaySpent)}</strong></span>
            <span style={{ color: todayRemaining >= 0 ? '#34d399' : '#f87171', fontWeight: '700' }}>
              {todayRemaining >= 0 ? `Sisa: ${formatRupiah(todayRemaining)}` : `Over: ${formatRupiah(Math.abs(todayRemaining))}`}
            </span>
          </div>

          <div className="progress-bar-container">
            <div 
              className={`progress-bar-fill ${usagePercentage >= 100 ? 'progress-danger' : usagePercentage >= 80 ? 'progress-warn' : 'progress-good'}`}
              style={{ width: `${Math.min(100, usagePercentage)}%` }}
            />
          </div>
        </div>

        {/* Recalculate Daily Allowance Option */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--glass-border)',
          fontSize: '0.8rem'
        }}>
          <div style={{ color: 'var(--text-muted)' }}>
            Sisa <strong>{remainingDays} hari</strong> lagi bulan ini
          </div>
          <button 
            onClick={recalculateDailyAllowance}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
            <span>Rata Ulang Jatah</span>
          </button>
        </div>
      </div>

      {/* Calendar View (Indikator Hemat/Pas/Boros per hari) */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h3 className="title-md">Kalender Disiplin Harian</h3>
            <p className="subtitle">Warna hari menandakan tingkat keterkontrolan anggaran</p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Hemat
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span> Pas
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span> Boros
          </span>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
            <div key={i} className="calendar-day-header">{d}</div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const status = getDaySpendingStatus(dayNum);
            const isToday = dayNum === currentDayNum;

            return (
              <div 
                key={dayNum} 
                className={`calendar-day-cell ${status.class} ${isToday ? 'today' : ''}`}
                title={`Tanggal ${dayNum}: ${status.spent > 0 ? formatRupiah(status.spent) : 'Belum ada pengeluaran'}`}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Transactions Timeline */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 className="title-md">Transaksi Hari Ini</h3>
          <button 
            onClick={() => setIsQuickModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#10b981',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <PlusCircle size={15} />
            <span>Tambah</span>
          </button>
        </div>

        {todayTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ marginBottom: '8px', opacity: 0.8 }} />
            <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>Belum Ada Pengeluaran Hari Ini</p>
            <p style={{ fontSize: '0.75rem', marginTop: '2px' }}>Pertahankan kedisiplinan jatah harian Anda!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todayTransactions.map(tx => (
              <div 
                key={tx.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{tx.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {tx.merchant} • <span style={{ color: '#10b981' }}>{tx.category}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    fontSize: '0.925rem',
                    fontWeight: '800',
                    color: tx.type === 'expense' ? '#f87171' : '#34d399'
                  }}>
                    {tx.type === 'expense' ? '-' : '+'}{formatRupiah(tx.amount)}
                  </div>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Hapus Transaksi"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

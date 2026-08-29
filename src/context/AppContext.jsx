import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadAppData, saveAppData, exportBackupJSON, DEFAULT_POTS, DEFAULT_ACCOUNTS, CATEGORY_POT_MAPPING } from '../utils/storage';
import { getRemainingDaysInMonth, getDaysInCurrentMonth } from '../utils/formatters';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => loadAppData());
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'allocation', 'quick', 'reports', 'accounts'
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [recalcOffset, setRecalcOffset] = useState(0); // Offset for rata-ulang daily allowance

  useEffect(() => {
    if (data) {
      saveAppData(data);
      if (data.theme) {
        document.documentElement.setAttribute('data-theme', data.theme);
      }
    }
  }, [data]);

  const showToast = (message, type = 'good') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations for current month
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const currentMonthTransactions = (data?.transactions || []).filter(tx => tx.date.startsWith(currentMonthStr));
  
  // Calculate total spent per pot
  const dailySpent = currentMonthTransactions
    .filter(tx => tx.type === 'expense' && (tx.potId === 'daily' || CATEGORY_POT_MAPPING[tx.category] === 'daily'))
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const monthlySpent = currentMonthTransactions
    .filter(tx => tx.type === 'expense' && (tx.potId === 'monthly' || CATEGORY_POT_MAPPING[tx.category] === 'monthly'))
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const savingsSpent = currentMonthTransactions
    .filter(tx => (tx.potId === 'savings' || CATEGORY_POT_MAPPING[tx.category] === 'savings'))
    .reduce((sum, tx) => sum + (tx.type === 'expense' ? Number(tx.amount) : 0), 0);

  // Targets based on monthly income and pot percentages
  const baseIncome = data?.monthlyIncome || 12000000;
  const dailyTarget = baseIncome * ((data?.pots?.daily?.percentage || 50) / 100);
  const monthlyTarget = baseIncome * ((data?.pots?.monthly?.percentage || 30) / 100);
  const savingsTarget = baseIncome * ((data?.pots?.savings?.percentage || 20) / 100);

  // Daily Allowance calculations
  const remainingDays = getRemainingDaysInMonth();
  const remainingDailyPot = Math.max(0, dailyTarget - dailySpent + recalcOffset);
  const rawTodayAllowance = Math.round(remainingDailyPot / remainingDays);
  
  const todayStr = now.toISOString().slice(0, 10);
  const todaySpent = currentMonthTransactions
    .filter(tx => tx.date === todayStr && tx.type === 'expense' && (tx.potId === 'daily' || CATEGORY_POT_MAPPING[tx.category] === 'daily'))
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const todayRemaining = rawTodayAllowance - todaySpent;

  // Transaction Handlers
  const addTransaction = (newTx) => {
    const potId = newTx.potId || CATEGORY_POT_MAPPING[newTx.category] || 'daily';
    const txToAdd = {
      ...newTx,
      id: `tx-${Date.now()}`,
      potId
    };

    // Update account balance
    const updatedAccounts = (data.accounts || []).map(acc => {
      if (acc.id === newTx.accountId) {
        const delta = newTx.type === 'expense' ? -Number(newTx.amount) : Number(newTx.amount);
        return { ...acc, balance: acc.balance + delta };
      }
      return acc;
    });

    // Check if transaction exceeds today allowance
    if (newTx.type === 'expense' && potId === 'daily') {
      if (Number(newTx.amount) > todayRemaining && todayRemaining > 0) {
        showToast(` Alert: Transaksi ini melebihi sisa jatah harian!`, 'danger');
      } else {
        showToast(' Transaksi berhasil dicatat!', 'good');
      }
    } else {
      showToast(' Transaksi berhasil disimpan', 'good');
    }

    // Check pot alert thresholds (80% - 90%)
    const updatedDailySpent = potId === 'daily' ? dailySpent + Number(newTx.amount) : dailySpent;
    if (updatedDailySpent / dailyTarget >= 0.85) {
      setTimeout(() => {
        showToast(` Peringatan: Pot Kebutuhan Harian telah terpakai ${(updatedDailySpent / dailyTarget * 100).toFixed(0)}%!`, 'warn');
      }, 1500);
    }

    setData(prev => ({
      ...prev,
      accounts: updatedAccounts,
      transactions: [txToAdd, ...prev.transactions]
    }));
  };

  const deleteTransaction = (id) => {
    const targetTx = data.transactions.find(t => t.id === id);
    if (!targetTx) return;

    const updatedAccounts = data.accounts.map(acc => {
      if (acc.id === targetTx.accountId) {
        const delta = targetTx.type === 'expense' ? Number(targetTx.amount) : -Number(targetTx.amount);
        return { ...acc, balance: acc.balance + delta };
      }
      return acc;
    });

    setData(prev => ({
      ...prev,
      accounts: updatedAccounts,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
    showToast('Transaksi telah dihapus', 'warn');
  };

  const updateMonthlyIncome = (income) => {
    setData(prev => ({ ...prev, monthlyIncome: Number(income) }));
    showToast(` Pemasukan bulanan diperbarui ke ${income.toLocaleString('id-ID')}`, 'good');
  };

  const updatePotPercentages = (dailyPct, monthlyPct, savingsPct) => {
    if (dailyPct + monthlyPct + savingsPct !== 100) {
      showToast('Total persentase harus 100%', 'danger');
      return false;
    }
    setData(prev => ({
      ...prev,
      pots: {
        daily: { ...prev.pots.daily, percentage: dailyPct },
        monthly: { ...prev.pots.monthly, percentage: monthlyPct },
        savings: { ...prev.pots.savings, percentage: savingsPct }
      }
    }));
    showToast(' Kustomisasi alokasi pot berhasil disimpan', 'good');
    return true;
  };

  const recalculateDailyAllowance = () => {
    // Reset recalculation baseline for daily allowance
    setRecalcOffset(0);
    showToast(' Jatah harian telah dirata-ulang sesuai sisa sisa hari', 'good');
  };

  const addAccount = (acc) => {
    const newAcc = {
      ...acc,
      id: `acc-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAcc]
    }));
    showToast(' Akun baru berhasil ditambahkan', 'good');
  };

  const transferBetweenAccounts = (fromId, toId, amount) => {
    const numAmount = Number(amount);
    const updatedAccounts = data.accounts.map(acc => {
      if (acc.id === fromId) return { ...acc, balance: acc.balance - numAmount };
      if (acc.id === toId) return { ...acc, balance: acc.balance + numAmount };
      return acc;
    });
    setData(prev => ({ ...prev, accounts: updatedAccounts }));
    showToast(' Transfer antar akun berhasil', 'good');
  };

  const toggleTheme = () => {
    const newTheme = data.theme === 'dark' ? 'light' : 'dark';
    setData(prev => ({ ...prev, theme: newTheme }));
  };

  const importData = (importedData) => {
    if (importedData && importedData.transactions && importedData.accounts) {
      setData(importedData);
      showToast(' Data backup berhasil dipulihkan!', 'good');
    } else {
      showToast(' Format file backup JSON tidak valid', 'danger');
    }
  };

  return (
    <AppContext.Provider value={{
      data,
      activeTab,
      setActiveTab,
      isQuickModalOpen,
      setIsQuickModalOpen,
      toastMessage,
      showToast,
      
      // Calculations
      baseIncome,
      dailyTarget,
      monthlyTarget,
      savingsTarget,
      dailySpent,
      monthlySpent,
      savingsSpent,
      
      // Daily allowance values
      remainingDays,
      todayAllowance: rawTodayAllowance,
      todaySpent,
      todayRemaining,

      // Actions
      addTransaction,
      deleteTransaction,
      updateMonthlyIncome,
      updatePotPercentages,
      recalculateDailyAllowance,
      addAccount,
      transferBetweenAccounts,
      toggleTheme,
      importData,
      exportBackupJSON: () => exportBackupJSON(data)
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

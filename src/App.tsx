import React, { useState, useEffect } from 'react';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BUDGET_POTS,
  INITIAL_CATEGORY_MAPPINGS,
  INITIAL_TRANSACTIONS,
} from './data/initialData';
import {
  Account,
  BudgetPot,
  CategoryMapping,
  TabType,
  Transaction,
} from './types';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DesktopSidebar } from './components/DesktopSidebar';
import { HomeView } from './components/HomeView';
import { JatahView } from './components/JatahView';
import { TambahTransaksiView } from './components/TambahTransaksiView';
import { LaporanView } from './components/LaporanView';
import { AkunKeuanganView } from './components/AkunKeuanganView';
import { ModalAddAccount } from './components/ModalAddAccount';
import { ModalAddCategory } from './components/ModalAddCategory';
import { NotificationModal } from './components/NotificationModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { AccountDetailModal } from './components/AccountDetailModal';
import { PinLockScreen } from './components/PinLockScreen';
import { ModalBackupRestore } from './components/ModalBackupRestore';
import { ModalSupabaseSync } from './components/ModalSupabaseSync';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [prevTab, setPrevTab] = useState<TabType>('home');

  // Security state
  const [isAppLocked, setIsAppLocked] = useState<boolean>(() => {
    const savedPin = localStorage.getItem('vaney_pin');
    return savedPin ? true : false;
  });
  const [pinCode, setPinCode] = useState<string>(() => {
    return localStorage.getItem('vaney_pin') || '1234';
  });

  // Modals state
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenBackup = () => setIsBackupModalOpen(true);
    const handleOpenSupabase = () => setIsSupabaseModalOpen(true);

    window.addEventListener('open-backup-modal', handleOpenBackup);
    window.addEventListener('open-supabase-modal', handleOpenSupabase);

    return () => {
      window.removeEventListener('open-backup-modal', handleOpenBackup);
      window.removeEventListener('open-supabase-modal', handleOpenSupabase);
    };
  }, []);

  // Ensure old cached mock data is cleanly wiped to Rp 0 on version upgrade
  const VANEY_STORAGE_VERSION = 'vaney_v2_zero_clean';
  if (typeof window !== 'undefined') {
    const currentVersion = localStorage.getItem('vaney_storage_version');
    if (currentVersion !== VANEY_STORAGE_VERSION) {
      localStorage.removeItem('vaney_accounts');
      localStorage.removeItem('vaney_budget_pots');
      localStorage.removeItem('vaney_category_mappings');
      localStorage.removeItem('vaney_transactions');
      localStorage.setItem('vaney_storage_version', VANEY_STORAGE_VERSION);
    }
  }

  // Core data states with localStorage initialization
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('vaney_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading accounts:', e);
      }
    }
    return INITIAL_ACCOUNTS;
  });

  const [budgetPots, setBudgetPots] = useState<BudgetPot[]>(() => {
    const saved = localStorage.getItem('vaney_budget_pots');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading budget pots:', e);
      }
    }
    return INITIAL_BUDGET_POTS;
  });

  const [categoryMappings, setCategoryMappings] = useState<CategoryMapping[]>(() => {
    const saved = localStorage.getItem('vaney_category_mappings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading category mappings:', e);
      }
    }
    return INITIAL_CATEGORY_MAPPINGS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('vaney_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading transactions:', e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Manual reset all data to clean 0 state
  const handleResetAllData = () => {
    if (window.confirm('Reset semua data transaksi, pot, dan saldo akun kembali menjadi Rp 0?')) {
      localStorage.removeItem('vaney_accounts');
      localStorage.removeItem('vaney_budget_pots');
      localStorage.removeItem('vaney_category_mappings');
      localStorage.removeItem('vaney_transactions');
      setAccounts(INITIAL_ACCOUNTS);
      setBudgetPots(INITIAL_BUDGET_POTS);
      setCategoryMappings(INITIAL_CATEGORY_MAPPINGS);
      setTransactions([]);
      alert('Semua data berhasil di-reset ke Rp 0!');
    }
  };

  // Modals state
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('vaney_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('vaney_budget_pots', JSON.stringify(budgetPots));
  }, [budgetPots]);

  useEffect(() => {
    localStorage.setItem('vaney_category_mappings', JSON.stringify(categoryMappings));
  }, [categoryMappings]);

  useEffect(() => {
    localStorage.setItem('vaney_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Tab change handler with history tracking
  const handleTabChange = (newTab: TabType) => {
    setPrevTab(currentTab);
    setCurrentTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add new transaction
  const handleSaveTransaction = (newTxData: Omit<Transaction, 'id' | 'timeStr'>) => {
    const newId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...newTxData,
      id: newId,
      timeStr: 'Baru saja',
    };

    // 1. Update transactions
    setTransactions((prev) => [newTx, ...prev]);

    // 2. Deduct from account
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === newTxData.accountId) {
          return {
            ...acc,
            balance:
              newTxData.type === 'expense'
                ? acc.balance - newTxData.amount
                : acc.balance + newTxData.amount,
          };
        }
        return acc;
      })
    );

    // 3. Deduct from corresponding pot if allocated
    if (newTxData.potType === 'harian') {
      setBudgetPots((prev) =>
        prev.map((pot) =>
          pot.id === 'pot-harian'
            ? {
                ...pot,
                remainingAmount: Math.max(0, pot.remainingAmount - newTxData.amount),
              }
            : pot
        )
      );
    } else if (newTxData.potType === 'bulanan') {
      setBudgetPots((prev) =>
        prev.map((pot) =>
          pot.id === 'pot-bulanan'
            ? {
                ...pot,
                remainingAmount: Math.max(0, pot.remainingAmount - newTxData.amount),
              }
            : pot
        )
      );
    }
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const txToDelete = transactions.find((t) => t.id === id);
    if (!txToDelete) return;

    // Refund account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === txToDelete.accountId) {
          return {
            ...acc,
            balance:
              txToDelete.type === 'expense'
                ? acc.balance + txToDelete.amount
                : acc.balance - txToDelete.amount,
          };
        }
        return acc;
      })
    );

    // Refund budget pot if applicable
    if (txToDelete.potType === 'harian') {
      setBudgetPots((prev) =>
        prev.map((pot) =>
          pot.id === 'pot-harian'
            ? {
                ...pot,
                remainingAmount: Math.min(pot.totalAmount, pot.remainingAmount + txToDelete.amount),
              }
            : pot
        )
      );
    } else if (txToDelete.potType === 'bulanan') {
      setBudgetPots((prev) =>
        prev.map((pot) =>
          pot.id === 'pot-bulanan'
            ? {
                ...pot,
                remainingAmount: Math.min(pot.totalAmount, pot.remainingAmount + txToDelete.amount),
              }
            : pot
        )
      );
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setSelectedTransaction(null);
  };

  // Add new Account
  const handleSaveAccount = (newAccData: Omit<Account, 'id'>) => {
    const newId = `acc-${Date.now()}`;
    const newAcc: Account = {
      ...newAccData,
      id: newId,
    };
    setAccounts((prev) => [...prev, newAcc]);
  };

  // Update Account Balance
  const handleUpdateAccountBalance = (id: string, newBalance: number) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, balance: newBalance } : acc))
    );
  };

  // Delete Account
  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    setSelectedAccount(null);
  };

  // Add new Category Mapping
  const handleSaveCategory = (newCatData: Omit<CategoryMapping, 'id'>) => {
    const newId = `cat-${Date.now()}`;
    const newCat: CategoryMapping = {
      ...newCatData,
      id: newId,
    };
    setCategoryMappings((prev) => [...prev, newCat]);
  };

  // Delete Category
  const handleDeleteCategory = (id: string) => {
    setCategoryMappings((prev) => prev.filter((c) => c.id !== id));
  };

  // Total balance for Home card (Net liquid assets)
  const homeTotalBalance = accounts
    .filter((a) => !a.isCredit && a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="min-h-screen bg-[#f9f9f7] text-[#1a1c1b] flex flex-col md:pl-64 transition-all duration-300 pb-20 md:pb-8">
      {/* PIN Security Overlay */}
      {isAppLocked && (
        <PinLockScreen
          correctPin={pinCode}
          onUnlock={() => setIsAppLocked(false)}
          onResetPin={() => {
            if (confirm('Lupa PIN? Seluruh data lokal & PIN akan di-reset. Lanjutkan?')) {
              localStorage.removeItem('vaney_pin');
              setIsAppLocked(false);
            }
          }}
        />
      )}

      {/* Desktop Sidebar (visible on md+) */}
      <DesktopSidebar
        currentTab={currentTab}
        onChangeTab={handleTabChange}
        onOpenAddTransaction={() => handleTabChange('tambah')}
      />

      {/* Top App Bar */}
      <TopAppBar
        currentTab={currentTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onAvatarClick={() => handleTabChange('profil')}
        onBack={() => handleTabChange(prevTab || 'home')}
      />

      {/* View Switcher with bottom padding on mobile so content is never cut off by the bottom navbar */}
      <div className="flex-1 w-full pb-32 md:pb-8">
        <ErrorBoundary onReset={() => handleTabChange('home')}>
          {currentTab === 'home' && (
            <HomeView
              totalBalance={homeTotalBalance}
              pots={budgetPots}
              transactions={transactions}
              onNavigate={handleTabChange}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onOpenAddTransaction={() => handleTabChange('tambah')}
            />
          )}

          {currentTab === 'jatah' && (
            <JatahView
              categories={categoryMappings}
              onOpenAddCategory={() => setIsAddCategoryOpen(true)}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {currentTab === 'tambah' && (
            <TambahTransaksiView
              accounts={accounts}
              onSaveTransaction={handleSaveTransaction}
              onCancel={() => handleTabChange(prevTab || 'home')}
            />
          )}

          {currentTab === 'laporan' && <LaporanView transactions={transactions} />}

          {currentTab === 'profil' && (
            <AkunKeuanganView
              accounts={accounts}
              onOpenAddAccount={() => setIsAddAccountOpen(true)}
              onSelectAccount={(acc) => setSelectedAccount(acc)}
              onUpdateBalance={handleUpdateAccountBalance}
              onResetAllData={handleResetAllData}
            />
          )}
        </ErrorBoundary>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar currentTab={currentTab} onChangeTab={handleTabChange} />

      {/* Modals & Drawers */}
      <ModalAddAccount
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onSaveAccount={handleSaveAccount}
      />

      <ModalAddCategory
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSaveCategory={handleSaveCategory}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <TransactionDetailModal
        transaction={selectedTransaction}
        accounts={accounts}
        onClose={() => setSelectedTransaction(null)}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <AccountDetailModal
        account={selectedAccount}
        transactions={transactions}
        onClose={() => setSelectedAccount(null)}
        onUpdateBalance={handleUpdateAccountBalance}
        onDeleteAccount={handleDeleteAccount}
      />

      <ModalBackupRestore
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        accounts={accounts}
        budgetPots={budgetPots}
        categoryMappings={categoryMappings}
        transactions={transactions}
        onRestoreData={(restored) => {
          if (restored.accounts) setAccounts(restored.accounts);
          if (restored.budgetPots) setBudgetPots(restored.budgetPots);
          if (restored.categoryMappings) setCategoryMappings(restored.categoryMappings);
          if (restored.transactions) setTransactions(restored.transactions);
        }}
      />

      <ModalSupabaseSync
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        accounts={accounts}
        budgetPots={budgetPots}
        categoryMappings={categoryMappings}
        transactions={transactions}
        onApplyCloudData={(cloudData) => {
          if (cloudData.accounts) setAccounts(cloudData.accounts);
          if (cloudData.budgetPots) setBudgetPots(cloudData.budgetPots);
          if (cloudData.categoryMappings) setCategoryMappings(cloudData.categoryMappings);
          if (cloudData.transactions) setTransactions(cloudData.transactions);
        }}
      />
    </div>
  );
}

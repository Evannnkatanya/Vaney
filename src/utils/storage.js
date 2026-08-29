// LocalStorage Engine for Vaney - 100% Offline Persistence & Backup

const STORAGE_KEY = 'vaney_finance_app_data_v1';

export const DEFAULT_ACCOUNTS = [
  { id: 'acc-1', name: 'BCA Utama', type: 'bank', balance: 5450000, accountNumber: '782910XXXX', icon: 'Landmark' },
  { id: 'acc-2', name: 'Mandiri Payroll', type: 'bank', balance: 4200000, accountNumber: '142001XXXX', icon: 'Building2' },
  { id: 'acc-3', name: 'GoPay', type: 'ewallet', balance: 350000, accountNumber: '0812XXXXXX', icon: 'Wallet' },
  { id: 'acc-4', name: 'OVO', type: 'ewallet', balance: 185000, accountNumber: '0812XXXXXX', icon: 'Smartphone' },
  { id: 'acc-5', name: 'Kas Tunai', type: 'cash', balance: 500000, accountNumber: 'Dompet', icon: 'Coins' },
  { id: 'acc-6', name: 'Kartu Kredit Mandiri', type: 'credit_card', balance: -1250000, accountNumber: '4512XXXX', icon: 'CreditCard' },
];

export const DEFAULT_POTS = {
  daily: { id: 'daily', name: 'Kebutuhan Harian', percentage: 50, color: '#10b981', icon: 'ShoppingBag' },
  monthly: { id: 'monthly', name: 'Kebutuhan Bulanan', percentage: 30, color: '#3b82f6', icon: 'Home' },
  savings: { id: 'savings', name: 'Tabungan & Investasi', percentage: 20, color: '#8b5cf6', icon: 'PiggyBank' },
};

export const CATEGORY_POT_MAPPING = {
  'Makanan & Minuman': 'daily',
  'Transportasi': 'daily',
  'Belanja Harian': 'daily',
  'Hiburan & Gaya Hidup': 'daily',
  'Kesehatan & Fitnes': 'daily',
  
  'Tagihan Listrik & Air': 'monthly',
  'Sewa Tempat Tinggal': 'monthly',
  'Internet & Pulsa': 'monthly',
  'Pendidikan': 'monthly',
  'Asuransi': 'monthly',
  
  'Tabungan Darurat': 'savings',
  'Investasi Saham / Crypto': 'savings',
  'Reksadana': 'savings',
  'Emas': 'savings',
};

// Generates seed transactions for realistic initial state
const getInitialTransactions = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  return [
    { id: 'tx-1', date: `${year}-${month}-02`, title: 'Gaji Bulanan', amount: 12000000, type: 'income', category: 'Pemasukan', potId: 'income', accountId: 'acc-1', merchant: 'PT Teknologi Bangsa' },
    { id: 'tx-2', date: `${year}-${month}-03`, title: 'Sewa Kost Bulanan', amount: 1800000, type: 'expense', category: 'Sewa Tempat Tinggal', potId: 'monthly', accountId: 'acc-1', merchant: 'Ibu Kost' },
    { id: 'tx-3', date: `${year}-${month}-04`, title: 'Supermarket Indomaret', amount: 145000, type: 'expense', category: 'Belanja Harian', potId: 'daily', accountId: 'acc-3', merchant: 'Indomaret' },
    { id: 'tx-4', date: `${year}-${month}-05`, title: 'Kopi & Snack Starbucks', amount: 65000, type: 'expense', category: 'Makanan & Minuman', potId: 'daily', accountId: 'acc-3', merchant: 'Starbucks' },
    { id: 'tx-5', date: `${year}-${month}-06`, title: 'Bensin Pertamax', amount: 100000, type: 'expense', category: 'Transportasi', potId: 'daily', accountId: 'acc-5', merchant: 'Pertamina' },
    { id: 'tx-6', date: `${year}-${month}-08`, title: 'Tagihan Listrik PLN', amount: 350000, type: 'expense', category: 'Tagihan Listrik & Air', potId: 'monthly', accountId: 'acc-2', merchant: 'PLN' },
    { id: 'tx-7', date: `${year}-${month}-10`, title: 'Makan Siang Resto', amount: 85000, type: 'expense', category: 'Makanan & Minuman', potId: 'daily', accountId: 'acc-3', merchant: 'Warung Bu Agus' },
    { id: 'tx-8', date: `${year}-${month}-12`, title: 'Topup Bibit Reksadana', amount: 1000000, type: 'expense', category: 'Reksadana', potId: 'savings', accountId: 'acc-1', merchant: 'Bibit' },
    { id: 'tx-9', date: `${year}-${month}-15`, title: 'Nonton Bioskop XXI', amount: 120000, type: 'expense', category: 'Hiburan & Gaya Hidup', potId: 'daily', accountId: 'acc-4', merchant: 'XXI' },
    { id: 'tx-10', date: `${year}-${month}-${String(today.getDate()).padStart(2, '0')}`, title: 'Makan Malam Cafe', amount: 75000, type: 'expense', category: 'Makanan & Minuman', potId: 'daily', accountId: 'acc-3', merchant: 'Kopi Kenangan' }
  ];
};

export const DEFAULT_RECURRING_BILLS = [
  { id: 'bill-1', name: 'Sewa Kost', amount: 1800000, dueDate: 3, category: 'Sewa Tempat Tinggal', isPaid: true },
  { id: 'bill-2', name: 'Listrik PLN', amount: 350000, dueDate: 10, category: 'Tagihan Listrik & Air', isPaid: true },
  { id: 'bill-3', name: 'WiFi Indihome', amount: 380000, dueDate: 20, category: 'Internet & Pulsa', isPaid: false },
  { id: 'bill-4', name: 'Netflix Premium', amount: 186000, dueDate: 25, category: 'Hiburan & Gaya Hidup', isPaid: false }
];

export const loadAppData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialData = {
        monthlyIncome: 12000000,
        pots: DEFAULT_POTS,
        accounts: DEFAULT_ACCOUNTS,
        transactions: getInitialTransactions(),
        recurringBills: DEFAULT_RECURRING_BILLS,
        categoryMapping: CATEGORY_POT_MAPPING,
        endPeriodChoice: 'savings', // 'carry', 'expire', 'savings'
        theme: 'dark'
      };
      saveAppData(initialData);
      return initialData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load local storage data:', err);
    return null;
  }
};

export const saveAppData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to local storage:', err);
  }
};

export const exportBackupJSON = (data) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vaney_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

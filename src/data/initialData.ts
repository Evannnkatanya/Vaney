import {
  Account,
  BudgetPot,
  CategoryMapping,
  Transaction,
  TransactionCategory,
  AllocationHistory,
  MonthlyTrendData,
  CategorySpendingShare
} from '../types';

export const USER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCYdRykdDMxvmriNGDJJFOsOqLs4r3wBx1Mu5p03AGel5QNtx379lXqIXdkbz44bVeQovXf3TOLOSQ7_iYoZ5CGuLawvbaSLdv8LtRot0SeS-B2e5W9_kkxmop7if8YL25TL9rwqbMm-oLz4yvqi3KLyvZBGgdx44Su_ZTsvHS9dCnXhkBJGHZhx5sIHxYsGxCJkBiyY6W2s5RgpIj5mxSOPNS30flqTHPj5p9GUPeEyY5vOp7VxzgY';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'bca',
    name: 'Rekening Bank (BCA)',
    subtitle: 'Tabungan Utama',
    type: 'bank',
    accountNumber: '•••• 1234',
    balance: 0,
    icon: 'account_balance',
    bgColorClass: 'bg-[#bde2fe]',
    textColorClass: 'text-[#41657d]',
    iconColorClass: 'text-[#41657d]',
  },
  {
    id: 'ewallet',
    name: 'E-Wallet (GoPay / OVO)',
    subtitle: 'Dompet Digital',
    type: 'ewallet',
    balance: 0,
    icon: 'account_balance_wallet',
    bgColorClass: 'bg-[#c1edd1]',
    textColorClass: 'text-[#002112]',
    iconColorClass: 'text-[#002112]',
  },
  {
    id: 'cash',
    name: 'Uang Tunai (Cash)',
    subtitle: 'Dompet Fisik',
    type: 'cash',
    balance: 0,
    icon: 'payments',
    bgColorClass: 'bg-[#f0e0cb]',
    textColorClass: 'text-[#221a0d]',
    iconColorClass: 'text-[#221a0d]',
  },
];

export const INITIAL_BUDGET_POTS: BudgetPot[] = [
  {
    id: 'pot-harian',
    name: 'Kebutuhan Harian (50%)',
    percentage: 50,
    remainingAmount: 0,
    totalAmount: 0,
    icon: 'coffee',
    colorClass: 'bg-[#3f627a]',
    bgTrackClass: 'bg-[#c8e6ff]/30',
    bgIconClass: 'bg-[#c8e6ff]/40 text-[#3f627a]',
  },
  {
    id: 'pot-bulanan',
    name: 'Kebutuhan Bulanan (30%)',
    percentage: 30,
    remainingAmount: 0,
    totalAmount: 0,
    icon: 'home_work',
    colorClass: 'bg-[#406651]',
    bgTrackClass: 'bg-[#c1edd1]/30',
    bgIconClass: 'bg-[#c1edd1]/40 text-[#406651]',
  },
  {
    id: 'pot-nabung',
    name: 'Tabungan & Investasi (20%)',
    percentage: 20,
    remainingAmount: 0,
    totalAmount: 0,
    icon: 'trending_up',
    colorClass: 'bg-[#685d4c]',
    bgTrackClass: 'bg-[#f0e0cb]/30',
    bgIconClass: 'bg-[#f0e0cb]/40 text-[#685d4c]',
  },
];

export const INITIAL_CATEGORY_MAPPINGS: CategoryMapping[] = [
  {
    id: 'cat-makan',
    name: 'Makan & Minum',
    monthlyAmount: 0,
    category: 'Kebutuhan',
    icon: 'lunch_dining',
    colorClass: 'text-[#406651]',
    bgIconClass: 'bg-[#406651]/15',
  },
  {
    id: 'cat-transport',
    name: 'Transportasi',
    monthlyAmount: 0,
    category: 'Kebutuhan',
    icon: 'directions_car',
    colorClass: 'text-[#3f627a]',
    bgIconClass: 'bg-[#3f627a]/15',
  },
  {
    id: 'cat-belanja',
    name: 'Belanja Harian',
    monthlyAmount: 0,
    category: 'Kebutuhan',
    icon: 'shopping_bag',
    colorClass: 'text-[#685d4c]',
    bgIconClass: 'bg-[#685d4c]/15',
  },
  {
    id: 'cat-film',
    name: 'Langganan & Hiburan',
    monthlyAmount: 0,
    category: 'Keinginan',
    icon: 'movie',
    colorClass: 'text-[#3f627a]',
    bgIconClass: 'bg-[#3f627a]/15',
  },
  {
    id: 'cat-tagihan',
    name: 'Tagihan & Utilitas',
    monthlyAmount: 0,
    category: 'Keinginan',
    icon: 'receipt_long',
    colorClass: 'text-[#ba1a1a]',
    bgIconClass: 'bg-[#ba1a1a]/15',
  },
  {
    id: 'cat-tabung',
    name: 'Tabungan Masa Depan',
    monthlyAmount: 0,
    category: 'Tabungan',
    icon: 'trending_up',
    colorClass: 'text-[#685d4c]',
    bgIconClass: 'bg-[#685d4c]/15',
  },
];

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  {
    id: 'makan',
    name: 'Makan',
    icon: 'restaurant',
    bgClass: 'bg-[#406651]/10',
    textClass: 'text-[#406651]',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'directions_car',
    bgClass: 'bg-[#3f627a]/10',
    textClass: 'text-[#3f627a]',
  },
  {
    id: 'belanja',
    name: 'Belanja',
    icon: 'shopping_bag',
    bgClass: 'bg-[#685d4c]/10',
    textClass: 'text-[#685d4c]',
  },
  {
    id: 'tagihan',
    name: 'Tagihan',
    icon: 'receipt_long',
    bgClass: 'bg-[#ba1a1a]/10',
    textClass: 'text-[#ba1a1a]',
  },
  {
    id: 'hiburan',
    name: 'Hiburan',
    icon: 'movie',
    bgClass: 'bg-[#a7cbe7]/30',
    textClass: 'text-[#3f627a]',
  },
  {
    id: 'lainnya',
    name: 'Lainnya',
    icon: 'more_horiz',
    bgClass: 'bg-[#e2e3e1]',
    textClass: 'text-[#414843]',
  },
];

// Clean initial state: Starts empty and persists all user transactions in localStorage
export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_ALLOCATION_HISTORY: AllocationHistory[] = [
  { month: 'Okt', alokasi: 0, realisasi: 0 },
  { month: 'Nov', alokasi: 0, realisasi: 0 },
  { month: 'Des', alokasi: 0, realisasi: 0 },
];

export const INITIAL_MONTHLY_TRENDS: MonthlyTrendData[] = [
  { month: 'Jun', pemasukan: 0, pengeluaran: 0 },
  { month: 'Jul', pemasukan: 0, pengeluaran: 0 },
  { month: 'Agu', pemasukan: 0, pengeluaran: 0 },
  { month: 'Sep', pemasukan: 0, pengeluaran: 0 },
  { month: 'Okt', pemasukan: 0, pengeluaran: 0 },
  { month: 'Nov', pemasukan: 0, pengeluaran: 0 },
];

export const INITIAL_CATEGORY_SPENDING: CategorySpendingShare[] = [
  { name: 'Makanan', percentage: 0, amount: 0, color: '#406651' },
  { name: 'Transportasi', percentage: 0, amount: 0, color: '#3f627a' },
  { name: 'Belanja', percentage: 0, amount: 0, color: '#685d4c' },
  { name: 'Tagihan & Lainnya', percentage: 0, amount: 0, color: '#ba1a1a' },
];

export function formatRupiah(amount: number): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID').format(absVal);
  return isNegative ? `- Rp ${formatted}` : `Rp ${formatted}`;
}

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
    name: 'Bank BCA',
    subtitle: 'Tabungan •••• 4521',
    type: 'bank',
    accountNumber: '•••• 4521',
    balance: 25400000,
    icon: 'account_balance',
    bgColorClass: 'bg-[#bde2fe]',
    textColorClass: 'text-[#41657d]',
    iconColorClass: 'text-[#41657d]',
  },
  {
    id: 'gopay',
    name: 'GoPay',
    subtitle: 'E-Wallet Aktif',
    type: 'ewallet',
    balance: 1250000,
    icon: 'account_balance_wallet',
    bgColorClass: 'bg-[#c1edd1]',
    textColorClass: 'text-[#002112]',
    iconColorClass: 'text-[#002112]',
  },
  {
    id: 'cash',
    name: 'Uang Tunai',
    subtitle: 'Dompet Fisik',
    type: 'cash',
    balance: 850000,
    icon: 'payments',
    bgColorClass: 'bg-[#f0e0cb]',
    textColorClass: 'text-[#221a0d]',
    iconColorClass: 'text-[#221a0d]',
  },
  {
    id: 'cc-platinum',
    name: 'Kartu Kredit Platinum',
    subtitle: 'Visa •••• 9928',
    type: 'credit',
    accountNumber: 'Visa •••• 9928',
    balance: -4500000,
    icon: 'credit_card',
    bgColorClass: 'bg-[#ffdad6]',
    textColorClass: 'text-[#93000a]',
    iconColorClass: 'text-[#ba1a1a]',
    isCredit: true,
  },
];

export const INITIAL_BUDGET_POTS: BudgetPot[] = [
  {
    id: 'pot-harian',
    name: 'Harian',
    percentage: 50,
    remainingAmount: 1500000,
    totalAmount: 3000000,
    icon: 'coffee',
    colorClass: 'bg-[#3f627a]',
    bgTrackClass: 'bg-[#c8e6ff]/30',
    bgIconClass: 'bg-[#c8e6ff]/40 text-[#3f627a]',
  },
  {
    id: 'pot-bulanan',
    name: 'Bulanan',
    percentage: 30,
    remainingAmount: 1500000,
    totalAmount: 5000000,
    icon: 'home_work',
    colorClass: 'bg-[#406651]',
    bgTrackClass: 'bg-[#c1edd1]/30',
    bgIconClass: 'bg-[#c1edd1]/40 text-[#406651]',
  },
  {
    id: 'pot-nabung',
    name: 'Nabung & Investasi',
    percentage: 20,
    remainingAmount: 2000000,
    totalAmount: 2000000,
    icon: 'trending_up',
    colorClass: 'bg-[#685d4c]',
    bgTrackClass: 'bg-[#f0e0cb]/30',
    bgIconClass: 'bg-[#f0e0cb]/40 text-[#685d4c]',
  },
];

export const INITIAL_CATEGORY_MAPPINGS: CategoryMapping[] = [
  {
    id: 'cat-makan',
    name: 'Makan Siang',
    monthlyAmount: 1500000,
    category: 'Kebutuhan',
    icon: 'lunch_dining',
    colorClass: 'text-[#406651]',
    bgIconClass: 'bg-[#406651]/15',
  },
  {
    id: 'cat-film',
    name: 'Langganan Film',
    monthlyAmount: 200000,
    category: 'Keinginan',
    icon: 'movie',
    colorClass: 'text-[#3f627a]',
    bgIconClass: 'bg-[#3f627a]/15',
  },
  {
    id: 'cat-reksa',
    name: 'Reksadana',
    monthlyAmount: 1000000,
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

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Makan Siang',
    amount: 45000,
    type: 'expense',
    date: '2026-08-28',
    timeStr: 'Hari ini, 12:30',
    categoryName: 'Makan',
    categoryIcon: 'restaurant',
    categoryBgClass: 'bg-[#c8e6ff]/30 text-[#3f627a]',
    categoryTextClass: 'text-[#3f627a]',
    accountId: 'bca',
    potType: 'harian',
    note: 'Makan siang di kantin',
  },
  {
    id: 'tx-2',
    title: 'Transportasi',
    amount: 25000,
    type: 'expense',
    date: '2026-08-28',
    timeStr: 'Hari ini, 08:15',
    categoryName: 'Transport',
    categoryIcon: 'directions_car',
    categoryBgClass: 'bg-[#c1edd1]/40 text-[#406651]',
    categoryTextClass: 'text-[#406651]',
    accountId: 'gopay',
    potType: 'harian',
    note: 'Ojek online ke kantor',
  },
  {
    id: 'tx-3',
    title: 'Gaji Bulanan',
    amount: 10000000,
    type: 'income',
    date: '2026-08-27',
    timeStr: 'Kemarin, 09:00',
    categoryName: 'Pemasukan',
    categoryIcon: 'account_balance_wallet',
    categoryBgClass: 'bg-[#f0e0cb]/40 text-[#685d4c]',
    categoryTextClass: 'text-[#685d4c]',
    accountId: 'bca',
    potType: 'tidak',
    note: 'Gaji pokok bulanan',
  },
  {
    id: 'tx-4',
    title: 'Belanja Bulanan',
    amount: 1200000,
    type: 'expense',
    date: '2026-08-26',
    timeStr: '2 Hari lalu',
    categoryName: 'Belanja',
    categoryIcon: 'shopping_bag',
    categoryBgClass: 'bg-[#c8e6ff]/30 text-[#3f627a]',
    categoryTextClass: 'text-[#3f627a]',
    accountId: 'bca',
    potType: 'bulanan',
    note: 'Supermarket mingguan',
  },
  {
    id: 'tx-5',
    title: 'Listrik & Air',
    amount: 450000,
    type: 'expense',
    date: '2026-08-25',
    timeStr: '3 Hari lalu',
    categoryName: 'Tagihan',
    categoryIcon: 'bolt',
    categoryBgClass: 'bg-[#c1edd1]/40 text-[#406651]',
    categoryTextClass: 'text-[#406651]',
    accountId: 'bca',
    potType: 'bulanan',
    note: 'Tagihan PLN dan PDAM',
  },
];

export const INITIAL_ALLOCATION_HISTORY: AllocationHistory[] = [
  { month: 'Okt', alokasi: 80, realisasi: 75 },
  { month: 'Nov', alokasi: 80, realisasi: 85 },
  { month: 'Des', alokasi: 80, realisasi: 60 },
];

export const INITIAL_MONTHLY_TRENDS: MonthlyTrendData[] = [
  { month: 'Jun', pemasukan: 7.5, pengeluaran: 3.2 },
  { month: 'Jul', pemasukan: 7.2, pengeluaran: 3.6 },
  { month: 'Agu', pemasukan: 6.9, pengeluaran: 3.8 },
  { month: 'Sep', pemasukan: 8.1, pengeluaran: 2.9 },
  { month: 'Okt', pemasukan: 8.3, pengeluaran: 3.0 },
  { month: 'Nov', pemasukan: 8.9, pengeluaran: 4.5 },
];

export const INITIAL_CATEGORY_SPENDING: CategorySpendingShare[] = [
  { name: 'Makanan', percentage: 45, amount: 2025000, color: '#406651' },
  { name: 'Transportasi', percentage: 25, amount: 1125000, color: '#3f627a' },
  { name: 'Hiburan', percentage: 15, amount: 675000, color: '#a99b88' },
  { name: 'Tagihan & Lainnya', percentage: 15, amount: 675000, color: '#c1c8c1' },
];

export function formatRupiah(amount: number): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID').format(absVal);
  return isNegative ? `- Rp ${formatted}` : `Rp ${formatted}`;
}

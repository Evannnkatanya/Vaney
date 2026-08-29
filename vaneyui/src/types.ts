export type TabType = 'home' | 'jatah' | 'tambah' | 'laporan' | 'profil';

export type AccountType = 'bank' | 'ewallet' | 'cash' | 'credit';

export interface Account {
  id: string;
  name: string;
  subtitle: string;
  type: AccountType;
  accountNumber?: string;
  balance: number;
  icon: string;
  bgColorClass: string;
  textColorClass: string;
  iconColorClass: string;
  isCredit?: boolean;
}

export interface BudgetPot {
  id: string;
  name: string;
  percentage: number;
  remainingAmount: number;
  totalAmount: number;
  icon: string;
  colorClass: string;
  bgTrackClass: string;
  bgIconClass: string;
}

export type PotCategoryType = 'Kebutuhan' | 'Keinginan' | 'Tabungan';

export interface CategoryMapping {
  id: string;
  name: string;
  monthlyAmount: number;
  category: PotCategoryType;
  icon: string;
  colorClass: string;
  bgIconClass: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  bgClass: string;
  textClass: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  date: string;
  timeStr: string;
  categoryName: string;
  categoryIcon: string;
  categoryBgClass: string;
  categoryTextClass: string;
  accountId: string;
  potType: 'tidak' | 'harian' | 'bulanan';
  note?: string;
}

export interface AllocationHistory {
  month: string;
  alokasi: number; // percentage or amount
  realisasi: number;
}

export interface MonthlyTrendData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

export interface CategorySpendingShare {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

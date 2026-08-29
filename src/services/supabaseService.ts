import { getSupabaseClient } from '../lib/supabaseClient';
import { Account, BudgetPot, CategoryMapping, Transaction } from '../types';

export interface SyncResult {
  success: boolean;
  message: string;
  syncedCount?: number;
}

/**
 * Service for syncing local state with Supabase cloud database
 */
export const SupabaseService = {
  /**
   * Test database connectivity
   */
  async testConnection(): Promise<{ connected: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { connected: false, error: 'Supabase URL atau Anon Key belum dikonfigurasi.' };
    }

    try {
      const { data, error } = await supabase.from('category_mappings').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        // Table exists or permission checked
        return { connected: false, error: error.message };
      }
      return { connected: true };
    } catch (err: any) {
      return { connected: false, error: err.message || 'Gagal terhubung ke Supabase.' };
    }
  },

  /**
   * Push all local data (accounts, pots, categories, transactions) to Supabase
   */
  async pushAllToCloud(params: {
    userId?: string;
    accounts: Account[];
    budgetPots: BudgetPot[];
    categoryMappings: CategoryMapping[];
    transactions: Transaction[];
  }): Promise<SyncResult> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase client belum aktif.' };
    }

    try {
      // Get current user if authenticated, or generate a stable local device UUID
      const { data: authData } = await supabase.auth.getUser();
      let activeUserId = authData?.user?.id || params.userId;

      if (!activeUserId) {
        let localDeviceUuid = localStorage.getItem('vaney_user_uuid');
        if (!localDeviceUuid) {
          localDeviceUuid = crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-0000-0000-000000000001';
          localStorage.setItem('vaney_user_uuid', localDeviceUuid);
        }
        activeUserId = localDeviceUuid;
      }

      // 1. Sync User / Profile
      await supabase.from('users').upsert({
        id: activeUserId,
        name: 'Vaney User',
        monthly_income: 15000000,
        end_period_choice: 'savings',
      });

      // 2. Sync Accounts
      if (params.accounts && params.accounts.length > 0) {
        const accountsPayload = params.accounts.map((acc) => ({
          id: acc.id.includes('-') && acc.id.length === 36 ? acc.id : undefined,
          user_id: activeUserId,
          name: acc.name,
          type: acc.type === 'credit' ? 'credit_card' : acc.type,
          balance: acc.balance,
          account_number: acc.accountNumber || '',
          icon: acc.icon,
          is_credit: Boolean(acc.isCredit),
        }));
        await supabase.from('accounts').upsert(accountsPayload);
      }

      // 3. Sync Budget Pots
      if (params.budgetPots && params.budgetPots.length > 0) {
        const potsPayload = params.budgetPots.map((pot) => ({
          user_id: activeUserId,
          pot_type: pot.id.includes('harian') ? 'harian' : pot.id.includes('bulanan') ? 'bulanan' : 'tabungan',
          percentage: pot.percentage,
          allocated_amount: pot.totalAmount,
          remaining_amount: pot.remainingAmount,
          period_month: new Date().toISOString().slice(0, 7),
        }));
        await supabase.from('budget_pots').upsert(potsPayload, { onConflict: 'user_id, pot_type, period_month' });
      }

      // 4. Sync Category Mappings
      if (params.categoryMappings && params.categoryMappings.length > 0) {
        const categoriesPayload = params.categoryMappings.map((cat) => ({
          user_id: activeUserId,
          name: cat.name,
          pot_type: cat.category === 'Kebutuhan' ? 'harian' : cat.category === 'Keinginan' ? 'bulanan' : 'tabungan',
          icon_name: cat.icon,
          color: cat.colorClass,
        }));
        await supabase.from('category_mappings').upsert(categoriesPayload);
      }

      // 5. Sync Transactions
      if (params.transactions && params.transactions.length > 0) {
        const txPayload = params.transactions.map((tx) => ({
          user_id: activeUserId,
          type: tx.type,
          amount: tx.amount,
          merchant_name: tx.title,
          note: tx.note || '',
          date: tx.date,
          time_str: tx.timeStr,
          sync_status: 'synced',
        }));
        await supabase.from('transactions').upsert(txPayload);
      }

      return {
        success: true,
        message: 'Semua data berhasil disinkronkan ke Supabase Cloud!',
        syncedCount: params.transactions.length,
      };
    } catch (err: any) {
      console.error('Supabase sync error:', err);
      return {
        success: false,
        message: err.message || 'Gagal melakukan sinkronisasi data ke cloud.',
      };
    }
  },

  /**
   * Pull all cloud data from Supabase to local state
   */
  async pullAllFromCloud(): Promise<{
    success: boolean;
    data?: {
      accounts?: Account[];
      budgetPots?: BudgetPot[];
      categoryMappings?: CategoryMapping[];
      transactions?: Transaction[];
    };
    message: string;
  }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase client belum aktif.' };
    }

    try {
      const [accRes, potRes, catRes, txRes] = await Promise.all([
        supabase.from('accounts').select('*'),
        supabase.from('budget_pots').select('*'),
        supabase.from('category_mappings').select('*'),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
      ]);

      const accounts: Account[] = (accRes.data || []).map((row) => ({
        id: row.id,
        name: row.name,
        subtitle: row.account_number || row.type.toUpperCase(),
        type: row.type === 'credit_card' ? 'credit' : row.type,
        balance: Number(row.balance),
        icon: row.icon || 'account_balance',
        bgColorClass: 'bg-emerald-50',
        textColorClass: 'text-emerald-800',
        iconColorClass: 'text-emerald-700',
        isCredit: row.is_credit,
      }));

      const transactions: Transaction[] = (txRes.data || []).map((row) => ({
        id: row.id,
        title: row.merchant_name || 'Transaksi',
        amount: Number(row.amount),
        type: row.type,
        date: row.date,
        timeStr: row.time_str || '12:00',
        categoryName: 'Kategori',
        categoryIcon: 'receipt',
        categoryBgClass: 'bg-emerald-100 text-emerald-800',
        categoryTextClass: 'text-emerald-800',
        accountId: row.account_id || '',
        potType: 'harian',
        note: row.note,
      }));

      return {
        success: true,
        message: 'Data berhasil ditarik dari Supabase!',
        data: {
          accounts: accounts.length > 0 ? accounts : undefined,
          transactions: transactions.length > 0 ? transactions : undefined,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Gagal mengambil data dari Supabase.',
      };
    }
  },
};

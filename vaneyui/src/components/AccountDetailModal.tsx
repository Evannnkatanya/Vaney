import React, { useState } from 'react';
import { formatRupiah } from '../data/initialData';
import { Account, Transaction } from '../types';

interface AccountDetailModalProps {
  account: Account | null;
  transactions: Transaction[];
  onClose: () => void;
  onUpdateBalance: (accountId: string, newBalance: number) => void;
  onDeleteAccount: (accountId: string) => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  transactions,
  onClose,
  onUpdateBalance,
  onDeleteAccount,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBalanceStr, setNewBalanceStr] = useState('');

  if (!account) return null;

  const accountTxs = transactions.filter((t) => t.accountId === account.id);
  const isCredit = account.isCredit || account.balance < 0;

  const handleSaveBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBalanceStr);
    if (!isNaN(val)) {
      onUpdateBalance(account.id, isCredit ? -Math.abs(val) : val);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-[24px] max-w-md w-full p-6 shadow-[0px_15px_40px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-[#717973] uppercase tracking-wider">
            Informasi Akun
          </span>
          <button
            onClick={onClose}
            className="text-[#717973] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f4f4f2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex items-center gap-4 py-3 border-b border-[#f4f4f2]">
          <div
            className={`w-14 h-14 rounded-full ${account.bgColorClass} flex items-center justify-center shrink-0 shadow-sm`}
          >
            <span
              className={`material-symbols-outlined ${account.iconColorClass} fill text-[28px]`}
            >
              {account.icon}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#1a1c1b]">
              {account.name}
            </h3>
            <p className="text-xs text-[#717973]">{account.subtitle}</p>
          </div>
        </div>

        {/* Balance Section */}
        <div className="py-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-[#717973]">
              Saldo Saat Ini
            </span>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setNewBalanceStr(Math.abs(account.balance).toString());
              }}
              className="text-xs font-bold text-[#406651] hover:underline cursor-pointer"
            >
              {isEditing ? 'Batal Edit' : 'Ubah Saldo'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveBalance} className="mt-2 space-y-2">
              <input
                type="number"
                value={newBalanceStr}
                onChange={(e) => setNewBalanceStr(e.target.value)}
                className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-base font-bold rounded-[16px] px-3.5 py-2 focus:ring-2 focus:ring-[#406651] outline-none"
                placeholder="Nominal baru..."
                required
              />
              <button
                type="submit"
                className="w-full bg-[#406651] text-[#ffffff] font-semibold text-xs py-2 rounded-xl"
              >
                Simpan Perubahan
              </button>
            </form>
          ) : (
            <p
              className={`text-2xl font-extrabold tracking-tight ${
                isCredit ? 'text-[#ba1a1a]' : 'text-[#406651]'
              }`}
            >
              {formatRupiah(account.balance)}
            </p>
          )}
        </div>

        {/* Transactions linked to this account */}
        <div className="py-3 border-t border-[#f4f4f2]">
          <h4 className="text-xs font-bold text-[#414843] mb-2 uppercase tracking-wider">
            Riwayat Transaksi Akun Ini ({accountTxs.length})
          </h4>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {accountTxs.length === 0 ? (
              <p className="text-xs text-[#717973] py-2 text-center">
                Belum ada transaksi di akun ini.
              </p>
            ) : (
              accountTxs.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#f9f9f7] text-xs"
                >
                  <span className="font-semibold text-[#1a1c1b]">
                    {tx.title}
                  </span>
                  <span
                    className={`font-bold ${
                      tx.type === 'expense'
                        ? 'text-[#ba1a1a]'
                        : 'text-[#406651]'
                    }`}
                  >
                    {tx.type === 'expense'
                      ? `- ${formatRupiah(tx.amount)}`
                      : `+ ${formatRupiah(tx.amount)}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-[#f4f4f2] flex gap-3">
          <button
            onClick={() => {
              if (confirm(`Yakin ingin menghapus akun ${account.name}?`)) {
                onDeleteAccount(account.id);
                onClose();
              }
            }}
            className="flex-1 bg-[#ffdad6] text-[#93000a] font-semibold text-xs py-2.5 rounded-[16px] hover:bg-[#ffb4ab] transition-colors cursor-pointer"
          >
            Hapus Akun
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#406651] text-[#ffffff] font-semibold text-xs py-2.5 rounded-[16px] hover:opacity-90 transition-opacity cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

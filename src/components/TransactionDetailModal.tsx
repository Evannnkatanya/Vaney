import React from 'react';
import { formatRupiah } from '../data/initialData';
import { Account, Transaction } from '../types';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  accounts: Account[];
  onClose: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  accounts,
  onClose,
  onDeleteTransaction,
}) => {
  if (!transaction) return null;

  const accountObj = accounts.find((a) => a.id === transaction.accountId);
  const isExpense = transaction.type === 'expense';
  const isSavings = transaction.type === 'savings';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-[24px] max-w-md w-full p-6 shadow-[0px_15px_40px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-[#717973] uppercase tracking-wider">
            Detail Transaksi
          </span>
          <button
            onClick={onClose}
            className="text-[#717973] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f4f4f2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-4 border-b border-[#f4f4f2]">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
              isSavings ? 'bg-[#f0e0cb]/60 text-[#685d4c]' : transaction.categoryBgClass
            }`}
          >
            <span className="material-symbols-outlined text-[28px]">
              {isSavings ? 'savings' : transaction.categoryIcon}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#1a1c1b]">
            {transaction.title}
          </h3>
          <p
            className={`text-2xl font-extrabold mt-1 tracking-tight ${
              isSavings
                ? 'text-[#685d4c]'
                : isExpense
                ? 'text-[#ba1a1a]'
                : 'text-[#406651]'
            }`}
          >
            {isExpense || isSavings
              ? `- ${formatRupiah(transaction.amount)}`
              : `+ ${formatRupiah(transaction.amount)}`}
          </p>
        </div>

        <div className="py-4 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-[#717973]">Kategori</span>
            <span className="font-semibold text-[#1a1c1b]">
              {transaction.categoryName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#717973]">Sumber Dana</span>
            <span className="font-semibold text-[#1a1c1b]">
              {accountObj ? `${accountObj.name} (${accountObj.subtitle})` : 'Bank'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#717973]">Waktu</span>
            <span className="font-semibold text-[#1a1c1b]">
              {transaction.timeStr || transaction.date}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#717973]">Pot Anggaran</span>
            <span className="font-semibold text-[#406651] capitalize">
              {transaction.potType === 'tidak'
                ? 'Tidak Dipotong'
                : `Pot ${transaction.potType}`}
            </span>
          </div>
          {transaction.note && (
            <div className="flex justify-between items-center">
              <span className="text-[#717973]">Catatan</span>
              <span className="font-medium text-[#1a1c1b] text-right">
                {transaction.note}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[#f4f4f2] flex gap-3">
          <button
            onClick={() => {
              onDeleteTransaction(transaction.id);
              onClose();
            }}
            className="flex-1 bg-[#ffdad6] text-[#93000a] font-semibold text-xs py-3 rounded-[16px] hover:bg-[#ffb4ab] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Hapus Transaksi
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#406651] text-[#ffffff] font-semibold text-xs py-3 rounded-[16px] hover:opacity-90 transition-opacity cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Account, AccountType } from '../types';

interface ModalAddAccountProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAccount: (account: Omit<Account, 'id'>) => void;
}

export const ModalAddAccount: React.FC<ModalAddAccountProps> = ({
  isOpen,
  onClose,
  onSaveAccount,
}) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !balance.trim()) {
      alert('Mohon isi nama akun dan saldo awal.');
      return;
    }

    const numBalance = parseFloat(balance) || 0;
    const isCredit = type === 'credit';
    const finalBalance = isCredit ? -Math.abs(numBalance) : Math.abs(numBalance);

    let icon = 'account_balance';
    let bgColorClass = 'bg-[#bde2fe]';
    let textColorClass = 'text-[#41657d]';
    let iconColorClass = 'text-[#41657d]';

    if (type === 'ewallet') {
      icon = 'account_balance_wallet';
      bgColorClass = 'bg-[#c1edd1]';
      textColorClass = 'text-[#002112]';
      iconColorClass = 'text-[#002112]';
    } else if (type === 'cash') {
      icon = 'payments';
      bgColorClass = 'bg-[#f0e0cb]';
      textColorClass = 'text-[#221a0d]';
      iconColorClass = 'text-[#221a0d]';
    } else if (type === 'credit') {
      icon = 'credit_card';
      bgColorClass = 'bg-[#ffdad6]';
      textColorClass = 'text-[#93000a]';
      iconColorClass = 'text-[#ba1a1a]';
    }

    onSaveAccount({
      name: name.trim(),
      subtitle:
        subtitle.trim() ||
        (type === 'bank'
          ? 'Tabungan Utama'
          : type === 'ewallet'
          ? 'E-Wallet'
          : type === 'cash'
          ? 'Dompet Tunai'
          : 'Kartu Kredit'),
      type,
      balance: finalBalance,
      icon,
      bgColorClass,
      textColorClass,
      iconColorClass,
      isCredit,
    });

    setName('');
    setSubtitle('');
    setBalance('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-[24px] max-w-md w-full p-6 shadow-[0px_15px_40px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-[#1a1c1b]">Tambah Akun Baru</h3>
          <button
            onClick={onClose}
            className="text-[#717973] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f4f4f2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#414843] block mb-1">
              Tipe Akun
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'bank', label: 'Bank', icon: 'account_balance' },
                { id: 'ewallet', label: 'E-Wallet', icon: 'account_balance_wallet' },
                { id: 'cash', label: 'Tunai', icon: 'payments' },
                { id: 'credit', label: 'Kredit', icon: 'credit_card' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as AccountType)}
                  className={`p-2.5 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                    type === item.id
                      ? 'bg-[#7da68d] text-[#143b28] shadow-sm'
                      : 'bg-[#f4f4f2] text-[#414843] hover:bg-[#e2e3e1]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#414843] block mb-1">
              Nama Akun
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bank Mandiri / OVO"
              className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-sm font-medium rounded-[16px] px-3.5 py-2.5 focus:ring-2 focus:ring-[#406651] outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#414843] block mb-1">
              Keterangan / Nomor (Opsional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Contoh: Tabungan •••• 1234"
              className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-sm font-medium rounded-[16px] px-3.5 py-2.5 focus:ring-2 focus:ring-[#406651] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#414843] block mb-1">
              Saldo Awal (Rp)
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Contoh: 1500000"
              className="w-full bg-[#f4f4f2] border border-[#e2e3e1] text-[#1a1c1b] text-sm font-medium rounded-[16px] px-3.5 py-2.5 focus:ring-2 focus:ring-[#406651] outline-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#f4f4f2] text-[#414843] font-semibold text-sm py-3 rounded-[16px] hover:bg-[#e2e3e1] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#406651] text-[#ffffff] font-semibold text-sm py-3 rounded-[16px] hover:scale-[1.02] active:scale-98 shadow-md transition-all cursor-pointer"
            >
              Simpan Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

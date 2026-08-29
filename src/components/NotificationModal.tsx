import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Pengingat Pot Harian',
      desc: 'Sisa pot harianmu masih Rp 1.500.000 (50%). Tetap tenang dan bijak berbelanja!',
      time: '10 menit yang lalu',
      icon: 'coffee',
      bgClass: 'bg-[#c8e6ff]/40 text-[#3f627a]',
      unread: true,
    },
    {
      id: 2,
      title: 'Insight Mingguan Siap',
      desc: 'Laporan pengeluaran bulan ini telah diperbarui dengan analisis kebiasaan belanja.',
      time: '2 jam yang lalu',
      icon: 'lightbulb',
      bgClass: 'bg-[#bde2fe] text-[#41657d]',
      unread: true,
    },
    {
      id: 3,
      title: 'Target Tabungan Tercapai',
      desc: 'Selamat! Target dana darurat bulan ini sudah terpenuhi 100%.',
      time: 'Kemarin',
      icon: 'savings',
      bgClass: 'bg-[#c1edd1]/40 text-[#406651]',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-[24px] max-w-md w-full p-6 shadow-[0px_15px_40px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#1a1c1b]">
              Notifikasi & Pengingat
            </h3>
            <span className="bg-[#c1edd1] text-[#002112] text-[10px] font-bold px-2 py-0.5 rounded-full">
              2 Baru
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#717973] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f4f4f2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3 divide-y divide-[#f4f4f2]">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`pt-3 first:pt-0 flex items-start gap-3 p-2 rounded-xl transition-colors ${
                n.unread ? 'bg-[#f9f9f7]' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.bgClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {n.icon}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-[#1a1c1b]">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-[#717973] whitespace-nowrap">
                    {n.time}
                  </span>
                </div>
                <p className="text-xs text-[#414843] mt-0.5 leading-relaxed">
                  {n.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#f4f4f2] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#406651] text-[#ffffff] px-5 py-2.5 rounded-xl text-xs font-semibold hover:scale-102 transition-transform cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

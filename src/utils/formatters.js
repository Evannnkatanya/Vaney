// Utility functions for formatting Indonesian Currency, dates, and numbers

export const formatRupiah = (amount) => {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(numericAmount);
};

export const formatCompactRupiah = (amount) => {
  const numericAmount = Number(amount) || 0;
  if (Math.abs(numericAmount) >= 1_000_000_000) {
    return `Rp ${(numericAmount / 1_000_000_000).toFixed(1)} M`;
  }
  if (Math.abs(numericAmount) >= 1_000_000) {
    return `Rp ${(numericAmount / 1_000_000).toFixed(1)} JT`;
  }
  if (Math.abs(numericAmount) >= 1_000) {
    return `Rp ${(numericAmount / 1_000).toFixed(0)} rb`;
  }
  return formatRupiah(numericAmount);
};

export const formatDateIndonesian = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const getDaysInCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

export const getRemainingDaysInMonth = () => {
  const now = new Date();
  const totalDays = getDaysInCurrentMonth();
  const currentDay = now.getDate();
  return Math.max(1, totalDays - currentDay + 1);
};

export const getCurrentMonthName = () => {
  const now = new Date();
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(now);
};

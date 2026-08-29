import React, { useState } from 'react';
import { Lock, Fingerprint, Delete, AlertCircle, RefreshCw } from 'lucide-react';

interface PinLockScreenProps {
  correctPin: string;
  isBiometricEnabled?: boolean;
  onUnlock: () => void;
  onResetPin?: () => void;
}

export function PinLockScreen({
  correctPin,
  isBiometricEnabled = true,
  onUnlock,
  onResetPin,
}: PinLockScreenProps) {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const handleKeyPress = (num: string) => {
    if (isLockedOut || pinInput.length >= 4) return;
    const newPin = pinInput + num;
    setPinInput(newPin);
    setErrorMsg('');

    if (newPin.length === 4) {
      if (newPin === correctPin) {
        onUnlock();
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        setPinInput('');
        if (nextAttempts >= 3) {
          setIsLockedOut(true);
          setLockoutSeconds(30);
          setErrorMsg('Terlalu banyak percobaan. Terkunci selama 30 detik.');
          const timer = setInterval(() => {
            setLockoutSeconds((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                setIsLockedOut(false);
                setAttempts(0);
                setErrorMsg('');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setErrorMsg(`PIN salah. Sisa percobaan: ${3 - nextAttempts}`);
        }
      }
    }
  };

  const handleDelete = () => {
    if (isLockedOut) return;
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleBiometricClick = () => {
    if (isLockedOut) return;
    // Simulate web biometric prompt
    setTimeout(() => {
      onUnlock();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1c1b]/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 text-white animate-fade-in">
      {/* Header Info */}
      <div className="w-full max-w-sm flex flex-col items-center pt-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Aplikasi Terkunci</h1>
        <p className="text-sm text-neutral-400">Masukkan 4-digit PIN Vaney Anda untuk melanjutkan</p>
      </div>

      {/* PIN Indicators & Messages */}
      <div className="w-full max-w-sm flex flex-col items-center my-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pinInput.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-emerald-400 scale-110 shadow-md shadow-emerald-400/50'
                    : 'bg-neutral-700 border border-neutral-600'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 text-xs font-medium text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLockedOut && (
          <p className="text-sm font-semibold text-amber-400 mt-2">
            Coba lagi dalam {lockoutSeconds} detik
          </p>
        )}
      </div>

      {/* Keypad Grid */}
      <div className="w-full max-w-xs flex flex-col items-center pb-8">
        <div className="grid grid-cols-3 gap-4 w-full mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              disabled={isLockedOut}
              className="w-16 h-16 mx-auto rounded-full bg-neutral-800/80 hover:bg-neutral-700 active:bg-neutral-600 border border-neutral-700/50 text-xl font-bold text-white flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              {num}
            </button>
          ))}

          {/* Biometrics Button */}
          <div className="flex items-center justify-center">
            {isBiometricEnabled ? (
              <button
                onClick={handleBiometricClick}
                disabled={isLockedOut}
                title="Buka dengan Biometrik"
                className="w-16 h-16 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-40"
              >
                <Fingerprint className="w-7 h-7" />
              </button>
            ) : (
              <div className="w-16 h-16" />
            )}
          </div>

          {/* Zero Button */}
          <button
            onClick={() => handleKeyPress('0')}
            disabled={isLockedOut}
            className="w-16 h-16 mx-auto rounded-full bg-neutral-800/80 hover:bg-neutral-700 active:bg-neutral-600 border border-neutral-700/50 text-xl font-bold text-white flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          >
            0
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isLockedOut || pinInput.length === 0}
            className="w-16 h-16 mx-auto rounded-full bg-neutral-800/40 hover:bg-neutral-700/60 active:bg-neutral-600/60 text-neutral-300 flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {onResetPin && (
          <button
            onClick={onResetPin}
            className="text-xs text-neutral-400 hover:text-neutral-200 underline underline-offset-4 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Lupa PIN? Reset Keamanan</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Web Speech API Voice Recognition for Indonesian financial input

export const isVoiceSupported = () => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const parseVoiceInput = (text) => {
  if (!text) return { amount: 0, merchant: '', category: 'Makanan & Minuman' };

  const lowerText = text.toLowerCase();
  
  // Word to number mapping for common Indonesian number words
  let parsedAmount = 0;
  
  // Extract digits first (e.g. 50000, 50.000, 50rb, 50ribu)
  const digitMatch = lowerText.match(/(\d+[\.\d]*)\s*(ribu|rb|jt|juta)?/);
  if (digitMatch) {
    let numStr = digitMatch[1].replace(/\./g, '');
    let val = parseFloat(numStr);
    const multiplier = digitMatch[2];
    if (multiplier === 'ribu' || multiplier === 'rb') val *= 1000;
    if (multiplier === 'juta' || multiplier === 'jt') val *= 1000000;
    parsedAmount = val;
  } else {
    // Basic text number parsing (e.g., lima puluh ribu)
    if (lowerText.includes('lima puluh ribu') || lowerText.includes('50 ribu')) parsedAmount = 50000;
    else if (lowerText.includes('seratus ribu') || lowerText.includes('100 ribu')) parsedAmount = 100000;
    else if (lowerText.includes('dua puluh ribu') || lowerText.includes('20 ribu')) parsedAmount = 20000;
    else if (lowerText.includes('tiga puluh ribu') || lowerText.includes('30 ribu')) parsedAmount = 30000;
    else if (lowerText.includes('sepuluh ribu') || lowerText.includes('10 ribu')) parsedAmount = 10000;
  }

  // Merchant & Category matching
  let category = 'Makanan & Minuman';
  let merchant = text;

  if (lowerText.includes('bensin') || lowerText.includes('pertamax') || lowerText.includes('gojek') || lowerText.includes('grab')) {
    category = 'Transportasi';
    merchant = lowerText.includes('bensin') ? 'Pertamina' : (lowerText.includes('gojek') ? 'Gojek' : 'Grab');
  } else if (lowerText.includes('indomaret') || lowerText.includes('alfamart') || lowerText.includes('supermarket')) {
    category = 'Belanja Harian';
    merchant = lowerText.includes('indomaret') ? 'Indomaret' : 'Alfamart';
  } else if (lowerText.includes('kopi') || lowerText.includes('starbucks') || lowerText.includes('makan')) {
    category = 'Makanan & Minuman';
    merchant = lowerText.includes('starbucks') ? 'Starbucks' : 'Warung Makan';
  } else if (lowerText.includes('listrik') || lowerText.includes('pln') || lowerText.includes('air')) {
    category = 'Tagihan Listrik & Air';
    merchant = 'PLN';
  }

  return {
    amount: parsedAmount,
    merchant,
    category
  };
};

export const startVoiceRecognition = (onResult, onError) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError('Web Speech API tidak didukung di browser ini.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'id-ID'; // Indonesian Language
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const parsed = parseVoiceInput(transcript);
    if (onResult) onResult({ rawText: transcript, ...parsed });
  };

  recognition.onerror = (err) => {
    if (onError) onError(err.error || 'Gagal merekam suara');
  };

  recognition.start();
  return recognition;
};

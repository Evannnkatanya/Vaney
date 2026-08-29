/**
 * Preprocesses an image on an HTML5 canvas to maximize OCR accuracy:
 * - Rescales if too large or too small
 * - Converts to grayscale
 * - Enhances contrast & applies adaptive thresholding
 */
export async function preprocessImageForOCR(imageSource: File | Blob | string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
        return;
      }

      // Ideal width for receipt OCR is around 1200-1600px
      let width = img.width;
      let height = img.height;
      const targetWidth = 1400;

      if (width < 800 || width > 2000) {
        const ratio = targetWidth / width;
        width = targetWidth;
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // 1. Grayscale & Contrast enhancement
        // Contrast factor: 1.35
        const contrast = 1.35;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
          // Standard luminous grayscale
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          // Apply contrast
          let enhanced = factor * (gray - 128) + 128;
          enhanced = Math.max(0, Math.min(255, enhanced));

          // Mild binarization curve
          const finalVal = enhanced < 130 ? enhanced * 0.7 : Math.min(255, enhanced * 1.15);

          data[i] = finalVal;
          data[i + 1] = finalVal;
          data[i + 2] = finalVal;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Canvas image processing fallback:', err);
        resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
      }
    };

    img.onerror = () => {
      resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = URL.createObjectURL(imageSource);
    }
  });
}

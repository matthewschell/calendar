// src/utils/imageCompression.js

/**
 * Compresses an image file using the browser's native Canvas API.
 * @param {File} file - The original image file from the input.
 * @param {number} maxWidth - Max width of the output image.
 * @param {number} maxHeight - Max height of the output image.
 * @param {number} quality - JPEG compression quality (0.0 to 1.0).
 * @returns {Promise<Blob>} A promise that resolves with the compressed Blob.
 */
export const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid file type provided for compression.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio preserving dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Draw image to canvas, resizing it
          ctx.drawImage(img, 0, 0, width, height);

          // Return the raw Blob directly (prevents 'new File()' crashes on iOS/WebViews)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas compression failed to generate a blob.'));
              }
            },
            'image/jpeg',
            quality
          );
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = () => reject(new Error('Image failed to load onto canvas.'));
    };
    
    reader.onerror = () => reject(new Error('FileReader failed to read the file.'));
  });
};
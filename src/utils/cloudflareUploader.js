// src/utils/cloudflareUploader.js

const IMAGE_WORKER_URL = "https://schell-calendar-images.matthew-schell.workers.dev";
const IMAGE_UPLOAD_SECRET = "schell-calendar-2026";

/**
 * Uploads a Blob/File to the custom Cloudflare Worker R2 bucket.
 * @param {Blob|File} blob - The file to upload (compressed or raw).
 * @param {string} filename - The target filename in the bucket.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export const uploadToCloudflare = async (blob, filename) => {
  const formData = new FormData();
  formData.append('file', blob, filename);

  const response = await fetch(`${IMAGE_WORKER_URL}/upload`, {
    method: 'POST',
    headers: { 
      'X-Upload-Secret': IMAGE_UPLOAD_SECRET 
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudflare upload failed with status ${response.status}`);
  }

  const data = await response.json();
  
  if (data.url) {
    return data.url;
  } else {
    throw new Error('Cloudflare worker did not return a valid URL.');
  }
};
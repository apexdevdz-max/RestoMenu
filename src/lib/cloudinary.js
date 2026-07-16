const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ufph9dyq';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

/**
 * Upload a file (image or video) to Cloudinary using unsigned upload.
 * Returns the secure URL of the uploaded file.
 */
export async function uploadToCloudinary(file, folder = 'menu') {
  const isVideo = file.type.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', `elmawid/${folder}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Échec de l\'upload vers Cloudinary');
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    mediaType: isVideo ? 'video' : 'image',
  };
}

/**
 * Detect media type from a URL string.
 */
export function getMediaType(url) {
  if (!url) return 'image';
  const videoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.ogv'];
  const lower = url.toLowerCase();
  if (videoExts.some(ext => lower.includes(ext))) return 'video';
  if (lower.includes('/video/')) return 'video'; // Cloudinary video URL pattern
  return 'image';
}

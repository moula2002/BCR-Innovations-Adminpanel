export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  
  const API_BASE_URL = 'https://bcr-innovations-server-1.onrender.com';

  // If it's already an absolute URL (e.g. from an external source or old data)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's an old path like /uploads/...
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // If it's an ObjectId (24 char hex string)
  if (/^[a-fA-F0-9]{24}$/.test(imagePath)) {
    return `${API_BASE_URL}/api/images/${imagePath}`;
  }

  // Fallback
  return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

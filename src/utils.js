export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  
  const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://bcr-innovations-server-1.onrender.com';

  // Handle case where imagePath is an object (e.g., populated MongoDB document)
  if (typeof imagePath === 'object') {
    // If it has an _id, construct the URL using the API endpoint
    if (imagePath._id) {
      const id = typeof imagePath._id === 'object' && imagePath._id.$oid ? imagePath._id.$oid : imagePath._id;
      return `${API_BASE_URL}/api/images/${id}`;
    }
    // If it contains direct base64 data (MongoDB extended JSON format)
    if (imagePath.data && imagePath.data.$binary && imagePath.data.$binary.base64) {
      return `data:image/jpeg;base64,${imagePath.data.$binary.base64}`;
    }
    // Fallback if object is missing expected properties
    return '/placeholder-image.jpg';
  }

  if (typeof imagePath === 'string') {
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
  }

  return '/placeholder-image.jpg';
};

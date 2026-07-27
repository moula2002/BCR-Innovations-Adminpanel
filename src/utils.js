export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://bcr-innovations-server-1.onrender.com${path.startsWith('/') ? path : '/' + path}`;
};

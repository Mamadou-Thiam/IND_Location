export const optimiserImage = (url, { w = 400, h = 0, c = 'fill' } = {}) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  const transformations = [`q_auto`, `f_auto`];
  if (w) transformations.push(`w_${w}`);
  if (h) transformations.push(`h_${h}`, `c_${c}`);
  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
};

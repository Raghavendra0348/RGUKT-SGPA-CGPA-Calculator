export const SITE_URL = 'https://rgukt-sgpa-cgpa-calculator.vercel.app';

export function canonicalUrl(href = '/') {
  const url = new URL(href, SITE_URL);
  const file = decodeURIComponent(url.pathname.split('/').pop() || 'index.html');
  const legacy = file.match(/^([a-z]+)[(_](e\ds\d)\)?\.html$/);
  const key = url.searchParams.get('key') || (file === 'puc.html' ? 'puc_mpc' : legacy ? `${legacy[1]}_${legacy[2]}` : '');
  if (key) return `${SITE_URL}/calculator.html?key=${encodeURIComponent(key)}`;
  if (['index.html', 'department.html'].includes(file)) return `${SITE_URL}/`;
  return `${SITE_URL}/${file}`;
}

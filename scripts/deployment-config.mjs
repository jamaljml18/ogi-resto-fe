export function resolveFrontendApiUrl({ development = false, apiUrl } = {}) {
  const value = String(apiUrl || '').trim().replace(/[/]+$/, '');
  if (!value || value === '/api') return development ? '/api' : 'http://localhost:5000/api';
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error('NEXT_PUBLIC_API_URL harus URL backend absolut untuk build statis, misalnya https://backend.vercel.app/api.'); }
  if (!['http:','https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error('NEXT_PUBLIC_API_URL harus URL HTTP/HTTPS tanpa kredensial, query, atau fragment.');
  }
  if (parsed.pathname === '/') parsed.pathname = '/api';
  return parsed.toString().replace(/[/]+$/, '');
}

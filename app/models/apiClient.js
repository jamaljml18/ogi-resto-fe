const API_URL = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/+$/, '');
export class ApiError extends Error {
  constructor(message, status) { super(message); this.name = 'ApiError'; this.status = status; }
}
export function queryString(filters = {}) {
  const params = new URLSearchParams();
  for (const [key,value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'Semua') params.set(key,String(value));
  }
  return params.size ? '?' + params : '';
}
async function responseFor(endpoint, { token, body, signal, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', 'Bearer ' + token);
  if (body !== undefined) headers.set('Content-Type','application/json');
  const response = await fetch(API_URL + endpoint, {
    ...options, headers, body: body === undefined ? undefined : JSON.stringify(body), signal
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(data.error || data.message || 'Permintaan gagal (HTTP ' + response.status + ')', response.status);
  }
  return response;
}
export async function apiRequest(endpoint, options) {
  return (await responseFor(endpoint, options)).json();
}
export async function downloadCsv(endpoint, token, filename) {
  const response = await responseFor(endpoint, { token });
  const url = URL.createObjectURL(await response.blob());
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}

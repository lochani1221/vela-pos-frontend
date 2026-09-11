const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return null;

  return res.json();
}

export function apiGet(path) {
  return request(path, { method: 'GET' });
}

export function apiPost(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}

export function apiPut(path, body) {
  return request(path, { method: 'PUT', body: JSON.stringify(body) });
}

export function apiDelete(path) {
  return request(path, { method: 'DELETE' });
}

export function mockDelay(data, ms = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
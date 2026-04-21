const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (path: string, data: any, isMultipart = false) => {
    const headers: any = getAuthHeaders();
    let body = data;

    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  delete: async (path: string) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const text = await res.text();
    if (!res.ok) {
      try { throw new Error(JSON.parse(text).error); } catch { throw new Error(text); }
    }
    return JSON.parse(text);
  },
  patch: async (path: string, data: any) => {
    const headers: any = getAuthHeaders();
    headers['Content-Type'] = 'application/json';
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    const text = await res.text();
    if (!res.ok) {
      try { throw new Error(JSON.parse(text).error); } catch { throw new Error(text); }
    }
    return JSON.parse(text);
  },
};

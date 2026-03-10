const API_BASE = (typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : null) ?? 'http://localhost:3000';
const TOKEN_KEY = 'handicraft_token';
const REQUEST_TIMEOUT_MS = 8000;

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<{ success: true; data: T } | { success: false; message: string }> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: json.message || res.statusText || 'Request failed' };
    }
    return json as { success: true; data: T };
  } catch (err) {
    clearTimeout(timeoutId);
    const message = err instanceof Error
      ? (err.name === 'AbortError' ? 'Request timed out. Please check if the backend is running.' : err.message)
      : 'Network error';
    return { success: false, message };
  }
}

export function getApiBase(): string {
  return API_BASE;
}

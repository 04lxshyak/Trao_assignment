export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

const tokenKey = "trao.token";
const userKey = "trao.user";

export function saveSession(token: string, user: SessionUser) {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(userKey, JSON.stringify(user));
}

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(tokenKey);
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(userKey);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export function clearSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
}

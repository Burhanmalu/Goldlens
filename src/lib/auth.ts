// Simple pluggable auth client wrapper

export interface UserSession {
  email?: string;
  name?: string;
  isGuest: boolean;
}

const SESSION_KEY = 'goldlens_session';

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setGuestSession(): UserSession {
  const session: UserSession = {
    name: 'Guest Judge',
    isGuest: true,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function setAuthenticatedSession(email: string, name?: string): UserSession {
  const session: UserSession = {
    email,
    name: name || email.split('@')[0],
    isGuest: false,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

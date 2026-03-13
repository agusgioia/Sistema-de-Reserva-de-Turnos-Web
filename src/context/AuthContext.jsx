import { useState } from 'react';
import { AuthContext, STORAGE_KEY } from './auth-context';

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(session) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession());

  const login = ({ email, role = 'OWNER' }) => {
    const nextSession = {
      token: 'demo-token',
      user: {
        email,
        role,
        name: email?.split('@')[0] || 'demo',
      },
      tenant: {
        id: 1,
        name: 'Mi Negocio',
      },
      plan: {
        code: 'STARTER',
        limits: {
          employees: 2,
          services: 8,
        },
      },
      onboardingCompleted: false,
    };

    setSession(nextSession);
    persistSession(nextSession);
  };

  const completeOnboarding = ({ businessName, tenantId = 1 }) => {
    if (!session) return;

    const nextSession = {
      ...session,
      onboardingCompleted: true,
      tenant: {
        id: tenantId,
        name: businessName,
      },
    };

    setSession(nextSession);
    persistSession(nextSession);
  };

  const updatePlan = (code) => {
    if (!session) return;

    const planCatalog = {
      STARTER: { employees: 2, services: 8 },
      PRO: { employees: 10, services: 30 },
      SCALE: { employees: 999, services: 999 },
    };

    const nextSession = {
      ...session,
      plan: {
        code,
        limits: planCatalog[code] || planCatalog.STARTER,
      },
    };

    setSession(nextSession);
    persistSession(nextSession);
  };

  const logout = () => {
    setSession(null);
    persistSession(null);
  };

  const value = {
    session,
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
    completeOnboarding,
    updatePlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

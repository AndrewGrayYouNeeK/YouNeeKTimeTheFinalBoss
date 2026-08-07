import React, { createContext, useState, useContext, useCallback } from 'react';

const AuthContext = createContext();

const PROFILE_EMAIL_KEY = 'localProfileEmail';

// Local-only "auth" context. This app runs entirely in the browser with no
// backend, so there is no real authentication. We keep a lightweight local
// profile (an optional email address persisted in localStorage) so the
// Settings page can show/edit it. All async/loading/error states are stubbed
// out to keep the rest of the app's API surface unchanged.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const email = typeof window !== 'undefined' ? localStorage.getItem(PROFILE_EMAIL_KEY) : null;
    return email ? { email } : null;
  });

  const setEmail = useCallback((email) => {
    if (email) {
      localStorage.setItem(PROFILE_EMAIL_KEY, email);
      setUser({ email });
    } else {
      localStorage.removeItem(PROFILE_EMAIL_KEY);
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(PROFILE_EMAIL_KEY);
    setUser(null);
  }, []);

  const navigateToLogin = useCallback(() => {
    // No hosted auth in the local build — no-op.
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: null,
      setEmail,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tokenStore.get()) {
      setReady(true);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => tokenStore.set(null))
      .finally(() => setReady(true));
  }, []);

  const finish = useCallback(({ user: u, token }) => {
    tokenStore.set(token);
    setUser(u);
    return u;
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login: (email, password) => api.post('/auth/login', { email, password }).then(({ data }) => finish(data)),
      register: (form) => api.post('/auth/register', form).then(({ data }) => finish(data)),
      refresh: () => api.get('/auth/me').then(({ data }) => setUser(data.user)),
      logout: () => {
        tokenStore.set(null);
        setUser(null);
      },
    }),
    [user, ready, finish]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

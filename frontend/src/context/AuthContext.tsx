import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types";
import { tokenStorage } from "../api/client";
import * as authApi from "../api/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: authApi.SignupPayload) => Promise<void>;
  logout: () => void;
  hasPermission: (key: string) => boolean;
  updateCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = () => authApi.fetchCurrentUser().then(setUser);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    loadUser()
      .catch(() => tokenStorage.clear())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    await authApi.login({ email, password });
    // /auth/login doesn't return `permissions` (only /auth/me does), so
    // re-fetch immediately to avoid a stale, permission-less user object.
    await loadUser();
  };

  const signup = async (payload: authApi.SignupPayload) => {
    await authApi.signup(payload);
    await loadUser();
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateCurrentUser = (newUser: User) => {
    setUser(newUser);
  };

  const hasPermission = (key: string) => {
    if (!user) return false;
    if (user.is_super_admin) return true;
    return (user.permissions ?? []).includes(key);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, hasPermission, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

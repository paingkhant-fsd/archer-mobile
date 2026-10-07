import * as SecureStore from "expo-secure-store";
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { User } from "../api/types";

const REFRESH_TOKEN_KEY = "archer.refreshToken";
type AuthContextValue = { user: User | null; accessToken: string | null; isRestoring: boolean; login(email: string, password: string): Promise<void>; logout(): Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const storedToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (!storedToken) return;
        const tokens = await api.refresh(storedToken);
        const profile = await api.me(tokens.accessToken);
        if (!active) return;
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
        setAccessToken(tokens.accessToken); setRefreshToken(tokens.refreshToken); setUser(profile.user);
      } catch { await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY); }
      finally { if (active) setIsRestoring(false); }
    }
    void restore();
    return () => { active = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, accessToken, isRestoring,
    async login(email, password) {
      const result = await api.login(email.trim(), password);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.refreshToken);
      setUser(result.user); setAccessToken(result.accessToken); setRefreshToken(result.refreshToken);
    },
    async logout() {
      const token = refreshToken;
      setUser(null); setAccessToken(null); setRefreshToken(null);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      if (token) await api.logout(token).catch(() => undefined);
    },
  }), [accessToken, isRestoring, refreshToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

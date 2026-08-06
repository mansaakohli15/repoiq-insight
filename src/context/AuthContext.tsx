import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchProfile, loginUser, registerUser, type UserResponse } from "@/services/authApi";

type AuthContextValue = {
  user: UserResponse | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetchProfile()
      .then(setUser)
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { access_token } = await loginUser({ email, password });
    localStorage.setItem("access_token", access_token);
    const profile = await fetchProfile();
    setUser(profile);
  };

  const register = async (username: string, email: string, password: string) => {
    await registerUser({ username, email, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
import type { User } from "@media-crm/shared";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { trpc } from "../trpc";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "sessionId";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = trpc.auth.login.useMutation();
  const signupMutation = trpc.auth.signup.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  useEffect(() => {
    if (meQuery.data !== undefined) {
      setUser(meQuery.data);
      setIsLoading(false);
    } else if (meQuery.isError) {
      setUser(null);
      setIsLoading(false);
    }
  }, [meQuery.data, meQuery.isError]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginMutation.mutateAsync({ email, password });
      localStorage.setItem(SESSION_KEY, result.sessionId);
      setUser(result.user);
      utils.invalidate();
    },
    [loginMutation, utils],
  );

  const signup = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const result = await signupMutation.mutateAsync({
        email,
        password,
        displayName,
      });
      localStorage.setItem(SESSION_KEY, result.sessionId);
      setUser(result.user);
      utils.invalidate();
    },
    [signupMutation, utils],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    utils.invalidate();
  }, [logoutMutation, utils]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

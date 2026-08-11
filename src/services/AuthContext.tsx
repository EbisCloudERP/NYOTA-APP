import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { setToken, setUser, getToken, getUser, clearSession } from "./storage";

export interface UserData {
  [key: string]: unknown;
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: string;
  gender: string;
  date_of_birth: string;
  education_level: string | null;
  employment_status: string;
  roles: Array<unknown>;
  is_onboarded: boolean;
  last_login_at: string;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, user: UserData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        getToken(),
        getUser(),
      ]);
      if (storedToken && storedUser) {
        setTokenState(storedToken);
        setUserState(storedUser as UserData);
      }
    } catch {
      // session restoration failed — user stays logged out
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(async (newToken: string, newUser: UserData) => {
    setTokenState(newToken);
    setUserState(newUser);
    await Promise.all([setToken(newToken), setUser(newUser)]);
  }, []);

  const signOut = useCallback(async () => {
    setTokenState(null);
    setUserState(null);
    await clearSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        signIn,
        signOut,
      }}
    >
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

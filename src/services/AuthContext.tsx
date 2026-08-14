import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { router } from "expo-router";
import { loginOtp } from "./api";
import {
  setToken,
  setUser,
  getToken,
  getUser,
  getUuid,
  clearSession,
} from "./storage";

export interface UserData {
  [key: string]: unknown;
  uuid: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: string;
  county: string | null;
  sub_county: string | null;
  is_onboarded: boolean;
  last_login_at: string;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, user: UserData) => Promise<void>;
  signInWithOtp: (otp: string) => Promise<void>;
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

  const signInWithOtp = useCallback(
    async (otp: string) => {
      const uuid = (await getUuid()) ?? "";
      const response = await loginOtp(otp, uuid);
      await signIn(response.data.token, response.data.user as UserData);

      if (response.data.user.is_onboarded) {
        router.replace("/home");
      } else {
        router.replace({ pathname: "/kyc", params: { uuid } });
      }
    },
    [signIn]
  );

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
        signInWithOtp,
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

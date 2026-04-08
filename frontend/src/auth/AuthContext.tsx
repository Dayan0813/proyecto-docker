import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "../api";

export interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  role?: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (data: { token: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .getMe()
      .then((u) => setUser(u))
      .catch((err: any) => {
        console.error("GET ME ERROR:", err);
        if (err?.status === 401) {
          api.logout();
          setUser(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async ({ token }: { token: string }) => {
    api.setToken(token);
    try {
      const user = await api.getMe();
      setUser(user);
    } catch (err) {
      api.logout();
      setUser(null);
      throw err;
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const logout = () => {
    console.trace("se disparo");
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type UserInfo = {
  ID: number;
  Name: string;
  Email: string;
  CreateTime: string;
  Roles: string;
  RoleCode?: string;
  RoleName?: string;
};

type AuthContextType = {
  user: UserInfo | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: {children: ReactNode;}) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await window.ezsite.apis.getUserInfo();

      if (response.error) {
        setUser(null);
        return;
      }

      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refetchUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const response = await window.ezsite.apis.logout();

      if (response.error) {
        throw new Error(response.error);
      }

      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.Roles?.includes('Administrator') || false;

  const value = {
    user,
    loading,
    signOut,
    refetchUser,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
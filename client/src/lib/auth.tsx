import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './queryClient';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  sessions_held: number;
  time_remaining: number;
  bonus_test_review_time: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // Query to check authentication status
  const { data: authData, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          return data;
        } else {
          setIsAuthenticated(false);
          return null;
        }
      } catch {
        setIsAuthenticated(false);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setIsAuthenticated(true);
      queryClient.setQueryData(['/api/auth/me'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.clear();
    }
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider value={{
      user: authData?.user || null,
      isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

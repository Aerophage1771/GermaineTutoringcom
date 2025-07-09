import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

/**
 * Custom hook that redirects unauthenticated users to login page
 * Only use this on student-facing pages, not on public/marketing pages
 */
export function useAuthRedirect() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (isLoading) return;
    
    // Redirect to login if user is not authenticated
    if (!user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  return { user, isLoading, isAuthenticated: !!user };
}
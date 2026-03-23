"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User, AuthResponse } from "@/types";

export function useAuth() {
  const queryClient = useQueryClient();

  // Fetch the current user profile
  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return null;
      
      try {
        const response = await api.get<{ data: User }>("/auth/profile");
        return response.data;
      } catch (error) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth on load if it fails (likely invalid token)
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post<{ data: AuthResponse }>("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      queryClient.setQueryData(["auth", "profile"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string }) => {
      const response = await api.post<{ data: AuthResponse }>("/auth/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      queryClient.setQueryData(["auth", "profile"], data.user);
    },
  });

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    queryClient.setQueryData(["auth", "profile"], null);
    queryClient.clear(); // Clear all other queries to ensure no stale user data
  };

  return { 
    user: user || null, 
    loading, 
    login: loginMutation.mutateAsync, 
    register: registerMutation.mutateAsync, 
    logout, 
    isAuthenticated: !!user,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending
  };
}

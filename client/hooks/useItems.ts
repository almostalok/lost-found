"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Item, PaginatedResponse } from "@/types";

interface UseItemsOptions {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
}

// Custom hook to fetch items with filtering and pagination
export function useItems(options: UseItemsOptions = {}) {
  return useQuery({
    queryKey: ["items", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options.page) params.set("page", String(options.page));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.status) params.set("status", options.status);
      if (options.category) params.set("category", options.category);
      if (options.search) params.set("search", options.search);

      const qs = params.toString();
      const endpoint = qs ? `/items?${qs}` : "/items";
      
      const response = await api.get<PaginatedResponse<Item>>(endpoint);
      return response;
    }
  });
}

// Custom hook to fetch a single item by ID
export function useItem(id: string | null) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      const response = await api.get<{ data: Item, success: boolean }>(`/items/${id}`);
      return response.data;
    },
    enabled: !!id, // Only fetch if ID exists
  });
}

// Custom hook to fetch logged-in user's items
export function useMyItems() {
  return useQuery({
    queryKey: ["items", "me"],
    queryFn: async () => {
      const response = await api.get<{ data: Item[], success: boolean }>("/items/user/me");
      return response.data;
    }
  });
}

// Mutation to create a new item
export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newItem: Partial<Item>) => {
      const response = await api.post<{ data: Item, success: boolean }>("/items", newItem);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch specific queries
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

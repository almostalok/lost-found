"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Claim, ClaimStatus } from "@/types";

export function useMyClaims() {
  return useQuery({
    queryKey: ["claims", "me"],
    queryFn: async () => {
      const response = await api.get<{ data: Claim[], success: boolean }>("/claims/me");
      return response.data;
    }
  });
}

export function useItemClaims(itemId: string) {
  return useQuery({
    queryKey: ["claims", "item", itemId],
    queryFn: async () => {
      const response = await api.get<{ data: Claim[], success: boolean }>(`/claims/item/${itemId}`);
      return response.data;
    },
    enabled: !!itemId,
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, message, evidence }: { itemId: string, message: string, evidence?: string[] }) => {
      const response = await api.post<{ data: Claim, success: boolean }>("/claims", { itemId, message, evidence });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["claims", "item", variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ["claims", "me"] });
    }
  });
}

export function useUpdateClaimStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ claimId, status }: { claimId: string, status: ClaimStatus }) => {
      const response = await api.patch<{ data: Claim, success: boolean }>(`/claims/${claimId}/status`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate everything related to claims and items
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });
}
"use client";

import { useState } from "react";
import { Button } from "../ui/Button";

interface ClaimFormProps {
  onSubmit: (data: { message: string }) => void;
  isLoading?: boolean;
}

export function ClaimForm({ onSubmit, isLoading }: ClaimFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ message });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Why do you believe this is yours?
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition min-h-[120px]"
          placeholder="Describe identifying details..."
          required
        />
      </div>
      <Button type="submit" isLoading={isLoading} className="w-full">
        Submit Claim
      </Button>
    </form>
  );
}

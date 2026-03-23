import { Claim } from "@/types";

interface ClaimCardProps {
  claim: Claim;
}

export function ClaimCard({ claim }: ClaimCardProps) {
  const statusColors = {
    PENDING: "text-yellow-600 bg-yellow-50",
    APPROVED: "text-green-600 bg-green-50",
    REJECTED: "text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[claim.status]}`}>
          {claim.status}
        </span>
        <span className="text-xs text-gray-400">{new Date(claim.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-gray-700">{claim.message}</p>
    </div>
  );
}

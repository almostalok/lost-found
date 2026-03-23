"use client";

import { useItem } from "@/hooks/useItems";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Badge } from "@/components/ui/Badge";
import { useState, useEffect } from "react";
import { useItemClaims, useUpdateClaimStatus } from "@/hooks/useClaims";
import { useAuth } from "@/hooks/useAuth";

export default function ItemDetailsPage() {
  const params = useParams();
  const itemId = params.id as string;
  const { data: item, isLoading, error } = useItem(itemId);
  const { data: claimsResponse, isLoading: loadingClaims } = useItemClaims(itemId);
  const { mutateAsync: updateClaimStatus } = useUpdateClaimStatus();
  const { user } = useAuth();

  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQrUrl(`${window.location.origin}/items/${itemId}`);
    }
  }, [itemId]);

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Item Details...</div>;
  if (error || !item) return <div className="p-8 text-center text-red-500">Failed to load item.</div>;

  const isOwner = user?.id === item.userId;
  const claims = Array.isArray(claimsResponse) ? claimsResponse : (claimsResponse as any)?.data || [];

  const handleStatusChange = async (claimId: string, status: "APPROVED" | "REJECTED") => {
    try {
      await updateClaimStatus({ claimId, status });
      alert(`Claim marked as ${status}`);
    } catch (err) {
      alert("Failed to update claim.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 flex flex-col md:flex-row">
        {/* Left Side: Detail */}
        <div className="p-8 flex-1">
          <div className="flex justify-between items-start mb-4">
            <Badge variant={(item.status.toLowerCase() as any) || "default"}>
              {item.status}
            </Badge>
            <span className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
          <p className="text-gray-700 mb-6">{item.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-6">
            <div>
              <span className="block font-medium text-gray-900">Category</span>
              <span className="capitalize">{item.category}</span>
            </div>
            <div>
              <span className="block font-medium text-gray-900">Location</span>
              <span>{item.location || (item.latitude ? "Pinned on Map" : "Unknown")}</span>
            </div>
          </div>
        </div>

        {/* Right Side: QR Code Area */}
        <div className="bg-gray-50 p-8 border-l border-gray-100 flex flex-col items-center justify-center min-w-[250px]">
          <p className="font-semibold text-gray-700 mb-4 text-center">Smart Recovery QR</p>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {qrUrl && <QRCodeSVG value={qrUrl} size={150} level="H" />}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Print and attach this to your item.<br/>Anyone scanning it can contact you.
          </p>
          <button 
            onClick={() => window.print()}
            className="mt-4 text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-200"
          >
            Print QR Tag
          </button>
        </div>
      </div>

      {/* Claims Section (Only visible to OWNER) */}
      {isOwner && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Verification Claims 
            <span className="bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full">{claims.length}</span>
          </h2>
          
          {loadingClaims && <p className="text-gray-500">Loading claims...</p>}
          
          {!loadingClaims && claims.length === 0 && (
            <p className="text-gray-500 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200 text-center">
              No claims submitted for this item yet.
            </p>
          )}

          <div className="space-y-4">
            {claims.map((claim: any) => (
              <div key={claim.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                  <p className="font-medium">Claim from: {claim.claimant?.name || "Anonymous User"}</p>
                  <p className="text-gray-600 mt-1">{claim.message}</p>
                  <div className="mt-2 text-sm text-gray-400">
                    Status: <span className={`font-semibold ${claim.status === 'APPROVED' ? 'text-green-600' : claim.status === 'REJECTED' ? 'text-red-600' : 'text-orange-500'}`}>{claim.status}</span>
                  </div>
                </div>
                
                {claim.status === "PENDING" && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => handleStatusChange(claim.id, "REJECTED")}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-md font-medium hover:bg-red-100 flex-1 sm:flex-none"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleStatusChange(claim.id, "APPROVED")}
                      className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 flex-1 sm:flex-none"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
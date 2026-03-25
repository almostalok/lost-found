"use client";

import { useItem } from "@/hooks/useItems";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Badge } from "@/components/ui/Badge";
import { useState, useEffect } from "react";
import { useItemClaims, useUpdateClaimStatus } from "@/hooks/useClaims";
import { useAuth } from "@/hooks/useAuth";
import { MapView } from "@/components/maps/MapView";
import { Printer, MapPin, Tag, Calendar, User as UserIcon, ShieldAlert } from "lucide-react";

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

  if (isLoading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error || !item) return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
        <ShieldAlert className="w-10 h-10 mx-auto mb-4 opacity-80" />
        <h3 className="text-lg font-medium">Item Not Found</h3>
        <p className="text-sm mt-2">The item may have been removed or the link is invalid.</p>
      </div>
    </div>
  );

  const isOwner = user?.id === item.userId;
  const claims = Array.isArray(claimsResponse) ? claimsResponse : (claimsResponse as any)?.data || [];

  const handleStatusChange = async (claimId: string, status: "APPROVED" | "REJECTED") => {
    try {
      await updateClaimStatus({ claimId, status });
      // In a real app, you'd want toast notification here
    } catch (err) {
      alert("Failed to update claim.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="card overflow-hidden flex flex-col lg:flex-row shadow-xl shadow-black/50">
        
        {/* Left Side: Images & Map */}
        <div className="lg:w-2/5 flex flex-col border-b lg:border-b-0 lg:border-r border-neutral-800">
           {item.images?.[0] ? (
              <div className="h-72 lg:h-80 bg-neutral-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 to-transparent z-10 pointer-events-none"></div>
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
              </div>
           ) : (
             <div className="h-64 bg-neutral-800/50 flex items-center justify-center text-neutral-500 border-b border-neutral-800">
                <span className="font-medium">No Image Provided</span>
             </div>
           )}

           {(item.latitude && item.longitude) && (
              <div className="h-64 lg:h-flex-1 border-t border-neutral-800 relative z-0">
                 <MapView 
                    items={[{...item, id: item.id}]} 
                    center={[item.latitude, item.longitude]}
                    zoom={15}
                 />
              </div>
           )}
        </div>

        {/* Right Side: Details & QR Area */}
        <div className="lg:w-3/5 flex flex-col">
          <div className="p-8 flex-1">
            <div className="flex justify-between items-start mb-6">
              <Badge variant={(item.status.toLowerCase() as any) || "default"}>
                {item.status} Phase
              </Badge>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Calendar size={14} />
                <span>{new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-neutral-100 leading-tight">{item.title}</h1>
            <p className="text-neutral-300 mb-8 whitespace-pre-wrap leading-relaxed bg-neutral-900/30 p-4 rounded-xl border border-neutral-800/50">
              {item.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="flex items-center gap-3 bg-neutral-900/40 p-3 rounded-lg border border-neutral-800/50">
                 <Tag className="text-blue-500" size={18} />
                 <div>
                   <span className="block text-neutral-500 text-xs font-medium uppercase tracking-wider mb-0.5">Category</span>
                   <span className="capitalize text-neutral-200 font-medium">{item.category}</span>
                 </div>
              </div>
              <div className="flex items-center gap-3 bg-neutral-900/40 p-3 rounded-lg border border-neutral-800/50">
                 <MapPin className="text-blue-500" size={18} />
                 <div>
                   <span className="block text-neutral-500 text-xs font-medium uppercase tracking-wider mb-0.5">Location</span>
                   <span className="text-neutral-200 font-medium truncate max-w-[150px] inline-block">{item.location || "Mapped Location"}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* QR Code Action Bar */}
          <div className="bg-neutral-900 border-t border-neutral-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-md shrink-0">
                {qrUrl && <QRCodeSVG value={qrUrl} size={64} level="M" fgColor="#000000" bgColor="#FFFFFF" />}
              </div>
              <div>
                <p className="font-semibold text-neutral-200 mb-1">Smart Recovery QR</p>
                <p className="text-xs text-neutral-500 max-w-[200px]">Print & attach this code to your item. Scanners will contact you.</p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={() => window.print()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-medium transition-colors border border-neutral-700"
              >
                <Printer size={16} />
                <span>Print Tag</span>
              </button>
              
              {!isOwner && item.status.toLowerCase() !== 'claimed' && (
                <button className="flex-1 sm:flex-none btn-primary px-6 py-2.5">
                   Claim Item
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claims Section (Only visible to OWNER) */}
      {isOwner && (
        <div className="card p-8 bg-neutral-950/50 border border-blue-900/20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
            <div>
              <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
                Verification Claims 
                <span className="bg-blue-500/20 text-blue-400 text-xs font-bold py-0.5 px-2 rounded-full border border-blue-500/30">
                  {claims.length}
                </span>
              </h2>
              <p className="text-sm text-neutral-500 mt-1">Review incoming claims from other users.</p>
            </div>
          </div>
          
          {loadingClaims && (
            <div className="flex items-center gap-3 text-neutral-500">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              <span>Loading claims...</span>
            </div>
          )}
          
          {!loadingClaims && claims.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-900/20">
              <ShieldAlert className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-400 font-medium">No claims submitted yet.</p>
              <p className="text-neutral-600 text-sm mt-1">Wait for users to contact you regarding this item.</p>
            </div>
          )}

          <div className="space-y-4">
            {claims.map((claim: any) => (
              <div key={claim.id} className="bg-[#171717] border border-neutral-800 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center hover:border-neutral-700 transition-colors">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center shrink-0 border border-neutral-700">
                    <UserIcon size={18} className="text-neutral-400" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-200">{claim.claimant?.name || "Anonymous User"}</p>
                    <p className="text-neutral-400 mt-1.5 text-sm bg-neutral-900 p-3 rounded-lg border border-neutral-800/50 inline-block">{claim.message}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="text-neutral-500">Status:</span>
                      <span className={`font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        claim.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' : 
                        claim.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>{claim.status}</span>
                    </div>
                  </div>
                </div>
                
                {claim.status === "PENDING" && (
                  <div className="flex gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-neutral-800 pt-4 sm:pt-0">
                    <button 
                      onClick={() => handleStatusChange(claim.id, "REJECTED")}
                      className="px-5 py-2.5 bg-red-500/10 border border-transparent hover:border-red-500/50 text-red-500 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleStatusChange(claim.id, "APPROVED")}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 hover:shadow-lg hover:shadow-green-900/30 transition-all flex-1 sm:flex-none"
                    >
                      Approve Match
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
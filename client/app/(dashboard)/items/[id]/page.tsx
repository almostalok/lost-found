"use client";

import { useItem } from "@/hooks/useItems";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ClaimForm } from "@/components/forms/ClaimForm";
import { ChatWindow } from "@/components/ChatWindow";
import { useState, useEffect } from "react";
import { useItemClaims, useUpdateClaimStatus, useCreateClaim } from "@/hooks/useClaims";
import { useAuth } from "@/hooks/useAuth";
import { MapView } from "@/components/maps/MapView";
import { Printer, MapPin, Tag, Calendar, User as UserIcon, ShieldAlert, MessageCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function ItemDetailsPage() {
  const params = useParams();
  const itemId = params.id as string;
  const { data: item, isLoading, error } = useItem(itemId);
  const { data: claimsResponse, isLoading: loadingClaims } = useItemClaims(itemId);
  const { mutateAsync: updateClaimStatus } = useUpdateClaimStatus();
  const { mutateAsync: createClaim, isPending: isSubmittingClaim } = useCreateClaim();
  const { user } = useAuth();

  const [qrUrl, setQrUrl] = useState("");
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatClaimId, setActiveChatClaimId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQrUrl(`${window.location.origin}/items/${itemId}`);
    }
  }, [itemId]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-16 h-16 border-t border-l border-white rounded-full" />
    </div>
  );
  
  if (error || !item) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <ShieldAlert className="w-16 h-16 mb-6 opacity-30 text-white" />
      <h3 className="text-4xl font-light tracking-tighter text-white mb-2">Item Not Found</h3>
      <p className="text-neutral-500 tracking-widest uppercase text-xs">The record may have been erased.</p>
    </div>
  );

  const isOwner = user?.id === item.userId;
  const claims = Array.isArray(claimsResponse) ? claimsResponse : (claimsResponse as any)?.data || [];
  const myClaim = claims.find((c: any) => c.claimant?.id === user?.id || c.claimantId === user?.id);

  const handleStatusChange = async (claimId: string, status: "APPROVED" | "REJECTED") => {
    try {
      await updateClaimStatus({ claimId, status });
    } catch (err) {
      alert("Failed to update claim.");
    }
  };

  const handleClaimSubmit = async (data: { message: string }) => {
    try {
      await createClaim({ itemId, message: data.message });
      setIsClaimModalOpen(false);
    } catch (err) {
      alert("Failed to submit claim. You may have already claimed this item.");
    }
  };

  const openChat = (claimId: string) => {
    setActiveChatClaimId(claimId);
    setIsChatModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="space-y-12 pb-24"
    >
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] rounded-[2rem] overflow-hidden group">
        <div className="absolute inset-0 bg-black z-0">
          {item.images?.[0] ? (
            <>
              <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }}
                src={item.images[0]} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </>
          ) : (
            <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
              <span className="text-neutral-800 tracking-widest uppercase text-2xl font-black">No visual data</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-10 flex flex-col justify-end h-full">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-6">
              <Badge className="bg-white text-black border-none uppercase tracking-widest text-[10px] font-bold px-3 py-1">
                {item.status}
              </Badge>
              <span className="text-white/60 text-sm tracking-widest uppercase font-medium">
                {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white leading-none mix-blend-difference">
              {item.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Details & Map Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
        {/* Left Column: Description & Metadata */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="space-y-12">
          <div>
            <h3 className="text-neutral-500 uppercase tracking-widest text-xs font-bold mb-6">Description</h3>
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/10">
            <div>
              <span className="block text-neutral-500 text-xs uppercase tracking-widest font-bold mb-2">Category</span>
              <span className="text-white text-lg tracking-tight">{item.category}</span>
            </div>
            <div>
              <span className="block text-neutral-500 text-xs uppercase tracking-widest font-bold mb-2">Location</span>
              <span className="text-white text-lg tracking-tight">{item.location || "Unknown"}</span>
            </div>
          </div>

          {/* Actions & QR */}
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-white p-3 rounded-2xl shadow-2xl">
                {qrUrl && <QRCodeSVG value={qrUrl} size={80} level="M" fgColor="#000000" bgColor="#FFFFFF" />}
              </div>
              <div>
                <h4 className="text-white font-medium text-lg mb-1 tracking-tight">Recovery Tag</h4>
                <p className="text-neutral-500 text-sm">Print and attach to identify.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {item.status !== "CLAIMED" && (
                <button onClick={() => window.print()} className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-sm flex justify-center items-center gap-2">
                  <Printer size={16} /> Print Tag
                </button>
              )}
              
              {!isOwner && item.status.toLowerCase() !== 'claimed' && !myClaim && (
                <button onClick={() => setIsClaimModalOpen(true)} className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors text-sm flex justify-center">
                  Claim Item
                </button>
              )}
              
              {!isOwner && myClaim && (
                <button onClick={() => openChat(myClaim.id)} className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm flex justify-center items-center gap-2">
                  <MessageCircle size={16} /> Message Owner
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Map */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="relative h-[400px] lg:h-auto rounded-3xl overflow-hidden border border-white/10 bg-white/5">
          {(item.latitude && item.longitude) ? (
            <div className="absolute inset-0 grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
              <MapView items={[{...item, id: item.id}]} center={[item.latitude, item.longitude]} zoom={15} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-600 p-8 text-center">
              <MapPin size={48} strokeWidth={1} className="mb-4 opacity-50" />
              <p className="tracking-widest uppercase text-xs font-medium">Location coordinates unavailable</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Claims Section for Owner */}
      {isOwner && (
        <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="pt-24 border-t border-white/10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-medium tracking-tighter text-white mb-2">Verification Claims</h2>
              <p className="text-neutral-500">Review submissions from potential owners.</p>
            </div>
            <div className="text-6xl font-light text-white/20 tracking-tighter">
              {claims.length < 10 ? `0${claims.length}` : claims.length}
            </div>
          </div>
          
          {loadingClaims && (
            <div className="flex gap-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white/5 h-32 rounded-3xl animate-pulse flex-1" />
              ))}
            </div>
          )}
          
          {!loadingClaims && claims.length === 0 && (
            <div className="py-20 text-center border border-white/5 border-dashed rounded-3xl bg-white/5">
              <p className="text-neutral-500 uppercase tracking-widest text-sm font-medium">No claims yet</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {claims.map((claim: any) => (
              <div key={claim.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors flex flex-col justify-between group">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <UserIcon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{claim.claimant?.name || "Anonymous Member"}</p>
                      <p className="text-neutral-500 text-xs uppercase tracking-widest">{claim.status}</p>
                    </div>
                  </div>
                  <p className="text-white/80 font-light leading-relaxed mb-8 italic">"{claim.message}"</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
                  <button onClick={() => openChat(claim.id)} className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-sm flex justify-center items-center gap-2">
                    <MessageCircle size={16} /> Open Chat
                  </button>
                  
                  {claim.status === "PENDING" && (
                    <>
                      <button onClick={() => handleStatusChange(claim.id, "REJECTED")} className="py-3 px-6 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors text-sm">
                        Decline
                      </button>
                      <button onClick={() => handleStatusChange(claim.id, "APPROVED")} className="flex-1 py-3 px-6 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors text-sm">
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Modals */}
      <Modal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} title="Submit Proof">
         <div className="p-8">
          <p className="text-neutral-400 font-light mb-8 text-lg">Detail exactly why this item belongs to you. The owner will review your submission.</p>
          <ClaimForm onSubmit={handleClaimSubmit} isLoading={isSubmittingClaim} />
        </div>
      </Modal>

      <Modal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} title="Conversation">
        {activeChatClaimId && <ChatWindow claimId={activeChatClaimId} />}
      </Modal>
    </motion.div>
  );
}
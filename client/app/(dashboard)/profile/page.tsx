"use client";

import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Phone, Fingerprint, Camera, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-100 flex items-center gap-3">
          Profile Settings
        </h1>
        <p className="text-neutral-400 mt-2">
          Manage your personal information and verified identity details.
        </p>
      </div>

      <div className="bg-neutral-950/50 border border-neutral-800/60 rounded-xl overflow-hidden shadow-2xl relative">
        {/* Decorative background gradient */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
        
        <div className="p-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-10 pb-8 border-b border-neutral-800/60">
            {/* Avatar Section */}
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-neutral-900 p-1 border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                {user?.avatar ? (
                   <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 text-3xl font-medium">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-full">
                   <Camera className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500/10 text-emerald-500 p-1.5 rounded-full border border-emerald-500/20" title="Verified Account">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-neutral-100">{user?.name || "Loading..."}</h2>
              <div className="flex items-center gap-2 mt-1.5 text-neutral-400">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{user?.email || "Account not loaded"}</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Identity Verified
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form className="space-y-6 max-w-xl">
            <div className="grid grid-cols-1 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  defaultValue={user?.name || ""}
                  placeholder="Your legal name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  defaultValue={user?.phone || ""}
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-neutral-500" />
                  Aadhar Identity Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    className="w-full bg-neutral-900 border border-neutral-800/80 rounded-lg px-4 py-2.5 text-neutral-500 cursor-not-allowed font-mono tracking-wider"
                    defaultValue={user?.aadhar ? `XXXX-XXXX-${user.aadhar.slice(-4)}` : "Not provided"}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 px-2 py-1 bg-neutral-800/50 rounded pointer-events-none">
                    Verified
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">For security reasons, your governmental ID cannot be changed after registration.</p>
              </div>

            </div>

            <div className="pt-6 border-t border-neutral-800/60 flex justify-end">
              <button
                type="button"
                className="px-6 py-2.5 bg-neutral-100 text-neutral-950 font-medium rounded-lg hover:bg-white active:scale-[0.98] transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

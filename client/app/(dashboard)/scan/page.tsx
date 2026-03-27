"use client";

import { useState } from "react";
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from "next/navigation";
import { ScanLine, AlertCircle } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleScan = (text: string) => {
    try {
      // Expecting URL like: http://localhost:3000/items/cm8p1234
      const url = new URL(text);
      
      if (url.pathname.includes("/items/")) {
        router.push(url.pathname);
      } else {
        setError("Invalid QR code format. Not an item from this platform.");
      }
    } catch (err) {
      setError("Failed to parse QR code URL.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-neutral-100 flex items-center justify-center gap-3">
          <ScanLine className="text-blue-500" size={32} />
          Scan Smart Tag
        </h1>
        <p className="text-neutral-400 mt-3 max-w-md mx-auto">
          Found an item with a QR code? Scan it here to quickly view its details and contact the owner.
        </p>
      </div>

      <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="rounded-xl overflow-hidden aspect-square max-w-sm mx-auto border-2 border-neutral-800 bg-neutral-900 relative">
          <Scanner 
            onScan={(result) => result?.[0]?.rawValue && handleScan(result[0].rawValue)}
            onError={(err) => setError("Camera error or permission denied.")}
            styles={{
               container: { width: '100%', height: '100%' },
               video: { objectFit: 'cover' }
            }}
          />
          <div className="absolute inset-0 border-4 border-blue-500/30 border-dashed m-12 rounded-2xl pointer-events-none animate-pulse"></div>
        </div>
        
        <p className="text-center text-sm text-neutral-500 mt-6">
          Make sure the QR code is well-lit and fits within the camera frame.
        </p>
      </div>
    </div>
  );
}
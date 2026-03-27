"use client";

import dynamic from "next/dynamic";

export interface MapItem {
  id: string;
  title: string;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
  category?: string;
  images?: string[];
  date?: string;
  description?: string;
}

// Fallback skeleton loader
function MapFallback() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-neutral-900 rounded-xl animate-pulse border border-neutral-800">
      <p className="text-neutral-500 font-medium tracking-wide">Loading Map...</p>
    </div>
  );
}

// Dynamically import the entire map viewer with no SSR
export const MapView = dynamic(() => import("./MapViewInner"), {
  ssr: false,
  loading: () => <MapFallback />
});

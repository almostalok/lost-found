"use client";

import dynamic from "next/dynamic";

export interface MapItem {
  id: string;
  title: string;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
}

// Fallback skeleton loader
function MapFallback() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gray-100 rounded-xl animate-pulse">
      <p className="text-gray-500">Loading Map...</p>
    </div>
  );
}

// Dynamically import the entire map viewer with no SSR
export const MapView = dynamic(() => import("./MapViewInner"), {
  ssr: false,
  loading: () => <MapFallback />
});

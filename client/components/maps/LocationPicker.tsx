"use client";

import dynamic from "next/dynamic";

function MapFallback() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-neutral-900 rounded-xl animate-pulse">
      <p className="text-neutral-500">Loading Map...</p>
    </div>
  );
}

export const LocationPicker = dynamic(() => import("./LocationPickerInner"), {
  ssr: false,
  loading: () => <MapFallback />
});

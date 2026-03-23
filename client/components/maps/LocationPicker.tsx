"use client";

import dynamic from "next/dynamic";

function MapFallback() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gray-100 rounded-xl animate-pulse">
      <p className="text-gray-500">Loading Map...</p>
    </div>
  );
}

export const LocationPicker = dynamic(() => import("./LocationPickerInner"), {
  ssr: false,
  loading: () => <MapFallback />
});

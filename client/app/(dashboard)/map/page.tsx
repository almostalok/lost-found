"use client";

import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { MapView } from "@/components/maps/MapView";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MapPage() {
  const router = useRouter();
  const { data: itemsResponse, isLoading } = useItems({ limit: 100 });
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [center, setCenter] = useState<[number, number] | undefined>(undefined);
  const [filterMode, setFilterMode] = useState<"ALL" | "FOUND_NEARBY">("ALL");

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter([pos.coords.latitude, pos.coords.longitude]);
          setFilterMode("FOUND_NEARBY");
        },
        (err) => {
          console.error(err);
          alert("Could not fetch location. Please ensure location permissions are granted.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const allItems = itemsResponse?.data || [];
  // When in FOUND_NEARBY mode, only show FOUND items.
  const itemsToDisplay = filterMode === "FOUND_NEARBY" 
    ? allItems.filter(item => item.status === "FOUND")
    : allItems;

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">Global Intel Map</h1>
          <p className="text-neutral-400 mt-2">Visualizing lost and found reports across regions.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleUseMyLocation}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border ${
              filterMode === "FOUND_NEARBY" 
                ? "bg-blue-600/10 text-blue-500 border-blue-500/30" 
                : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-100"
            }`}
          >
            <MapPin size={16} />
            <span>Search Nearby Found</span>
          </button>

          <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800 shadow-sm">
            <button
              onClick={() => { setShowHeatmap(false); setFilterMode("ALL"); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                !showHeatmap && filterMode === "ALL" ? 'bg-neutral-800 text-neutral-100 shadow' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Markers
            </button>
            <button
              onClick={() => { setShowHeatmap(true); setFilterMode("ALL"); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                showHeatmap && filterMode === "ALL" ? 'bg-orange-500/10 text-orange-500 shadow border border-orange-500/20' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Risk Heatmap
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-neutral-950/50 rounded-xl shadow-2xl border border-neutral-800/60 overflow-hidden min-h-[80vh] relative">
      	{isLoading && (
          <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl">
              <span className="w-4 h-4 rounded-full border-2 border-neutral-400 border-t-neutral-100 animate-spin" />
              <span className="text-sm font-medium text-neutral-300">Syncing map data...</span>
            </div>
          </div>
        )}
        <MapView
          items={itemsToDisplay}
          center={center}
          zoom={filterMode === "FOUND_NEARBY" ? 15 : undefined}
          showHeatmap={showHeatmap}
          onMarkerClick={(item) => router.push(`/items/${item.id}`)}
        />
      </div>
    </div>
  );
}

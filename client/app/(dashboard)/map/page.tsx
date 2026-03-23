"use client";

import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { MapView } from "@/components/maps/MapView";
import { MapPin } from "lucide-react";

export default function MapPage() {
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
  // When in FOUND_NEARBY mode, only show FOUND items. (Can also filter by distance if needed, but centering + map is usually enough)
  const itemsToDisplay = filterMode === "FOUND_NEARBY" 
    ? allItems.filter(item => item.status === "FOUND")
    : allItems;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Local Discoveries</h1>
          {isLoading && <span className="text-sm text-gray-500 animate-pulse mt-1 inline-block">Loading items...</span>}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleUseMyLocation}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filterMode === "FOUND_NEARBY" ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <MapPin size={16} />
            <span>Find Found Items Nearby</span>
          </button>

          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => { setShowHeatmap(false); setFilterMode("ALL"); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                !showHeatmap && filterMode === "ALL" ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Markers
            </button>
            <button
              onClick={() => { setShowHeatmap(true); setFilterMode("ALL"); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                showHeatmap && filterMode === "ALL" ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Risk Heatmap
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[70vh]">
        <MapView
          items={itemsToDisplay}
          center={center}
          zoom={filterMode === "FOUND_NEARBY" ? 15 : undefined}
          showHeatmap={showHeatmap}
          onMarkerClick={(item) => console.log("Clicked:", item)}
        />
      </div>
    </div>
  );
}

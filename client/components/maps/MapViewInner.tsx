"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.heat";

// Fast Refresh / Strict Mode monkey-patch for Leaflet
const originalInit = (L.Map.prototype as any).initialize;
(L.Map.prototype as any).initialize = function (id: string | HTMLElement, options: any) {
  const el = typeof id === 'string' ? document.getElementById(id) : id;
  if (el && (el as any)._leaflet_id) {
    (el as any)._leaflet_id = null;
  }
  return originalInit.call(this, id, options);
};

// Setup default icons globally
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

interface MapItem {
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

const getCategoryIcon = (category?: string, status?: string) => {
  const isFound = status === "FOUND";
  const bgColor = isFound ? "bg-green-500" : "bg-red-500";
  const icon = category?.toLowerCase() === "electronics" ? "📱" :
               category?.toLowerCase() === "wallet" ? "👛" :
               category?.toLowerCase() === "keys" ? "🔑" :
               category?.toLowerCase() === "bag" ? "🎒" : "📦";

  return L.divIcon({
    className: "custom-leaflet-icon bg-transparent border-0",
    html: `<div class="w-10 h-10 rounded-full flex items-center justify-center flex-col shadow-lg border-2 border-white ${bgColor} text-white font-bold" style="transform: translate(-50%, -100%);">
             <span class="text-lg leading-none">${icon}</span>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

interface MapViewProps {
  items?: MapItem[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (item: MapItem) => void;
  showHeatmap?: boolean;
}

export default function MapViewInner({
  items = [],
  center = [28.4720, 77.4880], // Default center Knowledge Park
  zoom = 13,
  onMarkerClick,
  showHeatmap = false
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      // Clean up lingering leaflet IDs from strict mode re-renders
      setTimeout(() => {
        const containers = document.querySelectorAll('.leaflet-container');
        containers.forEach(container => {
           (container as any)._leaflet_id = null;
        });
      }, 0);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 z-0 relative shadow-inner" style={{ minHeight: '80vh' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", minHeight: '80vh', backgroundColor: '#111' }}
      >
        <MapUpdater center={center} zoom={zoom} />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark Theme">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Light Theme">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {showHeatmap && (
           <HeatmapOverlay 
             points={items
               .filter(i => i.latitude && i.longitude)
               .map(i => [i.latitude!, i.longitude!, 1])} 
           />
        )}

        {!showHeatmap && items.map((item) => (
          item.latitude && item.longitude && (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={getCategoryIcon(item.category, item.status)}
              eventHandlers={{
                click: () => onMarkerClick?.(item),
              }}
            >
              <Popup>
                <div className="text-sm p-1 max-w-[200px]">
                  {item.images?.[0] && (
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-full h-24 object-cover rounded-md mb-2" 
                    />
                  )}
                  <h3 className="font-bold text-gray-900 mb-1 leading-tight">{item.title}</h3>
                  <div className="flex gap-1 mb-1 items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${item.status === 'FOUND' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.status || "Unknown"}
                    </span>
                    {item.category && (
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                  {item.date && (
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

function HeatmapOverlay({ points }: { points: [number, number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    
    const heatLayer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.4: "blue",
        0.6: "cyan",
        0.7: "lime",
        0.8: "yellow",
        1.0: "red"
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);
  return null;
}

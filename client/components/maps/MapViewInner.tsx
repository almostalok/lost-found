"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
}

interface MapViewProps {
  items?: MapItem[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (item: MapItem) => void;
  showHeatmap?: boolean;
}

function HeatmapLayerComponent({ items }: { items: MapItem[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !items.length) return;

    const heatPoints = items
      .filter(i => i.latitude && i.longitude)
      .map(i => [i.latitude, i.longitude, 1.0]) as [number, number, number][];

    const layer = (L as any).heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.4: "blue",
        0.6: "cyan",
        0.7: "lime",
        0.8: "yellow",
        1.0: "red"
      }
    });
    
    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, items]);

  return null;
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
    <div className="w-full h-full rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showHeatmap && <HeatmapLayerComponent items={items} />}

        {!showHeatmap && items.map((item) => (
          item.latitude && item.longitude && (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              eventHandlers={{
                click: () => onMarkerClick?.(item),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.status || "Unknown status"}</p>
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
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

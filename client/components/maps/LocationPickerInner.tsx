"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

// Fast Refresh / Strict Mode monkey-patch for Leaflet
const _originalInit = (L.Map.prototype as any).initialize;
(L.Map.prototype as any).initialize = function (id: string | HTMLElement, options: any) {
  const el = typeof id === 'string' ? document.getElementById(id) : id;
  if (el && (el as any)._leaflet_id) {
    (el as any)._leaflet_id = null;
  }
  return _originalInit.call(this, id, options);
};

// Setup default icons globally
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

interface LocationPickerProps {
  defaultLocation?: [number, number];
  onSelect: (lat: number, lng: number) => void;
}

function LocationPickerEventHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerInner({ defaultLocation, onSelect }: LocationPickerProps) {
  const defaultCenter: [number, number] = [28.4720, 77.4880]; // Knowledge Park default
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
    <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <MapContainer
        center={defaultLocation || defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <MapUpdater center={defaultLocation || defaultCenter} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationPickerEventHandler onSelect={onSelect} />
        
        {defaultLocation && (
          <Marker position={defaultLocation} />
        )}
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

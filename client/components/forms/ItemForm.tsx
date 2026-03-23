"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { LocationPicker } from "../maps/LocationPicker";

interface ItemFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export function ItemForm({ onSubmit, initialData, isLoading }: ItemFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [status, setStatus] = useState(initialData?.status || "LOST");
  const [locationName, setLocationName] = useState(initialData?.location || "");
  const [latitude, setLatitude] = useState<number | undefined>(initialData?.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(initialData?.longitude);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      title, 
      description, 
      category, 
      status, 
      location: locationName, 
      latitude, 
      longitude, 
      date: new Date(date).toISOString() 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input label="Title" id="item-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide detailing features (color, brand, serial number)..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition min-h-[100px]"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              required
            >
              <option value="">Select...</option>
              <option value="Electronics">Electronics</option>
              <option value="Documents">Documents</option>
              <option value="Keys">Keys</option>
              <option value="Wallet">Wallet</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Bags">Bags</option>
              <option value="Pets">Pets</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="LOST">I Lost This</option>
              <option value="FOUND">I Found This</option>
            </select>
          </div>
        </div>

        <Input 
          label="Location Name (Optional)" 
          id="item-location" 
          value={locationName} 
          placeholder="e.g. Central Park near the fountain"
          onChange={(e) => setLocationName(e.target.value)} 
        />
        
        <Input 
          label="Date of Event" 
          id="item-date" 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Pin Location on Map</label>
        <LocationPicker 
          onSelect={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
          defaultLocation={latitude && longitude ? [latitude, longitude] : undefined}
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full py-3">
        {initialData ? "Update Item" : "Submit Report"}
      </Button>
    </form>
  );
}

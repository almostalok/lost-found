"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { LocationPicker } from "../maps/LocationPicker";
import { UploadCloud } from "lucide-react";

interface ItemFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export function ItemForm({ onSubmit, initialData, isLoading }: ItemFormProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [status, setStatus] = useState(initialData?.status || "LOST");
  const [locationName, setLocationName] = useState(initialData?.location || "");
  const [latitude, setLatitude] = useState<number | undefined>(initialData?.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(initialData?.longitude);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);

  // For visual representation of image upload step
  const [images, setImages] = useState<File[]>([]);

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) {
        handleNext();
        return;
    }
    onSubmit({ 
      title, 
      description, 
      category, 
      status, 
      location: locationName, 
      latitude, 
      longitude, 
      date: new Date(date).toISOString() 
      // Ideally, images would be uploaded to cloud storage and URLs returned here
    });
  };

  return (
    <div className="card p-6 md:p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-800 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-300"
          style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
        ></div>
        
        {[1, 2, 3].map((num) => (
          <div 
            key={num} 
            className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${
              step >= num ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-neutral-800 text-neutral-500'
            } text-sm font-bold border-4 border-[#171717]`}
          >
            {num}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-6 text-neutral-100 pb-4 border-b border-neutral-800/50">
        {step === 1 ? "Upload Images" : step === 2 ? "Item Details" : "Pin Location"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: IMAGES */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="border-2 border-dashed border-neutral-700 hover:border-blue-500/50 bg-neutral-900/30 rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-neutral-400 group-hover:text-blue-500" size={32} />
              </div>
              <p className="text-neutral-300 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-neutral-500 text-sm">SVG, PNG, JPG or GIF (max. 5MB)</p>
              <input type="file" multiple className="hidden" onChange={(e) => {
                  if (e.target.files) {
                      setImages(Array.from(e.target.files));
                  }
              }} />
            </div>
            {images.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {images.map((file, idx) => (
                        <div key={idx} className="w-20 h-20 bg-neutral-800 rounded-md overflow-hidden flex-shrink-0 border border-neutral-700">
                            <span className="text-xs text-neutral-500 p-2 break-words">{file.name}</span>
                        </div>
                    ))}
                </div>
            )}
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">What is the item?</label>
                <input 
                    className="input-field" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Blue North Face Backpack"
                    required 
                />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">Description & Identifying Features</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include serial numbers, unique scratches, contents..."
                className="input-field min-h-[120px] resize-y"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field text-neutral-200 [&>option]:bg-neutral-900"
                  required
                >
                  <option value="">Select Category...</option>
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
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field text-neutral-200 [&>option]:bg-neutral-900"
                >
                  <option value="LOST">I Lost This Item</option>
                  <option value="FOUND">I Found This Item</option>
                </select>
              </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Date of Event</label>
                <input 
                    type="date" 
                    className="input-field color-scheme-dark" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                />
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Location Name / Landmark (Optional)</label>
                <input 
                    className="input-field" 
                    value={locationName} 
                    onChange={(e) => setLocationName(e.target.value)} 
                    placeholder="e.g. Central Park near the fountain"
                />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-400">Pin Exact Location on Map</label>
              <div className="rounded-xl overflow-hidden border border-neutral-800 shadow-inner h-[300px]">
                  <LocationPicker 
                    onSelect={(lat, lng) => {
                      setLatitude(lat);
                      setLongitude(lng);
                    }}
                    defaultLocation={latitude && longitude ? [latitude, longitude] : undefined}
                  />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-neutral-800/50 mt-8">
            {step > 1 ? (
                <button 
                  type="button" 
                  onClick={handlePrev} 
                  className="px-6 py-2.5 rounded-md font-medium text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
                >
                    Back
                </button>
            ) : <div></div>}
            
            <button 
              type="submit" 
              className="btn-primary px-8 py-2.5 ml-auto flex items-center gap-2"
              disabled={isLoading}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">Processing...</span>
                ) : step === 3 ? (
                    <>{initialData ? "Update Item" : "Submit Report"}</>
                ) : (
                    "Continue"
                )}
            </button>
        </div>
      </form>
    </div>
  );
}

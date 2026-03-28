"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { LocationPicker } from "../maps/LocationPicker";
import { ArrowRight, ArrowLeft, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      title, description, category, status, location: locationName, latitude, longitude, date: new Date(date).toISOString() 
    });
  };

  const categories = ["Electronics", "Documents", "Keys", "Wallet", "Clothing", "Accessories", "Bags", "Pets", "Other"];

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
  };
  
  const [direction, setDirection] = useState(1);
  
  const goToNext = () => { setDirection(1); handleNext(); };
  const goToPrev = () => { setDirection(-1); handlePrev(); };

  return (
    <div className="w-full relative min-h-[500px] flex flex-col">
      {/* Abstract Progress Indicator */}
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-sm tracking-widest uppercase font-bold text-neutral-500 mb-1">Step {step} of 3</h2>
          <div className="text-3xl tracking-tight text-white font-medium">
            {step === 1 && "Visual Identity"}
            {step === 2 && "Core Details"}
            {step === 3 && "Location Data"}
          </div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? "w-12 bg-white" : "w-4 bg-white/20"}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col relative">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            {/* STEP 1: IMAGES */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="h-64 border border-white/10 border-dashed rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group flex flex-col items-center justify-center relative overflow-hidden">
                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                    if (e.target.files) setImages(Array.from(e.target.files));
                  }} />
                  <UploadCloud className="text-white/30 group-hover:text-white transition-colors mb-4" size={48} strokeWidth={1} />
                  <p className="text-white text-xl font-light mb-2">Select visual evidence</p>
                  <p className="text-neutral-500 uppercase tracking-widest text-xs font-medium">Drag & Drop or Browse</p>
                </div>
                {images.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {images.map((file, idx) => (
                      <div key={idx} className="w-24 h-24 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-center p-2">
                        <span className="text-xs text-neutral-400 truncate w-full">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: DETAILS */}
            {step === 2 && (
              <div className="space-y-12">
                <div className="group">
                  <input className="w-full bg-transparent text-4xl font-medium tracking-tight text-white placeholder:text-neutral-700 outline-none pb-4 border-b border-white/20 focus:border-white transition-colors" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What did you lose or find?" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-xs tracking-widest uppercase text-neutral-500 font-bold">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(c => (
                        <button key={c} type="button" onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${category === c ? "bg-white text-black font-bold" : "bg-transparent text-neutral-500 border border-white/20 hover:text-white"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs tracking-widest uppercase text-neutral-500 font-bold">Status Type</label>
                    <div className="flex gap-4">
                      {["LOST", "FOUND"].map(s => (
                        <button key={s} type="button" onClick={() => setStatus(s)} className={`flex-1 py-4 rounded-2xl text-sm tracking-widest uppercase font-bold transition-all duration-300 border ${status === s ? "bg-white text-black border-transparent" : "bg-transparent text-neutral-500 border-white/20 hover:border-white/50"}`}>
                          I {s === "LOST" ? "Lost" : "Found"} This
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs tracking-widest uppercase text-neutral-500 font-bold">Specific Details</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Engravings, scratches, specific contents..." className="w-full bg-transparent text-xl font-light text-white placeholder:text-neutral-700 outline-none pb-4 border-b border-white/20 focus:border-white transition-colors min-h-[100px] resize-none" required />
                </div>
              </div>
            )}

            {/* STEP 3: LOCATION */}
            {step === 3 && (
              <div className="space-y-10">
                <div className="group">
                  <input className="w-full bg-transparent text-3xl font-light tracking-tight text-white placeholder:text-neutral-700 outline-none pb-4 border-b border-white/20 focus:border-white transition-colors" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Landmark or general area..." />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs tracking-widest uppercase text-neutral-500 font-bold">Geographic Coordinates</label>
                    <span className="text-xs text-neutral-600 font-mono tracking-wider">{latitude?.toFixed(4) || "---"}, {longitude?.toFixed(4) || "---"}</span>
                  </div>
                  <div className="h-[400px] rounded-[2rem] overflow-hidden border border-white/10 grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
                    <LocationPicker onSelect={(lat, lng) => { setLatitude(lat); setLongitude(lng); }} defaultLocation={latitude && longitude ? [latitude, longitude] : undefined} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/10">
          {step > 1 ? (
            <button type="button" onClick={goToPrev} className="text-xs uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-colors flex items-center gap-2">
              <ArrowLeft size={14} /> Navigate Back
            </button>
          ) : <div />}
          
          <button type="button" onClick={(e) => { if (step !== 3) { e.preventDefault(); goToNext(); } else { handleSubmit(e as any); } }} disabled={isLoading} className="bg-white text-black px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors flex items-center gap-3">
            {isLoading ? "Synchronizing..." : step === 3 ? "Finalize Profile" : "Continue"}
            {step !== 3 && <ArrowRight size={14} />}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Printer, Download, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function GenRatePage() {
  const { user } = useAuth();
  
  const [itemName, setItemName] = useState("");
  const [contactName, setContactName] = useState(user?.name || "");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  
  const qrRef = useRef<HTMLDivElement>(null);

  const qrData = `Item: ${itemName || 'Not Specified'}
Owner: ${contactName}
Phone: ${contactPhone}
Email: ${contactEmail}
App: Returnly`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Ensure white background
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Returnly_Tag_${itemName || 'Item'}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-100 flex items-center gap-3">
          <QrCode className="text-blue-500" size={32} />
          Generate Smart Tag
        </h1>
        <p className="text-neutral-400 mt-2">
          Create a personalized QR code for your items before they get lost. Anyone who scans it will see your contact details.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Settings */}
        <div className="lg:w-1/2 space-y-6 bg-neutral-950/50 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-medium text-neutral-200 border-b border-neutral-800 pb-3">Tag Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Item Name (Optional)</label>
              <Input 
                type="text" 
                placeholder="e.g., MacBook Pro, Backpack" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Owner Name</label>
              <Input 
                type="text" 
                value={contactName} 
                onChange={(e) => setContactName(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Contact Number</label>
              <Input 
                type="tel" 
                value={contactPhone} 
                onChange={(e) => setContactPhone(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Email Address</label>
              <Input 
                type="email" 
                value={contactEmail} 
                onChange={(e) => setContactEmail(e.target.value)} 
              />
            </div>
          </div>
          
          <p className="text-xs text-neutral-500 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
            Note: This QR code is readable by any standard smartphone camera. The information provided above will be encoded directly into the image.
          </p>
        </div>

        {/* QR Preview */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-8 shadow-xl flex-1 flex flex-col items-center justify-center relative overflow-hidden" ref={qrRef}>
            
            {/* The Tag UI */}
            <div className="print-only-tag bg-white p-6 rounded-2xl shadow-lg border-2 border-neutral-800/10 flex flex-col items-center text-center w-full max-w-sm">
              <div className="mb-4">
                <p className="text-neutral-900 font-bold text-xl tracking-tight leading-none mb-1">IF FOUND,</p>
                <p className="text-neutral-500 text-sm font-medium tracking-widest uppercase">Please Scan Here</p>
              </div>

              <div className="bg-white p-2 rounded-xl mb-4 shadow-sm border border-neutral-100">
                <QRCodeSVG 
                  id="qr-svg"
                  value={qrData} 
                  size={180} 
                  level="M" 
                  fgColor="#000000" 
                  bgColor="#FFFFFF" 
                  includeMargin={true}
                />
              </div>

              <div className="text-neutral-800 w-full space-y-1">
                <h3 className="font-bold text-lg">{itemName || "Returnly Protected Item"}</h3>
                <p className="text-sm font-medium text-neutral-600 border-t border-neutral-200 pt-2 mt-2">
                  Owner: {contactName}
                </p>
                {(contactPhone) && <p className="text-sm text-neutral-600 flex items-center justify-center gap-1 font-mono">
                  {contactPhone}
                </p>}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 w-full text-center">
                <p className="text-[10px] text-neutral-400 font-semibold tracking-wider">SECURED BY RETURNLY</p>
              </div>
            </div>
            
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button 
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl font-medium transition-colors border border-neutral-700 shadow-sm"
            >
              <Printer size={18} />
              Print Tag
            </button>
            <button 
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-blue-900/20"
            >
              <Download size={18} />
              Save Image
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          /* Prevent parent containers from clipping the absolute positioned tag */
          * {
            overflow: visible !important;
          }
          .print-only-tag, .print-only-tag * {
            visibility: visible;
          }
          .print-only-tag {
            position: fixed !important;
            left: 50% !important;
            top: 1.5in !important;
            transform: translateX(-50%) !important;
            border: 2px dashed #999 !important;
            padding: 40px !important;
            width: 3.5in !important;
            background-color: white !important;
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 16px !important;
          }
          /* Ensure text colors are printed properly regardless of dark mode */
          .print-only-tag h3 { color: #000 !important; }
          .print-only-tag p { color: #333 !important; }
        }
      `}} />

    </div>
  );
}
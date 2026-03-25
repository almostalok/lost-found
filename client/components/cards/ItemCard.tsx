import { Badge } from "../ui/Badge";
import { Item } from "@/types";
import { MapPin, ImageOff } from "lucide-react";

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const statusVariant = item.status.toLowerCase() as "lost" | "found" | "claimed" | "returned";

  return (
    <div
      onClick={onClick}
      className="card group hover:border-neutral-700 transition-colors cursor-pointer flex flex-col h-full bg-[#171717]"
    >
      {/* Image */}
      {item.images?.[0] ? (
        <div className="h-48 bg-neutral-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent opacity-20 z-10"></div>
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
        </div>
      ) : (
        <div className="h-48 bg-neutral-900/50 flex flex-col items-center justify-center text-neutral-600 border-b border-neutral-800">
          <ImageOff className="h-8 w-8 mb-2 opacity-50" />
          <span className="text-sm font-medium">No Image</span>
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={statusVariant}>{item.status}</Badge>
          <span className="text-xs text-neutral-500 font-medium">{new Date(item.date).toLocaleDateString()}</span>
        </div>
        <h3 className="font-semibold text-lg mb-2 leading-tight text-neutral-100 group-hover:text-blue-400 transition-colors">{item.title}</h3>
        <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">{item.description}</p>
        
        {item.location && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-auto border-t border-neutral-800/60 pt-4">
            <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-500" />
            <span className="truncate font-medium">{item.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

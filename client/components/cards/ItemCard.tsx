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
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image */}
      {item.images?.[0] ? (
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="h-48 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
          <ImageOff className="h-8 w-8 mb-2 opacity-50" />
          <span className="text-sm font-medium">No Image</span>
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={statusVariant}>{item.status}</Badge>
          <span className="text-xs text-gray-500 font-medium">{new Date(item.date).toLocaleDateString()}</span>
        </div>
        <h3 className="font-bold text-lg mb-2 leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{item.description}</p>
        
        {item.location && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto border-t border-gray-100 pt-3">
            <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
            <span className="truncate font-medium">{item.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

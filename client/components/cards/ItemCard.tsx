import { Badge } from "../ui/Badge";
import { Item } from "@/types";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const statusVariant = item.status.toLowerCase() as "lost" | "found" | "claimed" | "returned";

  return (
    <motion.div
      onClick={onClick}
      whileHover="hover"
      className="group cursor-pointer flex flex-col h-full rounded-3xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/20 transition-colors duration-500 relative"
    >
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white text-black p-2 rounded-full">
          <ArrowUpRight size={18} />
        </div>
      </div>

      {/* Image Container with Zoom effect */}
      <div className="h-64 bg-black overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 z-10 transition-opacity duration-500 group-hover:opacity-60"></div>
        {item.images?.[0] ? (
          <motion.img 
            variants={{
              hover: { scale: 1.05 }
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            src={item.images[0]} 
            alt={item.title} 
            className="w-full h-full object-cover origin-center" 
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
            <span className="text-neutral-700 uppercase tracking-widest text-xs font-medium">No Visual</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-20 flex gap-2">
          <Badge variant={statusVariant} className="bg-white text-black border-none font-semibold px-3 py-1 text-xs">
            {item.status}
          </Badge>
          <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10">
            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 bg-black group-hover:bg-neutral-950 transition-colors duration-500">
        <h3 className="font-semibold text-xl mb-3 leading-tight text-white tracking-tight">{item.title}</h3>
        <p className="text-sm text-neutral-400 line-clamp-2 mb-6 font-light">{item.description}</p>
        
        {item.location && (
          <div className="mt-auto flex items-center gap-2 text-xs text-neutral-500 font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
            <span className="truncate">{item.location}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useItems } from "@/hooks/useItems";
import { ItemCard } from "@/components/cards/ItemCard";
import { ArrowRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ItemsPage() {
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { data: itemsResponse, isLoading, error } = useItems({
    status,
    category,
    search,
  });

  const categories = ["All", "Electronics", "Accessories", "Bags", "Pets", "Documents", "Other"];
  const statuses = ["All", "LOST", "FOUND", "CLAIMED"];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="space-y-20 pb-20 pt-10">
      {/* Hero Search Section */}
      <section className="relative">
        <div className="flex justify-between items-start mb-12">
          <h1 className="text-sm font-medium tracking-widest text-neutral-500 uppercase">Archive</h1>
          <Link 
            href="/items/new"
            className="group flex items-center gap-3 text-sm font-medium tracking-widest uppercase text-white hover:text-neutral-400 transition-colors"
          >
            Report Item
            <span className="bg-white text-black p-1 rounded-full group-hover:bg-neutral-400 transition-colors">
              <Plus size={16} />
            </span>
          </Link>
        </div>

        <div className="relative group">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white placeholder:text-neutral-800 focus:outline-none transition-all py-4"
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-800 group-focus-within:bg-white transition-colors duration-700"></div>
        </div>
      </section>

      {/* Minimalism Filters */}
      <section className="flex flex-col md:flex-row gap-12 items-start md:items-center justify-between border-b border-white/10 pb-8">
        <div className="space-y-4 w-full md:w-auto">
          <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-bold mb-4">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s === "All" ? "" : s)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  (status === "" && s === "All") || status === s 
                    ? "bg-white text-black" 
                    : "bg-transparent text-neutral-500 hover:text-white border border-white/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 w-full md:w-auto">
          <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-bold mb-4">Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c === "All" ? "" : c)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  (category === "" && c === "All") || category === c 
                    ? "bg-white text-black" 
                    : "bg-transparent text-neutral-500 hover:text-white border border-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="min-h-[50vh]">
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-12 h-12 border-t border-l border-white rounded-full"
            />
          </div>
        )}
        
        {error && (
          <div className="text-center py-20">
            <p className="text-xl text-red-500 font-light tracking-wide">Failed to retrieve the archive.</p>
          </div>
        )}

        {!isLoading && !error && itemsResponse?.data && itemsResponse.data.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-light text-neutral-600 tracking-tight mb-4">Nothing to display.</h3>
            <p className="text-neutral-500 text-sm tracking-widest uppercase">The archive is empty here.</p>
          </div>
        )}

        {itemsResponse?.data && itemsResponse.data.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            <AnimatePresence>
              {itemsResponse.data.map((item) => (
                <motion.div key={item.id} variants={itemVariants} layoutId={`item-${item.id}`}>
                  <Link href={`/items/${item.id}`} className="block h-full cursor-none">
                    <ItemCard item={item} />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}

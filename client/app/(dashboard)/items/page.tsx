"use client";

import { useState } from "react";
import Link from "next/link";
import { useItems } from "@/hooks/useItems";
import { ItemCard } from "@/components/cards/ItemCard";
import { Search, Plus } from "lucide-react";

export default function ItemsPage() {
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { data: itemsResponse, isLoading, error } = useItems({
    status,
    category,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-100 tracking-tight">Explore Items</h1>
          <p className="text-neutral-400 mt-1 text-sm">Discover and report lost or found items nearby.</p>
        </div>
        <Link 
          href="/items/new"
          className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} />
          Report Item
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search active listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 h-full py-2.5 bg-neutral-900/50 border-neutral-800"
          />
        </div>
        
        <select 
          className="input-field w-full md:w-40 py-2.5 bg-neutral-900/50 border-neutral-800 text-neutral-300 [&>option]:bg-neutral-900"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
          <option value="CLAIMED">Claimed</option>
        </select>
        
        <select
          className="input-field w-full md:w-48 py-2.5 bg-neutral-900/50 border-neutral-800 text-neutral-300 [&>option]:bg-neutral-900"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Bags">Bags</option>
          <option value="Pets">Pets</option>
          <option value="Documents">Documents</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-10 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
          Failed to load items. Please try again.
        </div>
      )}

      {!isLoading && !error && itemsResponse?.data && itemsResponse.data.length === 0 && (
        <div className="text-center py-16 card flex flex-col items-center justify-center border-dashed">
          <div className="w-16 h-16 bg-neutral-800/50 rounded-full flex items-center justify-center mb-4 text-neutral-500">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-medium text-neutral-200 mb-1">No items found</h3>
          <p className="text-neutral-500 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {itemsResponse?.data?.map((item) => (
          <Link href={`/items/${item.id}`} key={item.id} className="block group">
            <div className="h-full transition-transform duration-200 group-hover:-translate-y-1">
              <ItemCard item={item} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

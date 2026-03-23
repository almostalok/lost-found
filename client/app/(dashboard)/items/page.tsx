"use client";

import { useState } from "react";
import Link from "next/link";
import { useItems } from "@/hooks/useItems";
import { ItemCard } from "@/components/cards/ItemCard";

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Items</h1>
        <Link 
          href="/items/new"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Report Item
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
          <option value="CLAIMED">Claimed</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Bags">Bags</option>
          <option value="Pets">Pets</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {isLoading && <div className="text-center py-10 text-gray-500 animate-pulse">Loading items...</div>}
      
      {error && <div className="text-center py-10 text-red-500">Failed to load items.</div>}

      {!isLoading && !error && itemsResponse?.data && itemsResponse.data.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-2">No items found matching your criteria.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {itemsResponse?.data?.map((item) => (
          <Link href={`/items/${item.id}`} key={item.id}>
            <ItemCard item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
}

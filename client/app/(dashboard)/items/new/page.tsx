"use client";

import { useRouter } from "next/navigation";
import { ItemForm } from "@/components/forms/ItemForm";
import { useCreateItem } from "@/hooks/useItems";

export default function NewItemPage() {
  const router = useRouter();
  const { mutateAsync: createItem, isPending } = useCreateItem();

  const handleSubmit = async (data: any) => {
    try {
      await createItem(data);
      router.push("/items");
    } catch (err) {
      console.error("Failed to create item", err);
      // In a real app, show a toast notification here
      alert("Failed to report item. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report an Item</h1>
        <p className="text-gray-500">Provide details about the item you lost or found to help our smart matching engine connect you with others.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <ItemForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
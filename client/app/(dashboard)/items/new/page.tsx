"use client";

import { useRouter } from "next/navigation";
import { ItemForm } from "@/components/forms/ItemForm";
import { useCreateItem } from "@/hooks/useItems";
import { motion } from "framer-motion";

export default function NewItemPage() {
  const router = useRouter();
  const { mutateAsync: createItem, isPending } = useCreateItem();

  const handleSubmit = async (data: any) => {
    try {
      await createItem(data);
      router.push("/items");
    } catch (err) {
      console.error("Failed to create item", err);
      alert("Failed to report item. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto py-12 md:py-20"
    >
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-6">Create Record</h1>
        <p className="text-xl text-neutral-500 font-light max-w-2xl leading-relaxed">
          Log an artifact into the registry. Our matching engine will begin correlation analysis immediately upon submission.
        </p>
      </div>
      
      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-16 backdrop-blur-3xl shadow-2xl">
        <ItemForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </motion.div>
  );
}
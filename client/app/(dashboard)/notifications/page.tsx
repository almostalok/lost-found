"use client";

import { NotificationCard } from "@/components/cards/NotificationCard";
import { Check, Settings2, BellRing, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markAllAsRead, markAsRead } = useNotifications();
  const router = useRouter();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleCardClick = async (id: string, type: string, data: any) => {
    try {
      await markAsRead(id);
      
      // Navigate to relevant item based on payload
      if (data?.matchItemId) {
        router.push(`/items/${data.matchItemId}`);
      } else if (data?.claimId || data?.itemId) {
        router.push(`/items/${data.itemId || data.claimId}`);
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-neutral-400 mt-2">
            Stay updated on matches, claims, and activity.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={16} />
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-neutral-950/50 border border-neutral-800/60 rounded-xl p-1 shadow-2xl">
        <div className="max-h-[70vh] overflow-y-auto space-y-2 p-4 custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationCard 
                key={n.id}
                title={n.title}
                message={n.message}
                read={n.read}
                createdAt={n.createdAt}
                type={n.type as any}
                onClick={() => handleCardClick(n.id, n.type, n.data)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-neutral-800">
                <BellRing size={24} className="text-neutral-500" />
              </div>
              <h3 className="text-neutral-200 font-medium">You're all caught up!</h3>
              <p className="text-neutral-500 text-sm mt-1">No new notifications right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

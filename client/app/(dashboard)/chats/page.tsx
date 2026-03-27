"use client";

import { useMyChats } from "@/hooks/useClaims";
import { useAuth } from "@/hooks/useAuth";
import { ChatWindow } from "@/components/ChatWindow";
import { useState } from "react";
import { MessageCircle, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function ChatsPage() {
  const { data: chatsResponse, isLoading } = useMyChats();
  const { user } = useAuth();
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);

  const chats = Array.isArray(chatsResponse) ? chatsResponse : (chatsResponse as any)?.data || [];

  return (
    <div className="max-w-5xl mx-auto h-[80vh] flex flex-col pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-neutral-100 flex items-center gap-3">
          <MessageCircle className="text-blue-500" />
          Conversations
        </h1>
        <p className="text-neutral-400 mt-1">Manage your active claims and item discussions.</p>
      </div>

      <div className="flex bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex-1">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-neutral-800 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">
              No conversations found.
            </div>
          ) : (
            <div className="flex flex-col">
              {chats.map((chat: any) => {
                const isOwner = chat.item.userId === user?.id;
                const otherParty = isOwner ? chat.claimant?.name || "User" : "Item Owner";
                const lastMessage = chat.messages?.[0]?.text || "No messages yet...";

                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveClaimId(chat.id)}
                    className={`p-4 text-left border-b border-neutral-800 hover:bg-neutral-900 transition-colors ${
                      activeClaimId === chat.id ? "bg-neutral-900 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-neutral-200 truncate">{chat.item.title}</span>
                      <Badge variant={(chat.status.toLowerCase() as any) || "default"}>{chat.status}</Badge>
                    </div>
                    <div className="text-xs text-neutral-500 mb-2">
                       Chatting with: <span className="text-neutral-400 font-medium">{otherParty}</span>
                    </div>
                    <p className="text-sm text-neutral-400 truncate max-w-[200px]">
                      {lastMessage}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="w-2/3 bg-neutral-950 flex flex-col">
          {activeClaimId ? (
            <div className="h-full flex flex-col">
              {/* Replace ChatWindow so it takes up the full space properly without its internal max-height constraint */}
              <div className="flex-1 p-0 overflow-hidden [&>div]:h-full [&>div]:border-none [&>div]:rounded-none">
                 <ChatWindow claimId={activeClaimId} />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500">
              <MessageCircle size={48} className="mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
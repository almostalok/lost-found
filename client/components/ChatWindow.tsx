"use client";

import { useState, useRef, useEffect } from "react";
import { useClaimMessages, useSendMessage } from "@/hooks/useClaims";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/Button";
import { Send, User as UserIcon } from "lucide-react";

interface ChatWindowProps {
  claimId: string;
}

export function ChatWindow({ claimId }: ChatWindowProps) {
  const { user } = useAuth();
  const { data: messagesResponse, isLoading } = useClaimMessages(claimId);
  const { mutateAsync: sendMessage, isPending } = useSendMessage();
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = Array.isArray(messagesResponse) ? messagesResponse : (messagesResponse as any)?.data || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await sendMessage({ claimId, text });
      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px] border border-neutral-800 rounded-xl bg-[#111111] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg: any) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
                    {msg.sender?.avatar ? (
                      <img src={msg.sender.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon size={14} className="text-neutral-400" />
                    )}
                  </div>
                )}
                
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                  isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-200" : "text-neutral-500"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-neutral-900 border-t border-neutral-800">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#171717] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={isPending || !text.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
import { BellRing, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/Badge";

interface NotificationCardProps {
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: "MATCH_FOUND" | "CLAIM_APPROVED" | "CLAIM_REJECTED" | "GENERAL";
  onClick?: () => void;
}

export function NotificationCard({ title, message, read, createdAt, type = "GENERAL", onClick }: NotificationCardProps) {
  const getIcon = () => {
    switch (type) {
      case "MATCH_FOUND":
        return <BellRing className="text-orange-400 w-5 h-5" />;
      case "CLAIM_APPROVED":
        return <CheckCircle2 className="text-emerald-400 w-5 h-5" />;
      case "CLAIM_REJECTED":
        return <AlertCircle className="text-red-400 w-5 h-5" />;
      default:
        return <BellRing className="text-blue-400 w-5 h-5" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`relative p-5 rounded-xl border border-neutral-800/60 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-neutral-700
        ${read ? "bg-neutral-900 overflow-hidden" : "bg-neutral-800/40 shadow-lg shadow-black/20 overflow-hidden"}
      `}
    >
      {!read && (
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
      )}
      <div className="flex gap-4 items-start">
        <div className="p-2 rounded-lg bg-neutral-800/50">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="font-medium text-sm text-neutral-100">{title}</h4>
            <span className="text-xs text-neutral-400">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}

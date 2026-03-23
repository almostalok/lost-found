interface NotificationCardProps {
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function NotificationCard({ title, message, read, createdAt }: NotificationCardProps) {
  return (
    <div className={`p-4 rounded-lg border transition ${read ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100"}`}>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-medium text-sm">{title}</h4>
        <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}

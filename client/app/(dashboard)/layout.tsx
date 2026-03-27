"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HeartPulse, LayoutList, Map, UserCircle, LogOut, Bell, MessageCircle, ScanLine, QrCode } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { name: "Items", path: "/items", icon: <LayoutList size={20} /> },
    { name: "Map", path: "/map", icon: <Map size={20} /> },
    { name: "Chats", path: "/chats", icon: <MessageCircle size={20} /> },
    { name: "QR Generator", path: "/generate", icon: <QrCode size={20} /> },
    { name: "QR Scanner", path: "/scan", icon: <ScanLine size={20} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={20} /> },
    { name: "Profile", path: "/profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-100 selection:bg-neutral-800">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800/50 p-6 hidden md:flex flex-col">
        <Link href="/" className="flex items-center gap-3 mb-12 text-neutral-100 group transition-opacity hover:opacity-80">
          <HeartPulse className="h-6 w-6 text-neutral-100" />
          <span className="text-xl font-medium tracking-tight">Returnly</span>
        </Link>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-neutral-800/80 text-neutral-100 shadow-sm"
                    : "text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200"
                }`}
              >
                <div className={`${isActive ? "text-neutral-100" : "text-neutral-400"}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden md:block">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200 transition-all duration-200 group"
          >
            <LogOut size={20} className="text-neutral-400 group-hover:text-neutral-200 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto w-full h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

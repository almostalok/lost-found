"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HeartPulse, LayoutList, Map, UserCircle, LogOut, Bell, MessageCircle, ScanLine, QrCode } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

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
    { name: "Items", path: "/items", icon: <LayoutList size={18} /> },
    { name: "Map", path: "/map", icon: <Map size={18} /> },
    { name: "Chats", path: "/chats", icon: <MessageCircle size={18} /> },
    { name: "QR", path: "/generate", icon: <QrCode size={18} /> },
    { name: "Scan", path: "/scan", icon: <ScanLine size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans">
      {/* Sleek Floating Top Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full py-3 px-6 flex items-center gap-8 shadow-2xl"
        >
          <Link href="/" className="flex items-center gap-2 text-white group mr-4">
            <HeartPulse className="h-5 w-5" />
            <span className="font-semibold tracking-tight text-lg">Returnly</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 text-sm transition-all duration-300 relative ${
                    isActive ? "text-white font-medium" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute -bottom-3 left-0 right-0 h-[2px] bg-white rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <Link href="/notifications" className="text-neutral-400 hover:text-white transition-colors">
              <Bell size={20} />
            </Link>
            <Link href="/profile" className="text-neutral-400 hover:text-white transition-colors">
              <UserCircle size={20} />
            </Link>
            <button onClick={handleLogout} className="text-neutral-400 hover:text-white transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Main Content Area */}
      <main className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
}

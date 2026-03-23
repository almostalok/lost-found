"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HeartPulse, LayoutList, Map, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth(); // Assume we have a logout function in useAuth

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { name: "Items", path: "/items", icon: <LayoutList size={20} /> },
    { name: "Map", path: "/map", icon: <Map size={20} /> },
    { name: "Profile", path: "/profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-10 text-gray-900 group">
          <HeartPulse className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-bold tracking-tight">Returnly</span>
        </Link>
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                pathname.startsWith(item.path)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className={pathname.startsWith(item.path) ? "text-blue-600" : "text-gray-400"}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition"
          >
            <LogOut size={20} className="text-gray-400 group-hover:text-red-600" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto w-full h-screen">
        {children}
      </main>
    </div>
  );
}

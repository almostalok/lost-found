import Link from "next/link";
import { Search, MapPin, ShieldCheck, HeartPulse } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar area */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shadow-sm z-10">
        <div className="flex items-center gap-2">
          <HeartPulse className="text-blue-600 h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">Returnly</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center pt-24 text-center px-4 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://patterns.dev/images/pattern.svg')] opacity-5 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Lost it? <span className="text-blue-600">Find it.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light">
            The community-driven lost and found platform. Report misplaced items, search your neighborhood, and help others reunite with what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/items/new"
              className="px-8 py-4 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Report an Item
            </Link>
            <Link
              href="/items"
              className="px-8 py-4 rounded-xl border-2 border-gray-200 bg-white text-lg font-semibold hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all"
            >
              Browse Local Discoveries
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 w-full max-w-7xl mx-auto mt-24 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-6">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI-Powered Matching</h3>
            <p className="text-gray-600">
              Our system intelligently matches lost reports with found items based on categories, descriptions, and locations.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-6">
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Interactive Heatmaps</h3>
            <p className="text-gray-600">
              Use our live geographic map to see where items are frequently lost or found in your exact neighborhood.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-6">
              <ShieldCheck className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Verification</h3>
            <p className="text-gray-600">
              File exact claims, provide photographic evidence, and safely transfer belongings without sharing personal contact info.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 text-center text-gray-400">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-white opacity-80">
            <HeartPulse className="h-6 w-6" />
            <span className="text-lg font-bold">Returnly</span>
          </div>
          <p>© {new Date().getFullYear()} Returnly Lost & Found Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

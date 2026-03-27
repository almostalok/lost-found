import Link from "next/link";
import { Search, MapPin, ShieldCheck, HeartPulse, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 w-full font-sans selection:bg-neutral-800">
      {/* Navigation */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="text-blue-500 h-6 w-6" />
          <span className="text-xl font-medium tracking-wide text-neutral-100">Returnly</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-neutral-100 transition-colors duration-200">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm rounded-md bg-white text-neutral-950 font-medium hover:bg-neutral-200 transition-colors duration-200 shadow-sm"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 text-center px-6 relative overflow-hidden">
        {/* Subtle grid background for professional aesthetic */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-xs font-medium text-neutral-400 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            Seamless Property Recovery
          </div>
          
          <h1 className="text-5xl md:text-7xl font-sans tracking-tight text-neutral-50 leading-tight">
            A cohesive platform for <br className="hidden md:block"/>
            <span className="text-neutral-400">lost property workflows.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Report misplaced assets, monitor regional discoveries, and facilitate secure returns through systematic geolocation and verifiable claim processing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/items/new"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all duration-200"
            >
              Report an Item <ArrowRight size={16} />
            </Link>
            <Link
              href="/items"
              className="flex items-center justify-center px-6 py-3 rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-200 text-sm font-medium hover:border-neutral-600 hover:bg-neutral-800 transition-all duration-200"
            >
              Search Database
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 w-full max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-neutral-900/50 p-8 rounded-xl border border-neutral-800/60 flex flex-col text-left hover:border-neutral-700 transition-colors">
            <div className="bg-neutral-800 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Search className="h-6 w-6 text-neutral-300" />
            </div>
            <h3 className="text-lg font-medium text-neutral-200 mb-2">Categorical Matching</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Our automated system correlates lost reports with found inventory based on structured metadata, specific parameters, and overlapping timeframes.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-neutral-900/50 p-8 rounded-xl border border-neutral-800/60 flex flex-col text-left hover:border-neutral-700 transition-colors">
            <div className="bg-neutral-800 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <MapPin className="h-6 w-6 text-neutral-300" />
            </div>
            <h3 className="text-lg font-medium text-neutral-200 mb-2">Geospatial Tracking</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Utilize global mapping architectures to visualize loss density, trace item coordinates, and survey neighborhood status in real time.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-neutral-900/50 p-8 rounded-xl border border-neutral-800/60 flex flex-col text-left hover:border-neutral-700 transition-colors">
            <div className="bg-neutral-800 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-neutral-300" />
            </div>
            <h3 className="text-lg font-medium text-neutral-200 mb-2">Verifiable Claims</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Initiate exact claims, mandate evidentiary support, and process transfers with strict privacy protocols ensuring rightful ownership is maintained.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/60 py-10 px-6 text-center text-neutral-500 text-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-neutral-400">
            <HeartPulse className="h-5 w-5" />
            <span className="font-medium tracking-wide">Returnly</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Returnly Software Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

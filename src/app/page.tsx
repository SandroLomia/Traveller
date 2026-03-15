'use client';

import { useState } from 'react';
import ChatSection from '@/components/ChatSection';
import MapSection from '@/components/MapSection';
import ItinerarySection from '@/components/ItinerarySection';
import { Compass, Globe, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const addLocation = (newLoc: Location) => {
    setLocations((prev) => {
      // Avoid duplicates based on name and coordinates
      const exists = prev.find(
        (loc) => loc.name === newLoc.name && loc.lat === newLoc.lat && loc.lng === newLoc.lng
      );
      if (exists) return prev;
      return [...prev, newLoc];
    });
  };

  const removeLocation = (index: number) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-sky-500 p-2 rounded-lg">
                <Compass className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">Traveler<span className="text-sky-500">App</span></span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#" className="hover:text-sky-500 transition-colors">Planner</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Destinations</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Community</a>
            </nav>

            <div className="flex items-center gap-4">
              <button className="hidden sm:flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                <Globe size={16} />
                Explore
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
                className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden absolute w-full bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-64 py-4" : "max-h-0"
        )}>
          <div className="px-4 space-y-4">
            <a href="#" className="block py-2 font-medium">Planner</a>
            <a href="#" className="block py-2 font-medium">Destinations</a>
            <a href="#" className="block py-2 font-medium">Community</a>
            <button className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-semibold">
              <Globe size={16} />
              Explore
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)] min-h-[600px]">
          {/* Left Column: Chat & Itinerary */}
          <div className="lg:col-span-5 flex flex-col gap-8 overflow-hidden">
            <div className="flex-1 min-h-[400px]">
              <ChatSection onAddLocation={addLocation} />
            </div>
            <div className="h-[300px] lg:h-auto overflow-y-auto">
              <ItinerarySection locations={locations} onRemoveLocation={removeLocation} />
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="lg:col-span-7 h-[400px] lg:h-full">
            <MapSection locations={locations} />
          </div>
        </div>
      </main>

      {/* Mobile-only padding for better scrolling */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
}

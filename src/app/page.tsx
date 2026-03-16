'use client';

import { useMemo, useState } from 'react';
import ChatSection from '@/components/ChatSection';
import MapSection from '@/components/MapSection';
import ItinerarySection from '@/components/ItinerarySection';
import { Compass, Globe, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/lib/useSoundEffects';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

const navItems = [
  { label: 'Planner', href: '#planner' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Community', href: '#community' },
];

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { play } = useSoundEffects();

  const addLocation = (newLoc: Location) => {
    setLocations((prev) => {
      const exists = prev.find(
        (loc) => loc.name === newLoc.name && loc.lat === newLoc.lat && loc.lng === newLoc.lng
      );
      if (exists) return prev;
      play('success');
      return [...prev, newLoc];
    });
  };

  const removeLocation = (index: number) => {
    play('remove');
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const communityCount = useMemo(() => locations.length + 2400, [locations.length]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans app-texture">
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="#planner" className="flex items-center gap-2" onClick={() => play('tap')}>
              <div className="bg-sky-500 p-2 rounded-lg">
                <Compass className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">Traveler<span className="text-sky-500">App</span></span>
            </a>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => play('tap')} className="hover:text-sky-500 transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <a
                href="#destinations"
                onClick={() => play('open')}
                className="hidden sm:flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                <Globe size={16} />
                Explore
              </a>

              <button
                onClick={() => {
                  play('tap');
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                aria-label="Toggle Menu"
                className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'md:hidden absolute w-full bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300 overflow-hidden',
            isMobileMenuOpen ? 'max-h-64 py-4' : 'max-h-0'
          )}
        >
          <div className="px-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2 font-medium"
                onClick={() => {
                  play('tap');
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#destinations"
              onClick={() => {
                play('open');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              <Globe size={16} />
              Explore
            </a>
          </div>
        </div>
      </header>

      <main id="planner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)] min-h-[600px]">
          <div className="lg:col-span-5 flex flex-col gap-8 overflow-hidden">
            <div className="flex-1 min-h-[400px]">
              <ChatSection onAddLocation={addLocation} onInteractionSound={() => play('tap')} />
            </div>
            <div className="h-[300px] lg:h-auto overflow-y-auto">
              <ItinerarySection locations={locations} onRemoveLocation={removeLocation} />
            </div>
          </div>

          <section id="destinations" className="lg:col-span-7 h-[400px] lg:h-full scroll-mt-24">
            <MapSection locations={locations} onMarkerFocus={() => play('open')} />
          </section>
        </div>

        <section id="community" className="mt-8 scroll-mt-24">
          <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl">
            <h2 className="text-xl font-bold">Community Snapshot</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">{communityCount.toLocaleString()} travelers are sharing itineraries right now.</p>
          </div>
        </section>
      </main>

      <div className="h-20 lg:hidden"></div>
    </div>
  );
}

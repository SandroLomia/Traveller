'use client';

import { Calendar, MapPin, Trash2 } from 'lucide-react';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

interface ItinerarySectionProps {
  locations: Location[];
  onRemoveLocation: (index: number) => void;
}

export default function ItinerarySection({ locations, onRemoveLocation }: ItinerarySectionProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-sky-500" size={24} />
          <h2 className="text-xl font-bold">Your Itinerary</h2>
        </div>
        <span className="text-sm bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 px-3 py-1 rounded-full font-medium">
          {locations.length} Places
        </span>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-zinc-500">Your planned stops will appear here.</p>
          <p className="text-xs text-zinc-400 mt-1">Add locations through the AI chat!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {locations.map((loc, index) => (
            <div
              key={`${loc.name}-${index}`}
              className="group flex items-start gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-sky-200 dark:hover:border-sky-900/50 bg-zinc-50 dark:bg-zinc-800/50 transition-all"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                {index < locations.length - 1 && (
                  <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-700 my-1"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{loc.name}</h3>
                {loc.description && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {loc.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>Lat: {loc.lat.toFixed(2)}, Lng: {loc.lng.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRemoveLocation(index)}
                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

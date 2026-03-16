'use client';

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useCallback, useState, useEffect } from 'react';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

interface MapSectionProps {
  locations: Location[];
  onMarkerFocus?: () => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 20,
  lng: 0,
};

export default function MapSection({ locations, onMarkerFocus }: MapSectionProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((loc) => {
        bounds.extend({ lat: loc.lat, lng: loc.lng });
      });
      map.fitBounds(bounds);

      if (locations.length === 1) {
        map.setZoom(12);
      }
    }
  }, [map, locations]);

  if (!isLoaded)
    return (
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center rounded-2xl animate-pulse">
        <p className="text-zinc-500">Loading Map...</p>
      </div>
    );

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={2}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          gestureHandling: 'greedy',
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ color: '#1e293b' }, { saturation: -15 }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#0f172a' }, { lightness: 8 }],
            },
            {
              featureType: 'landscape.natural',
              elementType: 'geometry',
              stylers: [{ color: '#334155' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#475569' }],
            },
            {
              featureType: 'all',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#0f172a' }],
            },
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#cbd5e1' }],
            },
          ],
        }}
      >
        {locations.map((loc, index) => (
          <Marker
            key={`${loc.name}-${index}`}
            position={{ lat: loc.lat, lng: loc.lng }}
            onClick={() => {
              onMarkerFocus?.();
              setSelectedPlace(loc);
            }}
            animation={window.google.maps.Animation.DROP}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-2 text-zinc-900">
              <h3 className="font-bold">{selectedPlace.name}</h3>
              {selectedPlace.description && <p className="text-sm mt-1">{selectedPlace.description}</p>}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

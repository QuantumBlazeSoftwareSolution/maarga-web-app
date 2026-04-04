'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat: string;
  initialLng: string;
  stationName: string;
  onSave: (lat: string, lng: string) => void;
}

export default function MapPickerModal({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  stationName,
  onSave,
}: MapPickerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [currentCoords, setCurrentCoords] = useState({
    lat: initialLat,
    lng: initialLng,
  });

  // Fix Leaflet's default marker icon issue in Next.js
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    if (isOpen && mapContainerRef.current && !mapRef.current) {
      const startLat = parseFloat(currentCoords.lat);
      const startLng = parseFloat(currentCoords.lng);

      // Initialize map
      mapRef.current = L.map(mapContainerRef.current).setView(
        [startLat, startLng],
        18,
      );

      // Add Google Hybrid Satellite Tier (Satellite + Labels)
      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        maxZoom: 20,
      }).addTo(mapRef.current);

      // Add initial marker
      markerRef.current = L.marker([startLat, startLng], {
        draggable: true,
      }).addTo(mapRef.current);

      // Handle Map Click to Move Marker
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const newLat = lat.toFixed(6);
        const newLng = lng.toFixed(6);

        markerRef.current?.setLatLng([lat, lng]);
        setCurrentCoords({ lat: newLat, lng: newLng });
      });

      // Handle Marker Drag
      markerRef.current.on('dragend', (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        setCurrentCoords({
          lat: position.lat.toFixed(6),
          lng: position.lng.toFixed(6),
        });
      });
    }

    if (!isOpen && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#E1E4E9]"
        style={{
          boxShadow: '10px 10px 20px #bebec0, -10px -10px 20px #ffffff',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h3 className="text-xl font-black text-slate-700">
              Coordinate Adjustment
            </h3>
            <p className="text-xs font-medium text-slate-400">
              Click on the map to re-pin: {stationName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-rose-500"
            style={{
              boxShadow:
                'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff',
            }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Map Container */}
        <div className="p-6">
          <div
            className="relative overflow-hidden rounded-2xl border-4 border-white/50"
            style={{
              boxShadow: '6px 6px 12px #c0c3c8, -6px -6px 12px #ffffff',
            }}
          >
            <div
              ref={mapContainerRef}
              style={{ height: '400px', width: '100%', cursor: 'crosshair' }}
            />

            {/* Coordinate Overlay */}
            <div className="absolute bottom-4 left-4 z-1000 rounded-xl border border-white bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
              <div className="flex gap-4">
                <div>
                  <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Latitude
                  </p>
                  <p className="font-mono text-xs font-bold text-slate-700">
                    {currentCoords.lat}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Longitude
                  </p>
                  <p className="font-mono text-xs font-bold text-slate-700">
                    {currentCoords.lng}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-1000 animate-pulse rounded-lg bg-emerald-500 px-3 py-1 text-[9px] font-black tracking-widest text-white uppercase shadow-lg">
              Google Satellite Mode
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 p-6 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-4 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:scale-[1.01] active:shadow-[inset_4px_4px_10px_#c0c3c8,inset_-4px_-4px_10px_#ffffff]"
            style={{
              boxShadow: '6px 6px 12px #c0c3c8, -6px -6px 12px #ffffff',
            }}
          >
            Cancel
          </button>
          <button
            className="flex-1 rounded-xl py-4 text-xs font-black tracking-widest text-blue-600 uppercase transition-all hover:scale-[1.01] active:shadow-[inset_4px_4px_10px_#c0c3c8,inset_-4px_-4px_10px_#ffffff]"
            style={{
              boxShadow: '6px 6px 12px #c0c3c8, -6px -6px 12px #ffffff',
            }}
            onClick={() => {
              onSave(currentCoords.lat, currentCoords.lng);
              onClose();
            }}
          >
            Update Coordinates
          </button>
        </div>
      </div>
    </div>
  );
}

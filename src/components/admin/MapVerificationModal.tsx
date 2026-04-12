'use client';

import React from 'react';
import { toast } from 'sonner';

interface MapVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: string;
  lng: string;
  stationName: string;
}

export default function MapVerificationModal({
  isOpen,
  onClose,
  lat,
  lng,
  stationName,
}: MapVerificationModalProps) {
  if (!isOpen) return null;

  // Google Maps Iframe URL with Satellite view (t=k), Zoom (z=18), and Pinpoint (q=lat,lng)
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=19&ie=UTF8&iwloc=&output=embed`;

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
            <h3 className="text-xl font-black text-slate-700">{stationName}</h3>
            <p className="text-xs font-medium text-slate-400">
              Google Satellite Verification · {lat}, {lng}
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

        {/* Map Container - Google Iframe */}
        <div className="p-6">
          <div
            className="relative overflow-hidden rounded-2xl border-4 border-white/50"
            style={{
              boxShadow: '6px 6px 12px #c0c3c8, -6px -6px 12px #ffffff',
            }}
          >
            <iframe
              title="Google Map Verification"
              width="100%"
              height="450"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={mapUrl}
              className="bg-slate-200"
            />
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
            Close
          </button>
          <button
            className="flex-1 rounded-xl py-4 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.01] active:shadow-[inset_4px_4px_10px_#c0c3c8,inset_-4px_-4px_10px_#ffffff]"
            style={{
              boxShadow: '6px 6px 12px #c0c3c8, -6px -6px 12px #ffffff',
            }}
            onClick={() => {
              toast.success('Ready for Backend Implementation!');
            }}
          >
            Verify Location
          </button>
        </div>
      </div>
    </div>
  );
}

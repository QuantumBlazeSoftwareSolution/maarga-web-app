'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  districtEnumItems,
  stationStatusEnumItems,
} from '@/src/lib/db/schema/enum';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const BASE = '#E1E4E9';
const nmOuter = '6px 6px 12px #c0c3c8, -6px -6px 12px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';

interface MapVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  station: any;
  onSave: (data: {
    name: string;
    address: string;
    district: string;
    status: string;
    latitude: string;
    longitude: string;
  }) => Promise<void>;
}

export default function MapVerificationModal({
  isOpen,
  onClose,
  station,
  onSave,
}: MapVerificationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    district: '',
    status: '',
    latitude: '',
    longitude: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleMapUrl, setGoogleMapUrl] = useState('');

  // Leaflet Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Fix Leaflet marker icon issue
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
    if (station && isOpen) {
      const lat = station.latitude || '0';
      const lng = station.longitude || '0';
      setFormData({
        name: station.name || '',
        address: station.address || '',
        district: station.district || 'Colombo',
        status: station.status || 'pending',
        latitude: lat,
        longitude: lng,
      });
      setGoogleMapUrl(
        `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=19&ie=UTF8&iwloc=&output=embed`,
      );
    }
  }, [station, isOpen]);

  // Leaflet Map Initialization & Cleanup
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Only initialize if not already done
    if (!mapRef.current) {
      const lat = parseFloat(formData.latitude) || 6.9271;
      const lng = parseFloat(formData.longitude) || 79.8612;

      mapRef.current = L.map(mapContainerRef.current).setView([lat, lng], 18);

      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        maxZoom: 20,
      }).addTo(mapRef.current);

      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
        mapRef.current,
      );

      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        markerRef.current?.setLatLng([lat, lng]);
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
      });

      markerRef.current.on('dragend', (e) => {
        const position = e.target.getLatLng();
        setFormData((prev) => ({
          ...prev,
          latitude: position.lat.toFixed(6),
          longitude: position.lng.toFixed(6),
        }));
      });
    }

    // Move marker if formData coordinates change (e.g. on load) 
    // without resetting map zoom/center manually unless we want to.
    const currentLat = parseFloat(formData.latitude);
    const currentLng = parseFloat(formData.longitude);
    if (!isNaN(currentLat) && !isNaN(currentLng) && markerRef.current) {
      markerRef.current.setLatLng([currentLat, currentLng]);
    }

    return () => {
      // We only want to cleanup when the modal fully closes
      // or when the station ID changes (handled by caller possibly)
    };
  }, [isOpen]); 

  // Separate effect for full cleanup on close
  useEffect(() => {
    if (!isOpen && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.latitude && formData.latitude !== '0') {
      const timeoutId = setTimeout(() => {
        setGoogleMapUrl(
          `https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&t=k&z=19&ie=UTF8&iwloc=&output=embed`,
        );
      }, 500); // 500ms debounce
      return () => clearTimeout(timeoutId);
    }
  }, [formData.latitude, formData.longitude]);

  if (!isOpen || !station) return null;

  const handleVerify = async () => {
    if (!formData.name || !formData.address) {
      toast.error('Name and address are required.');
      return;
    }

    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="relative flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-[#E1E4E9]"
        style={{
          boxShadow: '10px 10px 20px #bebec0, -10px -10px 20px #ffffff',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-700">
              Verified Station Identity
            </h3>
            <p className="text-xs font-medium text-slate-400">
              Full verification & coordinate sync · {formData.latitude},{' '}
              {formData.longitude}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-rose-500"
            style={{ boxShadow: nmPressed }}
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

        {/* Content */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-2 lg:flex-row">
          {/* Left: Form */}
          <div className="flex shrink-0 flex-col gap-4 lg:w-[28%]">
            <div className="space-y-1.5 focus-within:scale-[1.01] transition-transform">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Station Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{ boxShadow: nmPressed, background: BASE }}
                className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
              />
            </div>

            <div className="space-y-1.5 focus-within:scale-[1.01] transition-transform">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                style={{ boxShadow: nmPressed, background: BASE }}
                className="h-24 w-full resize-none appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
                >
                  {districtEnumItems.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
                >
                  {stationStatusEnumItems.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Latitude
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.latitude}
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 font-mono text-xs font-bold text-slate-400 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Longitude
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.longitude}
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 font-mono text-xs font-bold text-slate-400 outline-none"
                />
              </div>
            </div>

            <p className="mt-2 text-[10px] leading-relaxed font-medium text-slate-400">
              * Move the pin on the Leaflet map above to update coordinates.
            </p>
          </div>

          {/* Right: Maps */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Top: Leaflet Picker */}
            <div className="relative min-h-[250px] lg:min-h-[300px] flex-1 group">
              <div
                className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-white/50 transition-all duration-300 group-hover:border-blue-200/50"
                style={{ boxShadow: nmOuter }}
              >
                <div
                  ref={mapContainerRef}
                  className="h-full w-full cursor-crosshair"
                />
                <div className="absolute top-4 left-4 z-[1000] rounded-lg bg-blue-600 px-3 py-1.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg">
                  Leaflet Interactive Picker
                </div>
              </div>
            </div>

            {/* Bottom: Google Satellite */}
            <div className="relative min-h-[400px] lg:min-h-[500px] flex-1 group">
              <div
                className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-white/50 transition-all duration-300 group-hover:border-emerald-200/50"
                style={{ boxShadow: nmOuter }}
              >
                {googleMapUrl && (
                  <iframe
                    title="Google Map Verification"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={googleMapUrl}
                    className="bg-slate-200"
                  />
                )}

                <div className="absolute top-4 right-4 z-10 flex gap-2 pointer-events-none">
                  <div className="rounded-lg bg-emerald-500 px-3 py-1.5 text-[9px] font-black tracking-widest text-white uppercase shadow-lg">
                    Google Satellite
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 gap-4 p-6 pt-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-4 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:scale-[1.01] active:shadow-[inset_4px_4px_10px_#c0c3c8,inset_-4px_-4px_10px_#ffffff]"
            style={{ boxShadow: nmOuter }}
          >
            Discard Changes
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleVerify}
            className="flex-1 rounded-xl py-4 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.01] active:shadow-[inset_4px_4px_10px_#c0c3c8,inset_-4px_-4px_10px_#ffffff] disabled:opacity-50"
            style={{ boxShadow: isSubmitting ? nmPressed : nmOuter }}
          >
            {isSubmitting ? 'Updating...' : 'Update & Verify Station'}
          </button>
        </div>
      </div>
    </div>
  );
}
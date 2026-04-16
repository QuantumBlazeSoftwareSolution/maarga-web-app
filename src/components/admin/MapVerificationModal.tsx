'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { districtEnumItems, stationStatusEnumItems } from '@/src/lib/db/schema/enum';

const BASE = '#E1E4E9';
const nmOuter = '6px 6px 12px #c0c3c8, -6px -6px 12px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';

interface MapVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  station: any;
  onSave: (data: { name: string; address: string; district: string; status: string }) => Promise<void>;
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name || '',
        address: station.address || '',
        district: station.district || 'Colombo',
        status: station.status || 'pending',
      });
    }
  }, [station]);

  if (!isOpen || !station) return null;

  // Google Maps Iframe URL with Satellite view (t=k), Zoom (z=18), and Pinpoint (q=lat,lng)
  const mapUrl = `https://maps.google.com/maps?q=${station.latitude},${station.longitude}&t=k&z=19&ie=UTF8&iwloc=&output=embed`;

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
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-[#E1E4E9]"
        style={{
          boxShadow: '10px 10px 20px #bebec0, -10px -10px 20px #ffffff',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-700">Verify Station Identity</h3>
            <p className="text-xs font-medium text-slate-400">
              Check satellite view and update details before approving · {station.latitude}, {station.longitude}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-rose-500"
            style={{ boxShadow: nmPressed }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content: 2-Column Layout */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-2 lg:flex-row">
          
          {/* Left Form Edit Details */}
          <div className="flex shrink-0 flex-col gap-4 lg:w-1/3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Station Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ boxShadow: nmPressed, background: BASE }}
                className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ boxShadow: nmPressed, background: BASE }}
                className="h-20 w-full resize-none appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                style={{ boxShadow: nmPressed, background: BASE }}
                className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
              >
                {districtEnumItems.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Operational Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ boxShadow: nmPressed, background: BASE }}
                className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
              >
                {stationStatusEnumItems.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Map */}
          <div className="flex-1 shrink-0">
            <div
              className="h-[300px] w-full overflow-hidden rounded-2xl border-4 border-white/50 lg:h-full lg:min-h-[400px]"
              style={{ boxShadow: nmOuter }}
            >
              <iframe
                title="Google Map Verification"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={mapUrl}
                className="bg-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex shrink-0 gap-4 p-6 pt-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-4 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:scale-[1.01] active:shadow-[inset_4px_4px_10px_#c0c3c8,inset_-4px_-4px_10px_#ffffff]"
            style={{ boxShadow: nmOuter }}
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleVerify}
            className="flex-1 rounded-xl py-4 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.01] disabled:opacity-50 active:shadow-[inset_4px_4px_10px_#c0c3c8,inset_-4px_-4px_10px_#ffffff]"
            style={{ boxShadow: isSubmitting ? nmPressed : nmOuter }}
          >
            {isSubmitting ? 'Verifying...' : 'Verify & Approve'}
          </button>
        </div>
      </div>
    </div>
  );
}

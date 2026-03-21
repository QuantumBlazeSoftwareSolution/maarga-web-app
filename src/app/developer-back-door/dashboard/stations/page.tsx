'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import FloatingNav from '@/src/components/admin/FloatingNav';
import { getStations, createStation, updateStation, deleteStation } from '@/src/lib/actions/station';

// ── Neumorphism tokens ─────────────────────────────────
const BASE = '#E1E4E9';
const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StationItem = any; // Will match the DB schema

export default function StationManagementPage() {
  const [stations, setStations] = useState<StationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    longitude: '',
    latitude: '',
    type: 'fuel',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<StationItem>>({});

  const fetchStations = async () => {
    setIsLoading(true);
    const res = await getStations();
    if (res.success && res.data) {
      setStations(res.data);
    } else {
      toast.error('Failed to load stations');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Disable strict effect state rule, as we are calling an async function for initial data load
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStations();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.longitude || !formData.latitude) {
      toast.error('All fields are required');
      return;
    }

    setIsSubmitting(true);
    const res = await createStation({
      name: formData.name,
      address: formData.address,
      longitude: formData.longitude,
      latitude: formData.latitude,
      // @ts-expect-error Valid enum from schema
      type: formData.type,
    });

    if (res.success) {
      toast.success(res.message);
      setFormData({ name: '', address: '', longitude: '', latitude: '', type: 'fuel' });
      fetchStations();
    } else {
      toast.error(res.message);
    }
    setIsSubmitting(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editData.name || !editData.address || !editData.longitude || !editData.latitude) {
      toast.error('Fields cannot be empty');
      return;
    }

    const res = await updateStation(id, editData);
    if (res.success) {
      toast.success(res.message);
      setEditingId(null);
      fetchStations();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this station?')) return;
    const res = await deleteStation(id);
    if (res.success) {
      toast.success(res.message);
      fetchStations();
    } else {
      toast.error(res.message);
    }
  };

  const startEditing = (station: StationItem) => {
    setEditingId(station.id);
    setEditData({
      name: station.name,
      address: station.address,
      longitude: station.longitude,
      latitude: station.latitude,
      type: station.type,
    });
  };

  return (
    <div
      className="min-h-screen font-sans selection:bg-blue-200"
      style={{ background: BASE, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
    >
      <FloatingNav />

      {/* ── Top Navigation ─────────────────────────────── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-8 py-4" style={{ background: BASE }}>
        <div className="flex items-center gap-4">
          <div style={{ boxShadow: nmSubtle, background: BASE }} className="flex h-9 w-9 items-center justify-center rounded-xl">
            <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-700">Station Hub</span>
            <span className="ml-2 text-xs text-slate-400">/ Management</span>
          </div>
        </div>
      </nav>

      {/* ── Main Layout ───────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-8 pb-12 pt-6 flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Register Card */}
        <div className="lg:w-1/3 flex-shrink-0">
          <div style={{ boxShadow: nmOuter, background: BASE }} className="rounded-2xl p-8 sticky top-24">
            <div className="mb-6">
              <h2 className="text-lg font-black text-slate-700">Register Station</h2>
              <p className="mt-1 text-xs font-medium text-slate-400 leading-relaxed">
                Manually add a new station to the platform network.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-300 transition-all placeholder-slate-400"
                  placeholder="e.g. Lanka IOC"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-300 transition-all placeholder-slate-400"
                  placeholder="Street, City"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lat</label>
                  <input
                    type="text"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    style={{ boxShadow: nmPressed, background: BASE }}
                    className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-300 transition-all font-mono placeholder-slate-400"
                    placeholder="6.9271"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lng</label>
                  <input
                    type="text"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    style={{ boxShadow: nmPressed, background: BASE }}
                    className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-300 transition-all font-mono placeholder-slate-400"
                    placeholder="79.8612"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Station Type</label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ boxShadow: nmPressed, background: BASE }}
                    className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  >
                    <option value="fuel">Fuel (Petrol/Diesel)</option>
                    <option value="gas">Gas Station</option>
                    <option value="ev">EV Charging</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ boxShadow: isSubmitting ? nmPressed : nmOuter, background: BASE }}
                  className="w-full rounded-xl py-4 text-sm font-black uppercase tracking-widest text-emerald-600 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Station'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:w-2/3 flex-1 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-700">All Stations</h2>
            <div style={{ boxShadow: nmPressed, background: BASE }} className="flex items-center gap-2 rounded-xl px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">{stations.length} Total</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : stations.length === 0 ? (
            <div style={{ boxShadow: nmPressed, background: BASE }} className="rounded-2xl p-12 text-center">
              <p className="text-sm font-bold text-slate-500">No stations registered yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stations.map((station) => (
                <div key={station.id} style={{ boxShadow: nmOuter, background: BASE }} className="rounded-2xl p-6 transition-all">
                  {editingId === station.id ? (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="w-full appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
                        />
                        <select
                          value={editData.type || 'fuel'}
                          onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="w-full appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
                        >
                          <option value="fuel">Fuel</option>
                          <option value="gas">Gas</option>
                          <option value="ev">EV</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={editData.address || ''}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        style={{ boxShadow: nmPressed, background: BASE }}
                        className="w-full appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editData.latitude || ''}
                          onChange={(e) => setEditData({ ...editData, latitude: e.target.value })}
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="w-full appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none font-mono"
                        />
                        <input
                          type="text"
                          value={editData.longitude || ''}
                          onChange={(e) => setEditData({ ...editData, longitude: e.target.value })}
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="w-full appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none font-mono"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleUpdate(station.id)}
                          style={{ boxShadow: nmSubtle, background: BASE }}
                          className="flex-1 rounded-xl py-2 text-xs font-black uppercase text-blue-600 transition-all hover:scale-[1.02] active:scale-95"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{ boxShadow: nmSubtle, background: BASE }}
                          className="flex-1 rounded-xl py-2 text-xs font-black uppercase text-slate-500 transition-all hover:scale-[1.02] active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-slate-700 truncate">{station.name}</h3>
                          <span style={{ boxShadow: nmPressed, background: BASE }} className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {station.type}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 truncate">{station.address}</p>
                        <span className="text-[10px] font-bold font-mono text-slate-400 block pt-1">
                          {station.latitude}, {station.longitude}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => startEditing(station)}
                          style={{ boxShadow: nmSubtle, background: BASE }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:text-blue-500 active:scale-95"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(station.id)}
                          style={{ boxShadow: nmSubtle, background: BASE }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:text-rose-500 active:scale-95"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

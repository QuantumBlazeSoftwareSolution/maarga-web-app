'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import FloatingNav from '@/src/components/admin/FloatingNav';
import {
  getStations,
  createStation,
  updateStation,
  deleteStation,
  syncAllStationItems,
  updateStationCoordinates,
} from '@/src/lib/actions/station';
import { Station } from '@/src/lib/db/schema/station';

const MapVerificationModal = dynamic(
  () => import('@/src/components/admin/MapVerificationModal'),
  { ssr: false },
);

const MapPickerModal = dynamic(
  () => import('@/src/components/admin/MapPickerModal'),
  { ssr: false },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StationWithItems = Station & {
  items: {
    itemId: string;
    name: string;
    itemType: string;
    availability: string;
  }[];
};

// ── Neumorphism tokens ─────────────────────────────────
const BASE = '#E1E4E9';
const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

type StationItem = any; // Will match the DB schema from the action response

export default function StationManagementPage() {
  const [stations, setStations] = useState<StationWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Verification State
  const [verificationStation, setVerificationStation] =
    useState<Station | null>(null);

  // Coordinate Picker State
  const [pickingStation, setPickingStation] = useState<Station | null>(null);

  // Verification Switch Simulation State
  const [verifiedStations, setVerifiedStations] = useState<Record<string, boolean>>({});

  const toggleVerification = (id: string) => {
    setVerifiedStations(prev => ({ ...prev, [id]: !prev[id] }));
    const currentState = !verifiedStations[id];
    toast.info(`Station verification ${currentState ? 'ENABLED' : 'DISABLED'}`, {
      description: 'UI state updated (Simulation Mode)',
    });
  };

  // Tab Filtering State
  const [activeTab, setActiveTab] = useState("All");

  // Custom Drag Scroll Refs & State
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftValue = useRef(0);
  const draggedDistance = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - tabsRef.current.offsetLeft;
    scrollLeftValue.current = tabsRef.current.scrollLeft;
    draggedDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll speed multiplier
    tabsRef.current.scrollLeft = scrollLeftValue.current - walk;
    draggedDistance.current = Math.abs(x - startX.current);
  };

  const handleMouseUp = () => {
    setIsDragging(true); // Wait, should be false
    setIsDragging(false);
  };

  // Derive unique station names for tabs
  const uniqueNames = useMemo(() => {
    const names = Array.from(new Set(stations.map(s => s.name)))
      .filter(name => name && name.trim() !== "")
      .sort();
    return ["All", ...names];
  }, [stations]);

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

  const handleSyncItems = async () => {
    const confirmSync = confirm(
      'This will link ALL stations to their matching global items (Fuel/Gas/EV). This may take a few seconds. Proceed?',
    );
    if (!confirmSync) return;

    setIsLoading(true);
    const res = await syncAllStationItems();
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
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
    if (
      !formData.name ||
      !formData.address ||
      !formData.longitude ||
      !formData.latitude
    ) {
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
      setFormData({
        name: '',
        address: '',
        longitude: '',
        latitude: '',
        type: 'fuel',
      });
      fetchStations();
    } else {
      toast.error(res.message);
    }
    setIsSubmitting(false);
  };

  const handleUpdate = async (id: string) => {
    if (
      !editData.name ||
      !editData.address ||
      !editData.longitude ||
      !editData.latitude
    ) {
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

  const startEditing = (station: StationWithItems) => {
    setEditingId(station.id);
    setEditData({ ...station });
  };

  const filteredStations = stations.filter((station) => {
    const matchesSearch = 
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "All" || station.name === activeTab;
    
    return matchesSearch && matchesTab;
  });

  return (
    <div
      className="min-h-screen font-sans selection:bg-blue-200"
      style={{
        background: BASE,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      <FloatingNav />

      {/* ── Top Navigation ─────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: BASE }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{ boxShadow: nmSubtle, background: BASE }}
            className="flex h-9 w-9 items-center justify-center rounded-xl"
          >
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-700">
              Station Hub
            </span>
            <span className="ml-2 text-xs text-slate-400">/ Logistics</span>
          </div>
        </div>
        <button
          onClick={handleSyncItems}
          disabled={isLoading}
          style={{ boxShadow: nmSubtle, background: BASE }}
          className="rounded-xl px-5 py-2.5 text-xs font-black tracking-widest whitespace-nowrap text-emerald-600 uppercase transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {isLoading ? 'Syncing...' : 'Sync All Items'}
        </button>
      </nav>

      {/* ── Main Layout ───────────────────────────────────────── */}
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-8 pt-6 pb-12 lg:flex-row">
        {/* Left Column: Register Card */}
        <div className="shrink-0 lg:w-1/3">
          <div
            style={{ boxShadow: nmOuter, background: BASE }}
            className="sticky top-24 rounded-2xl p-8"
          >
            <div className="mb-6">
              <h2 className="text-lg font-black text-slate-700">
                Register Station
              </h2>
              <p className="mt-1 text-xs leading-relaxed font-medium text-slate-400">
                Manually add a new station to the platform network.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 placeholder-slate-400 transition-all outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g. Lanka IOC"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 placeholder-slate-400 transition-all outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Street, City"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Lat
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    style={{ boxShadow: nmPressed, background: BASE }}
                    className="w-full appearance-none rounded-xl border-0 px-4 py-3 font-mono text-sm font-bold text-slate-700 placeholder-slate-400 transition-all outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="6.9271"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Lng
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    style={{ boxShadow: nmPressed, background: BASE }}
                    className="w-full appearance-none rounded-xl border-0 px-4 py-3 font-mono text-sm font-bold text-slate-700 placeholder-slate-400 transition-all outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="79.8612"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Station Type
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    style={{ boxShadow: nmPressed, background: BASE }}
                    className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 transition-all outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="fuel">Fuel (Petrol/Diesel)</option>
                    <option value="gas">Gas Station</option>
                    <option value="ev">EV Charging</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    boxShadow: isSubmitting ? nmPressed : nmOuter,
                    background: BASE,
                  }}
                  className="w-full rounded-xl py-4 text-sm font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Station'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="flex flex-1 flex-col lg:w-2/3">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-700">All Stations</h2>
            <div
              style={{ boxShadow: nmPressed, background: BASE }}
              className="flex items-center gap-2 rounded-xl px-4 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase">
                {searchQuery
                  ? `${filteredStations.length} FOUND`
                  : `${stations.length} TOTAL`}
              </span>
            </div>
          </div>

          {/* ── Search Bar ─────────────────────────────────────── */}
          <div className="group relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 transition-colors group-focus-within:text-blue-500">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search station name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ boxShadow: nmPressed, background: BASE }}
              className="w-full appearance-none rounded-2xl border-0 py-4 pr-4 pl-11 text-sm font-bold text-slate-700 placeholder-slate-400 transition-all outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* ── Seamless Sticky Station Brand Tabs ─────────────────────────────── */}
          {uniqueNames.length > 2 && (
            <div 
              style={{ background: BASE }}
              className="sticky top-[72px] z-30 mb-4 border-b border-slate-200/40 transition-all duration-300"
            >
              <div 
                ref={tabsRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`flex w-full items-center gap-2 overflow-x-auto scrollbar-hide select-none py-4 px-4 transition-all
                  ${isDragging ? 'cursor-grabbing active:scale-[0.99]' : 'cursor-grab'}`}
              >
                {uniqueNames.map((name) => {
                  const count = name === "All" ? stations.length : stations.filter(s => s.name === name).length;
                  const isActive = activeTab === name;
                  
                  return (
                    <button
                      key={name}
                      onClick={(e) => {
                        // Prevent click if we were dragging
                        if (draggedDistance.current > 5) return;
                        setActiveTab(name);
                      }}
                      style={{ 
                        boxShadow: isActive ? nmPressed : nmSubtle,
                        background: BASE 
                      }}
                      className={`group relative shrink-0 flex items-center gap-2 rounded-2xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300
                        ${isActive 
                          ? 'text-emerald-600' 
                          : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {/* Smooth Neon Indicator */}
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                      )}
                      
                      {name}
                      
                      {/* Compact Badge */}
                      <span className={`ml-1 rounded-lg px-2 py-0.5 text-[10px] transition-all duration-300
                        ${isActive 
                          ? 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20' 
                          : 'bg-slate-200 text-slate-400 group-hover:bg-slate-300/50'}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : filteredStations.length === 0 ? (
            <div
              style={{ boxShadow: nmPressed, background: BASE }}
              className="rounded-2xl p-12 text-center"
            >
              <p className="text-sm font-bold text-slate-500">
                {searchQuery
                  ? `No stations matching "${searchQuery}"`
                  : 'No stations registered yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStations.map((station) => (
                <div
                  key={station.id}
                  style={{ boxShadow: nmOuter, background: BASE }}
                  className="rounded-2xl p-6 transition-all"
                >
                  {editingId === station.id ? (
                    <div className="animate-in fade-in space-y-4 duration-200">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editData.name || ''}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="w-full appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
                        />
                        <select
                          value={editData.type || 'fuel'}
                          onChange={(e) =>
                            setEditData({ ...editData, type: e.target.value })
                          }
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
                        onChange={(e) =>
                          setEditData({ ...editData, address: e.target.value })
                        }
                        style={{ boxShadow: nmPressed, background: BASE }}
                        className="w-full appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editData.latitude || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              latitude: e.target.value,
                            })
                          }
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="w-full appearance-none rounded-xl border-0 px-4 py-2 font-mono text-sm font-bold text-slate-700 outline-none"
                        />
                        <input
                          type="text"
                          value={editData.longitude || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              longitude: e.target.value,
                            })
                          }
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="w-full appearance-none rounded-xl border-0 px-4 py-2 font-mono text-sm font-bold text-slate-700 outline-none"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleUpdate(station.id)}
                          style={{ boxShadow: nmSubtle, background: BASE }}
                          className="flex-1 rounded-xl py-2 text-xs font-black text-blue-600 uppercase transition-all hover:scale-[1.02] active:scale-95"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{ boxShadow: nmSubtle, background: BASE }}
                          className="flex-1 rounded-xl py-2 text-xs font-black text-slate-500 uppercase transition-all hover:scale-[1.02] active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-3">
                          <h3 className="truncate text-[17px] font-bold tracking-tight text-slate-700">
                            {station.name}
                          </h3>
                          <span
                            style={{ boxShadow: nmPressed, background: BASE }}
                            className="rounded-full px-3 py-1 text-[9px] leading-none font-black tracking-widest text-slate-500 uppercase"
                          >
                            {station.type}
                          </span>
                        </div>
                        <p className="truncate text-[13px] font-medium text-slate-500">
                          {station.address}
                        </p>

                        {/* Station Items List */}
                        {station.items && station.items.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {station.items.map((item) => (
                              <span
                                key={item.itemId}
                                style={{
                                  boxShadow: nmPressed,
                                  background: BASE,
                                }}
                                className="rounded-lg bg-white/30 px-2 py-0.5 text-[10px] font-bold text-violet-500 lowercase"
                              >
                                {item.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <span className="block pt-1 font-mono text-[11px] font-bold text-slate-400">
                          {station.latitude}, {station.longitude}
                        </span>
                      </div>

                      {/* Right Side Controls: Switch + Actions */}
                      <div className="flex flex-col items-end gap-3 pr-2">
                        {/* Verification Switch (TOP) */}
                        <div className="flex flex-col items-end min-w-[76px]">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVerification(station.id);
                            }}
                            className={`relative flex h-8 w-20 cursor-pointer items-center rounded-full p-1 transition-all duration-500 ease-out
                              ${verifiedStations[station.id] 
                                ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6),inset_0_0_10px_rgba(0,0,0,0.1)]' 
                                : 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6),inset_0_0_10px_rgba(0,0,0,0.1)]'}`}
                          >
                            {/* Labels Layer (Opposite side of thumb) */}
                            <div className="absolute inset-0 flex items-center justify-between px-3.5 pointer-events-none z-10 text-white">
                              <span className={`text-[9.5px] font-black tracking-tight transition-all duration-500 ${verifiedStations[station.id] ? 'opacity-100 scale-110 drop-shadow-md translate-x-0' : 'opacity-0 scale-75 translate-x-2'}`}>ON</span>
                              <span className={`text-[9.5px] font-black tracking-tight transition-all duration-500 ${!verifiedStations[station.id] ? 'opacity-100 scale-110 drop-shadow-md translate-x-0' : 'opacity-0 scale-75 -translate-x-2'}`}>OFF</span>
                            </div>
                            
                            {/* Circular Sliding Thumb */}
                            <div 
                              className={`h-6 w-6 rounded-full bg-white shadow-[2px_2px_10px_rgba(0,0,0,0.2)] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center justify-center
                                ${verifiedStations[station.id] ? 'translate-x-12' : 'translate-x-0'}`}
                            >
                              <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${verifiedStations[station.id] ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons (BOTTOM) */}
                        <div 
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="flex items-center gap-1 rounded-2xl p-1.5"
                        >
                          <button
                            title="Verify on Satellite"
                            onClick={() => setVerificationStation(station)}
                            className="group flex h-9 w-9 items-center justify-center rounded-xl text-emerald-500 transition-all hover:bg-white/50 active:scale-90"
                          >
                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          <div className="h-4 w-px bg-slate-300/50 mx-0.5" />

                          <button
                            title="Fix Coordinates"
                            onClick={() => setPickingStation(station)}
                            className="group flex h-9 w-9 items-center justify-center rounded-xl text-amber-500 transition-all hover:bg-white/50 active:scale-90"
                          >
                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>

                          <div className="h-4 w-px bg-slate-300/50 mx-0.5" />

                          <button
                            title="Edit Station"
                            onClick={() => startEditing(station)}
                            className="group flex h-9 w-9 items-center justify-center rounded-xl text-blue-500 transition-all hover:bg-white/50 active:scale-90"
                          >
                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          <div className="h-4 w-px bg-slate-300/50 mx-0.5" />

                          <button
                            title="Delete Station"
                            onClick={() => handleDelete(station.id)}
                            className="group flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition-all hover:bg-white/50 active:scale-90"
                          >
                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {verificationStation && (
        <MapVerificationModal
          isOpen={!!verificationStation}
          onClose={() => setVerificationStation(null)}
          lat={verificationStation.latitude}
          lng={verificationStation.longitude}
          stationName={verificationStation.name}
        />
      )}

      {pickingStation && (
        <MapPickerModal
          isOpen={!!pickingStation}
          onClose={() => setPickingStation(null)}
          initialLat={pickingStation.latitude}
          initialLng={pickingStation.longitude}
          stationName={pickingStation.name}
          onSave={async (newLat, newLng) => {
            const res = await updateStationCoordinates(
              pickingStation.id,
              newLat,
              newLng,
            );
            if (res.success) {
              toast.success(res.message);
              setPickingStation(null);
            } else {
              toast.error(res.message);
            }
          }}
        />
      )}
    </div>
  );
}

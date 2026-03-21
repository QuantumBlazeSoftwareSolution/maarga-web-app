'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { bulkImportStations } from '@/src/lib/actions/station';
import FloatingNav from '@/src/components/admin/FloatingNav';

type Step = 'upload' | 'map' | 'import';

interface MappedFields {
  name: string;
  address: string;
  longitude: string;
  latitude: string;
}

interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}

interface StationFeature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: GeoJSONPoint;
  id?: string;
}

const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

export default function StationImportPage() {
  const [step, setStep] = useState<Step>('upload');
  const [jsonData, setJsonData] = useState<StationFeature[]>([]);
  const [availableKeys, setAvailableKeys] = useState<string[]>([]);
  const [mappedFields, setMappedFields] = useState<MappedFields>({
    name: '',
    address: '',
    longitude: '',
    latitude: '',
  });
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          throw new Error('JSON data must be an array of objects.');
        }

        setJsonData(json as StationFeature[]);

        const sampleSize = Math.min(json.length, 20);
        const uniqueKeys = new Set<string>();

        for (let i = 0; i < sampleSize; i++) {
          const feature = json[i] as StationFeature;
          if (feature.properties) {
            Object.keys(feature.properties).forEach(k => uniqueKeys.add(`properties.${k}`));
          }
          if (feature.geometry?.coordinates) {
            uniqueKeys.add('geometry.coordinates[0]');
            uniqueKeys.add('geometry.coordinates[1]');
          }
          Object.keys(feature).forEach(k => {
            if (k !== 'properties' && k !== 'geometry') uniqueKeys.add(k);
          });
        }

        const keys = Array.from(uniqueKeys).sort();
        setAvailableKeys(keys);

        setMappedFields({
          name: keys.find(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('brand')) || '',
          address: keys.find(k => k.toLowerCase().includes('address') || k.toLowerCase().includes('street') || k.toLowerCase().includes('amenity')) || '',
          longitude: 'geometry.coordinates[0]',
          latitude: 'geometry.coordinates[1]',
        });

        setStep('map');
        toast.success(`Loaded ${json.length} features successfully.`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const getValueFromPath = (obj: StationFeature, path: string) => {
    if (path === 'geometry.coordinates[0]') return obj.geometry?.coordinates?.[0]?.toString();
    if (path === 'geometry.coordinates[1]') return obj.geometry?.coordinates?.[1]?.toString();
    if (path.startsWith('properties.')) {
      const key = path.split('.')[1];
      return (obj.properties as Record<string, unknown>)?.[key]?.toString();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (obj as any)[path]?.toString();
  };

  const handleStartImport = async () => {
    if (!mappedFields.name || !mappedFields.address || !mappedFields.longitude || !mappedFields.latitude) {
      toast.error('All fields must be mapped.');
      return;
    }

    setIsImporting(true);

    try {
      const stationsToImport = [];
      const errors = [];

      for (const item of jsonData) {
        const name = getValueFromPath(item, mappedFields.name)?.trim() || 'Unknown Station';
        const address = getValueFromPath(item, mappedFields.address)?.trim() || 'Sri Lanka';
        const lonStr = getValueFromPath(item, mappedFields.longitude);
        const latStr = getValueFromPath(item, mappedFields.latitude);

        const lon = parseFloat(lonStr || '0');
        const lat = parseFloat(latStr || '0');

        if (isNaN(lon) || isNaN(lat) || lon < -180 || lon > 180 || lat < -90 || lat > 90) {
          errors.push(`Invalid coordinates for station: ${name}`);
          continue;
        }

        stationsToImport.push({
          name: name.slice(0, 255),
          address: address.slice(0, 500),
          longitude: lon.toFixed(7),
          latitude: lat.toFixed(7),
        });
      }

      if (errors.length > 0) {
        console.warn(`[IMPORT] Skipped ${errors.length} records`, errors.slice(0, 5));
        toast.warning(`Skipped ${errors.length} malformed records.`);
      }

      if (stationsToImport.length === 0) {
        toast.error('No valid records to import.');
        setIsImporting(false);
        return;
      }

      const res = await bulkImportStations(stationsToImport);

      if (res.success) {
        toast.success(res.message);
        router.push('/developer-back-door/dashboard');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Import failed during processing.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div
      className="min-h-screen font-sans selection:bg-blue-200"
      style={{ background: '#E1E4E9', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
    >
      {/* ── Top Navigation ─────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: '#E1E4E9' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/developer-back-door/dashboard')}
            style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all hover:text-slate-800 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
            className="flex h-9 w-9 items-center justify-center rounded-xl"
          >
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-700">Station Data Manager</span>
            <span className="ml-2 text-xs text-slate-400">
              / {step === 'upload' ? 'Upload File' : 'Map Columns'}
            </span>
          </div>
        </div>

        {/* Step pill indicator */}
        <div
          style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
          className="flex items-center gap-4 rounded-xl px-5 py-2.5"
        >
          {(['upload', 'map'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="h-px w-4 bg-slate-300" />}
              <div className="flex items-center gap-2">
                <div
                  style={{
                    boxShadow: step === s ? nmPressed : nmSubtle,
                    background: '#E1E4E9',
                  }}
                  className={`flex h-5 w-5 items-center justify-center rounded-lg text-[10px] font-black ${
                    step === s ? 'text-blue-500' : 'text-slate-400'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${step === s ? 'text-slate-700' : 'text-slate-400'}`}>
                  {s === 'upload' ? 'Upload' : 'Map'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </nav>

      <FloatingNav />
      {/* ── Main ───────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-8 pb-12 pt-4">

        {/* ── Step 1: Upload ─── */}
        {step === 'upload' && (
          <div className="flex flex-col items-center justify-center pt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
              className="group w-full cursor-pointer rounded-2xl p-16 text-center transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div
                style={{ boxShadow: nmOuter, background: '#E1E4E9' }}
                className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl text-blue-500 transition-transform group-hover:scale-110"
              >
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-700">Upload Station Data</h2>
              <p className="mt-3 text-sm font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">
                Drop your JSON file here or click to browse. Supports flat-array GeoJSON.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
            </div>

            <div
              style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
              className="mt-8 flex items-center gap-3 rounded-xl px-5 py-3"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                System ready for ingestion
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: Map ─── */}
        {step === 'map' && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-500">

            {/* Field mapping card */}
            <div
              style={{ boxShadow: nmOuter, background: '#E1E4E9' }}
              className="rounded-2xl p-8"
            >
              <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-lg font-black text-slate-700">Link Columns</h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    Match your file columns to the system fields.
                  </p>
                </div>
                <div
                  style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                  className="rounded-xl px-3 py-1.5"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                    Auto-mapped
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {(['name', 'address', 'longitude', 'latitude'] as const).map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {field}
                    </label>
                    <div className="relative">
                      <select
                        value={mappedFields[field]}
                        onChange={(e) => setMappedFields({ ...mappedFields, [field]: e.target.value })}
                        style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                        className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        <option value="">Choose column…</option>
                        {availableKeys.map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview card */}
            <div
              style={{ boxShadow: nmOuter, background: '#E1E4E9' }}
              className="rounded-2xl p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
                  Preview
                </h3>
                <span
                  style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                  className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  First 3 records
                </span>
              </div>

              <div className="space-y-4">
                {jsonData.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                    className="rounded-xl p-5"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Name</span>
                        <span className="text-xs font-bold text-slate-700 line-clamp-1">
                          {getValueFromPath(item, mappedFields.name) || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Address</span>
                        <span className="text-xs font-bold text-slate-700 line-clamp-1">
                          {getValueFromPath(item, mappedFields.address) || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Coords</span>
                        <span className="font-mono text-xs font-bold text-slate-600">
                          {getValueFromPath(item, mappedFields.latitude) || '?'}, {getValueFromPath(item, mappedFields.longitude) || '?'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Import button */}
            <button
              disabled={isImporting}
              onClick={handleStartImport}
              style={{
                boxShadow: isImporting ? nmPressed : nmOuter,
                background: '#E1E4E9',
              }}
              className="w-full rounded-2xl py-5 text-sm font-black uppercase tracking-widest text-blue-600 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
            >
              {isImporting
                ? 'Processing…'
                : `Import ${jsonData.length.toLocaleString()} Stations →`}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

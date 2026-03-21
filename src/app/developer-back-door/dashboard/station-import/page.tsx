'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { bulkImportStations } from '@/src/lib/actions/station';

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
        
        // Extract all unique keys from first 20 records for robust mapping
        const sampleSize = Math.min(json.length, 20);
        const uniqueKeys = new Set<string>();
        
        for (let i = 0; i < sampleSize; i++) {
          const feature = json[i] as StationFeature;
          if (feature.properties) {
            Object.keys(feature.properties).forEach(k => uniqueKeys.add(`properties.${k}`));
          }
          if (feature.geometry?.coordinates) {
            uniqueKeys.add('geometry.coordinates[0]'); // Lon
            uniqueKeys.add('geometry.coordinates[1]'); // Lat
          }
          // General top-level keys
          Object.keys(feature).forEach(k => {
            if (k !== 'properties' && k !== 'geometry') uniqueKeys.add(k);
          });
        }

        const keys = Array.from(uniqueKeys).sort();
        setAvailableKeys(keys);

        // Try to auto-guess some mappings
        setMappedFields({
          name:
            keys.find(
              (k) =>
                k.toLowerCase().includes('name') ||
                k.toLowerCase().includes('brand'),
            ) || '',
          address:
            keys.find(
              (k) =>
                k.toLowerCase().includes('address') ||
                k.toLowerCase().includes('street') ||
                k.toLowerCase().includes('amenity'),
            ) || '',
          longitude: 'geometry.coordinates[0]',
          latitude: 'geometry.coordinates[1]',
        });

        setStep('map');
        toast.success(`Loaded ${json.length} features successfully.`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Invalid JSON file',
        );
      }
    };
    reader.readAsText(file);
  };

  const getValueFromPath = (obj: StationFeature, path: string) => {
    if (path === 'geometry.coordinates[0]')
      return obj.geometry?.coordinates?.[0]?.toString();
    if (path === 'geometry.coordinates[1]')
      return obj.geometry?.coordinates?.[1]?.toString();

    if (path.startsWith('properties.')) {
      const key = path.split('.')[1];
      return (obj.properties as Record<string, unknown>)?.[key]?.toString();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (obj as any)[path]?.toString();
  };

  const handleStartImport = async () => {
    // Validate mappings
    if (
      !mappedFields.name ||
      !mappedFields.address ||
      !mappedFields.longitude ||
      !mappedFields.latitude
    ) {
      toast.error('All fields must be mapped.');
      return;
    }

    setIsImporting(true);

    try {
      // Transform and validate data based on mapping
      const stationsToImport = [];
      const errors = [];
      
      for (const item of jsonData) {
        const name = getValueFromPath(item, mappedFields.name)?.trim() || 'Unknown Station';
        const address = getValueFromPath(item, mappedFields.address)?.trim() || 'Sri Lanka';
        const lonStr = getValueFromPath(item, mappedFields.longitude);
        const latStr = getValueFromPath(item, mappedFields.latitude);
        
        const lon = parseFloat(lonStr || '0');
        const lat = parseFloat(latStr || '0');

        // Basic validation
        if (isNaN(lon) || isNaN(lat) || lon < -180 || lon > 180 || lat < -90 || lat > 90) {
          errors.push(`Invalid coordinates for station: ${name}`);
          continue;
        }

        stationsToImport.push({
          name: name.slice(0, 255), // Basic length capping
          address: address.slice(0, 500),
          longitude: lon.toFixed(7), // Consistent precision
          latitude: lat.toFixed(7),
        });
      }

      if (errors.length > 0) {
        console.warn(`[IMPORT] Skipped ${errors.length} records due to validation errors.`, errors.slice(0, 5));
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Return Home
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
              Station Data Manager
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full transition-colors ${step === 'upload' ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-slate-200'}`}></span>
            <span className={`h-2.5 w-2.5 rounded-full transition-colors ${step === 'map' ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-slate-200'}`}></span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl p-8">
        {step === 'upload' && (
          <div className="flex flex-col items-center justify-center pt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-24 text-center transition-all hover:border-blue-500/30 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 active:scale-[0.99]"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Upload Station Data</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-xs mx-auto">
                Drag and drop your station file or click to browse. Supports standard station JSON formats.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
            </div>
            <div className="mt-10 flex items-center gap-3 rounded-full bg-white px-5 py-2.5 border border-slate-200 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <p className="text-xs font-medium text-slate-400">
                Ready to process station records for the Maarga network.
              </p>
            </div>
          </div>
        )}

        {step === 'map' && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-8 border-b border-slate-100 pb-6">
                <h2 className="text-2xl font-bold text-slate-900">Link Data Columns</h2>
                <p className="mt-1 text-sm text-slate-500">Match your file columns to our system fields for successful import.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {(['name', 'address', 'longitude', 'latitude'] as const).map(
                  (field) => (
                    <div key={field} className="space-y-3">
                      <label className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
                        System Field: {field}
                      </label>
                      <div className="relative group">
                        <select
                          value={mappedFields[field]}
                          onChange={(e) =>
                            setMappedFields({
                              ...mappedFields,
                              [field]: e.target.value,
                            })
                          }
                          className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium text-slate-900 transition-all focus:border-blue-500/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 group-hover:border-slate-300 shadow-sm"
                        >
                          <option value="">Choose Column from File...</option>
                          {availableKeys.map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                  Data Preview
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">
                  First 3 Records
                </span>
              </div>
              
              <div className="space-y-4">
                {jsonData.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 font-medium text-sm text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Station Name</span>
                        <span className="text-slate-900 line-clamp-1">{getValueFromPath(item, mappedFields.name) || '---'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Location Details</span>
                        <span className="text-slate-900 line-clamp-1">{getValueFromPath(item, mappedFields.address) || '---'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Coordinates</span>
                        <span className="text-slate-900 font-mono">
                          {getValueFromPath(item, mappedFields.latitude) || '?'}, {getValueFromPath(item, mappedFields.longitude) || '?'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={isImporting}
              onClick={handleStartImport}
              className="w-full rounded-3xl bg-blue-600 py-5 font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isImporting
                ? 'Processing Your Data...'
                : `Import ${jsonData.length.toLocaleString()} Stations to Network`}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

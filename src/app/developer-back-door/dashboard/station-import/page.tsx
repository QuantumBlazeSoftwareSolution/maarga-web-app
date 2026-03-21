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
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-emerald-500/30">
      <nav className="border-b border-white/5 bg-white/2 px-8 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-white/40 hover:text-white"
            >
              ← Back
            </button>
            <h1 className="text-sm font-bold tracking-tight text-white/90 uppercase">
              Station Data Importer
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${step === 'upload' ? 'bg-emerald-500' : 'bg-white/10'}`}
            ></span>
            <span
              className={`h-2 w-2 rounded-full ${step === 'map' ? 'bg-emerald-500' : 'bg-white/10'}`}
            ></span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl p-8">
        {step === 'upload' && (
          <div className="flex flex-col items-center justify-center pt-20">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer rounded-3xl border-2 border-dashed border-white/5 bg-white/2 p-20 text-center transition-all hover:border-emerald-500/30 hover:bg-white/4"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110">
                <svg
                  className="h-8 w-8"
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
              <h2 className="text-xl font-light text-white/90">
                Upload Station JSON
              </h2>
              <p className="mt-2 text-sm text-white/40">
                Select a simplified flat-array JSON file to begin mapping.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
            </div>
            <p className="mt-8 text-xs text-white/20">
              The file should contain an array of station features.
            </p>
          </div>
        )}

        {step === 'map' && (
          <div className="animate-in fade-in space-y-8 duration-500">
            <div className="rounded-2xl border border-white/5 bg-white/2 p-6">
              <h2 className="text-white/90Headline mb-6 text-lg font-light">
                Field Mapping Selection
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {(['name', 'address', 'longitude', 'latitude'] as const).map(
                  (field) => (
                    <div key={field} className="space-y-2">
                      <label className="text-[10px] font-medium tracking-widest text-emerald-500/60 uppercase">
                        DB Column: {field}
                      </label>
                      <select
                        value={mappedFields[field]}
                        onChange={(e) =>
                          setMappedFields({
                            ...mappedFields,
                            [field]: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
                      >
                        <option value="">Select JSON Field...</option>
                        {availableKeys.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="rounded-2xl border border-white/5 bg-white/2 p-6">
              <h3 className="mb-4 text-xs font-medium tracking-widest text-white/20 uppercase">
                Data Preview (First 3 Records)
              </h3>
              <div className="space-y-4">
                {jsonData.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-white/5 bg-black/40 p-4 font-mono text-xs text-white/50"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-white/20">Name:</span>{' '}
                      <span>
                        {getValueFromPath(item, mappedFields.name) || '???'}
                      </span>
                      <span className="text-white/20">Address:</span>{' '}
                      <span>
                        {getValueFromPath(item, mappedFields.address) || '???'}
                      </span>
                      <span className="text-white/20">Coord:</span>{' '}
                      <span>
                        {getValueFromPath(item, mappedFields.latitude)},{' '}
                        {getValueFromPath(item, mappedFields.longitude)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={isImporting}
              onClick={handleStartImport}
              className="w-full rounded-2xl bg-emerald-500 py-4 font-bold text-[#0B0E14] shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
            >
              {isImporting
                ? 'Processing Bulk Import...'
                : `Import ${jsonData.length} Stations into Neon DB`}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

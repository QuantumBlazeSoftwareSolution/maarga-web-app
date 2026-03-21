'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { useEffect, useState, use } from 'react';
import Image from 'next/image';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

interface ApiDocsPageProps {
  params: Promise<{ version: string }>;
}

export default function ApiDocsPage({ params }: ApiDocsPageProps) {
  const { version } = use(params);
  const [spec, setSpec] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/${version}/swagger`)
      .then((res) => res.json())
      .then((data) => setSpec(data));
  }, [version]);

  if (!spec) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0E14] text-emerald-500">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-medium tracking-widest text-white/40 uppercase">Loading {version.toUpperCase()} Docs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0B0E14] py-6 px-8 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Maarga API</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
            Developer Documentation {version.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/20 uppercase tracking-widest font-mono">
            {version === 'v1' ? 'Current Stable' : 'Archived'}
          </span>
          <Image src="/favicon.ico" alt="Maarga" width={32} height={32} className="opacity-50" />
        </div>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <SwaggerUI spec={spec as any} />
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { useEffect, useState } from 'react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/swagger')
      .then((res) => res.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0E14] text-emerald-500">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-medium tracking-widest text-white/40 uppercase">Loading API Docs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0B0E14] py-6 px-8 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Maarga API</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Developer Documentation v1.0</p>
        </div>
        <img src="/favicon.ico" alt="Maarga" className="h-8 w-8 opacity-50" />
      </div>
      <SwaggerUI spec={spec} />
    </div>
  );
}

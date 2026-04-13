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
          <p className="text-sm font-medium tracking-widest text-white/40 uppercase">
            Loading {version.toUpperCase()} Docs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0B0E14] px-8 py-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Maarga API
          </h1>
          <p className="mt-1 text-xs tracking-widest text-white/40 uppercase">
            Developer Documentation {version.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-widest text-white/20 uppercase">
            {version === 'v1' ? 'Current Stable' : 'Archived'}
          </span>
          <Image
            src="/icon.png"
            alt="Maarga"
            width={32}
            height={32}
            className="opacity-50"
          />
        </div>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <SwaggerUI spec={spec as any} />
    </div>
  );
}

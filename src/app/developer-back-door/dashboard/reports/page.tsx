'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { getAllReports, getNewStationReports } from '@/src/lib/actions/report';
import {
  getStationNameRequestsAction,
  getStationDeleteRequestsAction,
  approveStationNameRequestAction,
  rejectStationNameRequestAction,
  confirmDeleteStationRequestAction,
  rejectDeleteStationRequestAction,
} from '@/src/lib/actions/station-requests';
import FloatingNav from '@/src/components/admin/FloatingNav';

const MapVerificationModal = dynamic(
  () => import('@/src/components/admin/MapVerificationModal'),
  { ssr: false },
);

const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

function NmCard({
  children,
  className = '',
  pressed = false,
  onClick,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  pressed?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        boxShadow: pressed ? nmPressed : nmOuter,
        background: '#E1E4E9',
        ...style,
      }}
      className={`rounded-2xl transition-all duration-200 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getColors = () => {
    switch (status) {
      case 'approved':
        return 'text-emerald-500 bg-emerald-50';
      case 'pending':
        return 'text-amber-500 bg-amber-50';
      case 'suspended':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <span
      style={{ boxShadow: nmPressed }}
      className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${getColors()}`}
    >
      {status}
    </span>
  );
}

function AvailabilityIndicator({ type }: { type: string }) {
  const color =
    type === 'available' ? '#10B981' : type === 'low' ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-1.5">
      <div
        style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
        className="h-1.5 w-1.5 rounded-full"
      />
      <span className="text-[10px] font-bold text-slate-600 capitalize">
        {type}
      </span>
    </div>
  );
}

interface ReportWithItems {
  id: string;
  stationName: string;
  userName: string | null;
  userEmail: string;
  queue: string;
  message: string | null;
  status: string;
  createdAt: Date;
  items: {
    itemName: string;
    itemSinhalaName: string | null;
    availability: string;
  }[];
}

interface NewStationReport {
  id: string;
  latitude: string;
  longitude: string;
  status: string;
  createdAt: Date;
  userName: string | null;
}

interface StationNameRequestItem {
  id: string;
  stationId: string;
  stationName: string;
  stationAddress: string;
  stationDistrict: string | null;
  stationLatitude: string;
  stationLongitude: string;
  suggestedName: string;
  status: string;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
}

interface StationDeleteRequestItem {
  id: string;
  stationId: string;
  stationName: string;
  stationAddress: string;
  stationDistrict: string | null;
  stationLatitude: string;
  stationLongitude: string;
  reason: string;
  status: string;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
}

export default function ReportsMonitoring() {
  const [activeTab, setActiveTab] = useState<
    'fuel' | 'new-station' | 'name-requests' | 'delete-requests'
  >('fuel');
  const [fuelReports, setFuelReports] = useState<ReportWithItems[]>([]);
  const [newStationReports, setNewStationReports] = useState<
    NewStationReport[]
  >([]);
  const [nameRequests, setNameRequests] = useState<StationNameRequestItem[]>([]);
  const [deleteRequests, setDeleteRequests] = useState<
    StationDeleteRequestItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Verification modal state
  const [activeModalItem, setActiveModalItem] = useState<{
    request: StationNameRequestItem | StationDeleteRequestItem;
    mode: 'verify' | 'delete';
  } | null>(null);

  const router = useRouter();

  const loadAllReports = async () => {
    try {
      const [fuelData, newData, nameData, deleteData] = await Promise.all([
        getAllReports(),
        getNewStationReports(),
        getStationNameRequestsAction(),
        getStationDeleteRequestsAction(),
      ]);
      setFuelReports(fuelData);
      setNewStationReports(newData as NewStationReport[]);
      setNameRequests(nameData as StationNameRequestItem[]);
      setDeleteRequests(deleteData as StationDeleteRequestItem[]);
    } catch (_error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllReports();
  }, []);

  const getActiveTabCount = () => {
    switch (activeTab) {
      case 'fuel':
        return fuelReports.length;
      case 'new-station':
        return newStationReports.length;
      case 'name-requests':
        return nameRequests.length;
      case 'delete-requests':
        return deleteRequests.length;
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: '#E1E4E9',
        fontFamily:
          'var(--font-poppins), -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: '#E1E4E9' }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl"
            onClick={() => router.push('/developer-back-door/dashboard')}
          >
            <svg
              className="h-5 w-5 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-700">
            Reports Monitor
          </span>
        </div>
      </nav>

      <FloatingNav />

      <main className="mx-auto max-w-6xl px-8 pt-6 pb-20">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              Community Reports
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Real-time feed of user-submitted station status and metadata updates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <NmCard className="flex p-1" style={{ background: '#E1E4E9' }}>
              <button
                onClick={() => setActiveTab('fuel')}
                style={{ boxShadow: activeTab === 'fuel' ? nmPressed : 'none' }}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all duration-200 ${
                  activeTab === 'fuel' ? 'text-blue-500' : 'text-slate-500'
                }`}
              >
                FUEL STATUS
              </button>
              <button
                onClick={() => setActiveTab('new-station')}
                style={{
                  boxShadow: activeTab === 'new-station' ? nmPressed : 'none',
                }}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all duration-200 ${
                  activeTab === 'new-station' ? 'text-blue-500' : 'text-slate-500'
                }`}
              >
                NEW STATIONS
              </button>
              <button
                onClick={() => setActiveTab('name-requests')}
                style={{
                  boxShadow: activeTab === 'name-requests' ? nmPressed : 'none',
                }}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all duration-200 ${
                  activeTab === 'name-requests'
                    ? 'text-blue-500'
                    : 'text-slate-500'
                }`}
              >
                NAME REQUESTS
              </button>
              <button
                onClick={() => setActiveTab('delete-requests')}
                style={{
                  boxShadow:
                    activeTab === 'delete-requests' ? nmPressed : 'none',
                }}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all duration-200 ${
                  activeTab === 'delete-requests'
                    ? 'text-rose-500'
                    : 'text-slate-500'
                }`}
              >
                DELETE REQUESTS
              </button>
            </NmCard>

            <NmCard className="px-4 py-2">
              <span className="text-xs font-bold text-slate-500">
                Total:{' '}
                <span className="font-black text-blue-500">
                  {getActiveTabCount()}
                </span>
              </span>
            </NmCard>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : activeTab === 'fuel' ? (
          fuelReports.length === 0 ? (
            <NmCard className="flex flex-col items-center justify-center py-20 text-center">
              <div
                style={{ boxShadow: nmPressed }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
              >
                📋
              </div>
              <h3 className="text-lg font-bold text-slate-700">
                No Fuel Status Reports
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-400">
                User submissions will appear here as soon as they are submitted from the mobile app.
              </p>
            </NmCard>
          ) : (
            <div className="flex flex-col gap-6">
              {fuelReports.map((report) => (
                <NmCard key={report.id} className="p-6">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    {/* Station & User Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <div
                          style={{ boxShadow: nmSubtle }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg"
                        >
                          ⛽
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-base font-black text-slate-700">
                            {report.stationName}
                          </h4>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-xs font-bold text-slate-400">
                              By {report.userName ?? 'Unknown User'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300">
                              •
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                              {new Date(report.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {report.message && (
                        <div
                          style={{ boxShadow: nmPressed }}
                          className="rounded-xl bg-slate-50/50 p-3"
                        >
                          <p className="text-xs leading-relaxed font-medium text-slate-500 italic">
                            &quot;{report.message}&quot;
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Items Reporting info */}
                    <div className="flex min-w-[300px] flex-wrap items-center gap-4 border-slate-200/50 lg:border-x lg:px-6">
                      <div className="mb-1 w-full">
                        <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Item Availability
                        </span>
                      </div>
                      {report.items.map(
                        (
                          item: { itemName: string; availability: string },
                          idx: number,
                        ) => (
                          <div
                            key={idx}
                            style={{ boxShadow: nmSubtle }}
                            className="flex min-w-[120px] flex-col rounded-xl p-2.5"
                          >
                            <span className="truncate text-[10px] font-black text-slate-700">
                              {item.itemName}
                            </span>
                            <div className="mt-1.5">
                              <AvailabilityIndicator type={item.availability} />
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Queue & Final Status */}
                    <div className="flex shrink-0 items-center gap-6 lg:pl-6">
                      <div className="text-right">
                        <span className="mb-1.5 block text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Queue Status
                        </span>
                        <span className="block text-xs font-black text-slate-600">
                          {report.queue.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="block text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Consensus
                        </span>
                        <StatusBadge status={report.status} />
                      </div>
                    </div>
                  </div>
                </NmCard>
              ))}
            </div>
          )
        ) : activeTab === 'new-station' ? (
          newStationReports.length === 0 ? (
            <NmCard className="flex flex-col items-center justify-center py-20 text-center">
              <div
                style={{ boxShadow: nmPressed }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
              >
                📍
              </div>
              <h3 className="text-lg font-bold text-slate-700">
                No New Station Reports
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-400">
                User suggestions for new stations will appear here.
              </p>
            </NmCard>
          ) : (
            <div className="flex flex-col gap-6">
              {newStationReports.map((report) => (
                <NmCard key={report.id} className="p-6">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <div
                          style={{ boxShadow: nmSubtle }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg"
                        >
                          📍
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-base font-black text-slate-700">
                            New Station Location
                          </h4>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-xs font-bold text-slate-400">
                              Suggested by {report.userName ?? 'Unknown User'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300">
                              •
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                              {new Date(report.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{ boxShadow: nmPressed }}
                        className="flex items-center justify-between rounded-xl bg-slate-50/50 p-3"
                      >
                        <div className="space-x-2 text-[10px] font-black text-slate-500">
                          <span className="rounded bg-white/50 px-2 py-0.5">
                            LAT: {parseFloat(report.latitude).toFixed(4)}
                          </span>
                          <span className="rounded bg-white/50 px-2 py-0.5">
                            LNG: {parseFloat(report.longitude).toFixed(4)}
                          </span>
                        </div>

                        <a
                          href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ boxShadow: nmSubtle }}
                          className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-black text-blue-600 transition-all hover:scale-105 active:scale-95"
                        >
                          VIEW ON MAP
                        </a>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-6 border-l border-slate-200/50 lg:pl-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="block text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Approval Status
                        </span>
                        <StatusBadge status={report.status} />
                      </div>
                    </div>
                  </div>
                </NmCard>
              ))}
            </div>
          )
        ) : activeTab === 'name-requests' ? (
          nameRequests.length === 0 ? (
            <NmCard className="flex flex-col items-center justify-center py-20 text-center">
              <div
                style={{ boxShadow: nmPressed }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
              >
                ✏️
              </div>
              <h3 className="text-lg font-bold text-slate-700">
                No Station Name Requests
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-400">
                User requests to correct or suggest station names will appear here.
              </p>
            </NmCard>
          ) : (
            <div className="flex flex-col gap-6">
              {nameRequests.map((req) => (
                <NmCard key={req.id} className="p-6">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <div
                          style={{ boxShadow: nmSubtle }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg"
                        >
                          ✏️
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-base font-black text-slate-700">
                            Current: {req.stationName}
                          </h4>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-xs font-bold text-slate-400">
                              Suggested by {req.userName ?? 'Unknown User'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300">
                              •
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                              {new Date(req.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{ boxShadow: nmPressed }}
                        className="flex flex-col gap-2 rounded-xl bg-slate-50/50 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                            Suggested Name:
                          </span>
                          <span className="ml-2 text-sm font-black text-blue-600">
                            {req.suggestedName}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">
                          {req.stationAddress} ({req.stationDistrict || 'N/A'})
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-4 border-slate-200/50 lg:border-l lg:pl-6">
                      <button
                        onClick={() =>
                          setActiveModalItem({ request: req, mode: 'verify' })
                        }
                        style={{ boxShadow: nmOuter }}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-xs font-black text-white transition-all hover:scale-105 active:scale-95"
                      >
                        REVIEW ON MAP
                      </button>

                      {req.status === 'pending' && (
                        <button
                          onClick={async () => {
                            const res = await rejectStationNameRequestAction(
                              req.id,
                            );
                            if (res.success) {
                              toast.success(res.message);
                              loadAllReports();
                            } else {
                              toast.error(res.message);
                            }
                          }}
                          style={{ boxShadow: nmSubtle }}
                          className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors"
                        >
                          Reject
                        </button>
                      )}

                      <div className="flex flex-col items-center gap-1">
                        <StatusBadge status={req.status} />
                      </div>
                    </div>
                  </div>
                </NmCard>
              ))}
            </div>
          )
        ) : (
          /* delete-requests */
          deleteRequests.length === 0 ? (
            <NmCard className="flex flex-col items-center justify-center py-20 text-center">
              <div
                style={{ boxShadow: nmPressed }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
              >
                🗑️
              </div>
              <h3 className="text-lg font-bold text-slate-700">
                No Station Delete Requests
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-400">
                User requests to delete non-existent or duplicate stations will appear here.
              </p>
            </NmCard>
          ) : (
            <div className="flex flex-col gap-6">
              {deleteRequests.map((req) => (
                <NmCard key={req.id} className="p-6">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <div
                          style={{ boxShadow: nmSubtle }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-lg"
                        >
                          🗑️
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-base font-black text-slate-700">
                            Station: {req.stationName}
                          </h4>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-xs font-bold text-slate-400">
                              Requested by {req.userName ?? 'Unknown User'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300">
                              •
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                              {new Date(req.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{ boxShadow: nmPressed }}
                        className="rounded-xl bg-rose-50/40 p-3"
                      >
                        <span className="text-[9px] font-black tracking-widest text-rose-500 uppercase">
                          Reason for Deletion:
                        </span>
                        <p className="mt-1 text-xs font-semibold text-slate-600 italic">
                          &quot;{req.reason}&quot;
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-4 border-slate-200/50 lg:border-l lg:pl-6">
                      <button
                        onClick={() =>
                          setActiveModalItem({ request: req, mode: 'delete' })
                        }
                        style={{ boxShadow: nmOuter }}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-black text-white transition-all hover:scale-105 active:scale-95"
                      >
                        REVIEW & DELETE
                      </button>

                      {req.status === 'pending' && (
                        <button
                          onClick={async () => {
                            const res = await rejectDeleteStationRequestAction(
                              req.id,
                            );
                            if (res.success) {
                              toast.success(res.message);
                              loadAllReports();
                            } else {
                              toast.error(res.message);
                            }
                          }}
                          style={{ boxShadow: nmSubtle }}
                          className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors"
                        >
                          Reject
                        </button>
                      )}

                      <div className="flex flex-col items-center gap-1">
                        <StatusBadge status={req.status} />
                      </div>
                    </div>
                  </div>
                </NmCard>
              ))}
            </div>
          )
        )}
      </main>

      {/* Reused Map Verification Modal */}
      {activeModalItem && (
        <MapVerificationModal
          isOpen={!!activeModalItem}
          mode={activeModalItem.mode}
          title={
            activeModalItem.mode === 'delete'
              ? 'Review Station for Deletion'
              : 'Verify Suggested Station Name'
          }
          actionLabel={
            activeModalItem.mode === 'delete'
              ? 'Confirm Delete Station'
              : 'Approve & Update Station Name'
          }
          onClose={() => setActiveModalItem(null)}
          station={{
            id: activeModalItem.request.stationId,
            name:
              activeModalItem.mode === 'verify' &&
              'suggestedName' in activeModalItem.request
                ? activeModalItem.request.suggestedName
                : activeModalItem.request.stationName,
            address: activeModalItem.request.stationAddress,
            district: activeModalItem.request.stationDistrict,
            latitude: activeModalItem.request.stationLatitude,
            longitude: activeModalItem.request.stationLongitude,
            status: 'approved',
          }}
          onSave={
            activeModalItem.mode === 'verify'
              ? async (data) => {
                  const res = await approveStationNameRequestAction(
                    activeModalItem.request.id,
                    activeModalItem.request.stationId,
                    {
                      name: data.name,
                      address: data.address,
                      district: data.district as any,
                      status: data.status as any,
                      latitude: data.latitude,
                      longitude: data.longitude,
                    },
                  );
                  if (res.success) {
                    toast.success(res.message);
                    setActiveModalItem(null);
                    loadAllReports();
                  } else {
                    toast.error(res.message);
                  }
                }
              : undefined
          }
          onDelete={
            activeModalItem.mode === 'delete'
              ? async () => {
                  const res = await confirmDeleteStationRequestAction(
                    activeModalItem.request.id,
                    activeModalItem.request.stationId,
                  );
                  if (res.success) {
                    toast.success(res.message);
                    setActiveModalItem(null);
                    loadAllReports();
                  } else {
                    toast.error(res.message);
                  }
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

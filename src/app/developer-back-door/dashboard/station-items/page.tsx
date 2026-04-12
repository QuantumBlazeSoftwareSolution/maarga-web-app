'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import FloatingNav from '@/src/components/admin/FloatingNav';
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from '@/src/lib/actions/items';
import { Item } from '@/src/lib/db/schema/items';
import { itemTypeEnumItems } from '@/src/lib/db/schema/enum';

// ── Neumorphism tokens ─────────────────────────────────
const BASE = '#E1E4E9';
const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

type StationItemDesc = Item; // Matches the items table schema

const getItemTypeLabel = (type: string) => {
  switch (type) {
    case 'fuel':
      return 'Fuel Type';
    case 'gas':
      return 'LPG Gas Type';
    case 'ev':
      return 'EV Charging Standard';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export default function StationItemsManagementPage() {
  const [items, setItems] = useState<StationItemDesc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | Item['itemType']>(
    'all',
  );

  // Registration Form State
  const [formData, setFormData] = useState<{
    name: string;
    sinhalaName: string;
    description: string;
    itemType: Item['itemType'];
  }>({
    name: '',
    sinhalaName: '',
    description: '',
    itemType: 'fuel',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<StationItemDesc>>({});

  const fetchItems = async () => {
    setIsLoading(true);
    const res = await getItems();
    if (res.success && res.data) {
      setItems(res.data);
    } else {
      toast.error('Failed to load items');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.itemType) {
      toast.error('Name and Type are required');
      return;
    }

    setIsSubmitting(true);
    const res = await createItem({
      name: formData.name,
      sinhalaName: formData.sinhalaName || null,
      description: formData.description,
      itemType: formData.itemType,
    });

    if (res.success) {
      toast.success(res.message);
      setFormData({
        name: '',
        sinhalaName: '',
        description: '',
        itemType: 'fuel',
      });
      fetchItems();
    } else {
      toast.error(res.message);
    }
    setIsSubmitting(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editData.name) {
      toast.error('Name cannot be empty');
      return;
    }

    const res = await updateItem(id, editData);
    if (res.success) {
      toast.success(res.message);
      setEditingId(null);
      fetchItems();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this global item?')) return;
    const res = await deleteItem(id);
    if (res.success) {
      toast.success(res.message);
      fetchItems();
    } else {
      toast.error(res.message);
    }
  };

  const startEditing = (item: StationItemDesc) => {
    setEditingId(item.id);
    setEditData({
      name: item.name,
      sinhalaName: item.sinhalaName,
      description: item.description,
      itemType: item.itemType,
    });
  };

  const filteredItems =
    selectedTab === 'all'
      ? items
      : items.filter((item) => item.itemType === selectedTab);

  return (
    <div
      className="min-h-screen pb-20 font-sans selection:bg-blue-200"
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
              className="h-4 w-4 text-violet-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-700">
              Station Items
            </span>
            <span className="ml-2 text-xs text-slate-400">
              / Global Inventory
            </span>
          </div>
        </div>
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
                Add Global Item
              </h2>
              <p className="mt-1 text-xs leading-relaxed font-medium text-slate-400">
                Items registered here become available for all stations to list
                as their services.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 placeholder-slate-400 transition-all outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="e.g. Petrol 92 Octane"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Sinhala Name{' '}
                  <span className="tracking-normal text-slate-400 normal-case">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.sinhalaName}
                  onChange={(e) =>
                    setFormData({ ...formData, sinhalaName: e.target.value })
                  }
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 placeholder-slate-400 transition-all outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="e.g. පැට්‍රල් 92"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={formData.itemType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        itemType: e.target.value as Item['itemType'],
                      })
                    }
                    style={{ boxShadow: nmPressed, background: BASE }}
                    className="w-full appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 transition-all outline-none focus:ring-2 focus:ring-violet-300"
                  >
                    {itemTypeEnumItems.map((type) => (
                      <option key={type} value={type}>
                        {getItemTypeLabel(type)}
                      </option>
                    ))}
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{ boxShadow: nmPressed, background: BASE }}
                  className="h-24 w-full resize-none appearance-none rounded-xl border-0 px-4 py-3 text-sm font-bold text-slate-700 placeholder-slate-400 transition-all outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="Tell users more about this fuel/item..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    boxShadow: isSubmitting ? nmPressed : nmOuter,
                    background: BASE,
                  }}
                  className="w-full rounded-xl py-4 text-sm font-black tracking-widest text-violet-600 uppercase transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Item'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="flex flex-1 flex-col lg:w-2/3">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-700">
              Platform Inventory
            </h2>
            <div
              style={{ boxShadow: nmPressed, background: BASE }}
              className="flex items-center gap-2 rounded-xl px-4 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-violet-500"></span>
              <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase">
                {filteredItems.length} Items
              </span>
            </div>
          </div>

          {/* ── Tabs ───────────────────────────────────────────── */}
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedTab('all')}
              style={{
                boxShadow: selectedTab === 'all' ? nmPressed : nmOuter,
                background: BASE,
              }}
              className={`rounded-xl px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all ${
                selectedTab === 'all' ? 'text-violet-600' : 'text-slate-500'
              }`}
            >
              All Items
            </button>
            {itemTypeEnumItems.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTab(type)}
                style={{
                  boxShadow: selectedTab === type ? nmPressed : nmOuter,
                  background: BASE,
                }}
                className={`rounded-xl px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all ${
                  selectedTab === type ? 'text-violet-600' : 'text-slate-500'
                }`}
              >
                {getItemTypeLabel(type)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div
              style={{ boxShadow: nmPressed, background: BASE }}
              className="rounded-2xl p-12 text-center"
            >
              <p className="text-sm font-bold text-slate-500">
                No {selectedTab === 'all' ? '' : selectedTab} items registered.
                Try adding one!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  style={{ boxShadow: nmOuter, background: BASE }}
                  className="rounded-2xl p-6 transition-all"
                >
                  {editingId === item.id ? (
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
                          placeholder="Item Name"
                        />
                        <input
                          type="text"
                          value={editData.sinhalaName || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              sinhalaName: e.target.value,
                            })
                          }
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="w-full appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
                          placeholder="සිංහල නම"
                        />
                        <select
                          value={editData.itemType || 'fuel'}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              itemType: e.target.value as Item['itemType'],
                            })
                          }
                          style={{ boxShadow: nmPressed, background: BASE }}
                          className="w-full appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
                        >
                          {itemTypeEnumItems.map((type) => (
                            <option key={type} value={type}>
                              {getItemTypeLabel(type)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        style={{ boxShadow: nmPressed, background: BASE }}
                        className="h-20 w-full resize-none appearance-none rounded-xl border-0 px-4 py-2 text-sm font-bold text-slate-700 outline-none"
                        placeholder="Description..."
                      />
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          style={{ boxShadow: nmSubtle, background: BASE }}
                          className="flex-1 rounded-xl py-2 text-xs font-black text-violet-600 uppercase transition-all hover:scale-[1.02] active:scale-95"
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
                            {item.name}
                          </h3>
                          {item.sinhalaName && (
                            <span className="text-[13px] font-medium text-slate-400">
                              {item.sinhalaName}
                            </span>
                          )}
                          <span
                            style={{ boxShadow: nmPressed, background: BASE }}
                            className="rounded-full px-3 py-1 text-[9px] leading-none font-black tracking-widest text-slate-500 uppercase"
                          >
                            {getItemTypeLabel(item.itemType)}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-[13px] leading-relaxed font-medium text-slate-500">
                          {item.description || 'No description provided.'}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4 pr-2">
                        <button
                          onClick={() => startEditing(item)}
                          style={{ boxShadow: nmOuter, background: BASE }}
                          className="group flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition-all hover:text-violet-500 active:shadow-[inset_4px_4px_10px_#c0c3c8,inset_-4px_-4px_10px_#ffffff]"
                        >
                          <svg
                            className="h-[18px] w-[18px] transition-transform group-active:scale-95"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{ boxShadow: nmOuter, background: BASE }}
                          className="group flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition-all hover:text-rose-500 active:shadow-[inset_4px_4px_10px_#c0c3c8,inset_-4px_-4px_10px_#ffffff]"
                        >
                          <svg
                            className="h-[18px] w-[18px] transition-transform group-active:scale-95"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
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

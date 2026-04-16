'use client';

import { useState, useEffect, useCallback } from 'react';
import FloatingNav from '@/src/components/admin/FloatingNav';
import { toast } from 'sonner';
import {
  BookOpen,
  TriangleAlert,
  Banknote,
  Phone,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  getRules,
  createRule,
  editRule,
  removeRule,
} from '@/src/lib/actions/rule-handbook';
import {
  getTrafficSigns,
  createTrafficSign,
  editTrafficSign,
  removeTrafficSign,
} from '@/src/lib/actions/traffic-sign';
import {
  getFines,
  createFine,
  editFine,
  removeFine,
} from '@/src/lib/actions/fine-guide';
import {
  getEmergencyContacts,
  createEmergencyContact,
  editEmergencyContact,
  removeEmergencyContact,
} from '@/src/lib/actions/emergency-contacts';
import type { RuleHandbook } from '@/src/lib/db/schema/rule-handbook';
import type { TrafficSign } from '@/src/lib/db/schema/traffic-sign';
import type { FineGuide } from '@/src/lib/db/schema/fine-guide';
import type { EmergencyContact } from '@/src/lib/db/schema/emergency-contacts';

// ── Neumorphism tokens ─────────────────────────────────
const BASE = '#E1E4E9';
const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

// ── Localized content type ─────────────────────────────
interface LocalizedContent { en: string; si: string; }

// ── Category badge colors ─────────────────────────────
const categoryColor: Record<string, string> = {
  General: '#3B82F6', Overtaking: '#F59E0B', Safety: '#10B981', Prohibited: '#EF4444',
  Regulatory: '#6366F1', Warning: '#F59E0B',
  Police: '#3B82F6', Medical: '#10B981', Fire: '#EF4444', Breakdown: '#F59E0B',
};

// ── Tab config ────────────────────────────────────────
type TabKey = 'rules' | 'signs' | 'fines' | 'contacts';
const TABS: { key: TabKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'rules', label: 'Rule Handbook', icon: BookOpen, color: '#3B82F6' },
  { key: 'signs', label: 'Traffic Signs', icon: TriangleAlert, color: '#F59E0B' },
  { key: 'fines', label: 'Fine Guide', icon: Banknote, color: '#EF4444' },
  { key: 'contacts', label: 'Emergency Contacts', icon: Phone, color: '#10B981' },
];

// ── Shared UI helpers ─────────────────────────────────
function LocalizedBadge({ content }: { content: LocalizedContent }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-bold text-slate-700">{content.en}</span>
      <span className="text-xs font-medium text-slate-400">{content.si}</span>
    </div>
  );
}

function CategoryBadge({ label }: { label: string }) {
  const color = categoryColor[label] ?? '#64748B';
  return (
    <span
      className="rounded-lg px-2 py-0.5 text-[10px] font-black tracking-widest uppercase whitespace-nowrap"
      style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}
    >
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}>
      <div className="relative w-full max-w-lg rounded-2xl p-8" style={{ background: BASE, boxShadow: nmOuter }}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-700">{title}</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}>
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full appearance-none rounded-xl border-0 px-4 py-2.5 text-sm font-bold text-slate-700 placeholder-slate-400 outline-none"
      style={{ background: BASE, boxShadow: nmPressed }}
    />
  );
}

function SaveCancelBtns({ onSave, onCancel, saving }: { onSave: () => void; onCancel: () => void; saving: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button onClick={onSave} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50" style={{ background: BASE, boxShadow: nmOuter }}>
        <Check size={14} /> {saving ? 'Saving...' : 'Save'}
      </button>
      <button onClick={onCancel} className="flex-1 rounded-xl py-3 text-xs font-black tracking-widest text-slate-500 uppercase" style={{ background: BASE, boxShadow: nmSubtle }}>Cancel</button>
    </div>
  );
}

// ── Rules Tab ─────────────────────────────────────────
function RulesTab() {
  const [items, setItems] = useState<RuleHandbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RuleHandbook | null>(null);
  const [form, setForm] = useState({ titleEn: '', titleSi: '', descEn: '', descSi: '', category: 'General' });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getRules();
    if (res.success) setItems(res.data as RuleHandbook[]);
    else toast.error('Failed to load rules');
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ titleEn: '', titleSi: '', descEn: '', descSi: '', category: 'General' }); setShowModal(true); };
  const openEdit = (item: RuleHandbook) => {
    setEditing(item);
    const t = item.title as LocalizedContent;
    const d = item.description as LocalizedContent;
    setForm({ titleEn: t.en, titleSi: t.si, descEn: d.en, descSi: d.si, category: item.category });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.titleEn.trim()) { toast.error('English title is required'); return; }
    setSaving(true);
    const payload = {
      title: { en: form.titleEn, si: form.titleSi },
      description: { en: form.descEn, si: form.descSi },
      category: form.category,
    };
    const res = editing
      ? await editRule(editing.id, payload)
      : await createRule(payload as any);
    if (res.success) { toast.success(res.message); setShowModal(false); load(); }
    else toast.error(res.message);
    setSaving(false);
  };

  const del = async (id: string) => {
    const res = await removeRule(id);
    if (res.success) { toast.success(res.message); load(); }
    else toast.error(res.message);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">{items.length} rules</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black tracking-widest text-blue-600 uppercase transition-all hover:scale-[1.02] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>
          <Plus size={14} /> Add Rule
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="py-12 text-center text-sm font-bold text-slate-400">No rules yet. Add one!</p>}
          {items.map(item => {
            const t = item.title as LocalizedContent;
            const d = item.description as LocalizedContent;
            return (
              <div key={item.id} className="rounded-2xl p-5" style={{ background: BASE, boxShadow: nmOuter }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <LocalizedBadge content={t} />
                      <CategoryBadge label={item.category} />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{d.en}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{d.si}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => openEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}><Pencil size={13} className="text-blue-500" /></button>
                    <button onClick={() => del(item.id)} className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}><Trash2 size={13} className="text-red-500" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? 'Edit Rule' : 'Add Rule'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title (English)"><Input value={form.titleEn} onChange={v => setForm({ ...form, titleEn: v })} placeholder="Speed Limits" /></Field>
              <Field label="Title (Sinhala)"><Input value={form.titleSi} onChange={v => setForm({ ...form, titleSi: v })} placeholder="වේග සීමා" /></Field>
            </div>
            <Field label="Description (English)"><Input value={form.descEn} onChange={v => setForm({ ...form, descEn: v })} placeholder="English description..." /></Field>
            <Field label="Description (Sinhala)"><Input value={form.descSi} onChange={v => setForm({ ...form, descSi: v })} placeholder="Sinhala description..." /></Field>
            <Field label="Category"><Input value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="General" /></Field>
            <SaveCancelBtns onSave={save} onCancel={() => setShowModal(false)} saving={saving} />
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Signs Tab ─────────────────────────────────────────
function SignsTab() {
  const [items, setItems] = useState<TrafficSign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TrafficSign | null>(null);
  const [form, setForm] = useState({ nameEn: '', nameSi: '', descEn: '', descSi: '', imageUrl: '', category: 'Regulatory' });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getTrafficSigns();
    if (res.success) setItems(res.data as TrafficSign[]);
    else toast.error('Failed to load traffic signs');
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ nameEn: '', nameSi: '', descEn: '', descSi: '', imageUrl: '', category: 'Regulatory' }); setShowModal(true); };
  const openEdit = (item: TrafficSign) => {
    setEditing(item);
    const n = item.name as LocalizedContent;
    const d = item.description as LocalizedContent;
    setForm({ nameEn: n.en, nameSi: n.si, descEn: d.en, descSi: d.si, imageUrl: item.imageUrl, category: item.category });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.nameEn.trim()) { toast.error('English name is required'); return; }
    setSaving(true);
    const payload = {
      name: { en: form.nameEn, si: form.nameSi },
      description: { en: form.descEn, si: form.descSi },
      imageUrl: form.imageUrl,
      category: form.category,
    };
    const res = editing
      ? await editTrafficSign(editing.id, payload)
      : await createTrafficSign(payload as any);
    if (res.success) { toast.success(res.message); setShowModal(false); load(); }
    else toast.error(res.message);
    setSaving(false);
  };

  const del = async (id: string) => {
    const res = await removeTrafficSign(id);
    if (res.success) { toast.success(res.message); load(); }
    else toast.error(res.message);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">{items.length} signs</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black tracking-widest text-amber-600 uppercase transition-all hover:scale-[1.02] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>
          <Plus size={14} /> Add Sign
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.length === 0 && <p className="col-span-2 py-12 text-center text-sm font-bold text-slate-400">No signs yet. Add one!</p>}
          {items.map(item => {
            const n = item.name as LocalizedContent;
            const d = item.description as LocalizedContent;
            return (
              <div key={item.id} className="rounded-2xl p-5" style={{ background: BASE, boxShadow: nmOuter }}>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl" style={{ background: BASE, boxShadow: nmPressed }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {item.imageUrl && <img src={item.imageUrl} alt={n.en} className="h-full w-full object-contain p-1" />}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <LocalizedBadge content={n} />
                      <CategoryBadge label={item.category} />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{d.en}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 justify-end">
                  <button onClick={() => openEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}><Pencil size={13} className="text-blue-500" /></button>
                  <button onClick={() => del(item.id)} className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}><Trash2 size={13} className="text-red-500" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? 'Edit Sign' : 'Add Traffic Sign'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name (English)"><Input value={form.nameEn} onChange={v => setForm({ ...form, nameEn: v })} placeholder="Stop Sign" /></Field>
              <Field label="Name (Sinhala)"><Input value={form.nameSi} onChange={v => setForm({ ...form, nameSi: v })} placeholder="නවත්වන්න" /></Field>
            </div>
            <Field label="Description (English)"><Input value={form.descEn} onChange={v => setForm({ ...form, descEn: v })} placeholder="English description..." /></Field>
            <Field label="Description (Sinhala)"><Input value={form.descSi} onChange={v => setForm({ ...form, descSi: v })} placeholder="Sinhala description..." /></Field>
            <Field label="Image URL"><Input value={form.imageUrl} onChange={v => setForm({ ...form, imageUrl: v })} placeholder="https://..." /></Field>
            <Field label="Category"><Input value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="Regulatory" /></Field>
            <SaveCancelBtns onSave={save} onCancel={() => setShowModal(false)} saving={saving} />
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Fines Tab ─────────────────────────────────────────
function FinesTab() {
  const [items, setItems] = useState<FineGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FineGuide | null>(null);
  const [form, setForm] = useState({ offenseEn: '', offenseSi: '', descEn: '', descSi: '', fineAmount: '', section: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getFines();
    if (res.success) setItems(res.data as FineGuide[]);
    else toast.error('Failed to load fine guide');
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ offenseEn: '', offenseSi: '', descEn: '', descSi: '', fineAmount: '', section: '' }); setShowModal(true); };
  const openEdit = (item: FineGuide) => {
    setEditing(item);
    const o = item.offense as LocalizedContent;
    const d = item.description as LocalizedContent;
    setForm({ offenseEn: o.en, offenseSi: o.si, descEn: d.en, descSi: d.si, fineAmount: String(item.fineAmount ?? ''), section: item.section ?? '' });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.offenseEn.trim()) { toast.error('English offense name is required'); return; }
    if (!form.fineAmount || isNaN(Number(form.fineAmount))) { toast.error('A valid fine amount is required'); return; }
    setSaving(true);
    const payload = {
      offense: { en: form.offenseEn, si: form.offenseSi },
      description: { en: form.descEn, si: form.descSi },
      fineAmount: form.fineAmount,
      section: form.section || null,
    };
    const res = editing
      ? await editFine(editing.id, payload as any)
      : await createFine(payload as any);
    if (res.success) { toast.success(res.message); setShowModal(false); load(); }
    else toast.error(res.message);
    setSaving(false);
  };

  const del = async (id: string) => {
    const res = await removeFine(id);
    if (res.success) { toast.success(res.message); load(); }
    else toast.error(res.message);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">{items.length} offenses</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black tracking-widest text-red-600 uppercase transition-all hover:scale-[1.02] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>
          <Plus size={14} /> Add Offense
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="py-12 text-center text-sm font-bold text-slate-400">No offenses yet. Add one!</p>}
          {items.map(item => {
            const o = item.offense as LocalizedContent;
            const d = item.description as LocalizedContent;
            return (
              <div key={item.id} className="rounded-2xl p-5" style={{ background: BASE, boxShadow: nmOuter }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <LocalizedBadge content={o} />
                    <p className="text-xs text-slate-500 leading-relaxed">{d.en}</p>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="rounded-lg px-3 py-1 text-xs font-black text-emerald-600" style={{ background: '#10B98115', border: '1px solid #10B98130' }}>
                        Rs. {Number(item.fineAmount).toLocaleString()}
                      </span>
                      {item.section && <span className="text-[11px] font-bold text-slate-400">{item.section}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => openEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}><Pencil size={13} className="text-blue-500" /></button>
                    <button onClick={() => del(item.id)} className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}><Trash2 size={13} className="text-red-500" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? 'Edit Offense' : 'Add Offense'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Offense (English)"><Input value={form.offenseEn} onChange={v => setForm({ ...form, offenseEn: v })} placeholder="Speeding" /></Field>
              <Field label="Offense (Sinhala)"><Input value={form.offenseSi} onChange={v => setForm({ ...form, offenseSi: v })} placeholder="සිංහල..." /></Field>
            </div>
            <Field label="Description (English)"><Input value={form.descEn} onChange={v => setForm({ ...form, descEn: v })} placeholder="English description..." /></Field>
            <Field label="Description (Sinhala)"><Input value={form.descSi} onChange={v => setForm({ ...form, descSi: v })} placeholder="Sinhala description..." /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fine Amount (Rs.)"><Input value={form.fineAmount} onChange={v => setForm({ ...form, fineAmount: v })} placeholder="3000" /></Field>
              <Field label="Legal Section"><Input value={form.section} onChange={v => setForm({ ...form, section: v })} placeholder="Section 141" /></Field>
            </div>
            <SaveCancelBtns onSave={save} onCancel={() => setShowModal(false)} saving={saving} />
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Contacts Tab ──────────────────────────────────────
function ContactsTab() {
  const [items, setItems] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EmergencyContact | null>(null);
  const [form, setForm] = useState({ nameEn: '', nameSi: '', descEn: '', descSi: '', phone: '', category: 'Police' });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getEmergencyContacts();
    if (res.success) setItems(res.data as EmergencyContact[]);
    else toast.error('Failed to load emergency contacts');
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ nameEn: '', nameSi: '', descEn: '', descSi: '', phone: '', category: 'Police' }); setShowModal(true); };
  const openEdit = (item: EmergencyContact) => {
    setEditing(item);
    const n = item.name as LocalizedContent;
    const d = item.description as LocalizedContent;
    setForm({ nameEn: n.en, nameSi: n.si, descEn: d.en, descSi: d.si, phone: item.phone, category: item.category });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.nameEn.trim()) { toast.error('English name is required'); return; }
    if (!form.phone.trim()) { toast.error('Phone number is required'); return; }
    setSaving(true);
    const payload = {
      name: { en: form.nameEn, si: form.nameSi },
      description: { en: form.descEn, si: form.descSi },
      phone: form.phone,
      category: form.category,
    };
    const res = editing
      ? await editEmergencyContact(editing.id, payload)
      : await createEmergencyContact(payload as any);
    if (res.success) { toast.success(res.message); setShowModal(false); load(); }
    else toast.error(res.message);
    setSaving(false);
  };

  const del = async (id: string) => {
    const res = await removeEmergencyContact(id);
    if (res.success) { toast.success(res.message); load(); }
    else toast.error(res.message);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">{items.length} contacts</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.02] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>
          <Plus size={14} /> Add Contact
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.length === 0 && <p className="col-span-2 py-12 text-center text-sm font-bold text-slate-400">No contacts yet. Add one!</p>}
          {items.map(item => {
            const n = item.name as LocalizedContent;
            const d = item.description as LocalizedContent;
            const color = categoryColor[item.category] ?? '#64748B';
            return (
              <div key={item.id} className="rounded-2xl p-5" style={{ background: BASE, boxShadow: nmOuter }}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Phone size={20} style={{ color }} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <LocalizedBadge content={n} />
                      <CategoryBadge label={item.category} />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{d.en}</p>
                    <span className="inline-block rounded-xl px-3 py-1 font-mono text-sm font-black" style={{ color, background: `${color}15` }}>{item.phone}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 justify-end">
                  <button onClick={() => openEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}><Pencil size={13} className="text-blue-500" /></button>
                  <button onClick={() => del(item.id)} className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}><Trash2 size={13} className="text-red-500" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? 'Edit Contact' : 'Add Emergency Contact'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name (English)"><Input value={form.nameEn} onChange={v => setForm({ ...form, nameEn: v })} placeholder="Police Emergency" /></Field>
              <Field label="Name (Sinhala)"><Input value={form.nameSi} onChange={v => setForm({ ...form, nameSi: v })} placeholder="සිංහල..." /></Field>
            </div>
            <Field label="Description (English)"><Input value={form.descEn} onChange={v => setForm({ ...form, descEn: v })} placeholder="English description..." /></Field>
            <Field label="Description (Sinhala)"><Input value={form.descSi} onChange={v => setForm({ ...form, descSi: v })} placeholder="Sinhala description..." /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone Number"><Input value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="119" /></Field>
              <Field label="Category"><Input value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="Police" /></Field>
            </div>
            <SaveCancelBtns onSave={save} onCancel={() => setShowModal(false)} saving={saving} />
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────
export default function RulesManagementPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('rules');
  const activeTabConfig = TABS.find(t => t.key === activeTab)!;

  const renderTab = () => {
    switch (activeTab) {
      case 'rules': return <RulesTab />;
      case 'signs': return <SignsTab />;
      case 'fines': return <FinesTab />;
      case 'contacts': return <ContactsTab />;
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col font-sans"
      style={{
        background: BASE,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      <FloatingNav />

      {/* ── Header ──────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 flex items-center gap-4 px-8 py-4" style={{ background: BASE }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: BASE, boxShadow: nmSubtle }}>
          <activeTabConfig.icon size={16} style={{ color: activeTabConfig.color }} />
        </div>
        <div>
          <span className="text-sm font-bold text-slate-700">Rules & Information</span>
          <span className="ml-2 text-xs text-slate-400">/ Content Management</span>
        </div>
      </nav>

      {/* ── Full-width Tab Bar ───────────────────────────── */}
      <div className="sticky top-[57px] z-30 px-8 pb-4" style={{ background: BASE }}>
        <div className="flex rounded-2xl p-1.5" style={{ background: BASE, boxShadow: nmPressed }}>
          {TABS.map(tab => {
            const isActive = tab.key === activeTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-[11px] font-black tracking-widest uppercase transition-all duration-300"
                style={{
                  background: isActive ? BASE : 'transparent',
                  boxShadow: isActive ? nmOuter : 'none',
                  color: isActive ? tab.color : '#94a3b8',
                }}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content Area ────────────────────────────────── */}
      <main className="flex-1 px-8 pb-16 pt-2">
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import FloatingNav from '@/src/components/admin/FloatingNav';
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
} from 'lucide-react';

// ── Neumorphism tokens ─────────────────────────────────
const BASE = '#E1E4E9';
const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

// ── Types ──────────────────────────────────────────────
interface LocalizedContent { en: string; si: string; }

interface RuleHandbook {
  id: string;
  title: LocalizedContent;
  description: LocalizedContent;
  category: string;
}

interface TrafficSign {
  id: string;
  name: LocalizedContent;
  description: LocalizedContent;
  imageUrl: string;
  category: string;
}

interface FineGuide {
  id: string;
  offense: LocalizedContent;
  description: LocalizedContent;
  fineAmount: string;
  section: string | null;
}

interface EmergencyContact {
  id: string;
  name: LocalizedContent;
  description: LocalizedContent;
  phone: string;
  category: string;
}

// ── Mock Data ──────────────────────────────────────────
const mockRules: RuleHandbook[] = [
  { id: '1', title: { en: 'Speed Limits', si: 'වේග සීමා' }, description: { en: 'Urban roads: 50 km/h, Highways: 100 km/h, Expressways: 100 km/h.', si: 'නාගරික මාර්ග: 50 km/h, අධිවේගී: 100 km/h.' }, category: 'General' },
  { id: '2', title: { en: 'Overtaking Rules', si: 'ඉදිරි යාමේ නීති' }, description: { en: 'Only overtake on the right side. Do not overtake at junctions or pedestrian crossings.', si: 'දකුණු පසින් පමණක් ඉදිරි යන්න. හන්දිවල ඉදිරි නොයන්න.' }, category: 'Overtaking' },
  { id: '3', title: { en: 'Seatbelt Regulations', si: 'ආසන පටි රෙගුලාසි' }, description: { en: 'All occupants in the front and rear seats must wear seat belts at all times.', si: 'ඉදිරිපස හා පසුපස ආසනවල සිටින සියලු දෙනා සීට් බෙල්ට් පැළඳිය යුතුය.' }, category: 'Safety' },
  { id: '4', title: { en: 'Mobile Phone Use', si: 'ජංගම දුරකථන භාවිතය' }, description: { en: 'Using a handheld mobile phone while driving is strictly prohibited.', si: 'රිය පදවනු ලබන අතරතුර ජංගම දුරකථනය අතේ ගෙන භාවිතා කිරීම සපුරා තහනම්.' }, category: 'Prohibited' },
];

const mockSigns: TrafficSign[] = [
  { id: '1', name: { en: 'Stop Sign', si: 'නවත්වන්න' }, description: { en: 'You must come to a complete stop and yield to all traffic.', si: 'ඔබ සම්පූර්ණයෙන්ම නතර විය යුතු අතර සියලු රථ වාහනවලට ඉඩ දිය යුතුය.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/MUTCD_R1-1.svg/96px-MUTCD_R1-1.svg.png', category: 'Regulatory' },
  { id: '2', name: { en: 'No Entry', si: 'ඇතුළු නොවීම' }, description: { en: 'Entry to the road ahead is prohibited.', si: 'ඉදිරිපස මාර්ගයට ඇතුළු වීම තහනම්ය.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/MUTCD_R5-1.svg/96px-MUTCD_R5-1.svg.png', category: 'Regulatory' },
  { id: '3', name: { en: 'Give Way', si: 'ඉඩ දෙන්න' }, description: { en: 'Slow down and give priority to vehicles on the main road.', si: 'මාර්ගය මත රථ වාහනවලට ප්‍රමුඛතාව දෙන්න.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/UK_traffic_sign_602.svg/96px-UK_traffic_sign_602.svg.png', category: 'Regulatory' },
  { id: '4', name: { en: 'Sharp Bend Ahead', si: 'ඉදිරියේ තියුණු වමොරු' }, description: { en: 'A sharp bend is ahead, reduce speed.', si: 'ඉදිරිපස තියුණු හැරවීමක් ඇත, වේගය අඩු කරන්න.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UK_traffic_sign_512.svg/96px-UK_traffic_sign_512.svg.png', category: 'Warning' },
];

const mockFines: FineGuide[] = [
  { id: '1', offense: { en: 'Exceeding Speed Limit', si: 'වේග සීමාව ඉක්මවීම' }, description: { en: 'Driving beyond the defined speed limit on any road.', si: 'ඕනෑම මාර්ගයක නිශ්චිත වේග සීමාව ඉකමවා රිය පැදවීම.' }, fineAmount: '3000', section: 'Section 141' },
  { id: '2', offense: { en: 'Using Mobile Phone While Driving', si: 'රිය පැදවීමේදී ජංගම දුරකථනය භාවිතය' }, description: { en: 'Using a handheld device while operating a vehicle.', si: 'රිය ක්‍රියාත්මක කිරීමේදී ජංගම උපකරණයක් æaවිතා කිරීම.' }, fineAmount: '2000', section: 'Section 152' },
  { id: '3', offense: { en: 'Not Wearing Seatbelt', si: 'ආසන පටිය නොදැමීම' }, description: { en: 'Failure to wear a seatbelt as the driver or passenger.', si: 'රියැදුරා හෝ මගියා ලෙස ආසන පටිය නොදැමීම.' }, fineAmount: '1000', section: 'Section 148B' },
  { id: '4', offense: { en: 'Parking in a No-Parking Zone', si: 'ස්ථානගත කිරීම තහනම් ස්ථානවල ගාල් කිරීම' }, description: { en: 'Leaving a vehicle in a zone designated as no-parking.', si: 'ස්ථානගත කිරීම තහනම් ස්ථානයක රථයක් සිටවීම.' }, fineAmount: '1500', section: null },
];

const mockContacts: EmergencyContact[] = [
  { id: '1', name: { en: 'Police Emergency', si: 'පොලිස් හදිසි' }, description: { en: 'National emergency line for the Sri Lanka Police.', si: 'ශ්‍රී ලංකා පොලිසිය සඳහා ජාතික හදිසි මාර්ගය.' }, phone: '119', category: 'Police' },
  { id: '2', name: { en: 'Ambulance Service', si: 'ගිලන්රථ සේවය' }, description: { en: 'Call for immediate medical emergency assistance.', si: 'වඩාත් ඉම් මෛද්‍ය හදිසි ආධාරය සඳහා අමතන්න.' }, phone: '1990', category: 'Medical' },
  { id: '3', name: { en: 'Fire & Rescue', si: 'ගිනි නිවීම සහ ගලවා ගැනීම' }, description: { en: 'Sri Lanka Fire and Rescue Services.', si: 'ශ්‍රී ලංකා ගිනි නිවීම හා ගලවා ගැනීමේ සේවා.' }, phone: '111', category: 'Fire' },
  { id: '4', name: { en: 'Road Breakdown Assistance', si: 'මාර්ග බිඳ වැටීමේ ආධාරය' }, description: { en: 'AA Ceylon roadside assistance for vehicle breakdowns.', si: 'රථ බිඳ වැටීම් සඳහා AA Ceylon ආධාරය.' }, phone: '011-2423888', category: 'Breakdown' },
];

// ── Category badge colors ─────────────────────────────
const categoryColor: Record<string, string> = {
  General: '#3B82F6', Overtaking: '#F59E0B', Safety: '#10B981', Prohibited: '#EF4444',
  Regulatory: '#6366F1', Warning: '#F59E0B', Warning2: '#F97316',
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
      className="rounded-lg px-2 py-0.5 text-[10px] font-black tracking-widest uppercase"
      style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}
    >
      {label}
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}>
      <div className="relative w-full max-w-lg rounded-2xl p-8" style={{ background: BASE, boxShadow: nmOuter }}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-700">{title}</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>
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

// ── Rules Tab ─────────────────────────────────────────
function RulesTab() {
  const [items, setItems] = useState<RuleHandbook[]>(mockRules);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RuleHandbook | null>(null);
  const [form, setForm] = useState({ titleEn: '', titleSi: '', descEn: '', descSi: '', category: 'General' });

  const openAdd = () => {
    setEditing(null);
    setForm({ titleEn: '', titleSi: '', descEn: '', descSi: '', category: 'General' });
    setShowModal(true);
  };

  const openEdit = (item: RuleHandbook) => {
    setEditing(item);
    setForm({ titleEn: item.title.en, titleSi: item.title.si, descEn: item.description.en, descSi: item.description.si, category: item.category });
    setShowModal(true);
  };

  const save = () => {
    if (!form.titleEn) return;
    if (editing) {
      setItems(items.map(i => i.id === editing.id ? { ...i, title: { en: form.titleEn, si: form.titleSi }, description: { en: form.descEn, si: form.descSi }, category: form.category } : i));
    } else {
      setItems([...items, { id: Date.now().toString(), title: { en: form.titleEn, si: form.titleSi }, description: { en: form.descEn, si: form.descSi }, category: form.category }]);
    }
    setShowModal(false);
  };

  const del = (id: string) => setItems(items.filter(i => i.id !== id));

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">{items.length} rules</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black tracking-widest text-blue-600 uppercase transition-all hover:scale-[1.02] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>
          <Plus size={14} /> Add Rule
        </button>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="rounded-2xl p-5 transition-all" style={{ background: BASE, boxShadow: nmOuter }}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <LocalizedBadge content={item.title} />
                  <CategoryBadge label={item.category} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description.en}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description.si}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => openEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}><Pencil size={13} className="text-blue-500" /></button>
                <button onClick={() => del(item.id)} className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}><Trash2 size={13} className="text-red-500" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
            <div className="flex gap-3 pt-2">
              <button onClick={save} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.01] active:scale-95" style={{ background: BASE, boxShadow: nmOuter }}><Check size={14} /> Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl py-3 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:scale-[1.01] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Signs Tab ─────────────────────────────────────────
function SignsTab() {
  const [items, setItems] = useState<TrafficSign[]>(mockSigns);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TrafficSign | null>(null);
  const [form, setForm] = useState({ nameEn: '', nameSi: '', descEn: '', descSi: '', imageUrl: '', category: 'Regulatory' });

  const openAdd = () => { setEditing(null); setForm({ nameEn: '', nameSi: '', descEn: '', descSi: '', imageUrl: '', category: 'Regulatory' }); setShowModal(true); };
  const openEdit = (item: TrafficSign) => { setEditing(item); setForm({ nameEn: item.name.en, nameSi: item.name.si, descEn: item.description.en, descSi: item.description.si, imageUrl: item.imageUrl, category: item.category }); setShowModal(true); };
  const save = () => {
    if (!form.nameEn) return;
    const updated = { name: { en: form.nameEn, si: form.nameSi }, description: { en: form.descEn, si: form.descSi }, imageUrl: form.imageUrl, category: form.category };
    if (editing) setItems(items.map(i => i.id === editing.id ? { ...i, ...updated } : i));
    else setItems([...items, { id: Date.now().toString(), ...updated }]);
    setShowModal(false);
  };
  const del = (id: string) => setItems(items.filter(i => i.id !== id));

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">{items.length} signs</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black tracking-widest text-amber-600 uppercase transition-all hover:scale-[1.02] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>
          <Plus size={14} /> Add Sign
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(item => (
          <div key={item.id} className="rounded-2xl p-5 transition-all" style={{ background: BASE, boxShadow: nmOuter }}>
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl" style={{ background: BASE, boxShadow: nmPressed }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.name.en} className="h-full w-full object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <LocalizedBadge content={item.name} />
                  <CategoryBadge label={item.category} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description.en}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => openEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}><Pencil size={13} className="text-blue-500" /></button>
              <button onClick={() => del(item.id)} className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}><Trash2 size={13} className="text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
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
            <div className="flex gap-3 pt-2">
              <button onClick={save} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.01] active:scale-95" style={{ background: BASE, boxShadow: nmOuter }}><Check size={14} /> Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl py-3 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:scale-[1.01] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Fines Tab ─────────────────────────────────────────
function FinesTab() {
  const [items, setItems] = useState<FineGuide[]>(mockFines);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FineGuide | null>(null);
  const [form, setForm] = useState({ offenseEn: '', offenseSi: '', descEn: '', descSi: '', fineAmount: '', section: '' });

  const openAdd = () => { setEditing(null); setForm({ offenseEn: '', offenseSi: '', descEn: '', descSi: '', fineAmount: '', section: '' }); setShowModal(true); };
  const openEdit = (item: FineGuide) => { setEditing(item); setForm({ offenseEn: item.offense.en, offenseSi: item.offense.si, descEn: item.description.en, descSi: item.description.si, fineAmount: item.fineAmount, section: item.section ?? '' }); setShowModal(true); };
  const save = () => {
    if (!form.offenseEn) return;
    const updated = { offense: { en: form.offenseEn, si: form.offenseSi }, description: { en: form.descEn, si: form.descSi }, fineAmount: form.fineAmount, section: form.section || null };
    if (editing) setItems(items.map(i => i.id === editing.id ? { ...i, ...updated } : i));
    else setItems([...items, { id: Date.now().toString(), ...updated }]);
    setShowModal(false);
  };
  const del = (id: string) => setItems(items.filter(i => i.id !== id));

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">{items.length} offenses</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black tracking-widest text-red-600 uppercase transition-all hover:scale-[1.02] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>
          <Plus size={14} /> Add Offense
        </button>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="rounded-2xl p-5 transition-all" style={{ background: BASE, boxShadow: nmOuter }}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <LocalizedBadge content={item.offense} />
                <p className="text-xs text-slate-500 leading-relaxed">{item.description.en}</p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="rounded-lg px-3 py-1 text-xs font-black text-emerald-600" style={{ background: '#10B98115', border: '1px solid #10B98130' }}>
                    Rs. {Number(item.fineAmount).toLocaleString()}
                  </span>
                  {item.section && (
                    <span className="text-[11px] font-bold text-slate-400">{item.section}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}><Pencil size={13} className="text-blue-500" /></button>
                <button onClick={() => del(item.id)} className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}><Trash2 size={13} className="text-red-500" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
              <Field label="Fine Amount (Rs.)"><Input value={form.fineAmount} onChange={v => setForm({ ...form, fineAmount: v })} placeholder="1000" /></Field>
              <Field label="Legal Section"><Input value={form.section} onChange={v => setForm({ ...form, section: v })} placeholder="Section 141" /></Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={save} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.01] active:scale-95" style={{ background: BASE, boxShadow: nmOuter }}><Check size={14} /> Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl py-3 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:scale-[1.01] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Contacts Tab ──────────────────────────────────────
function ContactsTab() {
  const [items, setItems] = useState<EmergencyContact[]>(mockContacts);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EmergencyContact | null>(null);
  const [form, setForm] = useState({ nameEn: '', nameSi: '', descEn: '', descSi: '', phone: '', category: 'Police' });

  const openAdd = () => { setEditing(null); setForm({ nameEn: '', nameSi: '', descEn: '', descSi: '', phone: '', category: 'Police' }); setShowModal(true); };
  const openEdit = (item: EmergencyContact) => { setEditing(item); setForm({ nameEn: item.name.en, nameSi: item.name.si, descEn: item.description.en, descSi: item.description.si, phone: item.phone, category: item.category }); setShowModal(true); };
  const save = () => {
    if (!form.nameEn || !form.phone) return;
    const updated = { name: { en: form.nameEn, si: form.nameSi }, description: { en: form.descEn, si: form.descSi }, phone: form.phone, category: form.category };
    if (editing) setItems(items.map(i => i.id === editing.id ? { ...i, ...updated } : i));
    else setItems([...items, { id: Date.now().toString(), ...updated }]);
    setShowModal(false);
  };
  const del = (id: string) => setItems(items.filter(i => i.id !== id));

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">{items.length} contacts</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.02] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>
          <Plus size={14} /> Add Contact
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(item => {
          const color = categoryColor[item.category] ?? '#64748B';
          return (
            <div key={item.id} className="rounded-2xl p-5 transition-all" style={{ background: BASE, boxShadow: nmOuter }}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Phone size={20} style={{ color }} />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <LocalizedBadge content={item.name} />
                    <CategoryBadge label={item.category} />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.description.en}</p>
                  <span className="inline-block rounded-xl px-3 py-1 font-mono text-sm font-black" style={{ color, background: `${color}15` }}>{item.phone}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => openEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}><Pencil size={13} className="text-blue-500" /></button>
                <button onClick={() => del(item.id)} className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}><Trash2 size={13} className="text-red-500" /></button>
              </div>
            </div>
          );
        })}
      </div>
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
            <div className="flex gap-3 pt-2">
              <button onClick={save} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-black tracking-widest text-emerald-600 uppercase transition-all hover:scale-[1.01] active:scale-95" style={{ background: BASE, boxShadow: nmOuter }}><Check size={14} /> Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl py-3 text-xs font-black tracking-widest text-slate-500 uppercase transition-all hover:scale-[1.01] active:scale-95" style={{ background: BASE, boxShadow: nmSubtle }}>Cancel</button>
            </div>
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
        <div
          key={activeTab}
          className="animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {renderTab()}
        </div>
      </main>
    </div>
  );
}

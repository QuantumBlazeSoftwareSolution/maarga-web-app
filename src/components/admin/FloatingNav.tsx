'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Upload,
  MapPin,
  Fuel,
  BarChart,
  BookOpen,
  LogOut,
  LucideIcon,
} from 'lucide-react';

// ── Neumorphism tokens (same as dashboard) ─────────────────────────────────
const BASE = '#E1E4E9';
const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';

// ── Corner snap positions ──────────────────────────────────────────────────
type Corner = 'tl' | 'tr' | 'bl' | 'br';

const BUBBLE_SIZE = 56; // px — the collapsed bubble diameter
const MARGIN = 20; // px — distance from screen edge when snapped
const DRAG_THRESHOLD = 8; // px — minimum movement before drag activates

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Sign Out',
    icon: LogOut,
    path: '/developer-back-door/login',
    color: '#EF4444',
  },
  {
    label: 'API Docs',
    icon: BookOpen,
    path: '/api-docs',
    color: '#10B981',
  },
  {
    label: 'Reports',
    icon: BarChart,
    path: '/developer-back-door/dashboard/reports',
    color: '#F59E0B',
  },
  {
    label: 'Station Items',
    icon: Fuel,
    path: '/developer-back-door/dashboard/station-items',
    color: '#8B5CF6',
  },
  {
    label: 'Stations',
    icon: MapPin,
    path: '/developer-back-door/dashboard/stations',
    color: '#10B981',
  },
  {
    label: 'Import Data',
    icon: Upload,
    path: '/developer-back-door/dashboard/station-import',
    color: '#6366F1',
  },
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/developer-back-door/dashboard',
    color: '#3B82F6',
  },
];

function getCornerPosition(corner: Corner): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  switch (corner) {
    case 'tl':
      return { x: MARGIN, y: MARGIN };
    case 'tr':
      return { x: vw - BUBBLE_SIZE - MARGIN, y: MARGIN };
    case 'bl':
      return { x: MARGIN, y: vh - BUBBLE_SIZE - MARGIN };
    case 'br':
      return { x: vw - BUBBLE_SIZE - MARGIN, y: vh - BUBBLE_SIZE - MARGIN };
  }
}

function getNearestCorner(x: number, y: number): Corner {
  const cx = x + BUBBLE_SIZE / 2;
  const cy = y + BUBBLE_SIZE / 2;
  const midX = window.innerWidth / 2;
  const midY = window.innerHeight / 2;
  if (cx < midX && cy < midY) return 'tl';
  if (cx >= midX && cy < midY) return 'tr';
  if (cx < midX && cy >= midY) return 'bl';
  return 'br';
}

export default function FloatingNav() {
  const router = useRouter();

  // Use lazy initializer — runs only on client (window exists), null during SSR
  const [pos, setPos] = useState<{ x: number; y: number } | null>(() => {
    if (typeof window === 'undefined') return null;
    return getCornerPosition('br');
  });
  const [corner, setCorner] = useState<Corner>('br');
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  // Refs for drag tracking
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 }); // pointer position at pointerdown
  const hasMoved = useRef(false); // true once drag threshold exceeded
  const isDragActive = useRef(false); // mirrors isDragging for callbacks
  const isPointerDown = useRef(false); // guard: only process moves when button held
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Snap to a corner with smooth transition
  const snapToCorner = useCallback((c: Corner) => {
    setCorner(c);
    setIsSnapping(true);
    setPos(getCornerPosition(c));
    setTimeout(() => setIsSnapping(false), 300);
  }, []);

  // Re-snap when window resizes
  useEffect(() => {
    const onResize = () => snapToCorner(corner);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [corner, snapToCorner]);

  // ── Pointer drag handlers ────────────────────────────────────────────────
  // Drag only activates after pointer moves ≥8px — so a quick tap always opens menu

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-nav-item]')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    isPointerDown.current = true;
    hasMoved.current = false;
    isDragActive.current = false;

    const rect = bubbleRef.current!.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only process movement when a button is actually held down
    if (!isPointerDown.current) return;

    // Check distance from initial press to decide if this is a drag
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (!isDragActive.current && dist < DRAG_THRESHOLD) return; // Still a potential tap

    // Threshold exceeded — activate drag mode
    if (!isDragActive.current) {
      isDragActive.current = true;
      hasMoved.current = true;
      setIsOpen(false);
      setIsDragging(true);
    }

    e.preventDefault();
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  }, []);

  const onPointerUp = useCallback(() => {
    isPointerDown.current = false;
    const wasDragging = isDragActive.current;
    isDragActive.current = false;
    setIsDragging(false);

    if (wasDragging && pos) {
      // It was a real drag — snap to nearest corner
      const nearest = getNearestCorner(pos.x, pos.y);
      snapToCorner(nearest);
    } else if (!hasMoved.current) {
      // Clean tap — toggle menu
      setIsOpen((prev) => !prev);
    }
  }, [pos, snapToCorner]);

  const handleNavClick = useCallback(
    (path: string) => {
      setIsOpen(false);
      router.push(path);
    },
    [router],
  );

  if (!pos) return null; // Not yet mounted

  // Determine which side the menu should open towards (avoid going off-screen)
  const openLeft = corner === 'tr' || corner === 'br';
  const openUp = corner === 'bl' || corner === 'br';

  return (
    <div
      ref={bubbleRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        transition: isSnapping
          ? 'left 0.3s cubic-bezier(0.34,1.56,0.64,1), top 0.3s cubic-bezier(0.34,1.56,0.64,1)'
          : 'none',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* ── Expanded menu panel ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          [openLeft ? 'right' : 'left']: BUBBLE_SIZE + 12,
          [openUp ? 'bottom' : 'top']: 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? 'scale(1) translateY(0)'
            : `scale(0.85) translateY(${openUp ? 12 : -12}px)`,
          transformOrigin: openLeft
            ? openUp
              ? 'bottom right'
              : 'top right'
            : openUp
              ? 'bottom left'
              : 'top left',
          transition:
            'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          background: BASE,
          boxShadow: nmOuter,
          borderRadius: 16,
          padding: '12px 8px',
          minWidth: 200,
          display: 'flex',
          flexDirection: openUp ? 'column-reverse' : 'column',
          gap: 6,
        }}
      >
        {/* Section label */}
        <div
          style={{
            padding: '4px 12px 2px',
            display: openUp ? 'none' : 'block',
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#9ca3af',
            }}
          >
            Navigation
          </span>
        </div>

        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.label}
            data-nav-item="true"
            onClick={() => handleNavClick(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 12,
              border: 'none',
              background: BASE,
              boxShadow: nmSubtle,
              cursor: 'pointer',
              transition: `opacity 0.2s ease ${i * 0.04}s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.04}s, box-shadow 0.15s ease`,
              opacity: isOpen ? 1 : 0,
              transform: isOpen
                ? 'translateX(0)'
                : `translateX(${openLeft ? 16 : -16}px)`,
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = nmPressed)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = nmSubtle)}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = 'scale(0.97)')
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Icon container */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: BASE,
                boxShadow: nmPressed,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <item.icon size={16} color={item.color} strokeWidth={2.2} />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#374151',
                fontFamily: 'Inter, -apple-system, sans-serif',
              }}
            >
              {item.label}
            </span>
          </button>
        ))}

        {/* Divider before label when opening upward */}
        {openUp && (
          <div style={{ padding: '2px 12px 4px' }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#9ca3af',
              }}
            >
              Navigation
            </span>
          </div>
        )}
      </div>

      {/* ── Main floating bubble ────────────────────────────────────── */}
      <div
        style={{
          width: BUBBLE_SIZE,
          height: BUBBLE_SIZE,
          borderRadius: 16,
          background: BASE,
          boxShadow: isOpen ? nmPressed : nmOuter,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'pointer',
          transition: 'box-shadow 0.2s ease, transform 0.15s ease',
          transform: isDragging ? 'scale(1.08)' : 'scale(1)',
          position: 'relative',
        }}
      >
        {/* Hamburger icon — visible when closed */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#374151"
          strokeWidth={2.2}
          strokeLinecap="round"
          style={{
            position: 'absolute',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            opacity: isOpen ? 0 : 1,
            transform: isOpen
              ? 'rotate(-45deg) scale(0.7)'
              : 'rotate(0deg) scale(1)',
          }}
        >
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </svg>
        {/* X icon — visible when open */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#374151"
          strokeWidth={2.2}
          strokeLinecap="round"
          style={{
            position: 'absolute',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            opacity: isOpen ? 1 : 0,
            transform: isOpen
              ? 'rotate(0deg) scale(1)'
              : 'rotate(45deg) scale(0.7)',
          }}
        >
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </svg>

        {/* Drag hint tooltip — only while dragging */}
        {isDragging && (
          <div
            style={{
              position: 'absolute',
              bottom: BUBBLE_SIZE + 6,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1f2937',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              opacity: 0.85,
            }}
          >
            Drop to snap ↗↙
          </div>
        )}
      </div>
    </div>
  );
}

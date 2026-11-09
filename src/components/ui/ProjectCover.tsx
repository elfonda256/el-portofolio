import type { CoverArt } from "@/data/types";

/**
 * Monochrome technical illustrations used as project imagery until a real
 * screenshot/photo is added (set `image` on the project). They depict the
 * kind of system, never a fake screenshot of the actual product.
 */

const INK = "#171717";
const MUTED = "#a3a3a3";
const PAPER = "#ffffff";

// Small deterministic PRNG so server and client render identical art.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function DotGrid({ id, step = 16, opacity = 0.18 }: { id: string; step?: number; opacity?: number }) {
  return (
    <>
      <defs>
        <pattern id={id} width={step} height={step} patternUnits="userSpaceOnUse">
          <circle cx={step / 2} cy={step / 2} r={0.8} fill={INK} opacity={opacity} />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#${id})`} />
    </>
  );
}

function Label({ x, y, children, anchor = "start" }: { x: number; y: number; children: string; anchor?: "start" | "end" | "middle" }) {
  return (
    <text x={x} y={y} fontFamily="ui-monospace, monospace" fontSize="7" letterSpacing="0.6" fill={INK} opacity={0.55} textAnchor={anchor}>
      {children}
    </text>
  );
}

/* ── Telemetry: canal network, stations and radio links ─────────── */
function Telemetry({ uid }: { uid: string }) {
  const stations = [
    [62, 210], [104, 176], [150, 160], [196, 168], [238, 142], [276, 112], [318, 98], [128, 238], [222, 212],
  ];
  return (
    <>
      <DotGrid id={`g-tel-${uid}`} />
      {/* main canal */}
      <path d="M20 236 C 80 220, 90 180, 150 162 S 240 150, 280 110 S 340 92, 384 70" fill="none" stroke={INK} strokeOpacity={0.12} strokeWidth={14} strokeLinecap="round" />
      <path d="M20 236 C 80 220, 90 180, 150 162 S 240 150, 280 110 S 340 92, 384 70" fill="none" stroke={INK} strokeWidth={1.2} />
      {/* branches */}
      <path d="M104 176 C 110 205, 120 225, 128 238 L 130 284" fill="none" stroke={INK} strokeWidth={1} strokeDasharray="0" opacity={0.7} />
      <path d="M196 168 C 205 190, 214 200, 222 212 L 236 284" fill="none" stroke={INK} strokeWidth={1} opacity={0.7} />
      {/* gateway tower */}
      <g transform="translate(330 40)">
        <path d="M0 40 L8 0 L16 40 M3 26 H13 M5 14 H11" stroke={INK} strokeWidth={1.2} fill="none" />
        {[10, 18, 26].map((r) => (
          <path key={r} d={`M${8 - r * 0.7} ${-r * 0.4} A ${r} ${r} 0 0 1 ${8 + r * 0.7} ${-r * 0.4}`} transform="translate(0 4)" fill="none" stroke={INK} strokeWidth={0.9} opacity={0.5} />
        ))}
      </g>
      <Label x={352} y={92}>GATEWAY</Label>
      {/* links */}
      {stations.slice(2, 7).map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2={338} y2={44} stroke={INK} strokeWidth={0.6} strokeDasharray="2 3" opacity={0.45} />
      ))}
      {/* stations */}
      {stations.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={7} fill={PAPER} stroke={INK} strokeWidth={1} />
          <circle cx={x} cy={y} r={2.4} fill={i % 3 === 0 ? INK : MUTED} />
        </g>
      ))}
      <Label x={62} y={196} anchor="middle">T-01</Label>
      <Label x={150} y={146} anchor="middle">T-03</Label>
      <Label x={276} y={98} anchor="middle">TC-02</Label>
      {/* reading card */}
      <g transform="translate(24 64)">
        <rect width="132" height="74" rx="10" fill={PAPER} stroke={INK} strokeOpacity={0.12} />
        <Label x={12} y={18}>WATER LEVEL</Label>
        <circle cx={118} cy={15} r={3} fill="#22a05a" />
        <path d="M12 58 L26 50 L40 54 L54 40 L68 44 L82 32 L96 36 L110 26 L120 30" fill="none" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
        <path d="M12 58 L26 50 L40 54 L54 40 L68 44 L82 32 L96 36 L110 26 L120 30 L120 64 L12 64Z" fill={INK} opacity={0.05} />
      </g>
    </>
  );
}

/* ── Catering: operations dashboard wireframe ─────────────────────── */
function Catering({ uid }: { uid: string }) {
  const bars = [38, 52, 44, 66, 58, 74, 62];
  return (
    <>
      <DotGrid id={`g-cat-${uid}`} opacity={0.12} />
      <g transform="translate(36 34)">
        <rect width="300" height="232" rx="14" fill={PAPER} stroke={INK} strokeOpacity={0.1} />
        {/* sidebar */}
        <rect x="0" y="0" width="64" height="232" rx="14" fill={INK} />
        <rect x="50" y="0" width="14" height="232" fill={INK} />
        <circle cx="20" cy="22" r="6" fill={PAPER} />
        {[52, 72, 92, 112, 132].map((y, i) => (
          <rect key={y} x="14" y={y} width={i === 1 ? 36 : 28} height="5" rx="2.5" fill={PAPER} opacity={i === 1 ? 0.95 : 0.35} />
        ))}
        {/* KPI cards */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${78 + i * 72} 16)`}>
            <rect width="64" height="44" rx="8" fill="#f5f5f4" />
            <rect x="9" y="10" width="26" height="4" rx="2" fill={INK} opacity={0.3} />
            <rect x="9" y="22" width={i === 0 ? 40 : 32} height="10" rx="3" fill={INK} opacity={0.85} />
          </g>
        ))}
        {/* chart */}
        <g transform="translate(78 72)">
          <rect width="136" height="92" rx="8" fill="#f5f5f4" />
          {bars.map((h, i) => (
            <rect key={i} x={12 + i * 17} y={80 - h} width="9" height={h} rx="2" fill={INK} opacity={i === 5 ? 0.9 : 0.25} />
          ))}
        </g>
        {/* order list */}
        <g transform="translate(222 72)">
          <rect width="64" height="146" rx="8" fill="#f5f5f4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(8 ${10 + i * 27})`}>
              <rect width="48" height="20" rx="5" fill={PAPER} />
              <circle cx="9" cy="10" r="3" fill={i < 2 ? INK : MUTED} />
              <rect x="16" y="8" width="24" height="4" rx="2" fill={INK} opacity={0.3} />
            </g>
          ))}
        </g>
        {/* table */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(78 ${174 + i * 15})`}>
            <rect width="136" height="10" rx="3" fill="#f5f5f4" />
            <rect x="6" y="3.5" width="40" height="3" rx="1.5" fill={INK} opacity={0.35} />
            <rect x="96" y="3.5" width="30" height="3" rx="1.5" fill={INK} opacity={0.2} />
          </g>
        ))}
      </g>
      {/* floating order ticket */}
      <g transform="translate(296 168) rotate(4)">
        <rect width="86" height="96" rx="10" fill={PAPER} stroke={INK} strokeOpacity={0.14} />
        <Label x={10} y={18}>ORDER</Label>
        {[30, 42, 54].map((y) => (
          <rect key={y} x="10" y={y} width="66" height="4" rx="2" fill={INK} opacity={0.18} />
        ))}
        <rect x="10" y="70" width="66" height="16" rx="8" fill={INK} />
      </g>
    </>
  );
}

/* ── Website: browser + phone frames ──────────────────────────────── */
function Website({ uid }: { uid: string }) {
  return (
    <>
      <DotGrid id={`g-web-${uid}`} opacity={0.12} />
      <g transform="translate(30 40)">
        <rect width="290" height="210" rx="12" fill={PAPER} stroke={INK} strokeOpacity={0.12} />
        <path d="M0 26 H290" stroke={INK} strokeOpacity={0.08} />
        {[14, 26, 38].map((x) => (<circle key={x} cx={x} cy="13" r="3.5" fill={INK} opacity={0.15} />))}
        <rect x="80" y="8" width="130" height="10" rx="5" fill="#f5f5f4" />
        {/* hero */}
        <rect x="18" y="44" width="120" height="14" rx="3" fill={INK} />
        <rect x="18" y="64" width="96" height="14" rx="3" fill={INK} />
        <rect x="18" y="88" width="110" height="4" rx="2" fill={INK} opacity={0.25} />
        <rect x="18" y="98" width="90" height="4" rx="2" fill={INK} opacity={0.25} />
        <rect x="18" y="114" width="54" height="16" rx="8" fill={INK} />
        <rect x="156" y="42" width="116" height="92" rx="8" fill="#e7e5e2" />
        <path d="M156 118 L192 86 L214 104 L236 82 L272 116 V126 a8 8 0 0 1-8 8 H164 a8 8 0 0 1-8-8Z" fill={INK} opacity={0.18} />
        <circle cx="244" cy="62" r="8" fill={PAPER} opacity={0.8} />
        {/* cards */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${18 + i * 86} 148)`}>
            <rect width="76" height="46" rx="6" fill="#f5f5f4" />
            <rect x="8" y="10" width="20" height="20" rx="4" fill={INK} opacity={0.15} />
            <rect x="8" y="36" width="44" height="3" rx="1.5" fill={INK} opacity={0.3} />
          </g>
        ))}
      </g>
      {/* phone */}
      <g transform="translate(296 92)">
        <rect width="78" height="164" rx="16" fill={INK} />
        <rect x="5" y="5" width="68" height="154" rx="12" fill={PAPER} />
        <rect x="30" y="10" width="18" height="4" rx="2" fill={INK} opacity={0.8} />
        <rect x="12" y="26" width="46" height="8" rx="2" fill={INK} />
        <rect x="12" y="38" width="36" height="8" rx="2" fill={INK} />
        <rect x="12" y="54" width="54" height="40" rx="6" fill="#e7e5e2" />
        <rect x="12" y="102" width="50" height="3" rx="1.5" fill={INK} opacity={0.25} />
        <rect x="12" y="110" width="40" height="3" rx="1.5" fill={INK} opacity={0.25} />
        <rect x="12" y="124" width="34" height="12" rx="6" fill={INK} />
      </g>
    </>
  );
}

/* ── SLAM: occupancy map, LiDAR rays, trajectory ──────────────────── */
function Slam({ uid }: { uid: string }) {
  const r = rng(7);
  const cx = 212;
  const cy = 168;
  const rays = Array.from({ length: 64 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2;
    const d = 70 + r() * 70;
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.82] as const;
  });
  return (
    <>
      <DotGrid id={`g-slam-${uid}`} step={12} opacity={0.14} />
      {/* walls */}
      <path d="M40 48 H250 V96 M290 96 H362 V262 H40 V48 M40 150 H110 M150 150 H170 V210 M300 186 H362" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="square" opacity={0.9} />
      <rect x="250" y="178" width="38" height="26" fill={INK} opacity={0.85} />
      <rect x="70" y="190" width="44" height="40" fill={INK} opacity={0.12} />
      {/* rays */}
      {rays.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={INK} strokeWidth={0.4} opacity={0.22} />
      ))}
      {rays.map(([x, y], i) => (
        <circle key={`p${i}`} cx={x} cy={y} r={1.3} fill={INK} opacity={0.7} />
      ))}
      {/* trajectory */}
      <path d="M70 120 C 110 120, 130 100, 160 110 S 200 150, 212 168" fill="none" stroke={INK} strokeWidth={1.4} strokeDasharray="3 4" />
      <circle cx="70" cy="120" r="3" fill={INK} />
      {/* robot */}
      <circle cx={cx} cy={cy} r={11} fill={PAPER} stroke={INK} strokeWidth={1.4} />
      <path d={`M${cx} ${cy - 6} L${cx + 5} ${cy + 4} L${cx - 5} ${cy + 4}Z`} fill={INK} />
      <Label x={cx + 16} y={cy - 12}>AMR</Label>
      <Label x={44} y={40}>MAP · /scan</Label>
    </>
  );
}

/* ── Jetson AMR: chassis top view ─────────────────────────────────── */
function Jetson({ uid }: { uid: string }) {
  return (
    <>
      <DotGrid id={`g-jet-${uid}`} opacity={0.14} />
      <g transform="translate(110 46)">
        {/* wheels */}
        {[[-18, 30], [162, 30], [-18, 150], [162, 150]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="36" height="54" rx="8" fill={INK} />
        ))}
        {/* chassis */}
        <rect x="10" y="0" width="160" height="212" rx="22" fill={PAPER} stroke={INK} strokeWidth={1.4} />
        {/* lidar */}
        <circle cx="90" cy="34" r="20" fill={PAPER} stroke={INK} strokeWidth={1.2} />
        <circle cx="90" cy="34" r="9" fill={INK} />
        <path d="M60 4 A 40 40 0 0 1 120 4" fill="none" stroke={INK} strokeWidth={0.8} opacity={0.4} transform="translate(0 -6)" />
        {/* compute module */}
        <rect x="38" y="76" width="104" height="76" rx="6" fill="#f5f5f4" stroke={INK} strokeOpacity={0.25} />
        <rect x="58" y="88" width="64" height="52" rx="3" fill={INK} />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={63 + i * 6.5} y="93" width="2.5" height="42" fill={PAPER} opacity={0.25} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={44 + i * 0} y={84 + i * 16} width="8" height="5" fill={INK} opacity={0.35} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`r${i}`} x="128" y={84 + i * 16} width="8" height="5" fill={INK} opacity={0.35} />
        ))}
        {/* battery */}
        <rect x="48" y="166" width="84" height="26" rx="5" fill="none" stroke={INK} strokeOpacity={0.4} />
        <rect x="52" y="170" width="56" height="18" rx="3" fill={INK} opacity={0.18} />
      </g>
      <Label x={36} y={70}>LIDAR</Label>
      <line x1="70" y1="67" x2="180" y2="80" stroke={INK} strokeWidth={0.6} opacity={0.4} />
      <Label x={330} y={160}>JETSON</Label>
      <line x1="252" y1="164" x2="326" y2="157" stroke={INK} strokeWidth={0.6} opacity={0.4} />
    </>
  );
}

/* ── Vision: detections with bounding boxes ───────────────────────── */
function Vision({ uid }: { uid: string }) {
  const boxes = [
    { x: 40, y: 96, w: 92, h: 132, label: "object" },
    { x: 170, y: 60, w: 70, h: 70, label: "object" },
    { x: 214, y: 146, w: 140, h: 96, label: "object" },
  ];
  return (
    <>
      <rect width="400" height="300" fill="#e7e5e2" />
      {/* simple scene */}
      <path d="M0 230 H400 V300 H0Z" fill={INK} opacity={0.06} />
      <rect x="52" y="108" width="68" height="114" rx="6" fill={INK} opacity={0.75} />
      <circle cx="205" cy="95" r="26" fill={PAPER} stroke={INK} strokeOpacity={0.3} />
      <rect x="226" y="160" width="116" height="76" rx="10" fill={INK} opacity={0.35} />
      <circle cx="250" cy="236" r="10" fill={INK} opacity={0.75} />
      <circle cx="318" cy="236" r="10" fill={INK} opacity={0.75} />
      {/* detections */}
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={INK} strokeWidth={1.6} />
          <rect x={b.x - 0.8} y={b.y - 15} width={50} height={15} fill={INK} />
          <text x={b.x + 5} y={b.y - 4.5} fontFamily="ui-monospace, monospace" fontSize="7.5" fill={PAPER} letterSpacing="0.4">
            {b.label}
          </text>
          {[[b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.h], [b.x + b.w, b.y + b.h]].map(([x, y], j) => (
            <rect key={j} x={x - 2.5} y={y - 2.5} width="5" height="5" fill={PAPER} stroke={INK} strokeWidth={1} />
          ))}
        </g>
      ))}
      {/* HUD */}
      <g transform="translate(268 22)">
        <rect width="108" height="22" rx="11" fill={PAPER} />
        <circle cx="13" cy="11" r="3.5" fill="#d64545" />
        <text x="23" y="14" fontFamily="ui-monospace, monospace" fontSize="7.5" fill={INK} letterSpacing="0.5">YOLO · TensorRT</text>
      </g>
    </>
  );
}

/* ── Early robotics: line tracer track + PID ──────────────────────── */
function Robot({ uid }: { uid: string }) {
  return (
    <>
      <DotGrid id={`g-rob-${uid}`} opacity={0.14} />
      <path d="M70 150 C 70 70, 170 60, 200 110 S 330 160, 330 110 S 290 40, 250 60 M70 150 C 70 230, 180 250, 220 210 S 330 230, 330 180" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" opacity={0.9} />
      <g transform="translate(184 96) rotate(32)">
        <rect x="-16" y="-12" width="32" height="24" rx="5" fill={PAPER} stroke={INK} strokeWidth={1.4} />
        <rect x="-20" y="-14" width="6" height="10" rx="2" fill={INK} />
        <rect x="14" y="-14" width="6" height="10" rx="2" fill={INK} />
        <rect x="-20" y="4" width="6" height="10" rx="2" fill={INK} />
        <rect x="14" y="4" width="6" height="10" rx="2" fill={INK} />
        {[-8, -3, 2, 7].map((x) => (<circle key={x} cx={x} cy={-9} r={1.5} fill="#d64545" />))}
      </g>
      <g transform="translate(36 240)">
        <rect width="196" height="32" rx="16" fill={PAPER} stroke={INK} strokeOpacity={0.12} />
        <text x="16" y="20" fontFamily="ui-monospace, monospace" fontSize="9" fill={INK} letterSpacing="0.3">
          u = Kp·e + Ki∫e dt + Kd·de/dt
        </text>
      </g>
    </>
  );
}

function Placeholder({ uid }: { uid: string }) {
  return (
    <>
      <DotGrid id={`g-ph-${uid}`} opacity={0.12} />
      <rect x="40" y="40" width="320" height="220" rx="18" fill="none" stroke={INK} strokeOpacity={0.3} strokeDasharray="5 6" />
      <circle cx="200" cy="140" r="22" fill={PAPER} stroke={INK} strokeOpacity={0.3} />
      <path d="M200 131 V149 M191 140 H209" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      <Label x={200} y={186} anchor="middle">NEW PROJECT SLOT</Label>
    </>
  );
}

const art: Record<CoverArt, (p: { uid: string }) => React.ReactElement> = {
  telemetry: Telemetry,
  catering: Catering,
  website: Website,
  slam: Slam,
  jetson: Jetson,
  vision: Vision,
  robot: Robot,
  placeholder: Placeholder,
};

export function ProjectCover({
  cover,
  label,
  uid,
  className = "",
}: {
  cover: CoverArt;
  label: string;
  /** Unique per instance on a page, e.g. the project slug. */
  uid: string;
  className?: string;
}) {
  const Art = art[cover];
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
      className={`block h-full w-full bg-stone ${className}`}
    >
      <Art uid={uid} />
    </svg>
  );
}

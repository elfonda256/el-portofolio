/**
 * Point formations for the "Field to Cloud" scene. Every formation has the
 * same number of points so the shader can morph between them.
 *
 *   0 FIELD     — a LiDAR-style ring scan of terrain with a canal carved in
 *   1 NETWORK   — a branching irrigation canal network with stations
 *   2 MACHINES  — an indoor LiDAR (SLAM) scan around a mobile robot
 *   3 CLOUD     — a data sphere with orbiting rings
 *   4 CONNECT   — a transmitter sending out signal rings (animated in the shader)
 */

export const SCENE_LABELS = ["Field", "Network", "Machines", "Cloud", "Connect"] as const;

export interface Formations {
  count: number;
  positions: Float32Array[]; // 5 × (count × 3)
  rnd: Float32Array; // count × 4 — random seeds, w = accent flag
  flow: Float32Array; // count — distance along canal (network pulses)
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── value noise ─────────────────────────────── */
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number) {
  let v = 0, amp = 0.5, f = 1;
  for (let i = 0; i < 4; i++) {
    v += amp * noise(x * f, y * f);
    f *= 2.03;
    amp *= 0.5;
  }
  return v;
}

/* ── 0 · FIELD ───────────────────────────────── */
function canalX(z: number) {
  return 2.2 * Math.sin(z * 0.32 + 0.6) + 0.8 * Math.sin(z * 0.9);
}
function terrainHeight(x: number, z: number) {
  const hills = (fbm(x * 0.16 + 3.1, z * 0.16 - 1.7) - 0.45) * 3.0;
  const d = x - canalX(z);
  const canal = 1.1 * Math.exp(-(d * d) / 0.35);
  const embank = 0.25 * Math.exp(-((Math.abs(d) - 0.9) ** 2) / 0.08);
  return hills - canal + embank;
}
function field(out: Float32Array, n: number, r: () => number) {
  const RINGS = 64;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.pow(r(), 0.85) * RINGS);
    const rad = 0.7 + k * 0.19 + (r() - 0.5) * 0.03;
    const th = r() * Math.PI * 2;
    const x = Math.cos(th) * rad;
    const z = Math.sin(th) * rad;
    out[i * 3] = x;
    out[i * 3 + 1] = terrainHeight(x, z) + (r() - 0.5) * 0.04;
    out[i * 3 + 2] = z;
  }
}

/* ── 1 · NETWORK ─────────────────────────────── */
interface Seg { ax: number; az: number; bx: number; bz: number; s0: number; len: number }
function buildCanals(r: () => number) {
  const segs: Seg[] = [];
  const nodes: [number, number][] = [];
  function grow(x: number, z: number, ang: number, len: number, depth: number, s: number) {
    let px = x, pz = z, a = ang, acc = s;
    const steps = Math.max(3, Math.round(len / 0.6));
    for (let i = 0; i < steps; i++) {
      a += (r() - 0.5) * 0.2;
      const step = len / steps;
      const nx = px + Math.cos(a) * step;
      const nz = pz + Math.sin(a) * step;
      if (Math.abs(nx) > 11.5 || Math.abs(nz) > 8.5) break;
      segs.push({ ax: px, az: pz, bx: nx, bz: nz, s0: acc, len: step });
      acc += step;
      px = nx;
      pz = nz;
      if (depth < 3 && r() < (depth === 0 ? 0.3 : 0.16)) {
        const side = r() < 0.5 ? -1 : 1;
        grow(px, pz, a + side * (0.7 + r() * 0.6), len * (0.45 + r() * 0.25), depth + 1, acc);
      }
      if (r() < 0.12) nodes.push([px, pz]);
    }
    nodes.push([px, pz]);
  }
  grow(-11, -3.5, 0.18, 21, 0, 0); // main canal
  grow(-6, -2.5, -1.1, 7, 1, 4); // secondary off-takes
  return { segs, nodes };
}
function network(out: Float32Array, flow: Float32Array, accent: Float32Array, n: number, r: () => number) {
  const { segs, nodes } = buildCanals(r);
  const total = segs.reduce((a, s) => a + s.len, 0);
  const cum: number[] = [];
  let acc = 0;
  for (const s of segs) cum.push((acc += s.len));
  for (let i = 0; i < n; i++) {
    const roll = r();
    let x: number, z: number, y = 0, f = 0;
    if (roll < 0.12) {
      // station cluster
      const [cx, cz] = nodes[Math.floor(r() * nodes.length)];
      const rr = Math.pow(r(), 2) * 0.28, th = r() * Math.PI * 2;
      x = cx + Math.cos(th) * rr;
      z = cz + Math.sin(th) * rr;
      y = Math.pow(r(), 3) * 0.6;
      accent[i] = 1;
      f = -1;
    } else if (roll < 0.22) {
      // faint ground grid
      x = (r() - 0.5) * 24;
      z = (r() - 0.5) * 17;
      if (r() < 0.5) x = Math.round(x * 0.75) / 0.75;
      else z = Math.round(z * 0.75) / 0.75;
      y = -0.05;
      f = -1;
    } else {
      const t = r() * total;
      let lo = 0, hi = cum.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] < t) lo = mid + 1;
        else hi = mid;
      }
      const s = segs[lo];
      const u = r();
      const w = (r() - 0.5) * 0.12;
      const dx = s.bx - s.ax, dz = s.bz - s.az, L = Math.hypot(dx, dz) || 1;
      x = s.ax + dx * u - (dz / L) * w;
      z = s.az + dz * u + (dx / L) * w;
      f = s.s0 + s.len * u;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
    flow[i] = f;
  }
}

/* ── 2 · MACHINES ────────────────────────────── */
type Wall = [number, number, number, number];
function machines(out: Float32Array, accent: Float32Array, n: number, r: () => number) {
  const walls: Wall[] = [
    [-10, -6.5, 10, -6.5], [10, -6.5, 10, 6.5], [10, 6.5, -10, 6.5], [-10, 6.5, -10, -6.5],
    [-3.5, -6.5, -3.5, -1.6], [-3.5, 1.2, -3.5, 6.5],
    [3.8, -6.5, 3.8, -2.4], [3.8, -0.4, 3.8, 3], [3.8, 3, 10, 3],
    [-10, 1.5, -6.5, 1.5],
    // racks / machines
    [5.6, -5, 8.6, -5], [5.6, -4, 8.6, -4], [5.6, -5, 5.6, -4], [8.6, -5, 8.6, -4],
    [-8, -4.4, -5.6, -4.4], [-5.6, -4.4, -5.6, -3.2], [-5.6, -3.2, -8, -3.2], [-8, -3.2, -8, -4.4],
    [0.6, 3.6, 2.4, 3.6], [2.4, 3.6, 2.4, 4.9], [2.4, 4.9, 0.6, 4.9], [0.6, 4.9, 0.6, 3.6],
  ];
  const CH = 16;
  for (let i = 0; i < n; i++) {
    const roll = r();
    if (roll < 0.06) {
      // the robot: a small chassis + mast
      const u = r(), v = r();
      let x: number, y: number, z: number;
      if (u < 0.7) {
        const face = Math.floor(r() * 4);
        const t = v * 2 - 1;
        x = face < 2 ? (face === 0 ? -0.55 : 0.55) : t * 0.55;
        z = face >= 2 ? (face === 2 ? -0.38 : 0.38) : t * 0.38;
        y = 0.05 + r() * 0.35;
      } else {
        const th = r() * Math.PI * 2;
        x = Math.cos(th) * 0.12;
        z = Math.sin(th) * 0.12;
        y = 0.4 + r() * 0.35;
      }
      out[i * 3] = x;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = z;
      accent[i] = 1;
      continue;
    }
    const th = r() * Math.PI * 2;
    const ch = Math.floor(r() * CH);
    const elev = -0.26 + (ch / (CH - 1)) * 0.5; // vertical beam angle
    const dx = Math.cos(th), dz = Math.sin(th);
    let best = 40;
    for (const [ax, az, bx, bz] of walls) {
      const ex = bx - ax, ez = bz - az;
      const den = dx * ez - dz * ex;
      if (Math.abs(den) < 1e-6) continue;
      const t = (ax * ez - az * ex) / den;
      const u = (ax * dz - az * dx) / den;
      if (t > 0.05 && u >= 0 && u <= 1 && t < best) best = t;
    }
    const sensorY = 0.75;
    let d = best, y = sensorY + Math.tan(elev) * best;
    if (y < 0) {
      // beam hits the floor first — ring on the ground
      d = sensorY / -Math.tan(elev);
      y = 0;
    } else if (y > 3.2) {
      d = (3.2 - sensorY) / Math.tan(elev);
      y = 3.2;
    }
    d += (r() - 0.5) * 0.03;
    out[i * 3] = dx * d;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = dz * d;
  }
}

/* ── 3 · CLOUD ───────────────────────────────── */
function cloud(out: Float32Array, accent: Float32Array, n: number, r: () => number) {
  const G = Math.PI * (3 - Math.sqrt(5));
  const sphereN = Math.floor(n * 0.7);
  for (let i = 0; i < n; i++) {
    let x: number, y: number, z: number;
    if (i < sphereN) {
      const yy = 1 - (i / (sphereN - 1)) * 2;
      const rad = Math.sqrt(1 - yy * yy);
      const th = G * i;
      const R = 4.6 + (fbm(Math.cos(th) * rad * 2 + 5, yy * 2) - 0.5) * 1.2 + (r() - 0.5) * 0.08;
      x = Math.cos(th) * rad * R;
      y = yy * R;
      z = Math.sin(th) * rad * R;
    } else {
      const ring = Math.floor(r() * 3);
      const R = [6.4, 7.4, 8.6][ring] + (r() - 0.5) * 0.12;
      const th = r() * Math.PI * 2;
      const tilt = [0.35, -0.5, 0.9][ring];
      const rx = Math.cos(th) * R, rz = Math.sin(th) * R;
      x = rx;
      y = rz * Math.sin(tilt);
      z = rz * Math.cos(tilt);
      if (r() < 0.15) accent[i] = 1;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
}

/* ── 4 · CONNECT ─────────────────────────────── */
// A transmitter core with signal rings radiating outward (animated in the shader).
function connect(out: Float32Array, accent: Float32Array, n: number, r: () => number) {
  for (let i = 0; i < n; i++) {
    const th = r() * Math.PI * 2;
    if (r() < 0.07) {
      const rad = Math.pow(r(), 2.5) * 0.7;
      const ph = Math.acos(2 * r() - 1);
      out[i * 3] = Math.cos(th) * Math.sin(ph) * rad;
      out[i * 3 + 1] = Math.sin(th) * Math.sin(ph) * rad;
      out[i * 3 + 2] = Math.cos(ph) * rad;
      accent[i] = 1;
      continue;
    }
    const ring = Math.floor(r() * 14);
    const rad = 0.6 + ring * 0.85 + (r() - 0.5) * 0.06;
    out[i * 3] = Math.cos(th) * rad;
    out[i * 3 + 1] = Math.sin(th) * rad;
    out[i * 3 + 2] = (r() - 0.5) * 0.25 - ring * 0.12;
  }
}

/** Centre a formation on the origin in the ground plane. */
function recenter(p: Float32Array, n: number) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < n; i++) {
    minX = Math.min(minX, p[i * 3]);
    maxX = Math.max(maxX, p[i * 3]);
    minZ = Math.min(minZ, p[i * 3 + 2]);
    maxZ = Math.max(maxZ, p[i * 3 + 2]);
  }
  const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2;
  for (let i = 0; i < n; i++) {
    p[i * 3] -= cx;
    p[i * 3 + 2] -= cz;
  }
}

export function buildFormations(count: number): Formations {
  const r = mulberry32(20260911);
  const positions = Array.from({ length: 5 }, () => new Float32Array(count * 3));
  const rnd = new Float32Array(count * 4);
  const flow = new Float32Array(count);
  const accentNet = new Float32Array(count);
  const accentMach = new Float32Array(count);
  const accentCloud = new Float32Array(count);
  const accentLink = new Float32Array(count);
  field(positions[0], count, r);
  network(positions[1], flow, accentNet, count, r);
  recenter(positions[1], count);
  machines(positions[2], accentMach, count, r);
  cloud(positions[3], accentCloud, count, r);
  connect(positions[4], accentLink, count, r);
  for (let i = 0; i < count; i++) {
    rnd[i * 4] = r();
    rnd[i * 4 + 1] = r();
    rnd[i * 4 + 2] = r();
    // accent bitmask: 1 = network station, 2 = robot, 4 = cloud ring node, 8 = transmitter core
    rnd[i * 4 + 3] = accentNet[i] + accentMach[i] * 2 + accentCloud[i] * 4 + accentLink[i] * 8;
  }
  return { count, positions, rnd, flow };
}

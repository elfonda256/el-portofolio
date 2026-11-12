/**
 * "Night Lap" — geometry helpers for an original, fictional circuit.
 * Units are roughly metres. The lap is a closed Catmull-Rom curve in the XZ plane.
 */
import type * as THREE_NS from "three";

type Three = typeof THREE_NS;

// Control points of the circuit (fictional layout): long main straight, a hairpin,
// a fast esses section and a sweeping final corner back onto the straight.
const CONTROL: [number, number][] = [
  [-160, 0], [-60, 0], [40, 0], [130, 0], [175, -20], [182, -62], [150, -88],
  [100, -84], [70, -110], [86, -150], [60, -190], [0, -206], [-70, -196],
  [-120, -160], [-112, -120], [-150, -96], [-198, -78], [-212, -38], [-196, -8],
];

export function buildCurve(THREE: Three) {
  const pts = CONTROL.map(([x, z]) => new THREE.Vector3(x, 0, z));
  const curve = new THREE.CatmullRomCurve3(pts, true, "centripetal", 0.5);
  curve.arcLengthDivisions = 2000;
  return curve;
}

export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Track ribbon with u (along) / v (across) coordinates and a per-vertex curvature. */
export function buildTrackGeometry(THREE: Three, curve: THREE_NS.CatmullRomCurve3, width = 15, samples = 900) {
  const pos: number[] = [];
  const uv: number[] = [];
  const curv: number[] = [];
  const idx: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const side = new THREE.Vector3();
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const p = curve.getPointAt(u % 1);
    const t = curve.getTangentAt(u % 1);
    const t2 = curve.getTangentAt((u + 0.004) % 1);
    side.crossVectors(up, t).normalize();
    const k = Math.min(1, t.angleTo(t2) * 18);
    for (const s of [-1, 1]) {
      pos.push(p.x + side.x * s * width * 0.5, 0.01, p.z + side.z * s * width * 0.5);
      uv.push(u * curve.getLength() / 8, s < 0 ? 0 : 1);
      curv.push(k);
    }
    if (i < samples) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute("aCurv", new THREE.Float32BufferAttribute(curv, 1));
  g.setIndex(idx);
  return g;
}

export interface LightSet {
  positions: Float32Array; // xyz
  colors: Float32Array; // rgb
  sizes: Float32Array; // world size
  tangents: Float32Array; // direction for speed streaks (0 = no streak)
  count: number;
}

/** Every emissive point on the circuit: floodlights, grandstand LEDs, barrier reflectors, distant city. */
export function buildLights(THREE: Three, curve: THREE_NS.CatmullRomCurve3, lite: boolean): LightSet {
  const r = mulberry32(42);
  const P: number[] = [], C: number[] = [], S: number[] = [], T: number[] = [];
  const add = (x: number, y: number, z: number, c: [number, number, number], s: number, t: [number, number, number] = [0, 0, 0]) => {
    P.push(x, y, z);
    C.push(...c);
    S.push(s);
    T.push(...t);
  };
  const up = new THREE.Vector3(0, 1, 0);
  const side = new THREE.Vector3();
  const L = curve.getLength();
  const cool: [number, number, number] = [0.82, 0.9, 1];
  const warm: [number, number, number] = [1, 0.86, 0.66];
  const red: [number, number, number] = [1, 0.2, 0.16];

  // floodlight masts along both sides
  const mastStep = 34;
  for (let d = 0; d < L; d += mastStep) {
    const u = d / L;
    const p = curve.getPointAt(u);
    side.crossVectors(up, curve.getTangentAt(u)).normalize();
    for (const s of [-1, 1]) {
      if (r() < 0.25) continue;
      const off = 17 + r() * 4;
      const x = p.x + side.x * s * off, z = p.z + side.z * s * off;
      add(x, 13, z, cool, 1.3);
      add(x + side.x * s * 0.8, 13.4, z + side.z * s * 0.8, cool, 0.9);
    }
  }

  // barrier reflectors (become speed streaks)
  for (let d = 0; d < L; d += lite ? 9 : 6) {
    const u = d / L;
    const p = curve.getPointAt(u);
    const tg = curve.getTangentAt(u);
    side.crossVectors(up, tg).normalize();
    for (const s of [-1, 1]) {
      const off = 9.5;
      add(p.x + side.x * s * off, 0.7, p.z + side.z * s * off, r() < 0.15 ? red : [0.9, 0.9, 0.95], 0.35, [tg.x, 0, tg.z]);
    }
  }

  // grandstand LEDs along the main straight (left side)
  for (let x = -150; x < 120; x += lite ? 2.4 : 1.6) {
    for (const [y, c] of [[3.4, warm], [6.2, warm], [9, red]] as const) {
      if (r() < 0.12) continue;
      add(x + r() * 0.4, y, -30, c as [number, number, number], y > 8 ? 0.55 : 0.4, [1, 0, 0]);
    }
  }
  // pit building lights (right side)
  for (let x = -140; x < 100; x += lite ? 3.2 : 2.2) {
    add(x, 4.2, 26, warm, 0.45, [1, 0, 0]);
  }

  // distant city skyline
  const city = lite ? 900 : 2200;
  for (let i = 0; i < city; i++) {
    const a = -0.6 + r() * 2.4; // mostly behind the hairpin, like a skyline
    const R = 520 + r() * 160;
    const h = Math.pow(r(), 2.2) * 70;
    add(Math.cos(a) * R, h, -Math.sin(a) * R - 100, r() < 0.7 ? warm : cool, 1.3 + r() * 1.5);
  }

  return {
    positions: new Float32Array(P),
    colors: new Float32Array(C),
    sizes: new Float32Array(S),
    tangents: new Float32Array(T),
    count: S.length,
  };
}

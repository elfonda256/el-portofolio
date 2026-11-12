/**
 * "Night Lap" set pieces: an original open-wheel race car, the pit lane, a
 * showcase garage, the pit-wall telemetry stand and the chequered flag.
 * Everything here is invented for this site — no real team, car or brand.
 */
import type * as THREE_NS from "three";

type Three = typeof THREE_NS;
type V3 = THREE_NS.Vector3;

/* ── small helpers ─────────────────────────────── */
function profileExtrude(THREE: Three, top: [number, number][], bottom: [number, number][], width: number, bevel = 0.04) {
  const shape = new THREE.Shape();
  shape.moveTo(top[0][0], top[0][1]);
  for (const [x, y] of top.slice(1)) shape.lineTo(x, y);
  for (const [x, y] of bottom) shape.lineTo(x, y);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: width - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 8,
  });
  g.translate(0, 0, -(width - bevel * 2) / 2);
  return g;
}

/** Narrow a geometry's width (z) along x with f(x) in 0..1. */
function taperZ(g: THREE_NS.BufferGeometry, f: (x: number) => number) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) * f(p.getX(i)));
  g.computeVertexNormals();
  return g;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ── environment for glossy reflections ────────── */
export function buildNightEnv(THREE: Three, renderer: THREE_NS.WebGLRenderer) {
  const env = new THREE.Scene();
  env.background = new THREE.Color("#050608");
  const strip = (w: number, h: number, color: string, pos: [number, number, number], intensity = 1) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  // floodlight banks, a red glow and a faint horizon
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    strip(3, 1.2, "#dfe8ff", [Math.cos(a) * 12, 7, Math.sin(a) * 12], 3);
  }
  strip(14, 1.2, "#ff3b30", [0, 1, -14], 1.4);
  strip(40, 2, "#30343c", [0, 0, 18], 1);
  strip(10, 10, "#1a1d23", [0, 14, 0], 1);
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(env, 0.03).texture;
  pm.dispose();
  return tex;
}

/* ── the car ────────────────────────────────────── */
export interface Car {
  group: THREE_NS.Group;
  wheels: THREE_NS.Object3D[];
  rainLight: THREE_NS.Object3D; // local point for the rain light glow
  dispose(): void;
}

export function buildCar(THREE: Three, env: THREE_NS.Texture): Car {
  const geos: THREE_NS.BufferGeometry[] = [];
  const keep = <T extends THREE_NS.BufferGeometry>(g: T) => (geos.push(g), g);

  const body = new THREE.MeshPhysicalMaterial({ color: "#0c0d10", metalness: 0.35, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08, envMap: env, envMapIntensity: 1.4 });
  const carbon = new THREE.MeshStandardMaterial({ color: "#16181c", metalness: 0.2, roughness: 0.55, envMap: env, envMapIntensity: 0.8 });
  const accent = new THREE.MeshStandardMaterial({ color: "#ff3b30", emissive: "#5a0804", metalness: 0.2, roughness: 0.35, envMap: env, envMapIntensity: 1 });
  const tyre = new THREE.MeshStandardMaterial({ color: "#0a0a0b", metalness: 0, roughness: 0.62, envMap: env, envMapIntensity: 0.6 });
  const rim = new THREE.MeshStandardMaterial({ color: "#2a2d33", metalness: 0.85, roughness: 0.3, envMap: env, envMapIntensity: 1.2 });
  const helmet = new THREE.MeshPhysicalMaterial({ color: "#e9ecef", metalness: 0.1, roughness: 0.25, clearcoat: 1, envMap: env });
  const visor = new THREE.MeshStandardMaterial({ color: "#050506", metalness: 0.9, roughness: 0.1, envMap: env, envMapIntensity: 1.6 });
  const lamp = new THREE.MeshBasicMaterial({ color: "#ff2a20" });
  const mats = [body, carbon, accent, tyre, rim, helmet, visor, lamp];

  const g = new THREE.Group();
  const add = (geo: THREE_NS.BufferGeometry, mat: THREE_NS.Material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(keep(geo), mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };

  // floor + plank
  add(new THREE.BoxGeometry(4.3, 0.035, 1.5), carbon, 0.05, 0.07, 0);
  // survival cell + nose (side profile, narrowing to the tip)
  const tub = profileExtrude(
    THREE,
    [[-0.65, 0.62], [0.1, 0.66], [0.75, 0.6], [1.5, 0.46], [2.3, 0.33], [2.95, 0.22]],
    [[2.98, 0.15], [2.2, 0.12], [0.6, 0.1], [-0.65, 0.1]],
    0.74,
  );
  taperZ(tub, (x) => 1 - 0.68 * smooth(0.7, 2.95, x));
  add(tub, body);
  // engine cover with airbox, tapering to the gearbox
  const cover = profileExtrude(
    THREE,
    [[-2.35, 0.42], [-1.7, 0.55], [-1.0, 0.86], [-0.55, 0.98], [-0.42, 0.98], [-0.38, 0.66]],
    [[-0.38, 0.12], [-2.35, 0.14]],
    0.78,
  );
  taperZ(cover, (x) => 1 - 0.55 * smooth(-0.8, -2.35, x));
  add(cover, body);
  // shark fin
  const fin = profileExtrude(THREE, [[-2.25, 0.5], [-1.0, 0.95], [-0.7, 0.96]], [[-0.7, 0.8], [-2.25, 0.4]], 0.03, 0.006);
  add(fin, body);
  // sidepods (rounded, slimming towards the rear)
  for (const s of [-1, 1]) {
    const pod = profileExtrude(THREE, [[-1.7, 0.36], [-0.9, 0.5], [0.15, 0.52], [0.35, 0.47]], [[0.35, 0.16], [-1.7, 0.14]], 0.5, 0.08);
    taperZ(pod, (x) => 1 - 0.35 * smooth(-0.6, -1.7, x));
    const m = add(pod, body, 0, 0, s * 0.52);
    m.scale.z = 1;
    // red accent stripe along the pod
    add(new THREE.BoxGeometry(1.5, 0.025, 0.012), accent, -0.55, 0.47, s * 0.775);
  }
  // red accents on the nose and engine cover
  add(new THREE.BoxGeometry(1.4, 0.012, 0.09), accent, 1.6, 0.465, 0).rotation.z = -0.17;
  add(new THREE.BoxGeometry(1.0, 0.012, 0.07), accent, -1.4, 0.69, 0).rotation.z = 0.33;

  // cockpit: helmet + halo
  const head = add(new THREE.SphereGeometry(0.15, 24, 16), helmet, -0.08, 0.76, 0);
  head.scale.set(1.12, 1, 0.95);
  add(new THREE.SphereGeometry(0.152, 24, 16, -0.9, 1.8, 1.2, 0.5), visor, -0.06, 0.76, 0).rotation.y = Math.PI / 2;
  const halo = add(new THREE.TorusGeometry(0.4, 0.032, 10, 32, Math.PI * 1.1), carbon, 0.0, 0.83, 0);
  halo.rotation.x = Math.PI / 2;
  halo.rotation.z = -Math.PI * 0.05 - Math.PI / 2;
  halo.scale.set(1.05, 0.85, 1);
  const strut = add(new THREE.CylinderGeometry(0.025, 0.032, 0.32, 8), carbon, 0.42, 0.72, 0);
  strut.rotation.z = -0.5;

  // front wing
  add(new THREE.BoxGeometry(0.55, 0.03, 1.95), carbon, 2.78, 0.1, 0);
  for (const [dx, dy, r] of [[-0.1, 0.16, 0.22], [-0.22, 0.22, 0.38]] as const) {
    const flap = add(new THREE.BoxGeometry(0.28, 0.02, 1.86), accent, 2.78 + dx, dy, 0);
    flap.rotation.z = r;
  }
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.6, 0.26, 0.025), carbon, 2.75, 0.18, s * 0.98);

  // rear wing + beam wing
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.75, 0.82, 0.03), carbon, -2.32, 0.66, s * 0.48);
  const main = add(new THREE.BoxGeometry(0.42, 0.04, 0.94), body, -2.35, 0.9, 0);
  main.rotation.z = 0.12;
  const flap = add(new THREE.BoxGeometry(0.26, 0.03, 0.94), body, -2.5, 1.02, 0);
  flap.rotation.z = 0.32;
  add(new THREE.BoxGeometry(0.02, 0.012, 0.94), accent, -2.62, 1.07, 0);
  add(new THREE.BoxGeometry(0.3, 0.03, 0.9), carbon, -2.25, 0.46, 0);
  // rain light
  add(new THREE.BoxGeometry(0.03, 0.06, 0.08), lamp, -2.62, 0.42, 0);
  const rainLight = new THREE.Object3D();
  rainLight.position.set(-2.66, 0.42, 0);
  g.add(rainLight);
  // diffuser
  const diff = add(new THREE.BoxGeometry(0.55, 0.03, 1.0), carbon, -2.2, 0.12, 0);
  diff.rotation.z = -0.25;

  // wheels + suspension
  const wheels: THREE_NS.Object3D[] = [];
  const wheel = (x: number, z: number, w: number) => {
    const hub = new THREE.Group();
    hub.position.set(x, 0.36, z);
    const t = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.36, 0.36, w, 36, 1)), tyre);
    t.rotation.x = Math.PI / 2;
    hub.add(t);
    for (const side of [-1, 1]) {
      const r = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 24)), rim);
      r.rotation.x = Math.PI / 2;
      r.position.z = (side * w) / 2;
      hub.add(r);
    }
    g.add(hub);
    wheels.push(hub);
    // wishbones
    for (const y of [0.24, 0.48]) {
      const len = Math.abs(z) - 0.3;
      const arm = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.014, 0.014, len, 6)), carbon);
      arm.rotation.x = Math.PI / 2;
      arm.position.set(x, y, Math.sign(z) * (0.3 + len / 2));
      g.add(arm);
    }
  };
  wheel(1.98, 0.83, 0.34);
  wheel(1.98, -0.83, 0.34);
  wheel(-1.62, 0.8, 0.42);
  wheel(-1.62, -0.8, 0.42);

  // mirrors
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.06, 0.06, 0.16), body, 0.55, 0.72, s * 0.5);

  g.traverse((o) => {
    if ((o as THREE_NS.Mesh).isMesh) (o as THREE_NS.Mesh).castShadow = false;
  });

  return {
    group: g,
    wheels,
    rainLight,
    dispose() {
      geos.forEach((x) => x.dispose());
      mats.forEach((m) => m.dispose());
    },
  };
}

/* ── the showcase garage (built away from the circuit) ── */
export function buildGarage(THREE: Three, origin: V3, lite: boolean) {
  const group = new THREE.Group();
  group.position.copy(origin);
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  const W = 16, D = 14, H = 5.2;
  const wall = keep(new THREE.MeshStandardMaterial({ color: "#1c1f25", roughness: 0.9, metalness: 0.05 }));
  const room = new THREE.Mesh(keep(new THREE.BoxGeometry(W, H, D)), wall);
  room.material.side = THREE.BackSide;
  room.position.y = H / 2;
  group.add(room);

  // glossy floor: a real reflection under a tinted epoxy layer
  let reflector: THREE_NS.Object3D | null = null;
  const setupFloor = async () => {
    const { Reflector } = await import("three/addons/objects/Reflector.js");
    const r = new Reflector(new THREE.PlaneGeometry(W, D), {
      textureWidth: lite ? 512 : 1024,
      textureHeight: lite ? 512 : 1024,
      color: new THREE.Color("#7a7f88"),
    });
    r.rotation.x = -Math.PI / 2;
    r.position.y = 0.001;
    group.add(r);
    reflector = r;
  };
  void setupFloor();
  const epoxy = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(W, D)),
    keep(new THREE.MeshBasicMaterial({ color: "#14171c", transparent: true, opacity: 0.62 })),
  );
  epoxy.rotation.x = -Math.PI / 2;
  epoxy.position.y = 0.01;
  group.add(epoxy);
  // floor markings
  const line = keep(new THREE.MeshBasicMaterial({ color: "#d8dbe0" }));
  for (const s of [-1, 1]) {
    const m = new THREE.Mesh(keep(new THREE.PlaneGeometry(0.08, 9)), line);
    m.rotation.x = -Math.PI / 2;
    m.position.set(s * 2.4, 0.02, 0);
    group.add(m);
  }

  // ceiling light strips
  const glow = keep(new THREE.MeshBasicMaterial({ color: "#f2f5ff" }));
  for (const x of [-3, 0, 3]) {
    const s = new THREE.Mesh(keep(new THREE.BoxGeometry(0.18, 0.04, 8)), glow);
    s.position.set(x, H - 0.05, 0);
    group.add(s);
  }
  // red accent light bars on the back wall
  const redGlow = keep(new THREE.MeshBasicMaterial({ color: "#ff3b30" }));
  for (const y of [1.2, 3.6]) {
    const b = new THREE.Mesh(keep(new THREE.BoxGeometry(W - 2, 0.05, 0.05)), redGlow);
    b.position.set(0, y, -D / 2 + 0.06);
    group.add(b);
  }
  // tool cabinets
  const cab = keep(new THREE.MeshStandardMaterial({ color: "#1b1e24", roughness: 0.5, metalness: 0.5 }));
  for (const s of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const c = new THREE.Mesh(keep(new THREE.BoxGeometry(0.7, 1.05, 1.4)), cab);
      c.position.set(s * (W / 2 - 0.45), 0.53, -4.5 + i * 1.6);
      group.add(c);
      const handle = new THREE.Mesh(keep(new THREE.BoxGeometry(0.02, 0.04, 1.1)), redGlow);
      handle.position.set(s * (W / 2 - 0.82), 0.9, -4.5 + i * 1.6);
      group.add(handle);
    }
  }

  // lights for the car
  const key = new THREE.SpotLight("#f4f6ff", 420, 20, 0.75, 0.55, 1.4);
  key.position.set(0, H - 0.3, 1.5);
  key.target.position.set(0, 0, 0);
  group.add(key, key.target);
  const rim = new THREE.PointLight("#ff4a3a", 60, 14, 1.4);
  rim.position.set(0, 1.2, -5);
  group.add(rim);
  const fill = new THREE.PointLight("#9fb4ff", 70, 16, 1.4);
  fill.position.set(4, 2.4, 4);
  group.add(fill);
  group.add(new THREE.AmbientLight("#ffffff", 0.25));
  const front = new THREE.PointLight("#ffffff", 50, 14, 1.4);
  front.position.set(-5, 2.2, 4);
  group.add(front);

  return {
    group,
    carSpot: new THREE.Vector3(origin.x, 0, origin.z),
    dispose() {
      disposables.forEach((d) => d.dispose());
      (reflector as unknown as { dispose?: () => void } | null)?.dispose?.();
    },
  };
}

/* ── pit lane: garage fronts lit from inside ───── */
export function buildPitLane(THREE: Three) {
  const group = new THREE.Group();
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  // light gradient for the garage openings
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, "#fff3df");
  grad.addColorStop(0.55, "#d9b88e");
  grad.addColorStop(1, "#5c4a36");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 4, 128);
  const tex = keep(new THREE.CanvasTexture(c));
  tex.colorSpace = THREE.SRGBColorSpace;
  const door = keep(new THREE.MeshBasicMaterial({ map: tex }));
  const doorRefl = keep(new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }));
  const doorGeo = keep(new THREE.PlaneGeometry(9, 4.6));
  const white = keep(new THREE.MeshBasicMaterial({ color: "#c9ccd2" }));
  const red = keep(new THREE.MeshBasicMaterial({ color: "#c2241c" }));
  for (let x = -128; x <= 92; x += 13) {
    const d = new THREE.Mesh(doorGeo, door);
    d.position.set(x, 2.3, 25.94);
    d.rotation.y = Math.PI;
    group.add(d);
    // wet-floor reflection, stretched downwards
    const r = new THREE.Mesh(doorGeo, doorRefl);
    r.position.set(x, -2.6, 25.9);
    r.rotation.y = Math.PI;
    r.scale.y = 1.25;
    group.add(r);
    // pit box markings
    const box = new THREE.Mesh(keep(new THREE.PlaneGeometry(7, 0.12)), white);
    box.rotation.x = -Math.PI / 2;
    box.position.set(x, 0.02, 17.5);
    group.add(box);
    for (const s of [-1, 1]) {
      const side = new THREE.Mesh(keep(new THREE.PlaneGeometry(0.12, 5)), white);
      side.rotation.x = -Math.PI / 2;
      side.position.set(x + s * 3.5, 0.02, 20);
      group.add(side);
    }
  }
  // pit lane lines and the pit wall
  const laneLine = new THREE.Mesh(keep(new THREE.PlaneGeometry(260, 0.2)), white);
  laneLine.rotation.x = -Math.PI / 2;
  laneLine.position.set(-20, 0.02, 14.2);
  group.add(laneLine);
  const wallMat = keep(new THREE.MeshBasicMaterial({ color: "#1a1c21" }));
  const pitWall = new THREE.Mesh(keep(new THREE.BoxGeometry(250, 1.1, 0.5)), wallMat);
  pitWall.position.set(-20, 0.55, 9.4);
  group.add(pitWall);
  const wallStripe = new THREE.Mesh(keep(new THREE.BoxGeometry(250, 0.08, 0.52)), red);
  wallStripe.position.set(-20, 1.06, 9.4);
  group.add(wallStripe);
  // pit asphalt (slightly lighter than the grass)
  const lane = new THREE.Mesh(keep(new THREE.PlaneGeometry(260, 16)), keep(new THREE.MeshBasicMaterial({ color: "#0c0d10" })));
  lane.rotation.x = -Math.PI / 2;
  lane.position.set(-20, 0.005, 18);
  group.add(lane);

  return { group, dispose: () => disposables.forEach((d) => d.dispose()) };
}

/* ── pit wall telemetry stand ──────────────────── */
export function buildPitWall(THREE: Three, at: V3) {
  const group = new THREE.Group();
  group.position.copy(at);
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  const dark = keep(new THREE.MeshStandardMaterial({ color: "#15171c", roughness: 0.6, metalness: 0.4 }));
  const desk = new THREE.Mesh(keep(new THREE.BoxGeometry(6, 0.1, 1.1)), dark);
  desk.position.set(0, 1.25, 0);
  group.add(desk);
  const roof = new THREE.Mesh(keep(new THREE.BoxGeometry(6.6, 0.12, 2.6)), dark);
  roof.position.set(0, 3.4, 0.4);
  group.add(roof);
  for (const s of [-1, 1]) {
    const post = new THREE.Mesh(keep(new THREE.BoxGeometry(0.12, 3.4, 0.12)), dark);
    post.position.set(s * 3.1, 1.7, 1.3);
    group.add(post);
  }
  const strip = new THREE.Mesh(keep(new THREE.BoxGeometry(6.6, 0.04, 0.04)), keep(new THREE.MeshBasicMaterial({ color: "#ff3b30" })));
  strip.position.set(0, 3.33, -0.85);
  group.add(strip);

  // screens with live telemetry drawn on canvases
  const screens: { ctx: CanvasRenderingContext2D; tex: THREE_NS.CanvasTexture; kind: number }[] = [];
  const W = 512, H = 300;
  for (let i = 0; i < 4; i++) {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;
    const tex = keep(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(keep(new THREE.PlaneGeometry(1.25, 0.73)), keep(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })));
    const row = i < 2 ? 0 : 1;
    const col = i % 2;
    m.position.set(-0.68 + col * 1.36, 1.85 + row * 0.8, -0.35);
    m.rotation.x = -0.08;
    // bezel
    const bz = new THREE.Mesh(keep(new THREE.BoxGeometry(1.31, 0.79, 0.04)), dark);
    bz.position.copy(m.position).add(new THREE.Vector3(0, 0, -0.025));
    bz.rotation.x = m.rotation.x;
    group.add(bz, m);
    screens.push({ ctx, tex, kind: i });
  }
  group.add(new THREE.PointLight("#9fb4ff", 3, 6, 1.5).translateY(2.2).translateZ(0.8));

  const trace = Array.from({ length: 120 }, (_, i) => 0.5 + 0.4 * Math.sin(i * 0.12) * Math.cos(i * 0.031));
  const draw = (time: number) => {
    for (const { ctx, tex, kind } of screens) {
      ctx.fillStyle = "#07080b";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.fillStyle = "#8b919a";
      ctx.font = "600 20px monospace";
      const titles = ["SPEED  KM/H", "THROTTLE / BRAKE", "SECTOR TIMES", "TRACK MAP"];
      ctx.fillText(titles[kind], 18, 28);
      ctx.fillStyle = "#ff3b30";
      ctx.fillRect(W - 40, 16, 22, 10);
      if (kind === 0 || kind === 1) {
        const shift = Math.floor(time * 12);
        ctx.beginPath();
        for (let i = 0; i < 120; i++) {
          const v = trace[(i + shift) % 120];
          const y = kind === 0 ? H - 20 - v * (H - 70) : H - 20 - (v > 0.55 ? 1 : 0.15) * (H - 90);
          const x = (i / 119) * W;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = kind === 0 ? "#eef0f2" : "#3ddc8a";
        ctx.lineWidth = 3;
        ctx.stroke();
        if (kind === 0) {
          ctx.fillStyle = "#eef0f2";
          ctx.font = "italic 900 54px sans-serif";
          ctx.fillText(String(Math.round(120 + trace[shift % 120] * 220)), W - 150, 92);
        }
      } else if (kind === 2) {
        const rows = [["S1", "28.412", "#a855f7"], ["S2", "31.907", "#3ddc8a"], ["S3", "24.660", "#facc15"], ["LAP", "1:24.979", "#eef0f2"]];
        rows.forEach(([a, b, col], r) => {
          ctx.fillStyle = "#8b919a";
          ctx.font = "600 26px monospace";
          ctx.fillText(a, 24, 92 + r * 52);
          ctx.fillStyle = col;
          ctx.font = "700 36px monospace";
          ctx.fillText(b, 170, 92 + r * 52);
        });
      } else {
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          const x = W / 2 + Math.cos(a) * 170 + Math.cos(a * 3) * 22;
          const y = H / 2 + 20 + Math.sin(a) * 85 + Math.sin(a * 2) * 14;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        const a = time * 0.5;
        ctx.fillStyle = "#ff3b30";
        ctx.beginPath();
        ctx.arc(W / 2 + Math.cos(a) * 170 + Math.cos(a * 3) * 22, H / 2 + 20 + Math.sin(a) * 85 + Math.sin(a * 2) * 14, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      tex.needsUpdate = true;
    }
  };
  draw(0);
  return { group, draw, dispose: () => disposables.forEach((d) => d.dispose()) };
}

/* ── chequered flag ────────────────────────────── */
export function buildFlag(THREE: Three) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 168;
  const ctx = c.getContext("2d")!;
  const n = 8, m = 5;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      ctx.fillStyle = (i + j) % 2 ? "#0b0b0c" : "#f2f2f0";
      ctx.fillRect((i * 256) / n, (j * 168) / m, 256 / n + 1, 168 / m + 1);
    }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const geo = new THREE.PlaneGeometry(3.2, 2.1, 24, 14);
  const base = (geo.attributes.position.array as Float32Array).slice();
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.4, 8), new THREE.MeshBasicMaterial({ color: "#9aa0a8" }));
  const group = new THREE.Group();
  mesh.position.set(1.6, 0.55, 0);
  pole.position.set(0, 0, 0);
  group.add(mesh, pole);
  const update = (t: number) => {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3], y = base[i * 3 + 1];
      const k = (x + 1.6) / 3.2; // 0 at the pole
      p.setZ(i, Math.sin(x * 2.6 - t * 6 + y * 0.6) * 0.22 * k);
      p.setY(i, y - k * k * 0.18);
    }
    p.needsUpdate = true;
  };
  return {
    group,
    update,
    dispose() {
      geo.dispose();
      mat.dispose();
      tex.dispose();
    },
  };
}

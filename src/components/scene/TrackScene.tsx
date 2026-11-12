"use client";

import { useEffect, useRef, useState } from "react";
import { buildCurve, buildLights, buildTrackGeometry, mulberry32 } from "./track";
import { buildCar, buildFlag, buildGarage, buildNightEnv, buildPitLane, buildPitWall } from "./world";

/**
 * "Night Lap" — a fixed full-screen 3D night circuit behind the page.
 * Sections pick their place with `data-scene="0..5"` (see PLACES below).
 */

/**
 * Each home-page chapter is its own place in the racing world. Crossing into
 * the next chapter plays a "jump": the camera lunges forward, the view
 * stretches, speed lines flash — and it lands in the next place.
 *   0 Grid · 1 Pit lane · 2 Garage · 3 Pit wall · 4 On track · 5 Finish
 */
const PLACES = ["Grid", "Pit lane", "Garage", "Pit wall", "On track", "Finish"] as const;
const GANTRY_U = 0.03;
const JUMP_TIME = 1.05; // seconds
const GARAGE_AT: [number, number, number] = [0, 0, 420]; // built away from the circuit
const PITWALL_AT: [number, number, number] = [-40, 0, 10.6];

// Survives client-side navigation, so a project page continues in the same place.
let lastPlace: number | null = null;

/* ── shaders ─────────────────────────────────── */
const FOG = /* glsl */ `
  float fogFactor(float d, float density) { return exp(-d * density); }
`;

const lightVert = /* glsl */ `
  uniform float uScale;
  uniform float uReflect;
  attribute vec3 aColor;
  attribute float aSize;
  varying vec3 vColor;
  varying float vAlpha;
  ${FOG}
  void main() {
    vec3 p = position;
    if (uReflect > 0.5) p.y = -p.y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float d = -mv.z;
    gl_PointSize = clamp(aSize * uScale / max(d, 0.5) * (uReflect > 0.5 ? 2.6 : 1.0), 1.5, 90.0);
    vColor = aColor;
    float far = smoothstep(380.0, 520.0, length(position.xz));
    vAlpha = mix(fogFactor(d, 0.0042), 0.55, far);
    if (uReflect > 0.5) vAlpha *= (position.y > 30.0 ? 0.0 : 0.32);
  }
`;
const lightFrag = /* glsl */ `
  uniform float uReflect;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float a;
    if (uReflect > 0.5) {
      // wet asphalt: reflections smear into long vertical streaks
      a = exp(-pow(c.x * 9.0, 2.0)) * exp(-pow(c.y * 2.0, 2.0));
    } else {
      float d = length(c);
      a = smoothstep(0.5, 0.0, d);
      a = a * a + smoothstep(0.12, 0.0, d);
    }
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

const trackVert = /* glsl */ `
  attribute float aCurv;
  varying vec2 vUv;
  varying float vCurv;
  varying float vDist;
  void main() {
    vUv = uv;
    vCurv = aCurv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const trackFrag = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uStartLine;
  varying vec2 vUv;
  varying float vCurv;
  varying float vDist;
  ${FOG}
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    float v = vUv.y;
    vec3 col = vec3(0.07, 0.073, 0.082) + (hash(floor(vUv * vec2(40.0, 60.0))) - 0.5) * 0.014;
    // wet sheen down the racing line
    col += vec3(0.025, 0.027, 0.034) * (1.0 - abs(v - 0.5) * 2.0);
    // wet asphalt mirrors the sky towards the horizon
    col += vec3(0.11, 0.115, 0.13) * smoothstep(18.0, 140.0, vDist) * (0.6 + 0.4 * (1.0 - abs(v - 0.5) * 2.0));
    // white edge lines
    float edge = step(0.035, v) * step(v, 0.052) + step(0.948, v) * step(v, 0.965);
    col = mix(col, vec3(0.82), edge);
    // kerbs on corners
    float kerb = (step(v, 0.03) + step(0.97, v)) * step(0.32, vCurv);
    float stripe = mod(floor(vUv.x * 2.2), 2.0);
    col = mix(col, mix(vec3(0.75, 0.08, 0.06), vec3(0.78), stripe), kerb);
    // start / finish line
    float sl = 1.0 - step(0.35, abs(vUv.x - uStartLine));
    float checker = mod(floor(vUv.x * 9.0) + floor(v * 14.0), 2.0);
    col = mix(col, vec3(0.04 + 0.6 * checker), sl);
    float f = fogFactor(vDist, 0.0055);
    gl_FragColor = vec4(mix(uFogColor, col, f), 1.0);
  }
`;

const rainVert = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCam;
  uniform vec3 uFwd;
  uniform float uSpeed;
  attribute vec3 aSeed;
  attribute float aEnd;
  varying float vAlpha;
  void main() {
    vec3 B = vec3(46.0, 26.0, 46.0);
    vec3 p;
    p.x = uCam.x + (fract(aSeed.x - uCam.x / B.x) - 0.5) * B.x;
    p.z = uCam.z + (fract(aSeed.z - uCam.z / B.z) - 0.5) * B.z;
    p.y = mod(aSeed.y * B.y - uTime * 24.0, B.y) - 3.0;
    vec3 vel = vec3(0.12, -1.0, 0.06) - uFwd * uSpeed * 0.018;
    p += normalize(vel) * aEnd * (0.55 + uSpeed * 0.012);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = 0.16 * smoothstep(40.0, 4.0, -mv.z);
  }
`;
const rainFrag = /* glsl */ `
  varying float vAlpha;
  void main() { gl_FragColor = vec4(0.72, 0.78, 0.88, vAlpha); }
`;

const streakVert = /* glsl */ `
  uniform float uLen;
  attribute vec3 aTan;
  attribute float aEnd;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  ${FOG}
  void main() {
    vec3 p = position - aTan * aEnd * uLen;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vAlpha = fogFactor(-mv.z, 0.006) * (1.0 - aEnd * 0.9);
  }
`;
const streakFrag = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() { gl_FragColor = vec4(vColor, vAlpha * uOpacity); }
`;

const sprayVert = /* glsl */ `
  uniform float uTime;
  uniform vec3 uLead;
  uniform vec3 uFwd;
  uniform vec3 uSide;
  uniform float uAmount;
  uniform float uScale;
  attribute vec3 aSeed;
  varying float vAlpha;
  void main() {
    float age = fract(uTime * (0.7 + aSeed.x * 0.6) + aSeed.y);
    float wheel = aSeed.z < 0.5 ? -1.0 : 1.0;
    vec3 p = uLead
      + uSide * wheel * (0.7 + age * 0.9 * aSeed.x)
      - uFwd * (0.5 + age * (1.6 + 3.2 * uAmount))
      + vec3(0.0, 0.12 + age * (0.35 + 0.8 * aSeed.y), 0.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(70.0, (0.2 + age * 0.9) * uScale / max(-mv.z, 0.5));
    vAlpha = (1.0 - age) * age * 0.22 * uAmount;
  }
`;
const sprayFrag = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(vec3(0.78, 0.8, 0.84), smoothstep(0.5, 0.0, d) * vAlpha);
  }
`;

const skyVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const skyFrag = /* glsl */ `
  uniform float uTime;
  varying vec3 vDir;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
  void main() {
    float h = clamp(vDir.y, -0.1, 1.0);
    vec3 col = mix(vec3(0.05, 0.052, 0.06), vec3(0.012, 0.013, 0.016), smoothstep(0.0, 0.6, h));
    vec2 q = vDir.xz / max(0.12, vDir.y + 0.2) * 1.6 + vec2(uTime * 0.01, 0.0);
    float c = fbm(q);
    float cloud = smoothstep(0.45, 0.85, c) * smoothstep(-0.02, 0.25, h);
    col = mix(col, vec3(0.16, 0.165, 0.18), cloud * 0.55);
    // city glow on the horizon
    col += vec3(0.16, 0.06, 0.04) * exp(-abs(h) * 14.0) * 0.6;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const poolVert = /* glsl */ `
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const poolFrag = /* glsl */ `
  varying vec2 vUv;
  varying float vDist;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, d);
    gl_FragColor = vec4(vec3(0.6, 0.68, 0.8), a * a * 0.05 * exp(-vDist * 0.006));
  }
`;

/* ── component ───────────────────────────────── */
/** Current chapter (by the viewport centre) and how far through it the reader is (0..1). */
function readSector(sections: { el: HTMLElement; scene: number }[]) {
  const c = window.scrollY + window.innerHeight * 0.5;
  let s = sections[0]?.scene ?? 0;
  for (const it of sections) if (it.el.offsetTop <= c) s = it.scene;
  const group = sections.filter((it) => it.scene === s);
  if (!group.length) return { scene: s, t: 0 };
  const top = group[0].el.offsetTop;
  const last = group[group.length - 1].el;
  const bottom = last.offsetTop + last.offsetHeight;
  return { scene: s, t: Math.min(1, Math.max(0, (c - top) / Math.max(1, bottom - top))) };
}

export function TrackScene({ dim = false }: { dim?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const gearRef = useRef<HTMLSpanElement>(null);
  const lapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const veilFrontRef = useRef<HTMLDivElement>(null);
  const [sector, setSector] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let stop = () => {};

    (async () => {
      const THREE = await import("three");
      const canvas = canvasRef.current;
      if (disposed || !canvas) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
      } catch {
        setFailed(true);
        window.dispatchEvent(new Event("fieldscene:ready"));
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = window.matchMedia("(max-width: 767px)").matches;
      const lite = small || (navigator.hardwareConcurrency ?? 8) <= 4;
      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.4 : 1.75);
      renderer.setPixelRatio(dpr);
      const fogColor = new THREE.Color("#07080a");
      renderer.setClearColor(fogColor, 1);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(fogColor, 0.0055);
      const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 1500);

      const curve = buildCurve(THREE);
      const L = curve.getLength();
      const disposables: { dispose(): void }[] = [];
      const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

      // sky
      const sky = new THREE.Mesh(
        track(new THREE.SphereGeometry(1000, 32, 16)),
        track(new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: skyVert, fragmentShader: skyFrag, side: THREE.BackSide, depthWrite: false, fog: false })),
      );
      scene.add(sky);

      // ground + track
      const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(3000, 3000)), track(new THREE.MeshBasicMaterial({ color: "#040506" })));
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);
      const trackUniforms = {
        uFogColor: { value: fogColor },
        uStartLine: { value: (GANTRY_U * L) / 8 + 0.9 },
      };
      const trackMesh = new THREE.Mesh(
        track(buildTrackGeometry(THREE, curve)),
        track(new THREE.ShaderMaterial({ uniforms: trackUniforms, vertexShader: trackVert, fragmentShader: trackFrag, side: THREE.DoubleSide })),
      );
      scene.add(trackMesh);

      // buildings: grandstand (left of the straight) and pit building (right)
      const dark = track(new THREE.MeshBasicMaterial({ color: "#0a0b0d" }));
      const stand = new THREE.Mesh(track(new THREE.BoxGeometry(280, 10, 10)), dark);
      stand.position.set(-15, 5, -36);
      scene.add(stand);
      const roof = new THREE.Mesh(track(new THREE.BoxGeometry(284, 0.6, 16)), dark);
      roof.position.set(-15, 12.5, -33);
      roof.rotation.x = -0.08;
      scene.add(roof);
      const pits = new THREE.Mesh(track(new THREE.BoxGeometry(250, 7, 8)), dark);
      pits.position.set(-20, 3.5, 30);
      scene.add(pits);

      // start gantry
      const gp = curve.getPointAt(GANTRY_U);
      const gt = curve.getTangentAt(GANTRY_U);
      const gantry = new THREE.Mesh(track(new THREE.BoxGeometry(0.9, 1.4, 22)), dark);
      gantry.position.set(gp.x, 7.2, gp.z);
      gantry.rotation.y = Math.atan2(-gt.z, gt.x);
      scene.add(gantry);

      // lights (direct + reflected)
      const lights = buildLights(THREE, curve, lite);
      const lightGeo = track(new THREE.BufferGeometry());
      lightGeo.setAttribute("position", new THREE.BufferAttribute(lights.positions, 3));
      lightGeo.setAttribute("aColor", new THREE.BufferAttribute(lights.colors, 3));
      lightGeo.setAttribute("aSize", new THREE.BufferAttribute(lights.sizes, 1));
      const scaleU = { value: 1 };
      const mkLightMat = (reflect: boolean) =>
        track(
          new THREE.ShaderMaterial({
            uniforms: { uScale: scaleU, uReflect: { value: reflect ? 1 : 0 } },
            vertexShader: lightVert,
            fragmentShader: lightFrag,
            transparent: true,
            depthWrite: false,
            depthTest: !reflect,
            blending: THREE.AdditiveBlending,
          }),
        );
      const reflPoints = new THREE.Points(lightGeo, mkLightMat(true));
      reflPoints.renderOrder = 1;
      scene.add(reflPoints);
      const lightPoints = new THREE.Points(lightGeo, mkLightMat(false));
      lightPoints.renderOrder = 3;
      scene.add(lightPoints);

      // gantry lamps + rain light: small dynamic set
      const dyn = new Float32Array(6 * 3);
      const dynCol = new Float32Array(6 * 3);
      const dynSize = new Float32Array(6);
      const side = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), gt).normalize();
      for (let i = 0; i < 5; i++) {
        const o = (i - 2) * 1.6;
        dyn.set([gp.x + side.x * o - gt.x * 0.5, 7.2, gp.z + side.z * o - gt.z * 0.5], i * 3);
        dynSize[i] = 1.1;
      }
      dynSize[5] = 0.9;
      const dynGeo = track(new THREE.BufferGeometry());
      dynGeo.setAttribute("position", new THREE.BufferAttribute(dyn, 3));
      dynGeo.setAttribute("aColor", new THREE.BufferAttribute(dynCol, 3));
      dynGeo.setAttribute("aSize", new THREE.BufferAttribute(dynSize, 1));
      const dynRefl = new THREE.Points(dynGeo, mkLightMat(true));
      dynRefl.frustumCulled = false; // the rain light moves around the whole lap
      dynRefl.renderOrder = 2;
      scene.add(dynRefl);
      const dynPoints = new THREE.Points(dynGeo, mkLightMat(false));
      dynPoints.frustumCulled = false;
      dynPoints.renderOrder = 4;
      scene.add(dynPoints);

      // light pools under the floodlights
      const mastHeads: number[] = [];
      for (let i = 0; i < lights.count; i++) if (lights.positions[i * 3 + 1] > 12.9 && lights.positions[i * 3 + 1] < 13.2) mastHeads.push(i);
      const pools = new THREE.InstancedMesh(
        track(new THREE.PlaneGeometry(20, 20)),
        track(new THREE.ShaderMaterial({ vertexShader: poolVert, fragmentShader: poolFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })),
        mastHeads.length,
      );
      const m4 = new THREE.Matrix4();
      const rotX = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
      mastHeads.forEach((li, k) => {
        m4.makeTranslation(lights.positions[li * 3], 0.03, lights.positions[li * 3 + 2]).multiply(rotX);
        pools.setMatrixAt(k, m4);
      });
      pools.renderOrder = 2;
      scene.add(pools);

      // speed streaks from barrier reflectors + grandstand LEDs
      const sP: number[] = [], sT: number[] = [], sE: number[] = [], sC: number[] = [];
      for (let i = 0; i < lights.count; i++) {
        const tx = lights.tangents[i * 3], tz = lights.tangents[i * 3 + 2];
        if (tx === 0 && tz === 0) continue;
        const x = lights.positions[i * 3], y = lights.positions[i * 3 + 1], z = lights.positions[i * 3 + 2];
        for (const e of [0, 1]) {
          sP.push(x, y, z);
          sT.push(tx, 0, tz);
          sE.push(e);
          sC.push(lights.colors[i * 3], lights.colors[i * 3 + 1], lights.colors[i * 3 + 2]);
        }
      }
      const streakGeo = track(new THREE.BufferGeometry());
      streakGeo.setAttribute("position", new THREE.Float32BufferAttribute(sP, 3));
      streakGeo.setAttribute("aTan", new THREE.Float32BufferAttribute(sT, 3));
      streakGeo.setAttribute("aEnd", new THREE.Float32BufferAttribute(sE, 1));
      streakGeo.setAttribute("aColor", new THREE.Float32BufferAttribute(sC, 3));
      const streakU = { uLen: { value: 0 }, uOpacity: { value: 0 } };
      const streaks = new THREE.LineSegments(
        streakGeo,
        track(new THREE.ShaderMaterial({ uniforms: streakU, vertexShader: streakVert, fragmentShader: streakFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })),
      );
      streaks.renderOrder = 3;
      scene.add(streaks);

      // rain
      const rnd = mulberry32(7);
      const drops = lite ? 700 : 1800;
      const rSeed = new Float32Array(drops * 2 * 3);
      const rEnd = new Float32Array(drops * 2);
      for (let i = 0; i < drops; i++) {
        const s = [rnd(), rnd(), rnd()];
        rSeed.set(s, i * 6);
        rSeed.set(s, i * 6 + 3);
        rEnd[i * 2 + 1] = 1;
      }
      const rainGeo = track(new THREE.BufferGeometry());
      rainGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(drops * 2 * 3), 3));
      rainGeo.setAttribute("aSeed", new THREE.BufferAttribute(rSeed, 3));
      rainGeo.setAttribute("aEnd", new THREE.BufferAttribute(rEnd, 1));
      const camPos = new THREE.Vector3();
      const fwd = new THREE.Vector3(1, 0, 0);
      const rainU = { uTime: { value: 0 }, uCam: { value: camPos }, uFwd: { value: fwd }, uSpeed: { value: 0 } };
      const rain = new THREE.LineSegments(
        rainGeo,
        track(new THREE.ShaderMaterial({ uniforms: rainU, vertexShader: rainVert, fragmentShader: rainFrag, transparent: true, depthWrite: false })),
      );
      rain.frustumCulled = false;
      rain.renderOrder = 5;
      scene.add(rain);

      // tyre spray behind the rain light
      const sprayN = lite ? 260 : 520;
      const spSeed = new Float32Array(sprayN * 3);
      for (let i = 0; i < sprayN * 3; i++) spSeed[i] = rnd();
      const sprayGeo = track(new THREE.BufferGeometry());
      sprayGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(sprayN * 3), 3));
      sprayGeo.setAttribute("aSeed", new THREE.BufferAttribute(spSeed, 3));
      const leadPos = new THREE.Vector3(); // rear axle of the car, for the tyre spray
      const sideV = new THREE.Vector3();
      const sprayU = { uTime: { value: 0 }, uLead: { value: leadPos }, uFwd: { value: fwd }, uSide: { value: sideV }, uAmount: { value: 0.3 }, uScale: scaleU };
      const spray = new THREE.Points(
        sprayGeo,
        track(new THREE.ShaderMaterial({ uniforms: sprayU, vertexShader: sprayVert, fragmentShader: sprayFrag, transparent: true, depthWrite: false })),
      );
      spray.frustumCulled = false;
      spray.renderOrder = 4;
      scene.add(spray);

      // mini map path (top-down, normalised into a 100×64 box)
      if (pathRef.current) {
        const pts = curve.getSpacedPoints(160);
        const xs = pts.map((p) => p.x), zs = pts.map((p) => p.z);
        const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
        const sc = Math.min(96 / (maxX - minX), 60 / (maxZ - minZ));
        const map = (x: number, z: number): [number, number] => [2 + (x - minX) * sc, 2 + (z - minZ) * sc];
        pathRef.current.setAttribute("d", "M" + pts.map((p) => map(p.x, p.z).map((n) => n.toFixed(1)).join(",")).join("L") + "Z");
        (pathRef.current as unknown as { __map: typeof map }).__map = map;
      }

      // ── set pieces ──
      const env = buildNightEnv(THREE, renderer);
      track(env);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const car = buildCar(THREE, env);
      scene.add(car.group);
      disposables.push(car);
      const pitLane = buildPitLane(THREE);
      scene.add(pitLane.group);
      disposables.push(pitLane);
      const garageOrigin = new THREE.Vector3(...GARAGE_AT);
      const garage = buildGarage(THREE, garageOrigin, lite);
      scene.add(garage.group);
      disposables.push(garage);
      const pitWallAt = new THREE.Vector3(...PITWALL_AT);
      const pitWall = buildPitWall(THREE, pitWallAt);
      scene.add(pitWall.group);
      disposables.push(pitWall);
      const flag = buildFlag(THREE);
      flag.group.position.set(gp.x + side.x * 4.5, 8.9, gp.z + side.z * 4.5);
      flag.group.rotation.y = Math.atan2(gt.x, gt.z) + Math.PI;
      scene.add(flag.group);
      disposables.push(flag);
      // outdoor light for the car: cool floodlight key, faint sky, red rain-light glow
      const key = new THREE.DirectionalLight("#cfdcff", 1.1);
      key.position.set(-30, 60, 40);
      scene.add(key);
      scene.add(new THREE.HemisphereLight("#3a4252", "#050505", 0.35));
      const tailGlow = new THREE.PointLight("#ff2a20", 1.2, 5, 1.8);
      scene.add(tailGlow);

      // ── scroll → place ──
      let sections: { el: HTMLElement; scene: number }[] = [];
      const collect = () => {
        sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((el) => ({ el, scene: Number(el.dataset.scene) || 0 }));
      };
      collect();
      const pageProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      };

      let baseFov = 52;
      const resize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        baseFov = w / h < 0.8 ? 66 : 52;
        camera.fov = baseFov;
        camera.updateProjectionMatrix();
        scaleU.value = (h * dpr) / (2 * Math.tan((camera.fov * Math.PI) / 360));
        collect();
      };
      resize();
      window.addEventListener("resize", resize);
      const ro = new ResizeObserver(collect);
      ro.observe(document.body);

      const up = new THREE.Vector3(0, 1, 0);
      const tmp = new THREE.Vector3();
      const tmpT = new THREE.Vector3();
      const camTarget = new THREE.Vector3();
      const lookTarget = new THREE.Vector3();
      const look = new THREE.Vector3();
      const carPos = new THREE.Vector3();
      const carPrev = new THREE.Vector3();
      const carFwd = new THREE.Vector3(1, 0, 0);
      const red = new THREE.Color("#ff2a20");
      const at = (u: number, out: import("three").Vector3) => curve.getPointAt(((u % 1) + 1) % 1, out);
      const tangentAt = (u: number, out: import("three").Vector3) => curve.getTangentAt(((u % 1) + 1) % 1, out);
      const placeCarOnTrack = (u: number) => {
        at(u, carPos);
        tangentAt(u, carFwd);
        car.group.position.copy(carPos);
        car.group.rotation.set(0, Math.atan2(-carFwd.z, carFwd.x), 0);
      };

      /** Camera position + look target (and car placement) for a place at progress t. */
      const pose = (place: number, t: number, time: number) => {
        switch (place) {
          case 0: {
            // on the grid behind the car, gantry lights ahead
            const u = 0.008 + t * 0.006;
            at(u, camTarget).y = 1.25;
            placeCarOnTrack(0.008 + 8 / L);
            at(u + 40 / L, lookTarget).y = 2.2;
            break;
          }
          case 1: {
            // rolling down the pit lane behind the car, lit garages on the right
            const x = -78 + t * 34 + time * 0.6;
            camTarget.set(x, 1.6, 15.4);
            car.group.position.set(x + 10, 0, 16.6);
            car.group.rotation.set(0, 0, 0);
            carFwd.set(1, 0, 0);
            carPos.copy(car.group.position);
            lookTarget.set(x + 32, 1.2, 18.5);
            break;
          }
          case 2: {
            // garage showcase: orbit the parked car
            const a = 0.75 + t * 1.9 + Math.sin(time * 0.25) * 0.05;
            camTarget.set(garageOrigin.x + Math.cos(a) * 6.6, 1.55, garageOrigin.z + Math.sin(a) * 6.6);
            car.group.position.copy(garageOrigin);
            car.group.rotation.set(0, 0, 0);
            carFwd.set(1, 0, 0);
            carPos.copy(garageOrigin);
            lookTarget.copy(garageOrigin).add(tmp.set(0, 0.45, 0));
            break;
          }
          case 3: {
            // behind the pit-wall screens, looking across the track; the car keeps lapping past
            // screens sit on the left, behind the photo, away from the text
            camTarget.copy(pitWallAt).add(tmp.set(1.7 + t * 0.6, 2.45, 2.7));
            lookTarget.copy(pitWallAt).add(tmp.set(3.4, 1.4, -18));
            placeCarOnTrack(0.02 + ((time * 0.016) % 0.13));
            break;
          }
          case 4: {
            // chase cam: the lap itself — keeps driving even while the reader pauses
            const u = 0.13 + t * 0.7 + drive;
            at(u, camTarget).y = 1.2;
            placeCarOnTrack(u + 9 / L);
            at(u + 34 / L, lookTarget).y = 0.9;
            break;
          }
          default: {
            // finish: the chequered flag on the gantry, car crossing the line
            const u = 0.988 + t * 0.022;
            at(u, camTarget).y = 1.4;
            placeCarOnTrack(u + 12 / L + t * 0.008);
            at(GANTRY_U, lookTarget).y = 5.8;
          }
        }
      };

      const first = sections.length ? readSector(sections) : { scene: 0, t: 0 };
      // project pages keep the place the visitor came from
      let shown = dim ? lastPlace ?? 4 : first.scene;
      let jump = lastPlace !== null && !reduce ? 0 : -1; // arriving from another page starts with a jump
      let jumpStart = performance.now();
      let jumpTo = shown;
      let swapped = jump < 0;
      let time = 0;
      let last = performance.now();
      let raf = 0;
      let shownLabel = -1;
      let hudTick = 0;
      let ready = false;
      let speed = 0;
      let dimT = 0;
      let drive = 0; // extra distance driven while sitting on the track chapter
      pose(shown, dim ? 0.5 : first.t, 0);
      camPos.copy(camTarget);
      look.copy(lookTarget);
      carPrev.copy(car.group.position);

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!reduce) time += dt;

        const read = dim ? { scene: shown, t: (dimT += dt * 0.01) % 1 } : sections.length ? readSector(sections) : { scene: 0, t: 0 };
        if (!dim && read.scene !== jumpTo) {
          jumpTo = read.scene;
          if (reduce) shown = jumpTo;
          else if (jump < 0 || swapped) {
            jump = 0;
            jumpStart = now;
            swapped = false;
          }
        }
        let kick = 0;
        if (jump >= 0) {
          jump = (now - jumpStart) / 1000 / JUMP_TIME;
          if (!swapped && jump >= 0.42) {
            swapped = true;
            shown = jumpTo;
            pose(shown, read.t, time);
            camPos.copy(camTarget);
            look.copy(lookTarget);
            carPrev.copy(car.group.position);
          }
          kick = Math.sin(Math.min(1, jump) * Math.PI);
          if (jump >= 1) jump = -1;
        }
        lastPlace = shown;
        if (shown === 4 && !reduce) drive = Math.min(drive + dt * 0.0035, 0.06);

        pose(shown, read.t, time);
        if (jump >= 0 && !swapped) {
          // lunge forward along the view direction
          tmp.subVectors(look, camPos).normalize();
          camPos.addScaledVector(tmp, dt * 40 * kick);
          look.addScaledVector(tmp, dt * 40 * kick);
        } else {
          const k = reduce ? 1 : Math.min(1, dt * 3);
          camPos.lerp(camTarget, k);
          look.lerp(lookTarget, k);
        }
        camera.position.copy(camPos);
        camera.up.set(0, 1, 0);
        camera.lookAt(look);
        const fov = baseFov + kick * 34;
        if (Math.abs(camera.fov - fov) > 0.01) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }

        // car speed → wheels, spray, HUD
        const moved = carPrev.distanceTo(car.group.position);
        carPrev.copy(car.group.position);
        const carSpeed = moved < 30 ? moved / Math.max(dt, 1e-3) : 0;
        speed += (Math.min(carSpeed, 95) + kick * 80 - speed) * Math.min(1, dt * 4);
        for (const w of car.wheels) w.rotation.z -= (carSpeed * dt) / 0.36;
        fwd.copy(carFwd);
        sideV.crossVectors(up, carFwd).normalize();
        leadPos.copy(car.group.position).addScaledVector(carFwd, -1.62);
        leadPos.y = 0.3;

        // rain light: glow sprite + a little red light on the wet ground
        car.rainLight.getWorldPosition(tmpT);
        const flash = reduce ? 1 : 0.7 + 0.3 * (Math.sin(time * 26) > 0 ? 1 : 0.35);
        dyn.set([tmpT.x, tmpT.y, tmpT.z], 15);
        dynCol.set([1.4 * flash, 0.2 * flash, 0.14 * flash], 15);
        tailGlow.position.copy(tmpT).addScaledVector(carFwd, -0.9);
        tailGlow.position.y = 0.15;
        tailGlow.intensity = 1.2 * flash;
        // gantry: five reds on the grid
        const lightsOn = shown === 0 && !dim ? 1 : 0;
        for (let i = 0; i < 5; i++) dynCol.set([red.r * lightsOn, red.g * lightsOn, red.b * lightsOn], i * 3);
        dynGeo.attributes.position.needsUpdate = true;
        dynGeo.attributes.aColor.needsUpdate = true;

        const indoors = shown === 2;
        rain.visible = !indoors;
        spray.visible = !indoors;
        const sp = Math.min(1, speed / 85);
        streakU.uLen.value = sp * 14;
        streakU.uOpacity.value = Math.max(0, sp - 0.15) * 0.9;
        rainU.uTime.value = time;
        rainU.uSpeed.value = speed;
        sprayU.uTime.value = time;
        sprayU.uAmount.value = Math.min(1, carSpeed / 60) * 0.95 + 0.05;
        (sky.material as import("three").ShaderMaterial).uniforms.uTime.value = time;
        flag.group.visible = shown === 5;
        if (shown === 5) flag.update(time);
        if (shown === 3 && Math.floor(time * 10) !== Math.floor((time - dt) * 10)) pitWall.draw(time);

        renderer.render(scene, camera);

        // HUD (≈12 Hz)
        hudTick += dt;
        if (hudTick > 0.08) {
          hudTick = 0;
          const kmh = Math.round(Math.min(342, speed * 3.6));
          if (speedRef.current) speedRef.current.textContent = String(kmh).padStart(3, "0");
          const gear = kmh < 6 ? "N" : String(Math.min(8, 1 + Math.floor(kmh / 42)));
          if (gearRef.current) gearRef.current.textContent = gear;
          if (lapRef.current) lapRef.current.style.transform = `scaleX(${pageProgress()})`;
          const map = (pathRef.current as unknown as { __map?: (x: number, z: number) => [number, number] } | null)?.__map;
          if (map && dotRef.current) {
            const [mx, my] = map(car.group.position.x, car.group.position.z);
            dotRef.current.setAttribute("cx", mx.toFixed(1));
            dotRef.current.setAttribute("cy", my.toFixed(1));
            dotRef.current.style.opacity = indoors ? "0" : "1";
          }
        }
        if (veilRef.current) {
          const v = jump >= 0 ? Math.pow(kick, 2.2) : 0;
          veilRef.current.style.opacity = v.toFixed(3);
          veilRef.current.style.transform = `scale(${(1 + kick * 0.25).toFixed(3)})`;
        }
        if (veilFrontRef.current) {
          const v = jump >= 0 ? Math.pow(kick, 3) * 0.32 : 0;
          veilFrontRef.current.style.opacity = v.toFixed(3);
          veilFrontRef.current.style.transform = `scale(${(1.1 + kick * 0.35).toFixed(3)})`;
        }
        if (shown !== shownLabel) {
          shownLabel = shown;
          setSector(shown);
        }
        if (!ready) {
          ready = true;
          window.dispatchEvent(new Event("fieldscene:ready"));
        }
      };
      raf = requestAnimationFrame(frame);

      const onVisibility = () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      stop = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
        ro.disconnect();
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      stop();
    };
  }, [dim]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 -z-10 h-lvh w-full ${dim ? "opacity-45" : ""}`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(130%_90%_at_50%_40%,transparent_45%,rgb(6_7_8/0.8)_100%)]"
      />
      {/* chapter jump: speed lines + red flash behind the content */}
      <div ref={veilRef} aria-hidden="true" className="jump-veil pointer-events-none fixed inset-0 -z-[9] opacity-0" />
      <div ref={veilFrontRef} aria-hidden="true" className="jump-veil pointer-events-none fixed inset-0 z-30 opacity-0" />
      {!failed && !dim && (
        <div aria-hidden="true" className="pointer-events-none fixed bottom-4 left-4 z-40 hidden origin-bottom-left scale-[0.82] items-end gap-4 opacity-90 md:flex">
          <div className="glass flex items-end gap-4 rounded-2xl px-4 py-3">
            <div>
              <p className="hud-label">Speed</p>
              <p className="title-xl mt-1 text-[1.9rem] leading-none tabular-nums">
                <span ref={speedRef}>000</span>
                <span className="ml-1 font-mono text-[0.6rem] not-italic tracking-[0.1em] text-muted">KM/H</span>
              </p>
            </div>
            <div className="border-l border-line pl-4">
              <p className="hud-label">Gear</p>
              <p className="title-xl mt-1 text-[1.9rem] leading-none signal-text">
                <span ref={gearRef}>N</span>
              </p>
            </div>
            <div className="border-l border-line pl-4">
              <p className="hud-label">{PLACES[sector]}</p>
              <svg viewBox="0 0 100 64" className="mt-1 h-10 w-[4.2rem]">
                <path ref={pathRef} fill="none" stroke="rgb(255 255 255 / 0.28)" strokeWidth="1.4" />
                <circle ref={dotRef} r="2.6" fill="#ff3b30" />
              </svg>
            </div>
          </div>
          <div className="mb-1 h-[3px] w-28 overflow-hidden rounded-full bg-white/10">
            <div ref={lapRef} className="h-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { buildCurve, buildLights, buildTrackGeometry, mulberry32 } from "./track";

/**
 * "Night Lap" — a fixed full-screen 3D night circuit behind the page.
 * Scrolling drives the camera around one lap behind a red rain light.
 * Sections mark their sector with `data-scene="0..4"` (grid, S1, S2, S3, finish).
 */

const SECTORS = ["Grid", "Sector 1", "Sector 2", "Sector 3", "Finish"] as const;
const START_U = 0.012; // camera on the grid, just behind the start gantry
const GANTRY_U = 0.03;

// Survives client-side navigation, so the next page continues the same lap.
let lastU: number | null = null;

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
function readSector(sections: { el: HTMLElement; scene: number }[]) {
  const c = window.scrollY + window.innerHeight * 0.5;
  let s = sections[0]?.scene ?? 0;
  for (const it of sections) if (it.el.offsetTop <= c) s = it.scene;
  return s;
}

export function TrackScene({ dim = false }: { dim?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const gearRef = useRef<HTMLSpanElement>(null);
  const lapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
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
      const leadPos = new THREE.Vector3();
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

      // scroll → lap position
      let sections: { el: HTMLElement; scene: number }[] = [];
      const collect = () => {
        sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((el) => ({ el, scene: Number(el.dataset.scene) || 0 }));
      };
      collect();
      const pageProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      };

      const resize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = w / h < 0.8 ? 66 : 52;
        camera.updateProjectionMatrix();
        scaleU.value = (h * dpr) / (2 * Math.tan((camera.fov * Math.PI) / 360));
        collect();
      };
      resize();
      window.addEventListener("resize", resize);
      const ro = new ResizeObserver(collect);
      ro.observe(document.body);

      const arriving = lastU !== null;
      // project pages cruise on from wherever the visitor was on the lap
      const baseDim = lastU ?? 0.35;
      let u = arriving ? (lastU as number) : START_U + pageProgress() * 0.96;
      let cruise = 0;
      let speed = 0; // m/s
      let boost = arriving && !reduce ? 1 : 0;
      let time = 0;
      let last = performance.now();
      let raf = 0;
      let shownSector = -1;
      let hudTick = 0;
      let ready = false;
      const look = new THREE.Vector3();
      const p0 = new THREE.Vector3();
      const tan = new THREE.Vector3();
      const tan2 = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0);
      const red = new THREE.Color("#ff2a20");

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!reduce) time += dt;

        // target position on the lap
        const sec = sections.length ? readSector(sections) : 0;
        if (!dim && sec > 0 && !reduce) cruise += dt * 0.0012;
        if (dim && !reduce) cruise += dt * 0.004;
        const target = dim ? baseDim + cruise : START_U + pageProgress() * 0.96 + cruise;
        const prev = u;
        u = reduce ? target : u + (target - u) * Math.min(1, dt * 2.2);
        lastU = u;
        const inst = Math.abs(u - prev) * L / Math.max(dt, 1e-3);
        boost = Math.max(0, boost - dt * 0.8);
        speed += (inst + boost * 70 - speed) * Math.min(1, dt * 4);

        const uu = ((u % 1) + 1) % 1;
        curve.getPointAt(uu, p0);
        curve.getTangentAt(uu, tan);
        curve.getTangentAt((uu + 30 / L) % 1, tan2);
        fwd.copy(tan);
        sideV.crossVectors(up, tan).normalize();
        const turn = tan.x * tan2.z - tan.z * tan2.x;

        camPos.copy(p0).addScaledVector(up, 1.15 + Math.sin(time * 9) * 0.006 * Math.min(1, speed / 40));
        curve.getPointAt((uu + 9 / L) % 1, leadPos);
        leadPos.y = 0.62;
        curve.getPointAt((uu + 34 / L) % 1, look);
        look.y = 0.9;
        camera.position.copy(camPos);
        const roll = Math.max(-0.035, Math.min(0.035, turn * 0.08));
        camera.up.set(-roll * sideV.x, 1, -roll * sideV.z).normalize();
        camera.lookAt(look);

        // gantry: five reds on the grid, lights out once the lap starts
        const lightsOn = sec === 0 && !dim ? 1 : 0;
        for (let i = 0; i < 5; i++) dynCol.set([red.r * lightsOn, red.g * lightsOn, red.b * lightsOn], i * 3);
        // rain light: steady glow with the rain-light flash
        const flash = reduce ? 1 : 0.7 + 0.3 * (Math.sin(time * 26) > 0 ? 1 : 0.35);
        dyn.set([leadPos.x, leadPos.y, leadPos.z], 15);
        dynCol.set([1.6 * flash, 0.22 * flash, 0.16 * flash], 15);
        dynGeo.attributes.position.needsUpdate = true;
        dynGeo.attributes.aColor.needsUpdate = true;

        const sp = Math.min(1, speed / 85);
        streakU.uLen.value = sp * 14;
        streakU.uOpacity.value = Math.max(0, sp - 0.15) * 0.9;
        rainU.uTime.value = time;
        rainU.uSpeed.value = speed;
        sprayU.uTime.value = time;
        sprayU.uAmount.value = 0.25 + sp * 0.9;
        (sky.material as import("three").ShaderMaterial).uniforms.uTime.value = time;

        renderer.render(scene, camera);

        // HUD (≈12 Hz)
        hudTick += dt;
        if (hudTick > 0.08) {
          hudTick = 0;
          const kmh = Math.round(Math.min(342, speed * 3.6 * 1.6));
          if (speedRef.current) speedRef.current.textContent = String(kmh).padStart(3, "0");
          const gear = kmh < 6 ? "N" : String(Math.min(8, 1 + Math.floor(kmh / 42)));
          if (gearRef.current) gearRef.current.textContent = gear;
          if (lapRef.current) lapRef.current.style.transform = `scaleX(${pageProgress()})`;
          const map = (pathRef.current as unknown as { __map?: (x: number, z: number) => [number, number] } | null)?.__map;
          if (map && dotRef.current) {
            const [mx, my] = map(p0.x, p0.z);
            dotRef.current.setAttribute("cx", mx.toFixed(1));
            dotRef.current.setAttribute("cy", my.toFixed(1));
          }
        }
        if (sec !== shownSector) {
          shownSector = sec;
          setSector(sec);
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
              <p className="hud-label">{SECTORS[sector]}</p>
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

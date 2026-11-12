"use client";

import { useEffect, useRef, useState } from "react";
import { SCENE_LABELS, buildFormations } from "./formations";

/**
 * Fixed full-screen point cloud behind the home page.
 * Sections mark which formation they belong to with `data-scene="0..4"`;
 * the cloud morphs as the visitor scrolls from one to the next.
 */

// Per-formation staging: group tilt, vertical offset, camera distance, spin, colour, point size.
const STAGE = {
  tilt: [0.52, 1.02, 0.6, 0.18, 0],
  y: [-2.4, -1.5, -1.8, 0, 0.6],
  camZ: [12.4, 14.5, 12.4, 15.5, 15],
  spin: [0.045, 0.025, 0.06, 0.07, 0],
  color: ["#7fe3ff", "#62d2ff", "#a6ecff", "#aab8ff", "#dbe7ff"],
  size: [1.2, 1.1, 1, 0.95, 1.1],
};

const vertex = /* glsl */ `
  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixel;
  uniform float uScan;
  uniform float uFlow;
  uniform float uWave;
  uniform float uAlpha;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute vec4 aRnd;
  attribute float aFlow;
  varying float vAlpha;
  varying float vAccent;
  varying float vGlow;

  // signal rings expand from the transmitter and fade at the edge
  vec3 streamed() {
    vec3 q = aP4;
    float r = length(q.xy);
    if (r < 0.75) return q;
    float nr = 0.75 + mod(r - 0.75 + uTime * uWave, 11.9);
    q.xy *= nr / r;
    return q;
  }
  vec3 pick(float i) {
    if (i < 0.5) return position;
    if (i < 1.5) return aP1;
    if (i < 2.5) return aP2;
    if (i < 3.5) return aP3;
    return streamed();
  }
  float accentOf(float i) {
    float m = aRnd.w;
    if (i < 0.5) return 0.0;
    if (i > 0.5 && i < 1.5) return mod(m, 2.0);
    if (i > 1.5 && i < 2.5) return mod(floor(m / 2.0), 2.0);
    if (i > 2.5 && i < 3.5) return mod(floor(m / 4.0), 2.0);
    return floor(m / 8.0);
  }

  void main() {
    float m = clamp(uMorph, 0.0, 4.0);
    float i0 = floor(m);
    float i1 = min(i0 + 1.0, 4.0);
    float f = m - i0;
    float d = aRnd.x * 0.4;
    float t = smoothstep(d, d + 0.6, f);

    vec3 p = mix(pick(i0), pick(i1), t);
    // a little life, strongest mid-morph
    float drift = 0.02 + 0.5 * t * (1.0 - t);
    p += vec3(
      sin(uTime * 0.55 + aRnd.y * 6.283),
      cos(uTime * 0.45 + aRnd.z * 6.283),
      sin(uTime * 0.35 + aRnd.x * 6.283)
    ) * drift;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // rotating LiDAR sweep (field + machines)
    float ang = atan(p.z, p.x);
    float sweep = mod(ang - uTime * 0.9, 6.2831853);
    float beam = exp(-sweep * 2.2) * uScan;
    // data pulses running down the canals (network)
    float pulse = aFlow < 0.0 ? 0.0 : pow(max(0.0, sin(aFlow * 1.4 - uTime * 2.2)), 18.0) * uFlow;

    float acc = mix(accentOf(i0), accentOf(i1), t);
    vAccent = acc;
    vGlow = beam + pulse;

    float size = uSize * (0.55 + aRnd.y * 0.9) * (1.0 + acc * 0.9 + vGlow * 0.8);
    gl_PointSize = size * uPixel * (34.0 / max(0.5, -mv.z));
    float fog = smoothstep(40.0, 4.0, -mv.z);
    vAlpha = (0.42 + 0.58 * aRnd.z) * fog;
    // fade the signal rings as they reach the edge
    vAlpha *= 1.0 - smoothstep(9.0, 12.5, length(p.xy)) * smoothstep(3.0, 4.0, m);
    vAlpha *= uAlpha;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vAccent;
  varying float vGlow;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.05, d);
    vec3 col = mix(uColor, uAccent, clamp(vAccent, 0.0, 1.0));
    col = mix(col, vec3(1.0), clamp(vGlow, 0.0, 1.0) * 0.7);
    gl_FragColor = vec4(col, a * clamp(vAlpha + vGlow * 0.6 + vAccent * 0.35, 0.0, 1.0));
  }
`;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function stageAt(arr: number[], m: number) {
  const i = Math.min(Math.floor(m), arr.length - 2);
  return lerp(arr[i], arr[i + 1], Math.min(1, m - i));
}

/** Scroll position → formation (0..4), blending in the last third of each section. */
function readTarget(sections: { el: HTMLElement; scene: number }[]) {
  if (!sections.length) return 0;
  const c = window.scrollY + window.innerHeight * 0.5;
  for (let i = 0; i < sections.length; i++) {
    const { el, scene } = sections[i];
    const top = el.offsetTop;
    const h = el.offsetHeight;
    if (c < top + h || i === sections.length - 1) {
      if (c < top) return scene;
      const next = sections[i + 1]?.scene ?? scene;
      const t = (c - top) / Math.max(1, h);
      const blend = Math.min(1, Math.max(0, (t - 0.68) / 0.32));
      const s = blend * blend * (3 - 2 * blend);
      return lerp(scene, next, s);
    }
  }
  return sections[sections.length - 1].scene;
}

export function FieldScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState(0);
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
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
      } catch {
        setFailed(true);
        window.dispatchEvent(new Event("fieldscene:ready"));
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = window.matchMedia("(max-width: 767px)").matches;
      const lowPower = small || (navigator.hardwareConcurrency ?? 8) <= 4;
      const count = lowPower ? 16000 : 34000;
      const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 120);
      const group = new THREE.Group();
      scene.add(group);

      const f = buildFormations(count);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(f.positions[0], 3));
      geo.setAttribute("aP1", new THREE.BufferAttribute(f.positions[1], 3));
      geo.setAttribute("aP2", new THREE.BufferAttribute(f.positions[2], 3));
      geo.setAttribute("aP3", new THREE.BufferAttribute(f.positions[3], 3));
      geo.setAttribute("aP4", new THREE.BufferAttribute(f.positions[4], 3));
      geo.setAttribute("aRnd", new THREE.BufferAttribute(f.rnd, 4));
      geo.setAttribute("aFlow", new THREE.BufferAttribute(f.flow, 1));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 80);

      const uniforms = {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: small ? 0.85 : 1 },
        uAlpha: { value: small ? 0.5 : 0.9 },
        uPixel: { value: dpr },
        uScan: { value: 1 },
        uFlow: { value: 0 },
        uWave: { value: 0 },
        uColor: { value: new THREE.Color(STAGE.color[0]) },
        uAccent: { value: new THREE.Color("#ffb454") },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      group.add(new THREE.Points(geo, material));

      const colors = STAGE.color.map((c) => new THREE.Color(c));
      const tmp = new THREE.Color();

      let sections: { el: HTMLElement; scene: number }[] = [];
      const collect = () => {
        sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((el) => ({
          el,
          scene: Number(el.dataset.scene) || 0,
        }));
      };
      collect();

      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // keep the formations framed on tall phone screens
        camera.fov = w / h < 0.8 ? 68 : 52;
        camera.updateProjectionMatrix();
        collect();
      };
      resize();
      window.addEventListener("resize", resize);
      const ro = new ResizeObserver(collect);
      ro.observe(document.body);

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let morph = readTarget(sections);
      let spin = 0;
      let last = performance.now();
      let time = 0;
      let raf = 0;
      let shownLabel = -1;
      let readySent = false;

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!reduce) time += dt;

        const target = readTarget(sections);
        morph = reduce ? target : morph + (target - morph) * Math.min(1, dt * 2.6);

        uniforms.uMorph.value = morph;
        uniforms.uTime.value = time;
        uniforms.uScan.value = Math.max(0, 1 - Math.abs(morph - 0)) + Math.max(0, 1 - Math.abs(morph - 2));
        uniforms.uFlow.value = Math.max(0, 1 - Math.abs(morph - 1));
        uniforms.uWave.value = Math.max(0, morph - 3) * 1.1;
        const ci = Math.min(Math.floor(morph), 3);
        tmp.copy(colors[ci]).lerp(colors[ci + 1], Math.min(1, morph - ci));
        uniforms.uColor.value.copy(tmp);
        uniforms.uSize.value = (small ? 0.85 : 1) * stageAt(STAGE.size, morph);

        pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 2);
        pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 2);
        if (!reduce) spin += dt * stageAt(STAGE.spin, morph);
        const settle = Math.max(0, morph - 3);
        group.rotation.set(
          stageAt(STAGE.tilt, morph) + pointer.y * 0.05,
          spin * (1 - settle) + pointer.x * 0.08,
          0,
        );
        group.position.y = stageAt(STAGE.y, morph);
        camera.position.set(pointer.x * 0.4, pointer.y * -0.25, stageAt(STAGE.camZ, morph));
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);

        const nearest = Math.round(morph);
        if (nearest !== shownLabel) {
          shownLabel = nearest;
          setLabel(nearest);
        }
        if (!readySent) {
          readySent = true;
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
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        ro.disconnect();
        geo.dispose();
        material.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      stop();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-lvh w-full"
      />
      {/* soft vignette keeps text readable over the cloud */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_40%,rgb(4_6_10/0.85)_100%)]"
      />
      {!failed && (
        <div aria-hidden="true" className="pointer-events-none fixed bottom-5 left-5 z-40 hidden items-center gap-3 md:flex">
          <div className="flex gap-1">
            {SCENE_LABELS.map((_, i) => (
              <span
                key={i}
                className={`h-3 w-[3px] rounded-full transition-colors duration-500 ${i === label ? "bg-signal" : "bg-white/15"}`}
              />
            ))}
          </div>
          <span className="hud-label">
            <span className="signal-text">0{label + 1}</span> / {SCENE_LABELS[label]}
          </span>
        </div>
      )}
    </>
  );
}

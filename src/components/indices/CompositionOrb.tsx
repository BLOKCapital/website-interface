"use client";

import { useEffect, useRef } from "react";

export type OrbNode = { id: string; label: string; weight?: number; color: string; logo?: string };

type P = { x: number; y: number; z: number };

/** Evenly spread n points on a unit sphere (Fibonacci lattice). */
function lattice(n: number): P[] {
  const pts: P[] = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    pts.push({ x: Math.cos(g * i) * r, y: y * 0.82, z: Math.sin(g * i) * r });
  }
  return pts;
}

/**
 * A small 3D view of an index: the core is the index, each satellite is one
 * component, sized by its weight when weights are published (equal otherwise).
 * Plain canvas 2D with a hand-rolled projection: no WebGL, no library, ~0 kB
 * of dependencies. Drifts slowly, tilts toward the pointer, highlights the
 * selected component. Stops drawing off-screen and when the tab is hidden;
 * with reduced motion it renders one still frame.
 *
 * Decorative for assistive tech: the same components are real buttons beside it.
 */
export function CompositionOrb({
  nodes,
  selected,
  onSelect,
  className,
}: {
  nodes: OrbNode[];
  selected: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    nodes,
    selected,
    onSelect,
    tx: 0,
    ty: 0,
    ax: 0.35,
    ay: 0,
    hover: null as string | null,
    images: new Map<string, HTMLImageElement>(),
  });
  state.current.nodes = nodes;
  state.current.selected = selected;
  state.current.onSelect = onSelect;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;
    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    let projected: { id: string; x: number; y: number; r: number }[] = [];
    const css = getComputedStyle(document.documentElement);
    const rgb = (v: string) => css.getPropertyValue(v).trim().split(/\s+/).join(",");
    const fg = rgb("--fg");
    const leaf = rgb("--leaf");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      const n = s.nodes;
      const pts = lattice(n.length);
      if (!reduce) {
        s.ay = t * 0.00012 + s.tx * 0.5;
        s.ax += ((0.35 + s.ty * 0.35) - s.ax) * 0.06;
      }
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.37;
      const cosY = Math.cos(s.ay), sinY = Math.sin(s.ay), cosX = Math.cos(s.ax), sinX = Math.sin(s.ax);
      const maxW = Math.max(...n.map((d) => d.weight ?? 1));
      const items = n.map((d, i) => {
        const p = pts[i];
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const persp = 1 / (1.9 - z2 * 0.55);
        return { d, x: cx + x1 * R * persp * 1.3, y: cy + y2 * R * persp * 1.3, z: z2, persp };
      });

      ctx.clearRect(0, 0, w, h);
      // Orbit rings.
      ctx.lineWidth = 1;
      for (const k of [1, 0.62]) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * 1.12 * k, R * 1.12 * k * Math.abs(Math.sin(s.ax)) + 6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${fg},0.06)`;
        ctx.stroke();
      }
      // Spokes behind the core first, then core, then front spokes.
      const spoke = (it: (typeof items)[number]) => {
        const sel = it.d.id === s.selected || it.d.id === s.hover;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(it.x, it.y);
        ctx.strokeStyle = sel ? `rgba(${leaf},0.55)` : `rgba(${fg},${0.05 + (it.z + 1) * 0.05})`;
        ctx.lineWidth = sel ? 1.4 : 1;
        ctx.stroke();
      };
      const sorted = [...items].sort((a, b) => a.z - b.z);
      sorted.filter((i) => i.z < 0).forEach(spoke);
      // Core: the index itself.
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.42);
      g.addColorStop(0, `rgba(${leaf},0.5)`);
      g.addColorStop(1, `rgba(${leaf},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${leaf},0.9)`;
      ctx.fill();
      sorted.filter((i) => i.z >= 0).forEach(spoke);

      projected = [];
      for (const it of sorted) {
        const sel = it.d.id === s.selected;
        const hov = it.d.id === s.hover;
        const base = (n.length > 6 ? 8 : 11) + 14 * Math.sqrt((it.d.weight ?? 1) / maxW);
        const r = base * it.persp * 1.25 * (sel ? 1.18 : 1);
        const alpha = 0.45 + (it.z + 1) * 0.275;
        if (sel || hov) {
          ctx.beginPath();
          ctx.arc(it.x, it.y, r + 7, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${leaf},${sel ? 0.7 : 0.35})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        const img = it.d.logo ? s.images.get(it.d.logo) : undefined;
        ctx.globalAlpha = alpha;
        if (img?.complete && img.naturalWidth) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(it.x, it.y, r, 0, Math.PI * 2);
          ctx.clip();
          ctx.fillStyle = "#fff";
          ctx.fillRect(it.x - r, it.y - r, r * 2, r * 2);
          ctx.drawImage(img, it.x - r, it.y - r, r * 2, r * 2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(it.x, it.y, r, 0, Math.PI * 2);
          ctx.fillStyle = it.d.color;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (!img?.complete && r > 11) {
          ctx.fillStyle = `rgba(9,13,11,${Math.min(1, alpha + 0.2)})`;
          ctx.font = `600 ${Math.max(9, Math.min(12, r * 0.55))}px ui-sans-serif, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(it.d.label.slice(0, 5), it.x, it.y + 0.5);
        }
        projected.push({ id: it.d.id, x: it.x, y: it.y, r: r + 4 });
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    let onScreen = false;
    const sync = () => (onScreen && document.visibilityState === "visible" ? start() : stop());
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    const hit = (e: PointerEvent | MouseEvent) => {
      const b = canvas.getBoundingClientRect();
      const x = e.clientX - b.left;
      const y = e.clientY - b.top;
      // Front-most first.
      for (let i = projected.length - 1; i >= 0; i--) {
        const p = projected[i];
        if ((x - p.x) ** 2 + (y - p.y) ** 2 <= p.r ** 2) return p.id;
      }
      return null;
    };
    const move = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      s.tx = ((e.clientX - b.left) / b.width - 0.5) * 0.9;
      s.ty = ((e.clientY - b.top) / b.height - 0.5) * 0.9;
      s.hover = hit(e);
      canvas.style.cursor = s.hover && s.onSelect ? "pointer" : "default";
      if (reduce) draw(0);
    };
    const leave = () => {
      s.tx = 0;
      s.ty = 0;
      s.hover = null;
      if (reduce) draw(0);
    };
    const click = (e: MouseEvent) => {
      const id = hit(e);
      if (id) s.onSelect?.(id);
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("click", click);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("click", click);
    };
  }, []);

  // Load token logos once; each load triggers a still redraw (reduced motion).
  useEffect(() => {
    const map = state.current.images;
    for (const n of nodes) {
      if (!n.logo || map.has(n.logo)) continue;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => canvasRef.current?.dispatchEvent(new PointerEvent("pointerleave"));
      img.src = n.logo;
      map.set(n.logo, img);
    }
  }, [nodes]);

  // Redraw a still frame when selection changes under reduced motion.
  useEffect(() => {
    const c = canvasRef.current;
    if (c && window.matchMedia("(prefers-reduced-motion: reduce)").matches) c.dispatchEvent(new PointerEvent("pointerleave"));
  }, [selected, nodes]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}

/**
 * Isometric geometry for the protocol scenes (components/iso). The same 2:1
 * projection as the explorer's LayerStack: x runs right and down, y runs left
 * and down, z runs up. One scene unit is one SVG unit; a scene scales as a
 * whole, so every part, label and motion path stays in register.
 */
export type V3 = readonly [x: number, y: number, z: number];
export type Pt = [number, number];

export const project = ([x, y, z]: V3): Pt => [x - y, (x + y) / 2 - z];

/** An axis-aligned box: its near-bottom corner and its size along x, y, z. */
export type Box = { x: number; y: number; z: number; w: number; d: number; h: number };

/** The three faces a viewer sees, as screen points: the top, and the two front sides. */
export function faces({ x, y, z, w, d, h }: Box) {
  const P = (a: number, b: number, c: number) => project([a, b, c]);
  return {
    top: [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)],
    right: [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)],
    left: [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)],
  } satisfies Record<string, Pt[]>;
}

export type Rect = { x: number; y: number; w: number; h: number };

/** The screen rectangle around a set of points, with optional padding. */
export function bounds(points: Pt[], pad = 0): Rect {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y };
}

export const boxBounds = (b: Box, pad = 1) => bounds(Object.values(faces(b)).flat(), pad);

/** SVG `points` for a polygon. */
export const pts = (ps: Pt[]) => ps.map(([a, b]) => `${+a.toFixed(2)},${+b.toFixed(2)}`).join(" ");

/** A screen offset (scene units) as a CSS translate in % of a part's own box, so it needs no container units. */
export const offset = ([sx, sy]: Pt, r: Rect) => [`${+((sx / r.w) * 100).toFixed(2)}%`, `${+((sy / r.h) * 100).toFixed(2)}%`] as const;

/** The screen offset of a move in scene space (dx, dy, dz). */
export const shift = (dx: number, dy: number, dz: number): Pt => {
  const [a, b] = project([dx, dy, dz]);
  return [a, b];
};

/** A rounded rectangle in the plane z, as projected points (corner arcs sampled). */
export function roundRect(x: number, y: number, w: number, d: number, r: number, z: number, seg = 6): Pt[] {
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -90],
    [x + w - r, y + d - r, 0],
    [x + r, y + d - r, 90],
    [x + r, y + r, 180],
  ];
  const out: Pt[] = [];
  for (const [cx, cy, a0] of corners)
    for (let i = 0; i <= seg; i++) {
      const a = ((a0 + (90 * i) / seg) * Math.PI) / 180;
      out.push(project([cx + r * Math.cos(a), cy + r * Math.sin(a), z]));
    }
  return out;
}

/** The convex hull of screen points (monotone chain), for an extruded outline. */
export function hull(points: Pt[]): Pt[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper: Pt[] = [];
  for (const q of p.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** A circle of radius r lying in the plane z projects to an axis-aligned ellipse. */
export const isoCircle = (cx: number, cy: number, z: number, r: number) => {
  const [x, y] = project([cx, cy, z]);
  return { cx: x, cy: y, rx: r * Math.SQRT2, ry: (r * Math.SQRT2) / 2 };
};

/**
 * SVG transforms that lay a flat 2D drawing onto a face, so text and marks
 * read as engraved on it. Local u runs along the face, v runs down it.
 *  top: the plane z = const, from corner o, u along +x, v along +y.
 *  left: the face y = const (front left), u along +x, v down.
 *  right: the face x = const (front right), u along -y, v down.
 */
export const onFace = {
  top: ([x, y]: Pt) => `matrix(1 0.5 -1 0.5 ${+x.toFixed(2)} ${+y.toFixed(2)})`,
  left: ([x, y]: Pt) => `matrix(1 0.5 0 1 ${+x.toFixed(2)} ${+y.toFixed(2)})`,
  right: ([x, y]: Pt) => `matrix(1 -0.5 0 1 ${+x.toFixed(2)} ${+y.toFixed(2)})`,
};

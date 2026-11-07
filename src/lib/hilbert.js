export const HILBERT_ORDER = 4;
export const HILBERT_GRID = 1 << HILBERT_ORDER;
export const HILBERT_CELLS = HILBERT_GRID * HILBERT_GRID;
export const HILBERT_SEGMENTS = HILBERT_CELLS - 1;

function rot(s, x, y, rx, ry) {
  if (ry !== 0) return { x, y };
  if (rx === 1) {
    return { x: s - 1 - y, y: s - 1 - x };
  }
  return { x: y, y: x };
}

export function hilbertCell(order, index) {
  const n = 1 << order;
  let x = 0;
  let y = 0;
  let t = index;
  for (let s = 1; s < n; s *= 2) {
    const rx = Math.floor(t / 2) & 1;
    const ry = (t ^ rx) & 1;
    const rotated = rot(s, x, y, rx, ry);
    x = rotated.x + s * rx;
    y = rotated.y + s * ry;
    t = Math.floor(t / 4);
  }
  return { x, y };
}

let cellCache = null;

export function hilbertCells() {
  if (!cellCache) {
    cellCache = new Array(HILBERT_CELLS);
    for (let d = 0; d < HILBERT_CELLS; d++) cellCache[d] = hilbertCell(HILBERT_ORDER, d);
  }
  return cellCache;
}

export function hilbertPointAt(t) {
  const cells = hilbertCells();
  const u = ((t % HILBERT_SEGMENTS) + HILBERT_SEGMENTS) % HILBERT_SEGMENTS;
  const i = Math.min(Math.floor(u), HILBERT_SEGMENTS - 1);
  const f = u - i;
  const a = cells[i];
  const b = cells[i + 1];
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    segment: i,
  };
}

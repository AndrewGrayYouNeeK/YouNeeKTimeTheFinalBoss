export const GREEN = '#7d5fff';
export const RED = '#7d5fff';
export const RED_BRIGHT = '#c026ff';
export const YELLOW = '#9ae8ff';
export const WHITE = '#e8f4ff';
export const ARMY = '#7d5fff';
export const ARMY_CYAN = '#3ecbff';
export const RING_GRAY = '#2a2040';

export const PURPLE = '#d24dff';
export const BLUE = '#3ecbff';
export const LAVA = '#7d5fff';
export const LAVA_DEEP = '#c026ff';
export const GOLD = '#b8e8ff';

export function mixHex(a, b, t = 0.5) {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = n(a);
  const [r2, g2, b2] = n(b);
  const hex = (v) => Math.round(v).toString(16).padStart(2, '0');
  return `#${hex(r1 + (r2 - r1) * t)}${hex(g1 + (g2 - g1) * t)}${hex(b1 + (b2 - b1) * t)}`;
}

export function fadePurpleBlue(t) {
  return mixHex(PURPLE, BLUE, Math.min(1, Math.max(0, t)));
}

export function fadePurpleBlueMirror(frac) {
  const f = ((frac % 1) + 1) % 1;
  return fadePurpleBlue(1 - Math.abs(1 - 2 * f));
}

export function fadeLavaMirror(frac) {
  const f = ((frac % 1) + 1) % 1;
  return mixHex(PURPLE, BLUE, 1 - Math.abs(1 - 2 * f));
}

export const HAND_RED = '#d24dff';
export const HAND_WHITE = '#d6eeff';
export const HAND_BLUE = BLUE;
export const HAND_PURPLE = PURPLE;

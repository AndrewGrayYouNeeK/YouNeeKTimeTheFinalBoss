export const GREEN = '#39ff14';
export const RED = '#d4553a';
export const RED_BRIGHT = '#ff4d2e';
export const YELLOW = '#ffff00';
export const WHITE = '#f4f4f4';
export const ARMY = '#2dd900';
export const ARMY_CYAN = '#22d3ee';
export const RING_GRAY = '#4a4a4a';

export function mixHex(a, b) {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = n(a);
  const [r2, g2, b2] = n(b);
  const hex = (v) => Math.round(v).toString(16).padStart(2, '0');
  return `#${hex((r1 + r2) / 2)}${hex((g1 + g2) / 2)}${hex((b1 + b2) / 2)}`;
}

export const HAND_RED = '#ff2a2a';
export const HAND_BLUE = '#2a6dff';
export const HAND_PURPLE = mixHex(HAND_RED, HAND_BLUE);

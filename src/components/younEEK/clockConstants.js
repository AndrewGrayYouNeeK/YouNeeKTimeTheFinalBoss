export const GREEN = '#39ff14';
export const RED = '#d4553a';
export const RED_BRIGHT = '#ff4d2e';
export const YELLOW = '#ffe600';
export const WHITE = '#f4f4f4';
export const ARMY = '#2dd900';
export const ARMY_CYAN = '#22d3ee';
export const RING_GRAY = '#4a4a4a';

export const PURPLE = '#c026ff';
export const BLUE = '#7CFF6B';
export const LAVA = '#ff6a00';
export const LAVA_DEEP = '#ff3b00';
export const GOLD = '#ffd700';

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

// Seamless around-the-dial fade: purple at top (frac 0), blue at bottom (frac 0.5), back to purple.
export function fadePurpleBlueMirror(frac) {
  const f = ((frac % 1) + 1) % 1;
  return fadePurpleBlue(1 - Math.abs(1 - 2 * f));
}

// Lava fade: red at top, through orange, yellow at bottom, back to red — seamless.
export function fadeLavaMirror(frac) {
  const f = ((frac % 1) + 1) % 1;
  return mixHex('#ff2200', '#ffd700', 1 - Math.abs(1 - 2 * f));
}

export const HAND_RED = '#ff2a2a';
export const HAND_WHITE = '#e8ecf4';
export const HAND_BLUE = BLUE;
export const HAND_PURPLE = PURPLE;

// Charcoal / felt-green / ivory palette for the Hilbert and log-spiral render
// modes. These intentionally replace the neon palette inside those modes only.
export const CHARCOAL = '#1d211e';
export const FELT_GREEN = '#2e6b4f';
export const IVORY = '#f3eedd';

// Diary inks stay inside the mode palette family (felt green -> ivory ramp) so
// tag colors never reintroduce the neon palette.
export const DIARY_INKS = ['#3f8a66', '#5fa87e', '#9ec4a8', '#f3eedd'];

// Reflect / Move face only. Classic dial keeps the neon tokens above.
export const VOID = '#0c0d0e';
export const FELT_PATH = '#1a5c3a';
export const FELT_PATH_BRIGHT = '#2f7a52';
export const PATH_IVORY = '#f4f0e6';
export const PALE_CYAN = '#d7efe9';
export const COOL_MIST = '#8d9a93';
export const PATH_AMBER = '#c4893a';
export const PATH_RED = '#8f3d3a';

export function hexAlpha(hex, alpha = 1) {
  const n = (h) => [h.length - 6, h.length - 4, h.length - 2].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r, g, b] = n(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

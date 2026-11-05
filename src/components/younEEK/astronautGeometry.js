// Shared geometry for the astronaut-in-the-middle dial. All values are in the
// 400x400 dial viewBox; the dial centre is (200, 200).
export const CX = 200;
export const CY = 200;

// Torso (public/astro-torso.webp is 400x556)
export const TORSO_W = 98;
export const TORSO_H = TORSO_W * (556 / 400);
export const TORSO_X = CX - TORSO_W / 2;
export const TORSO_Y = 90;

// Legs (public/astro-leg.webp is 118x530: the shin was shortened so it stays proportionate)
export const LEG_H = 107;
// Wider than the raw aspect ratio so the legs have the same bulk as the torso (stretched with preserveAspectRatio=none).
export const LEG_W = 33;
export const LEG_DX = 19;

// Shoulder pivot points: the arms (clock hands) rotate around these, not around the dial centre.
export const SHOULDER_DX = 33;
export const SHOULDER_Y = TORSO_Y + TORSO_H * 0.47;
export const L_SHOULDER = { x: CX - SHOULDER_DX, y: SHOULDER_Y };
export const R_SHOULDER = { x: CX + SHOULDER_DX, y: SHOULDER_Y };

// Arm image (public/astro-arm.webp is 126x760); pivot is the bottom-centre of the image.
export const ARM_RATIO = 126 / 760;
export const HOUR_ARM_LEN = 98;
export const MINUTE_ARM_LEN = 132;

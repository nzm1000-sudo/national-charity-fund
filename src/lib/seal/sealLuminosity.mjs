// The seal's luminosity — how much colour and life the seal carries for a
// lifetime count. Ported from the "כזוהר הרקיע" app (services/sealLuminosity.mjs).
import { RANKS } from "./spiritualCircle.mjs";
import { layerGrowth } from "./sealGeometry.mjs";

export const SEAL_HUES = Object.freeze([
  Object.freeze({ name: "violet", rank: 3 }),
  Object.freeze({ name: "sky", rank: 5 }),
  Object.freeze({ name: "rose", rank: 8 }),
  Object.freeze({ name: "green", rank: 11 }),
]);

export const SEAL_EFFECTS = Object.freeze([
  "breath",
  "sheen",
  "iris",
  "glints",
  "deep",
  "infinite",
]);

const effectFor = (reached) =>
  reached >= 15 ? 5 : reached >= 12 ? 4 : reached >= 9 ? 3 : reached >= 6 ? 2 : reached >= 3 ? 1 : 0;

export function sealLuminosity(count) {
  const growth = layerGrowth(count);
  const reached = growth.filter((t) => t >= 1).length;
  const intensity =
    Math.round((growth.reduce((sum, t) => sum + t, 0) / RANKS.length) * 1000) / 1000;
  const weights = { gold: 1 };
  for (const hue of SEAL_HUES) weights[hue.name] = growth[hue.rank];
  const hues = 1 + SEAL_HUES.filter((hue) => weights[hue.name] >= 1).length;
  return { intensity, hues, weights, effect: effectFor(reached), reached };
}

"use client";

import { useId } from "react";
import { SEAL_VIEWBOX, sealPrimitives } from "@/lib/seal/sealGeometry.mjs";
import { sealLuminosity } from "@/lib/seal/sealLuminosity.mjs";

/**
 * The seal of the spiritual circle — the app's CircleSeal, ported so the site
 * and the app share one mark. Decorative only: the words beside it carry the
 * meaning, so it is aria-hidden. `alive` gives it motion (transform/opacity
 * only), which stops under prefers-reduced-motion and in discreet mode.
 */
interface SealItem {
  kind: string;
  key: string;
  o?: number;
  w?: number;
  r?: number;
  cx?: number;
  cy?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  d?: string;
  dash?: number | null;
  join?: string;
  drift?: boolean;
  fill?: number;
}

const HAZE: Record<string, [number, number, number, number]> = {
  violet: [0.5, 1, 60, 1],
  sky: [0.3, 0.8, 46, 0.55],
  rose: [0, 0.6, 24, 0.75],
  green: [0.84, 0.98, 50, 0.7],
};
const IRIS = ["violet", "sky", "rose", "green"];

export function CircleSeal({
  count = 0,
  size = 320,
  className = "",
  alive = false,
}: {
  count?: number;
  size?: number;
  className?: string;
  alive?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const px = Math.max(16, Number(size) || 32);
  const small = px < 60;
  const thicken = Math.min(2.4, Math.max(1, 96 / px));
  const items = sealPrimitives(count) as SealItem[];
  const lum = sealLuminosity(count);
  const { intensity, effect } = lum;
  const weights = lum.weights as Record<string, number>;
  const c = SEAL_VIEWBOX / 2;
  const sw = (w: number) => Math.round(w * thicken * 100) / 100;

  const stroke = (item: SealItem, paint = "currentColor", widen = 1) => ({
    fill: item.fill ? paint : "none",
    fillOpacity: item.fill || undefined,
    stroke: paint,
    strokeWidth: sw((item.w ?? 1) * widen),
    strokeOpacity: item.o,
    strokeLinecap: "round" as const,
    strokeLinejoin: (item.join ?? "round") as "round" | "miter",
  });

  const draw = (item: SealItem, paint?: string, widen?: number) => {
    switch (item.kind) {
      case "glow":
        return (
          <circle
            key={item.key}
            className="circle-seal-glow"
            cx={c}
            cy={c}
            r={item.r}
            fill={`url(#seal-glow-${id})`}
            opacity={item.o}
          />
        );
      case "core":
        return (
          <circle
            key={item.key}
            className="circle-seal-core"
            cx={c}
            cy={c}
            r={item.r}
            fill="currentColor"
          />
        );
      case "dot":
        return (
          <circle
            key={item.key}
            cx={item.cx}
            cy={item.cy}
            r={item.r}
            fill={paint || "currentColor"}
            fillOpacity={item.o}
          />
        );
      case "circle":
        return (
          <circle
            key={item.key}
            cx={item.cx ?? c}
            cy={item.cy ?? c}
            r={item.r}
            {...stroke(item, paint, widen)}
          />
        );
      case "line":
        return (
          <line
            key={item.key}
            x1={item.x1}
            y1={item.y1}
            x2={item.x2}
            y2={item.y2}
            {...stroke(item, paint, widen)}
          />
        );
      case "path":
        return (
          <path
            key={item.key}
            d={item.d}
            pathLength={item.dash ? 1 : undefined}
            strokeDasharray={item.dash ? `${item.dash} 1` : undefined}
            {...stroke(item, paint, widen)}
          />
        );
      default:
        return null;
    }
  };

  const drift = items.filter((item) => item.drift);
  const core = items.filter((item) => item.kind === "core");
  const glows = items.filter((item) => item.kind === "glow");
  const rest = items.filter(
    (item) => !item.drift && item.kind !== "core" && item.kind !== "glow",
  );
  const hues = IRIS.filter((name) => weights[name] > 0.02);

  const travel = (r: number, paint: string, scale = 1) =>
    [
      [34, 0.16],
      [20, 0.22],
      [8, 0.3],
    ].map(([span, o]) => {
      const t = (span / 2) * (Math.PI / 180);
      const x1 = c - r * Math.sin(t);
      const x2 = c + r * Math.sin(t);
      const y = c - r * Math.cos(t);
      return (
        <path
          key={span}
          d={`M ${x1.toFixed(2)} ${y.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y.toFixed(2)}`}
          fill="none"
          style={{ stroke: paint }}
          strokeWidth={sw(1.6 * scale)}
          strokeOpacity={Math.min(0.9, o * (1 + intensity))}
          strokeLinecap="round"
        />
      );
    });

  const lights =
    alive && effect >= 1
      ? [
          { r: 44, paint: effect >= 3 ? "var(--seal-sky)" : "currentColor", n: 1, scale: 1 },
          ...(effect >= 3 && !small
            ? [{ r: 28, paint: "var(--seal-violet)", n: 2, scale: 0.8 }]
            : []),
          ...(effect >= 4 && !small
            ? [{ r: 34, paint: "var(--seal-green)", n: 3, scale: 0.7 }]
            : []),
          ...(effect >= 5 && !small
            ? [{ r: 54, paint: "var(--seal-rose)", n: 4, scale: 0.7 }]
            : []),
        ]
      : [];

  const glintAt: Array<[number, number]> = [
    [0, 23.5],
    [120, 23.5],
    [240, 23.5],
    [30, 39.6],
    [150, 39.6],
    [270, 39.6],
    [60, 23.5],
    [180, 23.5],
    [300, 23.5],
  ];
  const glints =
    alive && effect >= 3 && !small
      ? glintAt
          .slice(0, effect >= 5 ? 9 : effect >= 4 ? 6 : 3)
          .map(([deg, r], i) => {
            const t = (deg * Math.PI) / 180;
            return (
              <circle
                key={i}
                className="circle-seal-glint"
                style={{ animationDelay: `${-((i * 2.3) % 7).toFixed(1)}s` }}
                cx={(c + r * Math.sin(t)).toFixed(2)}
                cy={(c - r * Math.cos(t)).toFixed(2)}
                r={3.4}
                fill={`url(#seal-glint-${id})`}
              />
            );
          })
      : [];

  const irisOpacity =
    Math.round(Math.min(0.96, 0.28 + 0.62 * intensity) * 100) / 100;
  const irisStops: Array<[string, number]> = [["var(--seal-gold-hi)", 0.55]];
  hues.forEach((name) => {
    irisStops.push([`var(--seal-${name})`, weights[name]]);
    irisStops.push(["var(--seal-gold-hi)", 0.4]);
  });
  if (hues.length === 0)
    irisStops.push(["var(--seal-gold-hi)", 0.08], ["var(--seal-gold-hi)", 0.6]);
  const lit = count > 0;

  return (
    <svg
      className={`circle-seal${alive ? " is-alive" : ""} ${className}`.trim()}
      data-fx={effect}
      data-hues={lum.hues}
      data-small={small ? "" : undefined}
      width={px}
      height={px}
      viewBox={`0 0 ${SEAL_VIEWBOX} ${SEAL_VIEWBOX}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`seal-glow-${id}`}>
          <stop offset="0" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        {hues.map((name) => {
          const [a, b] = HAZE[name];
          return (
            <radialGradient key={name} id={`seal-haze-${name}-${id}`}>
              <stop offset={a} style={{ stopColor: `var(--seal-${name})` }} stopOpacity="0" />
              <stop
                offset={(a + b) / 2}
                style={{ stopColor: `var(--seal-${name})` }}
                stopOpacity="0.55"
              />
              <stop offset={b} style={{ stopColor: `var(--seal-${name})` }} stopOpacity="0" />
            </radialGradient>
          );
        })}
        <radialGradient id={`seal-glint-${id}`}>
          <stop offset="0" style={{ stopColor: "var(--seal-spark)" }} stopOpacity="1" />
          <stop offset="0.3" style={{ stopColor: "var(--seal-gold-hi)" }} stopOpacity="0.55" />
          <stop offset="1" style={{ stopColor: "var(--seal-gold-hi)" }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`seal-core-${id}`}>
          <stop offset="0" style={{ stopColor: "var(--seal-spark)" }} stopOpacity="0.95" />
          <stop offset="0.35" style={{ stopColor: "var(--seal-gold-hi)" }} stopOpacity="0.5" />
          <stop offset="1" style={{ stopColor: "var(--seal-gold-hi)" }} stopOpacity="0" />
        </radialGradient>
        {lit && (
          <linearGradient
            id={`seal-iris-${id}`}
            gradientUnits="userSpaceOnUse"
            x1="64"
            y1="6"
            x2="64"
            y2="122"
          >
            {irisStops.map(([color, o], i) => (
              <stop
                key={i}
                offset={Math.round((i / (irisStops.length - 1)) * 1000) / 1000}
                style={{ stopColor: color }}
                stopOpacity={Math.round(o * 1000) / 1000}
              />
            ))}
          </linearGradient>
        )}
        {lit && (
          <mask
            id={`seal-mask-${id}`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={SEAL_VIEWBOX}
            height={SEAL_VIEWBOX}
          >
            {rest.map((item) => draw(item, "#fff", small ? 1.1 : 1.25))}
          </mask>
        )}
      </defs>
      {hues.length > 0 && (
        <g className="circle-seal-auraplane">
          <g className="circle-seal-aura">
            {hues.map((name, i) => (
              <circle
                key={name}
                className={`circle-seal-haze circle-seal-haze-${i + 1}`}
                cx={c}
                cy={c}
                r={HAZE[name][2] + 3 * intensity}
                fill={`url(#seal-haze-${name}-${id})`}
                opacity={
                  Math.round(
                    weights[name] *
                      HAZE[name][3] *
                      (small ? 0.2 : 0.18 + 0.42 * intensity) *
                      100,
                  ) / 100
                }
              />
            ))}
          </g>
        </g>
      )}
      <g className="circle-seal-breath">{glows.map((item) => draw(item))}</g>
      {rest.map((item) => draw(item))}
      {drift.length > 0 && (
        <g className="circle-seal-drift">{drift.map((item) => draw(item))}</g>
      )}
      {lit && (
        <g className="circle-seal-irisplane">
          <g mask={`url(#seal-mask-${id})`} opacity={irisOpacity}>
            <g className="circle-seal-iris">
              <circle cx={c} cy={c} r={c} fill={`url(#seal-iris-${id})`} />
            </g>
          </g>
        </g>
      )}
      {lights.map(({ r, paint, n, scale }) => (
        <g key={n} className={`circle-seal-sheen circle-seal-sheen-${n}`}>
          {travel(r, paint, scale)}
        </g>
      ))}
      {glints.length > 0 && <g className="circle-seal-glints">{glints}</g>}
      {lit && (
        <circle
          className="circle-seal-corelight"
          cx={c}
          cy={c}
          r={Math.round((5 + 13 * intensity) * 100) / 100}
          fill={`url(#seal-core-${id})`}
          opacity={Math.round((0.35 + 0.65 * intensity) * 100) / 100}
        />
      )}
      {core.map((item) => draw(item))}
    </svg>
  );
}

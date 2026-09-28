import React from 'react';

const FUND_COLORS = ["#059669", "#0d9488", "#2563eb", "#ca8a04", "#64748b"];

export function GaugeChart({ score, max = 10 }) {
  const pct = Math.max(0, Math.min(1, score / max));
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = c * 0.75;
  const filled = dash * pct;
  const color = score >= 7 ? "#059669" : score >= 5 ? "#d97706" : "#dc2626";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 88" className="w-full max-w-[160px]">
        <g transform="translate(60,58)">
          <circle r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" strokeDasharray={`${dash} ${c}`} strokeDashoffset={dash * 0.125} strokeLinecap="round" transform="rotate(-135)" />
          <circle r={r} fill="none" stroke={color} strokeWidth="10" strokeDasharray={`${filled} ${c}`} strokeDashoffset={dash * 0.125} strokeLinecap="round" transform="rotate(-135)" />
          <text textAnchor="middle" y="-2" className="fill-gray-900" style={{ fontSize: 22, fontWeight: 800 }}>{score}</text>
          <text textAnchor="middle" y="14" className="fill-gray-400" style={{ fontSize: 9, fontWeight: 700 }}>VIABILITY / {max}</text>
        </g>
      </svg>
    </div>
  );
}

export function ScoreBars({ items }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-[10px] font-bold mb-0.5">
            <span className="text-gray-600">{item.label}</span>
            <span className="text-gray-900">{item.score}/10</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-teal-600" style={{ width: `${item.score * 10}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompetitorBars({ competitors, radiusKm }) {
  if (!competitors?.length) return null;
  const max = Math.max(radiusKm || 1, ...competitors.map((c) => c.distance_km));
  const w = 320;
  const rowH = 28;
  const h = competitors.length * rowH + 8;
  const left = 108;
  const barW = w - left - 36;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {competitors.map((c, i) => {
        const y = 6 + i * rowH;
        const bw = (c.distance_km / max) * barW;
        return (
          <g key={c.name}>
            <text x="0" y={y + 12} className="fill-gray-600" style={{ fontSize: 9, fontWeight: 700 }}>
              {c.name.length > 16 ? `${c.name.slice(0, 15)}…` : c.name}
            </text>
            <rect x={left} y={y} width={barW} height="16" rx="4" className="fill-red-50" />
            <rect x={left} y={y} width={Math.max(bw, 8)} height="16" rx="4" className="fill-red-500" />
            <text x={left + Math.max(bw, 8) + 4} y={y + 12} className="fill-gray-800" style={{ fontSize: 9, fontWeight: 800 }}>
              {c.distance_km} km
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({ slices, centerLabel }) {
  if (!slices?.length) return null;
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = 48;
  const cy = 48;
  const r = 32;
  const ir = 20;
  let acc = 0;

  const arc = (start, end) => {
    const toXY = (ang, rad) => {
      const a = (ang - 90) * (Math.PI / 180);
      return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    };
    const large = end - start > 180 ? 1 : 0;
    const [x1, y1] = toXY(start, r);
    const [x2, y2] = toXY(end, r);
    const [x3, y3] = toXY(end, ir);
    const [x4, y4] = toXY(start, ir);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${large} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 96 96" className="w-24 h-24 flex-shrink-0">
        {slices.map((s, i) => {
          const start = (acc / total) * 360;
          acc += s.value;
          const end = (acc / total) * 360;
          return <path key={s.label} d={arc(start, Math.max(end, start + 0.8))} fill={FUND_COLORS[i % FUND_COLORS.length]} />;
        })}
        <text x="48" y="46" textAnchor="middle" className="fill-gray-900" style={{ fontSize: 11, fontWeight: 800 }}>{centerLabel}</text>
        <text x="48" y="58" textAnchor="middle" className="fill-gray-400" style={{ fontSize: 8, fontWeight: 700 }}>FUNDS</text>
      </svg>
      <div className="flex-1 space-y-1.5 min-w-0">
        {slices.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: FUND_COLORS[i % FUND_COLORS.length] }} />
            <span className="text-[10px] font-semibold text-gray-600 truncate flex-1">{s.label}</span>
            <span className="text-[10px] font-extrabold text-gray-900">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ series, formatY }) {
  if (!series?.length) return null;
  const w = 320;
  const h = 140;
  const pad = { l: 36, r: 8, t: 12, b: 24 };
  const keys = Object.keys(series[0]).filter((k) => k !== "label");
  const colors = { sales: "#0d9488", surplus: "#2563eb", emi: "#dc2626" };
  const all = series.flatMap((row) => keys.map((k) => row[k]));
  const min = Math.min(0, ...all);
  const max = Math.max(...all, 1);
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const x = (i) => pad.l + (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
  const y = (v) => pad.t + ((max - v) / (max - min || 1)) * innerH;
  const path = (key) => series.map((row, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(row[key])}`).join(" ");
  const y0 = y(0);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line x1={pad.l} y1={y0} x2={w - pad.r} y2={y0} stroke="#e5e7eb" strokeWidth="1" />
      {series.map((row, i) => (
        <text key={row.label} x={x(i)} y={h - 6} textAnchor="middle" className="fill-gray-400" style={{ fontSize: 9, fontWeight: 700 }}>{row.label}</text>
      ))}
      <text x="2" y={pad.t + 8} className="fill-gray-400" style={{ fontSize: 8 }}>{formatY ? formatY(max) : max}</text>
      {keys.map((key) => (
        <g key={key}>
          <path d={path(key)} fill="none" stroke={colors[key] || "#059669"} strokeWidth="2.2" strokeLinejoin="round" />
          {series.map((row, i) => (
            <circle key={`${key}-${i}`} cx={x(i)} cy={y(row[key])} r="3" fill={colors[key] || "#059669"} />
          ))}
        </g>
      ))}
    </svg>
  );
}

function inrShort(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}k`;
  return `₹${Math.round(n)}`;
}

export function GroupedBars({ series }) {
  if (!series?.length) return null;
  const w = 320;
  const h = 168;
  const pad = { l: 28, r: 10, t: 22, b: 28 };
  const max = Math.max(...series.flatMap((s) => [s.nsfdc, s.bank]), 1);
  const groupW = (w - pad.l - pad.r) / series.length;
  const barW = Math.min(22, groupW * 0.28);
  const innerH = h - pad.t - pad.b;
  const base = pad.t + innerH;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible">
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad.l} x2={w - pad.r} y1={base - innerH * t} y2={base - innerH * t} stroke="#f1f5f9" strokeWidth="1" />
      ))}
      <line x1={pad.l} x2={w - pad.r} y1={base} y2={base} stroke="#94a3b8" strokeWidth="1.5" />
      <text x="2" y={pad.t + 4} className="fill-gray-400" style={{ fontSize: 8 }}>{inrShort(max)}</text>
      {series.map((row, i) => {
        const gx = pad.l + i * groupW + groupW / 2;
        const h1 = (row.nsfdc / max) * innerH;
        const h2 = (row.bank / max) * innerH;
        const y1 = base - h1;
        const y2 = base - h2;
        return (
          <g key={row.label}>
            <rect x={gx - barW - 3} y={y1} width={barW} height={h1} rx="3" fill="#059669" />
            <rect x={gx + 3} y={y2} width={barW} height={h2} rx="3" fill="#94a3b8" />
            <text x={gx - barW / 2 - 3} y={y1 - 4} textAnchor="middle" className="fill-emerald-800" style={{ fontSize: 7, fontWeight: 800 }}>{inrShort(row.nsfdc)}</text>
            <text x={gx + barW / 2 + 3} y={y2 - 4} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 7, fontWeight: 800 }}>{inrShort(row.bank)}</text>
            <text x={gx} y={h - 8} textAnchor="middle" className="fill-gray-600" style={{ fontSize: 10, fontWeight: 800 }}>{row.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

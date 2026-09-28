import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, AlertTriangle, Sparkles, AlertCircle, MapPin, Users, Store } from 'lucide-react';
import { GaugeChart, ScoreBars, CompetitorBars } from './ReportCharts';

const DOT_SLOTS = [
  { top: '20%', left: '30%' }, { top: '15%', left: '60%' }, { top: '35%', left: '80%' },
  { top: '70%', left: '20%' }, { top: '80%', left: '70%' }, { top: '60%', left: '85%' }
];

export default function FeasibilityReport({ nextStep, data }) {
  if (!data) return <div className="p-12 text-center text-gray-500 font-medium">Analyzing...</div>;

  const market = data.market || {};
  const competitors = data.competitors || [];
  const demandSignals = data.demand_signals || [];
  const households = market.households ?? 2400;
  const competitorDots = competitors.length ? competitors : Array.from({ length: data.competitors_count || 0 });

  const swotConfig = [
    { key: "strengths", title: "STRENGTHS", headerColor: "bg-green-500", borderColor: "border-green-500", icon: <TrendingUp className="w-4 h-4 text-green-600" /> },
    { key: "weaknesses", title: "WEAKNESSES", headerColor: "bg-yellow-400", borderColor: "border-yellow-400", icon: <AlertTriangle className="w-4 h-4 text-yellow-600" /> },
    { key: "opportunities", title: "OPPORTUNITIES", headerColor: "bg-blue-500", borderColor: "border-blue-500", icon: <Sparkles className="w-4 h-4 text-blue-600" /> },
    { key: "threats", title: "THREATS", headerColor: "bg-red-500", borderColor: "border-red-500", icon: <AlertCircle className="w-4 h-4 text-red-600" /> }
  ];

  return (
    <div className="flex flex-col bg-white px-4 pt-6 pb-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-7 h-7 text-green-500" />
        <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight">Feasibility Report</h2>
      </div>

      {data.pivot_recommended ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700">Pivot recommended</p>
          <p className="text-[13px] font-bold text-gray-900 mt-0.5">
            Dairy is saturated. Shift to {data.pivot_suggestion}.
          </p>
          <p className="text-[11px] text-gray-600 mt-1">
            Viability {data.viability_score}/10 as dairy vs a clear snack-packing gap (0 packers in {data.radius_km} km).
          </p>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-green-700">Market is viable</p>
          <p className="text-[13px] font-bold text-gray-900 mt-0.5">
            Score {data.viability_score}/10 · {data.competitors_count} direct premium competitor in {data.radius_km} km
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        {swotConfig.map(({ key, title, headerColor, borderColor, icon }) => (
          <div key={key} className={`flex flex-col border-[2px] ${borderColor} rounded-xl overflow-hidden bg-white shadow-sm min-h-[9.5rem]`}>
            <div className={`${headerColor} text-white text-[11px] font-extrabold text-center py-1.5 uppercase tracking-wider flex items-center justify-center gap-1`}>
              {title}
            </div>
            <div className="p-2.5 flex-1">
              <ul className="space-y-1.5">
                {(data.swot[key] || []).map((item, i) => (
                  <li key={i} className="text-[11px] font-semibold text-gray-800 leading-snug pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-2 opacity-80">{icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5">
        <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-widest mb-3">LOCAL MARKET ANALYSIS</h3>

        <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="w-32 h-32 relative bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-2 border border-blue-200 rounded-full"></div>
            <div className="absolute inset-8 border border-blue-200 rounded-full"></div>
            <div className="absolute w-full h-px bg-blue-100"></div>
            <div className="absolute h-full w-px bg-blue-100"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full z-10 shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
            {competitorDots.map((_, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 bg-red-500 rounded-full" style={DOT_SLOTS[i % DOT_SLOTS.length]}></div>
            ))}
            <div className="absolute -top-1 right-2 text-[8px] font-bold text-blue-600 bg-blue-50 px-1 rounded">{data.radius_km} km</div>
          </div>

          <div className="flex-1 flex flex-col justify-between min-h-[8rem] py-0.5">
            <div>
              <div className="text-[20px] font-black text-gray-900 leading-none mb-1">{households.toLocaleString()}</div>
              <div className="text-[11px] font-bold text-gray-500 leading-tight">
                households within {data.radius_km} km
              </div>
              {market.population != null && (
                <div className="text-[10px] text-gray-400 font-semibold mt-1">
                  ~{market.population.toLocaleString()} people · {market.catchment}
                </div>
              )}
            </div>

            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="text-[10px] text-gray-500 font-bold mb-0.5">Market Saturation:</div>
                <div className="flex items-center gap-1">
                  {data.market_saturation === "LOW" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className={`text-sm font-black ${data.market_saturation === "LOW" ? "text-green-600" : "text-amber-600"}`}>
                    {data.market_saturation}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500 font-bold mb-0.5">Viability Score:</div>
                <div className="text-lg font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">
                  {data.viability_score}<span className="text-xs">/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {market.source && (
          <p className="text-[9px] text-gray-400 font-semibold mt-1.5 px-1">Source: {market.source}</p>
        )}
      </div>

      <div className="mb-5 rounded-2xl border border-gray-100 p-4">
        <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-widest mb-2">Viability graph</h3>
        <GaugeChart score={data.viability_score} />
        <ScoreBars items={data.score_breakdown} />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-2.5">
          <Users className="w-3.5 h-3.5 text-gray-500 mb-1" />
          <div className="text-[13px] font-black text-gray-900">{(market.daily_footfall || 0).toLocaleString()}</div>
          <div className="text-[9px] font-bold text-gray-500 leading-tight">daily footfall</div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-2.5">
          <Store className="w-3.5 h-3.5 text-gray-500 mb-1" />
          <div className="text-[13px] font-black text-gray-900">{data.competitors_count}</div>
          <div className="text-[9px] font-bold text-gray-500 leading-tight">direct rivals</div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-2.5">
          <MapPin className="w-3.5 h-3.5 text-gray-500 mb-1" />
          <div className="text-[13px] font-black text-gray-900">
            ₹{Math.round((market.monthly_demand_inr || 0) / 1000)}k
          </div>
          <div className="text-[9px] font-bold text-gray-500 leading-tight">est. monthly demand</div>
        </div>
      </div>

      {demandSignals.length > 0 && (
        <div className="mb-5">
          <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-widest mb-2">Demand signals</h3>
          <div className="space-y-2">
            {demandSignals.map((row) => (
              <div key={row.label} className="flex justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2">
                <span className="text-[11px] font-semibold text-gray-600">{row.label}</span>
                <span className="text-[11px] font-extrabold text-gray-900 text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {competitors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-widest mb-2">Competitors in radius</h3>
          <div className="rounded-xl border border-gray-100 p-2 mb-3">
            <CompetitorBars competitors={competitors} radiusKm={data.radius_km} />
          </div>
          <div className="space-y-2">
            {competitors.map((c) => (
              <div key={c.name} className="rounded-xl border border-gray-100 p-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-[13px] font-extrabold text-gray-900">{c.name}</p>
                    <p className="text-[10px] font-semibold text-gray-500">{c.type} · {c.years} yrs</p>
                  </div>
                  <span className="text-[11px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md">{c.distance_km} km</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1.5">{c.overlap}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={nextStep} className="w-full bg-white hover:bg-gray-50 text-gray-800 py-3 rounded-xl font-bold text-[14px] transition-colors flex justify-center items-center gap-2 border border-gray-200">
        Apply for Financing <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

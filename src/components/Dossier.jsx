import React, { useState } from 'react';
import { CheckCircle2, FileText, ArrowRight, X, Printer, Check } from 'lucide-react';
import { GaugeChart, ScoreBars, CompetitorBars, DonutChart, LineChart, GroupedBars } from './ReportCharts';

function inr(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function titleCase(s) {
  if (!s) return "";
  return String(s).replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

export default function Dossier({ scenario, selectedPartner, onRestart }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(null);

  const f = scenario.feasibility || {};
  const fin = scenario.financials || {};
  const market = f.market || {};
  const p = fin.projections || {};
  const yearlyNsfdc = (fin.loan_amount || 0) * ((fin.interest_rate || 0) / 100);
  const yearlyBank = (fin.loan_amount || 0) * ((fin.commercial_rate || 0) / 100);

  const PdfViewer = () => (
    <div className="fixed inset-0 z-[100] bg-gray-900/90 flex items-center justify-center p-3 md:p-8 backdrop-blur-sm">
      <div className="bg-gray-100 w-full max-w-4xl h-full max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-gray-800 text-gray-200 px-6 py-3 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3 font-mono text-sm">
            <FileText className="w-5 h-5 text-red-400" />
            {viewingPdf}
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => window.print()} className="hover:text-white flex items-center gap-2 transition-colors">
              <Printer className="w-5 h-5" /> <span className="text-sm font-bold hidden md:inline">Print</span>
            </button>
            <div className="w-px h-5 bg-gray-600"></div>
            <button onClick={() => setViewingPdf(null)} className="hover:text-red-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div className="bg-white w-full max-w-3xl shadow-xl text-black font-sans relative" style={{ minHeight: '1056px' }}>
            <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-700" />
            <div className="px-10 md:px-14 pt-8 pb-12">
              <div className="text-center border-b border-gray-300 pb-5 mb-8">
                <p className="text-[11px] font-bold tracking-[0.25em] text-gray-500">भारत सरकार · GOVERNMENT OF INDIA</p>
                <h1 className="text-xl font-black uppercase tracking-widest mt-2">Ministry of Social Justice &amp; Empowerment</h1>
                <h2 className="text-sm font-bold uppercase mt-1 text-gray-600">NSFDC · Fingo Digital Dossier</h2>
                <p className="text-[11px] text-gray-500 mt-2">Confidential · For official use of the Channelizing Agency</p>
              </div>

              {viewingPdf === 'Feasibility Report.pdf' && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-wide text-center">Business Feasibility Report</h2>
                    <p className="text-center text-xs text-gray-500 mt-1">Generated {new Date().toLocaleDateString("en-IN")} · Catchment scan {f.radius_km} km</p>
                  </div>

                  <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${f.is_viable ? "border-green-300 bg-green-50 text-green-900" : "border-amber-300 bg-amber-50 text-amber-900"}`}>
                    {f.is_viable
                      ? `Finding: VIABLE — score ${f.viability_score}/10, saturation ${f.market_saturation}.`
                      : `Finding: HIGH RISK as proposed — score ${f.viability_score}/10. Recommended pivot: ${f.pivot_suggestion}.`}
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm border border-gray-200 rounded-lg p-4">
                    <div><span className="text-gray-500">Applicant</span><div className="font-bold">{titleCase(scenario.profile.name)}</div></div>
                    <div><span className="text-gray-500">Location</span><div className="font-bold">{titleCase(scenario.input.location)}</div></div>
                    <div><span className="text-gray-500">Proposed business</span><div className="font-bold">{titleCase(scenario.input.business)}</div></div>
                    <div><span className="text-gray-500">Catchment</span><div className="font-bold">{market.catchment || `${f.radius_km} km`}</div></div>
                    <div><span className="text-gray-500">Households</span><div className="font-bold">{(market.households || 0).toLocaleString("en-IN")}</div></div>
                    <div><span className="text-gray-500">Population</span><div className="font-bold">~{(market.population || 0).toLocaleString("en-IN")}</div></div>
                    <div><span className="text-gray-500">Daily footfall</span><div className="font-bold">{(market.daily_footfall || 0).toLocaleString("en-IN")}</div></div>
                    <div><span className="text-gray-500">Est. monthly demand</span><div className="font-bold">{inr(market.monthly_demand_inr)}</div></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 items-start">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Viability</p>
                      <GaugeChart score={f.viability_score} />
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Score breakdown</p>
                      <ScoreBars items={f.score_breakdown} />
                    </div>
                  </div>

                  {f.swot && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">SWOT</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { k: "strengths", t: "Strengths", c: "border-green-400 bg-green-50" },
                          { k: "weaknesses", t: "Weaknesses", c: "border-yellow-400 bg-yellow-50" },
                          { k: "opportunities", t: "Opportunities", c: "border-blue-400 bg-blue-50" },
                          { k: "threats", t: "Threats", c: "border-red-400 bg-red-50" }
                        ].map((box) => (
                          <div key={box.k} className={`border rounded-lg p-3 ${box.c}`}>
                            <p className="text-[11px] font-black uppercase mb-1">{box.t}</p>
                            <ul className="list-disc pl-4 text-xs space-y-1">
                              {(f.swot[box.k] || []).map((item) => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {f.competitors?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Competitors in {f.radius_km} km</p>
                      <div className="border border-gray-200 rounded-lg p-3 mb-3">
                        <CompetitorBars competitors={f.competitors} radiusKm={f.radius_km} />
                      </div>
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Competitor</th>
                            <th className="border border-gray-300 p-2">Type</th>
                            <th className="border border-gray-300 p-2">Distance</th>
                            <th className="border border-gray-300 p-2">Overlap</th>
                          </tr>
                        </thead>
                        <tbody>
                          {f.competitors.map((c) => (
                            <tr key={c.name}>
                              <td className="border border-gray-300 p-2 font-semibold">{c.name}</td>
                              <td className="border border-gray-300 p-2">{c.type}</td>
                              <td className="border border-gray-300 p-2">{c.distance_km} km</td>
                              <td className="border border-gray-300 p-2">{c.overlap}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {f.demand_signals?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Demand signals</p>
                      <table className="w-full text-left border-collapse text-xs">
                        <tbody>
                          {f.demand_signals.map((row) => (
                            <tr key={row.label}>
                              <td className="border border-gray-300 p-2 w-1/2">{row.label}</td>
                              <td className="border border-gray-300 p-2 font-bold">{row.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-500 pt-4 border-t border-gray-200">Source: {market.source || "Census 2011 catchment + OSM POIs"} · Not a sanction letter.</p>
                </div>
              )}

              {viewingPdf === 'Financial Plan.pdf' && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-wide text-center">Financial Sanction Summary</h2>
                    <p className="text-center text-xs text-gray-500 mt-1">{fin.scheme} · {titleCase(scenario.profile.name)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm border border-gray-200 rounded-lg p-4">
                    <div><span className="text-gray-500">Applicant</span><div className="font-bold">{titleCase(scenario.profile.name)}</div></div>
                    <div><span className="text-gray-500">Scheme</span><div className="font-bold">{fin.scheme}</div></div>
                    <div><span className="text-gray-500">Interest</span><div className="font-bold">{fin.interest_rate}% p.a.</div></div>
                    <div><span className="text-gray-500">Tenure / moratorium</span><div className="font-bold">{fin.tenure_years} yrs / {fin.moratorium_months} mo</div></div>
                    <div><span className="text-gray-500">Quarterly EMI</span><div className="font-bold">{inr(fin.quarterly_emi)}</div></div>
                    <div><span className="text-gray-500">DSCR</span><div className="font-bold">{p.dscr}x</div></div>
                  </div>

                  <table className="w-full text-left border-collapse text-sm">
                    <tbody>
                      {[
                        ["1. Total project cost", inr(fin.project_cost), true],
                        ["2. Promoter's margin money", inr(fin.margin_money), false],
                        ["3. NSFDC term loan", inr(fin.loan_amount), true],
                        ["4. Year-1 sales (plan)", inr(p.year1_sales), false],
                        ["5. Year-1 surplus", inr(p.year1_surplus), false],
                        ["6. Break-even", `${p.break_even_months} months`, false]
                      ].map(([label, val, bold]) => (
                        <tr key={label} className={bold ? "bg-gray-50" : ""}>
                          <td className={`border border-gray-300 p-2.5 ${bold ? "font-bold" : ""}`}>{label}</td>
                          <td className={`border border-gray-300 p-2.5 text-right ${bold ? "font-bold" : ""}`}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {fin.use_of_funds?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Use of funds</p>
                      <div className="border border-gray-200 rounded-lg p-3 mb-3">
                        <DonutChart
                          slices={fin.use_of_funds.map((row) => ({ label: row.item, value: row.pct }))}
                          centerLabel="100%"
                        />
                      </div>
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Head</th>
                            <th className="border border-gray-300 p-2">%</th>
                            <th className="border border-gray-300 p-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fin.use_of_funds.map((row) => (
                            <tr key={row.item}>
                              <td className="border border-gray-300 p-2">{row.item}</td>
                              <td className="border border-gray-300 p-2">{row.pct}%</td>
                              <td className="border border-gray-300 p-2 text-right font-semibold">{inr(fin.project_cost * row.pct / 100)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {fin.quarterly_trend?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Year-1 sales vs surplus</p>
                      <div className="flex gap-4 text-[10px] font-bold mb-1">
                        <span className="text-teal-700">● Sales</span>
                        <span className="text-blue-700">● Surplus</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3">
                        <LineChart series={fin.quarterly_trend} formatY={(v) => `₹${Math.round(Math.abs(v) / 1000)}k`} />
                      </div>
                    </div>
                  )}

                  {fin.commercial_rate != null && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Interest vs commercial bank</p>
                      <div className="flex gap-4 text-[10px] font-bold mb-1">
                        <span className="text-emerald-700">■ NSFDC {fin.interest_rate}%</span>
                        <span className="text-slate-500">■ Bank {fin.commercial_rate}%</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3">
                        <GroupedBars
                          series={Array.from({ length: Math.min(fin.tenure_years, 4) }, (_, i) => ({
                            label: `Y${i + 1}`,
                            nsfdc: yearlyNsfdc,
                            bank: yearlyBank
                          }))}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Indicative annual saving vs bank: {inr(yearlyBank - yearlyNsfdc)}.</p>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-500 pt-4 border-t border-gray-200">Preview only. Final sanction is by the selected SCA / bank after due diligence.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center bg-white">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h2 className="text-[22px] font-extrabold text-gray-900 mb-4">Application Submitted Successfully</h2>
        <p className="text-gray-500 text-sm mb-12">Your dossier was securely routed to {selectedPartner?.name}.</p>
        <button onClick={onRestart} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3.5 rounded-xl font-bold text-[15px] transition-colors">
          Start New Application
        </button>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center bg-white">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mb-6"></div>
        <h2 className="text-[20px] font-extrabold text-gray-900">Submitting to {selectedPartner?.name}...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white px-4 pt-12 pb-4">
      {viewingPdf && <PdfViewer />}

      <div className="text-center mb-8">
        <CheckCircle2 className="w-10 h-10 text-blue-500 mx-auto mb-3" />
        <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight">Application Ready</h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-5 mb-6">
        <h3 className="font-bold text-[15px] text-gray-900 mb-4 border-b border-gray-100 pb-2">Loan Application Dossier</h3>
        <ul className="space-y-4">
          {[
            { text: "1. Applicant Profile", check: true },
            { text: "2. Business Feasibility Report", check: true, attached: true },
            { text: "3. Financial Plan", check: true, attached: true },
            { text: `4. Scheme: ${scenario.financials.scheme.replace(/\s*\(.*\)/, '')}`, check: true },
            { text: `5. Partner: ${selectedPartner?.name.replace('SCA ', '')}`, check: true }
          ].map((item, i) => (
            <li key={i} className="flex justify-between items-start text-[13px] font-medium text-gray-800 leading-tight">
              <span>
                {item.text}
                {item.attached && <span className="text-gray-400 font-normal ml-1">(attached)</span>}
              </span>
              {item.check && <Check className="w-4 h-4 text-green-500 flex-shrink-0" />}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 mb-6 px-1">
        <button onClick={() => setViewingPdf('Feasibility Report.pdf')} className="bg-green-50 text-green-700 py-2.5 px-4 rounded-lg text-[13px] font-bold flex items-center gap-2 border border-green-200 self-start">
          <FileText className="w-4 h-4" /> Feasibility Report.pdf
        </button>
        <button onClick={() => setViewingPdf('Financial Plan.pdf')} className="bg-blue-50 text-blue-700 py-2.5 px-4 rounded-lg text-[13px] font-bold flex items-center gap-2 border border-blue-200 self-start">
          <FileText className="w-4 h-4" /> Financial Plan.pdf
        </button>
      </div>

      <div className="mt-auto pt-4 text-center">
        <button
          onClick={() => { setSubmitting(true); setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 2500); }}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm mb-3"
        >
          Submit to SCA <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[10px] text-gray-500 font-bold">
          Application will be digitally submitted to {selectedPartner?.name}
        </p>
      </div>
    </div>
  );
}

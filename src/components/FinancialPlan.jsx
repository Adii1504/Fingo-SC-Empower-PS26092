import React from 'react';
import { ArrowLeft, Share2, ArrowDown, Briefcase, IndianRupee, FileText, ArrowRight } from 'lucide-react';
import { DonutChart, LineChart, GroupedBars } from './ReportCharts';

function inr(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function FinancialPlan({ nextStep, data, capital }) {
  if (!data) return null;

  const projectCost = data.project_cost || 0;
  const loanAmount = data.loan_amount || 0;
  const annualSaving = loanAmount * (((data.commercial_rate || 0) - (data.interest_rate || 0)) / 100);
  const yearlyInterest = loanAmount * ((data.interest_rate || 0) / 100);
  const p = data.projections || {};

  return (
    <div className="flex flex-col bg-white px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => window.history.back()} className="text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-[17px] font-extrabold text-gray-900 tracking-tight">Smart Financial Calculator</h2>
        <button className="text-gray-900">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <h3 className="text-[14px] font-extrabold text-gray-900 mb-4">Calculation Flow</h3>

      <div className="flex flex-col items-center mb-6">
        <div className="bg-blue-100 text-blue-900 w-full p-4 rounded-xl flex items-center gap-3">
          <div className="bg-blue-600 rounded-full p-2"><IndianRupee className="w-5 h-5 text-white" /></div>
          <div className="font-bold text-[15px]">Your Capital: {inr(capital)}</div>
        </div>

        <ArrowDown className="w-6 h-6 text-gray-400 my-2" />

        <div className="bg-blue-50 text-blue-900 w-full p-4 rounded-xl flex items-start gap-3">
          <div className="bg-blue-200 rounded-full p-2 mt-1"><Briefcase className="w-5 h-5 text-blue-700" /></div>
          <div>
            <div className="font-bold text-[15px]">Project Cost: {inr(projectCost)}</div>
            <div className="text-[11px] font-medium text-gray-500 mt-0.5">10× promoter margin (NSFDC 10% own contribution)</div>
          </div>
        </div>

        <ArrowDown className="w-6 h-6 text-gray-400 my-2" />

        <div className="bg-green-50 border border-green-200 text-green-900 w-full p-4 rounded-xl flex items-center gap-3">
          <div className="bg-green-600 rounded-full p-2"><FileText className="w-5 h-5 text-white" /></div>
          <div className="font-bold text-[15px]">
            Loan Amount: {inr(loanAmount)} ({projectCost ? Math.round((loanAmount / projectCost) * 100) : 0}%)
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-4">
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
          <FileText className="w-5 h-5 text-gray-600" />
          <div className="font-extrabold text-[14px] text-gray-900 leading-tight">
            Scheme Auto-Selected: <br/> {data.scheme}
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[
            { label: "Interest rate", value: `${data.interest_rate}% p.a.` },
            { label: "Tenure", value: `${data.tenure_years} years` },
            { label: "Moratorium", value: `${data.moratorium_months} months` },
            { label: "Quarterly EMI", value: inr(data.quarterly_emi) },
            { label: "Annual NSFDC interest", value: inr(yearlyInterest) },
            data.commercial_rate != null && {
              label: `Vs bank at ${data.commercial_rate}%`,
              value: `${inr(annualSaving)} saved / yr`
            }
          ].filter(Boolean).map((row) => (
            <div key={row.label} className="flex justify-between items-center text-[13px] gap-3">
              <span className="font-bold text-gray-600">{row.label}</span>
              <span className="font-extrabold text-gray-900 text-right">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {data.commercial_rate != null && (
        <div className="mb-5 rounded-xl border border-gray-200 p-3">
          <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-widest mb-1">Interest vs commercial bank</h3>
          <div className="flex items-center gap-4 mb-1">
            <span className="text-[10px] font-bold text-emerald-700">■ NSFDC {data.interest_rate}%</span>
            <span className="text-[10px] font-bold text-slate-500">■ Bank {data.commercial_rate}%</span>
          </div>
          <GroupedBars
            series={Array.from({ length: Math.min(data.tenure_years, 4) }, (_, i) => ({
              label: `Y${i + 1}`,
              nsfdc: yearlyInterest,
              bank: loanAmount * (data.commercial_rate / 100)
            }))}
          />
        </div>
      )}

      {data.use_of_funds?.length > 0 && (
        <div className="mb-5">
          <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-widest mb-2">Use of funds</h3>
          <div className="rounded-xl border border-gray-200 p-3 mb-3">
            <DonutChart
              slices={data.use_of_funds.map((row) => ({ label: row.item, value: row.pct }))}
              centerLabel="100%"
            />
          </div>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            {data.use_of_funds.map((row) => {
              const amount = projectCost * (row.pct / 100);
              return (
                <div key={row.item} className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-gray-100 last:border-b-0">
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-gray-800 truncate">{row.item}</p>
                    <div className="mt-1 h-1.5 w-28 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[12px] font-extrabold text-gray-900">{inr(amount)}</p>
                    <p className="text-[10px] font-bold text-gray-400">{row.pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {p.monthly_revenue != null && (
        <div className="mb-5">
          <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-widest mb-2">Year-1 operating plan</h3>
          {data.quarterly_trend?.length > 0 && (
            <div className="rounded-xl border border-gray-200 p-3 mb-3">
              <div className="flex items-center gap-4 mb-1">
                <span className="text-[10px] font-bold text-teal-700">● Sales</span>
                <span className="text-[10px] font-bold text-blue-700">● Surplus</span>
              </div>
              <LineChart
                series={data.quarterly_trend}
                formatY={(v) => `₹${Math.round(Math.abs(v) / 1000)}k`}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <p className="text-[10px] font-bold text-gray-500">Monthly revenue</p>
              <p className="text-[15px] font-black text-gray-900">{inr(p.monthly_revenue)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <p className="text-[10px] font-bold text-gray-500">Monthly opex</p>
              <p className="text-[15px] font-black text-gray-900">{inr(p.monthly_opex)}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
              <p className="text-[10px] font-bold text-emerald-700">Monthly EBITDA</p>
              <p className="text-[15px] font-black text-emerald-800">{inr(p.monthly_ebitda)}</p>
            </div>
            <div className="rounded-xl bg-teal-50 border border-teal-100 p-3">
              <p className="text-[10px] font-bold text-teal-700">DSCR</p>
              <p className="text-[15px] font-black text-teal-800">{p.dscr}x</p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 space-y-1.5">
            <div className="flex justify-between text-[12px]"><span className="font-semibold text-gray-600">Break-even</span><span className="font-extrabold">{p.break_even_months} months</span></div>
            <div className="flex justify-between text-[12px]"><span className="font-semibold text-gray-600">Year-1 sales</span><span className="font-extrabold">{inr(p.year1_sales)}</span></div>
            <div className="flex justify-between text-[12px]"><span className="font-semibold text-gray-600">Year-1 surplus</span><span className="font-extrabold text-green-700">{inr(p.year1_surplus)}</span></div>
          </div>
        </div>
      )}

      <button onClick={nextStep} className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-colors">
        View EMI Schedule <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

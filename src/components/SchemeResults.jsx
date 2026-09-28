import React, { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle, XCircle, ChevronDown, ChevronUp, Shield, IndianRupee, FileText, ExternalLink } from 'lucide-react';
import { findAllMatches } from '../utils/schemeEngine';

export default function SchemeResults({ profile, nextStep, onSelectScheme }) {
  const [expandedId, setExpandedId] = useState(null);

  const results = useMemo(() => findAllMatches(profile), [profile]);
  const eligibleCount = results.filter(r => r.eligible).length;
  const totalCount = results.length;

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  const handleSelect = (result) => {
    if (onSelectScheme) onSelectScheme(result.scheme);
    nextStep();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-800 px-5 pt-6 pb-5 text-white">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-green-200 mb-1">
          Scheme Recommendation Engine
        </div>
        <h2 className="text-[22px] font-extrabold tracking-tight leading-tight mb-3">
          Eligible Schemes Found
        </h2>
        
        {/* Stats Bar */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/15 backdrop-blur rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-black text-white">{eligibleCount}</div>
            <div className="text-[10px] font-bold text-green-200 uppercase tracking-wider">Eligible</div>
          </div>
          <div className="flex-1 bg-white/15 backdrop-blur rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-black text-white">{totalCount - eligibleCount}</div>
            <div className="text-[10px] font-bold text-green-200 uppercase tracking-wider">Not Eligible</div>
          </div>
          <div className="flex-1 bg-white/15 backdrop-blur rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-black text-white">{totalCount}</div>
            <div className="text-[10px] font-bold text-green-200 uppercase tracking-wider">Total Checked</div>
          </div>
        </div>
      </div>

      {/* Profile Summary Pill */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 px-4 py-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-sm flex-shrink-0">
            {(profile.applicantName || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-extrabold text-gray-900 truncate">{profile.applicantName || "Applicant"}</div>
            <div className="text-[10px] text-gray-500 font-medium truncate">
              Age {profile.age} • {profile.business} • ₹{Number(profile.income || 0).toLocaleString('en-IN')}/yr
            </div>
          </div>
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-3">
        {results.map((result, idx) => {
          const isExpanded = expandedId === result.scheme_id;
          const isEligible = result.eligible;
          
          return (
            <div
              key={result.scheme_id}
              className={`rounded-2xl border-2 overflow-hidden transition-all shadow-sm ${
                isEligible 
                  ? 'border-green-200 bg-white' 
                  : 'border-gray-200 bg-gray-50/80'
              }`}
            >
              {/* Card Header */}
              <button 
                onClick={() => toggle(result.scheme_id)}
                className="w-full text-left p-4 flex items-start gap-3"
              >
                {/* Status Icon */}
                <div className={`mt-0.5 flex-shrink-0 ${isEligible ? 'text-green-500' : 'text-red-400'}`}>
                  {isEligible 
                    ? <CheckCircle className="w-5 h-5" /> 
                    : <XCircle className="w-5 h-5" />
                  }
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                      isEligible 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {isEligible ? '✓ ELIGIBLE' : '✗ NOT ELIGIBLE'}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                      {result.category}
                    </span>
                  </div>
                  <h3 className={`text-[13px] font-extrabold leading-tight ${
                    isEligible ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {result.scheme_name}
                  </h3>
                </div>
                
                <div className="flex-shrink-0 mt-1">
                  {isExpanded 
                    ? <ChevronUp className="w-4 h-4 text-gray-400" /> 
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                  {/* Description */}
                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed mt-3 mb-3">
                    {result.description}
                  </p>

                  {/* Benefits */}
                  {result.benefits && (
                    <div className="flex items-start gap-2 bg-green-50 rounded-lg p-2.5 mb-3 border border-green-100">
                      <IndianRupee className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] text-green-800 font-bold leading-snug">{result.benefits}</span>
                    </div>
                  )}

                  {/* Eligibility Reasons */}
                  <div className="mb-3">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                      Rule-by-Rule Check
                    </div>
                    <div className="space-y-1.5">
                      {result.reasons.map((reason, rIdx) => {
                        const isPassing = !reason.toLowerCase().includes('not provided') 
                          && !reason.toLowerCase().includes('exceeds') 
                          && !reason.toLowerCase().includes('below minimum')
                          && !reason.toLowerCase().includes('not in')
                          && !reason.toLowerCase().includes('may not fit')
                          && !reason.toLowerCase().includes('invalid');
                        return (
                          <div key={rIdx} className={`flex items-start gap-2 text-[11px] font-medium leading-snug rounded-md px-2 py-1.5 ${
                            isPassing ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
                          }`}>
                            <span className="flex-shrink-0 mt-0.5">
                              {isPassing ? '✓' : '✗'}
                            </span>
                            <span>{reason}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Documents Required */}
                  {result.documents_required && result.documents_required.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                        Documents Required
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.documents_required.map((doc, dIdx) => (
                          <span key={dIdx} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Select / Apply Button */}
                  {isEligible && (
                    <button 
                      onClick={() => handleSelect(result)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-colors mt-2"
                    >
                      Select This Scheme <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.08)]">
        <button 
          onClick={() => {
            // Auto-select the first eligible scheme
            const firstEligible = results.find(r => r.eligible);
            if (firstEligible) handleSelect(firstEligible);
            else nextStep();
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          Continue with Best Scheme <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

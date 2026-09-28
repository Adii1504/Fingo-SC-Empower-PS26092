import React, { useState } from 'react';
import { ArrowLeft, Search, Building2, Briefcase, IndianRupee } from 'lucide-react';
import schemesData from '../data/schemes.json';

export default function SchemesList({ onBack }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSchemes = schemesData.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-100 sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-900 hover:bg-gray-100 p-1 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[18px] font-extrabold text-gray-900 tracking-tight">Government Schemes</h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)] z-10">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-green-500 focus-within:bg-white transition-colors">
          <Search className="w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search schemes, e.g. MUDRA, Housing..." 
            className="bg-transparent outline-none text-sm w-full font-semibold text-gray-800 placeholder:text-gray-500 placeholder:font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-12">
        {filteredSchemes.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 font-medium">No schemes found matching "{searchTerm}"</div>
        ) : (
          filteredSchemes.map((scheme, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-extrabold text-gray-900 text-[15px] leading-tight">{scheme.name}</h3>
                <span className="bg-green-100 text-green-800 text-[9px] font-black uppercase px-2 py-1 rounded-md border border-green-200 flex-shrink-0 ml-2">
                  {scheme.category || "General"}
                </span>
              </div>
              
              <p className="text-[12px] text-gray-600 font-medium leading-relaxed mb-4 line-clamp-3">
                {scheme.description || scheme.offline_explanation}
              </p>

              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-700 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100">
                  <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                  <span className="truncate">{scheme.benefits ? scheme.benefits : "Financial Assistance Available"}</span>
                </div>
                
                {scheme.eligibility_rules && (
                  <div className="flex gap-2">
                    {scheme.eligibility_rules.age_min !== null && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                        Age: {scheme.eligibility_rules.age_min}+
                      </span>
                    )}
                    {scheme.eligibility_rules.income_max !== null && (
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                        Income &lt; ₹{(scheme.eligibility_rules.income_max / 100000)}L
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

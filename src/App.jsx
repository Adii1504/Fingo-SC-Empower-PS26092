import React, { useState, useEffect, useRef } from 'react';
import InputScreen from './components/InputScreen';
import SchemeResults from './components/SchemeResults';
import FeasibilityReport from './components/FeasibilityReport';
import FinancialPlan from './components/FinancialPlan';
import PartnerMap from './components/PartnerMap';
import Dossier from './components/Dossier';
import SchemesList from './components/SchemesList';
import { ArrowRight, Mic, TrendingUp, FileText, MapPin, RotateCcw } from 'lucide-react';

export const SCENARIOS = {
  lakshmi: {
    id: 'lakshmi',
    profile: { name: "Lakshmi", age: 32, caste: "SC", location: "Kanpur, Uttar Pradesh", language: "Hindi", quote: "मुझे अपनी चमड़े की दुकान बढ़ानी है, मेरे पास 2 लाख हैं", emoji: "👩" },
    input: { business: "Leather Workshop Expansion", location: "Kanpur, UP", capital: 200000 },
    feasibility: {
      is_viable: true, competitors_count: 1, radius_km: 8, market_saturation: "LOW", viability_score: 8.8,
      pivot_recommended: false,
      swot: {
        strengths: ["Growing demand from nearby leather export hub", "Established local leather artisan cluster", "Low competition in premium customized goods"],
        weaknesses: ["Capital intensive raw material procurement", "Seasonal fluctuation in hide supply"],
        opportunities: ["Unserved niche in customized premium leather goods", "Government push for MSME exports under ODOP"],
        threats: ["Seasonal supply chain disruption", "Environmental compliance costs rising"]
      },
      market: {
        households: 18420,
        population: 82700,
        source: "Census 2011 catchment + OSM 2024 POIs",
        catchment: "Jajmau–Kanpur leather belt",
        daily_footfall: 340,
        avg_ticket: 2400,
        monthly_demand_inr: 480000,
        cluster: "ODOP: Leather products",
        export_units_nearby: 62,
        bulk_tanneries: 14
      },
      competitors: [
        { name: "Sharma Custom Leather", type: "Premium workshop", distance_km: 6.2, overlap: "Partial — belts & wallets", years: 11 }
      ],
      demand_signals: [
        { label: "Cluster stitching overflow", value: "₹18–22 L / month" },
        { label: "Corporate gifting gap", value: "Unserved in 8 km" },
        { label: "PPP ticket band", value: "₹800 – ₹4,500" }
      ],
      score_breakdown: [
        { label: "Demand", score: 9.1 },
        { label: "Competition", score: 8.6 },
        { label: "Cluster fit", score: 9.2 },
        { label: "Capital fit", score: 8.4 },
        { label: "Risk", score: 7.8 }
      ]
    },
    financials: {
      scheme: "Term Loan (TL)", margin_money: 200000, project_cost: 2000000, loan_amount: 1800000,
      interest_rate: 8.0, tenure_years: 7, moratorium_months: 6, quarterly_emi: 8943,
      commercial_rate: 12.5,
      use_of_funds: [
        { item: "Machinery & stitching tools", pct: 40 },
        { item: "Working capital (hides & dyes)", pct: 30 },
        { item: "Shop fit-out & finishing", pct: 15 },
        { item: "Compliance & branding", pct: 5 },
        { item: "Contingency", pct: 10 }
      ],
      projections: {
        monthly_revenue: 185000,
        monthly_opex: 112000,
        monthly_ebitda: 73000,
        dscr: 2.04,
        break_even_months: 11,
        year1_sales: 2220000,
        year1_surplus: 548000
      },
      quarterly_trend: [
        { label: "Q1", sales: 380000, surplus: -42000 },
        { label: "Q2", sales: 490000, surplus: 86000 },
        { label: "Q3", sales: 590000, surplus: 176000 },
        { label: "Q4", sales: 760000, surplus: 328000 }
      ]
    },
    partners: [
      { id: 1, name: "SCA Kanpur Central", type: "SCA", distance_km: 12, npa_percent: 5, utilization_percent: 91, health_score: 91, status: "GREEN", lat: 26.4499, lng: 80.3319 },
      { id: 2, name: "UP Gramin Bank", type: "RRB", distance_km: 14, npa_percent: 28, utilization_percent: 65, health_score: 46, status: "RED", lat: 26.4600, lng: 80.3500 },
      { id: 3, name: "Baroda UP Gramin Bank", type: "RRB", distance_km: 19, npa_percent: 12, utilization_percent: 84, health_score: 74, status: "YELLOW", lat: 26.4350, lng: 80.3100 },
      { id: 6, name: "SBI Kanpur", type: "PSB", distance_km: 6, npa_percent: 18, utilization_percent: 50, health_score: 55, status: "RED", lat: 26.4550, lng: 80.3400 }
    ]
  },
  aditya: {
    id: 'aditya',
    profile: { name: "Aditya", age: 24, caste: "SC", location: "Latur, Maharashtra", language: "Marathi", quote: "मला दूध डेअरी सुरू करायचंय", emoji: "👨" },
    input: { business: "Milk Dairy", location: "Latur, Maharashtra", capital: 50000 },
    feasibility: {
      is_viable: false, competitors_count: 4, radius_km: 5, market_saturation: "HIGH", viability_score: 4.2,
      pivot_recommended: true, pivot_suggestion: "Packaged Snacks",
      swot: {
        strengths: ["Local raw material (milk) availability", "Existing family knowledge of dairy operations"],
        weaknesses: ["Highly perishable product without cold storage", "Thin margins in unbranded milk resale"],
        opportunities: ["Zero packaged snack suppliers in 5 km — massive gap", "Growing demand for branded regional snacks"],
        threats: ["4 existing dairies creating price war", "Seasonal milk supply fluctuation"]
      },
      market: {
        households: 3120,
        population: 14800,
        source: "Census 2011 catchment + OSM 2024 POIs",
        catchment: "Latur rural mandal",
        daily_footfall: 90,
        avg_ticket: 45,
        monthly_demand_inr: 98000,
        cluster: "Dairy collection belt",
        snack_packers: 0
      },
      competitors: [
        { name: "Gokul Milk Booth", type: "Retail dairy", distance_km: 0.8, overlap: "Direct milk resale", years: 8 },
        { name: "Shivneri Dairy", type: "Collection unit", distance_km: 1.4, overlap: "Direct milk resale", years: 15 },
        { name: "Amrut Milk", type: "Retail dairy", distance_km: 2.9, overlap: "Direct milk resale", years: 6 },
        { name: "Latur Co-op Collection", type: "Co-operative", distance_km: 4.1, overlap: "Bulk procurement", years: 22 }
      ],
      demand_signals: [
        { label: "Packaged snack suppliers", value: "0 in 5 km" },
        { label: "Weekly mandi snack spend", value: "₹1.4 L" },
        { label: "PPP ticket band (snacks)", value: "₹10 – ₹40" }
      ],
      score_breakdown: [
        { label: "Demand", score: 7.2 },
        { label: "Competition", score: 2.1 },
        { label: "Cluster fit", score: 4.0 },
        { label: "Capital fit", score: 6.5 },
        { label: "Risk", score: 3.4 }
      ]
    },
    financials: {
      scheme: "Micro Credit Finance (MCF)", margin_money: 50000, project_cost: 500000, loan_amount: 450000,
      interest_rate: 6.5, tenure_years: 3, moratorium_months: 3, quarterly_emi: 4287,
      commercial_rate: 14.0,
      use_of_funds: [
        { item: "Sealing & packaging line", pct: 36 },
        { item: "Working capital (flour, oil, spices)", pct: 44 },
        { item: "Branding & pouches", pct: 12 },
        { item: "FSSAI & licenses", pct: 8 }
      ],
      projections: {
        monthly_revenue: 95000,
        monthly_opex: 58000,
        monthly_ebitda: 37000,
        dscr: 2.16,
        break_even_months: 8,
        year1_sales: 1140000,
        year1_surplus: 272000
      },
      quarterly_trend: [
        { label: "Q1", sales: 180000, surplus: -18000 },
        { label: "Q2", sales: 250000, surplus: 42000 },
        { label: "Q3", sales: 320000, surplus: 98000 },
        { label: "Q4", sales: 390000, surplus: 150000 }
      ]
    },
    partners: [
      { id: 4, name: "SCA Latur Rural", type: "SCA", distance_km: 8, npa_percent: 4, utilization_percent: 92, health_score: 92, status: "GREEN", lat: 18.4088, lng: 76.5604 },
      { id: 7, name: "SCA Osmanabad", type: "SCA", distance_km: 14, npa_percent: 7, utilization_percent: 88, health_score: 85, status: "GREEN", lat: 18.185, lng: 76.041 },
      { id: 8, name: "SCA Beed", type: "SCA", distance_km: 12, npa_percent: 14, utilization_percent: 65, health_score: 68, status: "YELLOW", lat: 18.99, lng: 75.75 },
      { id: 5, name: "Maharashtra Gramin Bank", type: "RRB", distance_km: 15, npa_percent: 22, utilization_percent: 70, health_score: 54, status: "RED", lat: 18.4200, lng: 76.5800 },
      { id: 9, name: "SBI Branch Nanded", type: "PSB", distance_km: 5, npa_percent: 18, utilization_percent: 60, health_score: 60, status: "RED", lat: 18.39, lng: 76.59 }
    ]
  }
};

function App() {
  const [step, setStep] = useState(0);
  const [scenario, setScenario] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const mainRef = useRef(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const nextStep = () => setStep(s => s + 1);
  const pickScenario = (key) => { setScenario(SCENARIOS[key]); setStep(1); };
  const restart = () => { setStep(0); setScenario(null); setSelectedPartner(null); };

  // ─── LANDING PAGE ─────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        {/* Top Government Navbar */}
        <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label="emblem">🏛️</span>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-2xl text-gray-900">Fingo</span>
              <span className="font-bold text-lg text-green-700">SC-Empower</span>
            </div>
          </div>
          <div className="flex items-center gap-4 hidden md:flex">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">SIH 2026</span>
          </div>
        </header>

        {/* Hero Banner (Colorful) */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white relative overflow-hidden px-6 py-20">
          {/* Decorative background glows */}
          <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-emerald-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-green-100 font-bold text-xs mb-10 uppercase tracking-widest backdrop-blur-sm">
              Ministry of Social Justice & Empowerment • NSFDC
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15] text-white">
              Empowering Marginalized <br className="hidden md:block" />Entrepreneurs with AI
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100/90 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
              Seamlessly connecting SC/ST/OBC youth to business advisory, automated scheme matching, and geo-spatial credit routing.
            </p>

            {/* Core Modules (Buttons) */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-4xl mx-auto">
              <button onClick={() => pickScenario('aditya')} className="group flex items-center justify-between gap-6 bg-white/10 hover:bg-white/20 border border-white/20 text-left p-6 md:p-8 rounded-2xl transition-all w-full sm:w-1/2 backdrop-blur-md shadow-xl">
                <div>
                  <div className="text-xs font-bold text-green-300 uppercase tracking-widest mb-2">PS 26091</div>
                  <div className="font-extrabold text-white text-2xl md:text-3xl">Business Advisory</div>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/10 group-hover:bg-white flex items-center justify-center transition-colors flex-shrink-0 shadow-inner">
                  <ArrowRight className="w-6 h-6 text-white group-hover:text-green-800 transition-colors" />
                </div>
              </button>

              <button onClick={() => pickScenario('lakshmi')} className="group flex items-center justify-between gap-6 bg-white hover:bg-green-50 text-left p-6 md:p-8 rounded-2xl transition-all w-full sm:w-1/2 shadow-2xl hover:-translate-y-1">
                <div>
                  <div className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">PS 26092</div>
                  <div className="font-extrabold text-green-900 text-2xl md:text-3xl">Geo-Spatial Routing</div>
                </div>
                <div className="w-14 h-14 rounded-full bg-green-100 group-hover:bg-green-200 border border-green-200 flex items-center justify-center transition-colors flex-shrink-0">
                  <ArrowRight className="w-6 h-6 text-green-700" />
                </div>
              </button>
            </div>
            
            {/* View Schemes Button */}
            <div className="mt-12">
              <button onClick={() => setStep(-1)} className="text-green-200 hover:text-white underline font-medium text-sm transition-colors">
                View All Available Government Schemes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN APP FLOW ────────────────────────────────────────
  const handleInputSubmit = (userInput) => {
    // Store user profile and move to Scheme Results screen
    setScenario(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: userInput.applicantName || prev.profile.name
      },
      input: {
        business: userInput.business,
        location: userInput.location,
        capital: userInput.capital
      },
      userProfile: userInput // Save for the scheme engine
    }));
    setStep(2); // Go to SchemeResults
  };

  // Called when user selects a scheme from the results screen
  const handleSchemeSelect = (selectedScheme) => {
    const cap = scenario.input.capital || scenario.userProfile?.capital || 50000;
    const projectCost = cap * 10;
    const loanAmount = projectCost - cap;
    const rate = scenario.financials.interest_rate;
    const tenure = scenario.financials.tenure_years;
    const totalInterest = loanAmount * (rate / 100) * tenure;
    const quarterlyEmi = Math.round((loanAmount + totalInterest) / (tenure * 4));

    setScenario(prev => ({
      ...prev,
      financials: {
        ...prev.financials,
        scheme: selectedScheme.name,
        margin_money: cap,
        project_cost: projectCost,
        loan_amount: loanAmount,
        quarterly_emi: quarterlyEmi
      }
    }));
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center font-sans sm:p-8">
      {/* Mobile Frame Container */}
      <div className="w-full h-full sm:w-[400px] sm:h-[800px] bg-gray-50 sm:rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden sm:border-[10px] sm:border-gray-900">
        
        {/* Fake Status Bar */}
        <div className="bg-white px-4 py-1.5 flex justify-between items-center text-[10px] font-medium text-gray-800 hidden sm:flex">
          <span>10:10 AM</span>
          <div className="flex items-center gap-1">
            <span>LTE</span>
            <span>85%</span>
          </div>
        </div>

        {/* Universal App Header */}
        {step >= 0 && (
          <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-gray-900 text-lg tracking-tight">
                Fingo <span className="text-green-700">
                  {scenario?.id === 'aditya' ? 'Business Empower' : 'SC-Empower'}
                </span>
              </span>
            </div>
            <button onClick={restart} className="text-gray-500 hover:text-gray-900">
              <RotateCcw className="w-5 h-5" />
            </button>
          </header>
        )}

        {/* Content Area */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-gray-50 relative flex flex-col">
          {step === -1 && <SchemesList onBack={() => setStep(0)} />}
          {step === 1 && <InputScreen onSubmit={handleInputSubmit} />}
          {step === 2 && scenario?.userProfile && (
            <SchemeResults 
              profile={scenario.userProfile} 
              nextStep={() => setStep(3)} 
              onSelectScheme={handleSchemeSelect} 
            />
          )}
          {step === 3 && <FeasibilityReport nextStep={() => setStep(4)} data={scenario.feasibility} />}
          {step === 4 && <FinancialPlan nextStep={() => setStep(5)} data={scenario.financials} capital={scenario.input.capital} />}
          {step === 5 && <PartnerMap nextStep={() => setStep(6)} partners={scenario.partners} setSelectedPartner={setSelectedPartner} />}
          {step === 6 && <Dossier scenario={scenario} selectedPartner={selectedPartner} onRestart={restart} />}
        </main>
      </div>
    </div>
  );
}

export default App;

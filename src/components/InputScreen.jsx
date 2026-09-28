import React, { useState } from 'react';
import { Mic, ArrowRight, Briefcase, MapPin, IndianRupee, Globe, User } from 'lucide-react';

export default function InputScreen({ onSubmit }) {
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("Hindi");
  const [applicantName, setApplicantName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [income, setIncome] = useState("");
  const [category, setCategory] = useState("General");
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("");
  const [capital, setCapital] = useState("");

  const simulateVoice = () => {
    setListening(true);
    // Just a visual flair for the demo, no auto-filling. The presenter will type.
    setTimeout(() => {
      setListening(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Header / Language Selection */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-1 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-md text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50">
          <Globe className="w-3.5 h-3.5 text-gray-500" />
          <select className="bg-transparent outline-none cursor-pointer" value={language} onChange={e => setLanguage(e.target.value)}>
            <option>हिन्दी (Hindi)</option>
            <option>मराठी (Marathi)</option>
            <option>தமிழ் (Tamil)</option>
            <option>తెలుగు (Telugu)</option>
          </select>
        </div>
      </div>

      {/* Top Section */}
      <div className="px-6 pt-20 pb-8 text-center flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="text-blue-700 font-black text-[17px] mb-5 tracking-wider drop-shadow-sm whitespace-nowrap">
          "आपका बिज़नेस, सलूशन हमारा!"
        </div>
        <h2 className="text-[28px] font-bold text-gray-900 mb-16 leading-tight mt-1">
          अपना बिज़नेस आइडिया <br /> बताइए
        </h2>

        {/* Huge Voice Button */}
        <button
          onClick={simulateVoice}
          disabled={listening}
          className="relative group cursor-pointer focus:outline-none"
        >
          {/* Animated Ripples */}
          <div className={`absolute inset-0 bg-green-100 rounded-full scale-[1.8] ${listening ? 'animate-ping opacity-50' : 'opacity-100'}`}></div>
          <div className="absolute inset-0 bg-green-200 rounded-full scale-[1.4]"></div>
          
          {/* Core Button */}
          <div className="relative z-10 w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95">
            <Mic className="w-10 h-10 text-white" />
          </div>
        </button>
      </div>

      {/* Input Fields Section (Bottom Sheet style) */}
      <div className="bg-white px-6 pb-6 w-full border-t border-gray-100 pt-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] h-[350px] overflow-y-auto">
        <div className="space-y-3">
          
          {[
            { id: "applicant", icon: <User className="text-gray-500 w-5 h-5" />, val: applicantName, set: setApplicantName, title: "आवेदक का नाम (Applicant Name)", ph: "अपना नाम लिखें", type: "text" },
            { id: "age", icon: <User className="text-gray-500 w-5 h-5" />, val: age, set: setAge, title: "आयु (Age)", ph: "अपनी आयु लिखें", type: "number" },
            { id: "gender", icon: <User className="text-gray-500 w-5 h-5" />, val: gender, set: setGender, title: "लिंग (Gender)", type: "select", options: ["Male", "Female", "Other"] },
            { id: "income", icon: <IndianRupee className="text-gray-500 w-5 h-5" />, val: income, set: setIncome, title: "वार्षिक आय (Annual Income)", ph: "अपनी वार्षिक आय लिखें", type: "number" },
            { id: "category", icon: <User className="text-gray-500 w-5 h-5" />, val: category, set: setCategory, title: "जाति / वर्ग (Social Category)", type: "select", options: ["General", "SC", "ST", "OBC", "EWS"] },
            { id: "location", icon: <MapPin className="text-gray-500 w-5 h-5" />, val: location, set: setLocation, title: "स्थान (Location)", ph: "शहर या गाँव का नाम लिखें", type: "text" },
            { id: "business", icon: <Briefcase className="text-gray-500 w-5 h-5" />, val: business, set: setBusiness, title: "व्यापार का प्रकार (Business Type)", ph: "जैसे- किराना की दुकान, सिलाई", type: "text" },
            { id: "capital", icon: <IndianRupee className="text-gray-500 w-5 h-5" />, val: capital, set: setCapital, title: "उपलब्ध पूँजी (Available Capital)", ph: "अपनी पूँजी की राशि लिखें", type: "number" }
          ].map((field, i) => (
            <div key={i} className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-lg border border-gray-200 focus-within:border-green-500 focus-within:bg-white transition-colors">
              <div className="flex-shrink-0 mt-1 self-start">{field.icon}</div>
              <div className="flex-1">
                <label htmlFor={field.id} className="block text-[10px] font-bold text-gray-700 mb-0.5">{field.title}</label>
                {field.type === "select" ? (
                  <select 
                    id={field.id}
                    className="w-full bg-transparent outline-none text-gray-900 text-sm font-medium cursor-pointer"
                    value={field.val}
                    onChange={e => field.set(e.target.value)}
                  >
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input 
                    id={field.id}
                    type={field.type} 
                    className="w-full bg-transparent outline-none text-gray-900 text-sm placeholder:text-gray-400 font-medium" 
                    value={field.val} 
                    onChange={e => field.set(e.target.value)} 
                    placeholder={field.ph} 
                  />
                )}
              </div>
            </div>
          ))}

        </div>

        <button
          onClick={() => onSubmit({ applicantName, age: Number(age), gender, income: Number(income), category, business, location, capital: Number(capital) })}
          disabled={!applicantName || !age || !business || !capital}
          className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
        >
          Analyze Business <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

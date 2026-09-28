import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, User, Star, ArrowRight, MapPin } from 'lucide-react';

const createPin = (color) => L.divIcon({
  html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
  className: 'custom-pin',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function MapBounds({ partners }) {
  const map = useMap();
  useEffect(() => {
    if (partners && partners.length > 0) {
      const bounds = L.latLngBounds(partners.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, partners]);
  return null;
}

export default function PartnerMap({ nextStep, partners, setSelectedPartner }) {
  const [search, setSearch] = useState("");
  const recommended = partners.find(p => p.status === 'GREEN') || partners[0];

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* Header */}
      <div className="px-4 pt-4 pb-2 z-10 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight">Nearest Eligible Partners</h2>
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
        
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent outline-none text-sm w-full font-medium"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100 z-0">
        <MapContainer center={[partners[0]?.lat || 20, partners[0]?.lng || 78]} zoom={11} className="w-full h-full" zoomControl={false}>
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapBounds partners={partners} />
          
          {/* Add a central circle to mimic the 5km radius */}
          {partners[0] && (
            <Circle 
              center={[partners[0].lat, partners[0].lng - 0.02]} 
              radius={5000} 
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }} 
            />
          )}

          {partners.map(p => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={createPin(p.status === 'GREEN' ? '#10b981' : (p.status === 'YELLOW' ? '#eab308' : '#ef4444'))}>
              <Popup className="custom-popup">
                <div className="text-center p-1">
                  <div className="font-bold text-[12px]">{p.name} - {p.distance_km}km</div>
                  <div className={`text-[10px] font-bold ${p.status === 'GREEN' ? 'text-green-600' : 'text-red-500'}`}>
                    NPA: {p.npa_percent}% {p.status === 'RED' ? '-- Not Recommended' : ''}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <style>{`
          .leaflet-container { font-family: inherit; }
          .custom-popup .leaflet-popup-content-wrapper { border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .custom-popup .leaflet-popup-content { margin: 8px; }
        `}</style>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white rounded-t-3xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] p-5 z-20 absolute bottom-0 left-0 right-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[14px] font-extrabold text-gray-900 flex items-center gap-2">
              Recommended: {recommended?.name}
            </div>
            <div className="text-[12px] text-gray-600 font-medium mt-2 space-y-1">
              <div>Health Score: <span className="font-bold text-gray-900">{recommended?.health_score}/100</span></div>
              <div>Distance: <span className="font-bold text-gray-900">{recommended?.distance_km} km</span></div>
              <div>Fund Utilization: <span className="font-bold text-gray-900">{recommended?.utilization_percent}%</span></div>
              <div>NPA: <span className={`font-bold ${recommended?.npa_percent <= 10 ? 'text-green-600' : 'text-red-500'}`}>{recommended?.npa_percent}%</span></div>
            </div>
          </div>
          <Star className="w-5 h-5 text-gray-400" />
        </div>
        
        <button 
          onClick={() => { setSelectedPartner(recommended); nextStep(); }} 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-colors"
        >
          Select This Partner <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

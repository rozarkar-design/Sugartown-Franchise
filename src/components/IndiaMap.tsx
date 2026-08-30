import React, { useState } from 'react';
import { City, CityTier, CityStatus } from '../types';
import { MapPin, Search, CheckCircle2, Star, Clock, Store, ArrowRight, X } from 'lucide-react';

interface IndiaMapProps {
  cities: City[];
  onSelectCity: (city: City) => void;
  selectedCityId?: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ cities, onSelectCity, selectedCityId }) => {
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);

  // Filter cities
  const filteredCities = cities.filter((city) => {
    const matchesTier = selectedTier === 'All' || city.tier === selectedTier;
    const matchesStatus = selectedStatus === 'All' || city.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      city.city_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesStatus && matchesSearch;
  });

  // Coordinate projection from GPS (lat, lng) to SVG coordinate space
  // Bounds calibrated for India: Lat (7.5 to 37.0), Lng (68.0 to 97.5)
  const projectCoordinates = (lat: number, lng: number) => {
    const minLng = 68.0;
    const maxLng = 96.0;
    const minLat = 7.5;
    const maxLat = 36.5;

    const width = 600;
    const height = 660;

    const x = ((lng - minLng) / (maxLng - minLng)) * (width - 80) + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (height - 60) + 30;

    return { x, y };
  };

  const getMarkerColor = (status: CityStatus) => {
    switch (status) {
      case 'Existing':
        return '#FC3D00'; // Signature Orange
      case 'Priority':
        return '#0284C7'; // Blue
      case 'Available':
        return '#059669'; // Emerald
      case 'Under Evaluation':
        return '#D97706'; // Amber
      default:
        return '#6B7280';
    }
  };

  return (
    <div id="india-expansion-map-container" className="bg-white rounded-[28px] sm:rounded-[32px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-7">
      {/* Controls: Search, Tier & Status Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b-2 border-black">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input
            id="city-map-search-input"
            type="text"
            placeholder="Search city or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm font-semibold rounded-2xl border-2 border-black bg-white placeholder:text-neutral-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tier Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-black uppercase tracking-wider text-black mr-1 hidden sm:inline">Tier:</span>
          {['All', 'Tier 1', 'Tier 2', 'Tier 3'].map((tier) => (
            <button
              key={tier}
              id={`filter-tier-${tier.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedTier(tier)}
              className={`px-3.5 py-1.5 rounded-full font-black uppercase tracking-wider text-xs border-2 border-black transition-all ${
                selectedTier === tier
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-black uppercase tracking-wider text-black mr-1 hidden sm:inline">Status:</span>
          {['All', 'Available', 'Priority', 'Existing', 'Under Evaluation'].map((status) => (
            <button
              key={status}
              id={`filter-status-${status.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-full font-black uppercase tracking-wider text-[11px] border-2 border-black transition-all ${
                selectedStatus === status
                  ? 'bg-[#FF5C00] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map + Filtered City List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Map Visualizer (7 Cols) */}
        <div className="lg:col-span-7 relative bg-[#F3F4F6] rounded-2xl border-2 border-black p-3 sm:p-4 flex flex-col items-center justify-center min-h-[440px] sm:min-h-[520px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Map Legend */}
          <div className="absolute top-3 left-3 bg-white border-2 border-black rounded-2xl p-3 text-[11px] space-y-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-10">
            <div className="font-black uppercase tracking-wider text-black text-xs mb-1">Territory Status</div>
            <div className="flex items-center gap-2 text-neutral-700 font-bold">
              <span className="w-3 h-3 rounded-full bg-[#FF5C00] border border-black" />
              <span>Existing / Flagship</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700 font-bold">
              <span className="w-3 h-3 rounded-full bg-[#FFD100] border border-black" />
              <span>Priority Expansion</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700 font-bold">
              <span className="w-3 h-3 rounded-full bg-[#00FF66] border border-black" />
              <span>Territory Available</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700 font-bold">
              <span className="w-3 h-3 rounded-full bg-[#00D1FF] border border-black" />
              <span>Under Evaluation</span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <svg
            viewBox="0 0 600 660"
            className="w-full h-full max-h-[500px] select-none"
            aria-label="Interactive India Franchise Territory Map"
          >
            <defs>
              {/* Subtle Grid Pattern */}
              <pattern id="india-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E5E5E5" strokeWidth="0.5" strokeOpacity="0.6" />
              </pattern>
              <filter id="marker-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Background Map Grid */}
            <rect width="100%" height="100%" fill="url(#india-grid)" rx="12" />

            {/* Stylized India Geography Contour */}
            <g id="india-landmass-silhouette" opacity="0.85">
              {/* Main Subcontinent Path */}
              <path
                d="M 180 50 
                   Q 220 30, 270 50 
                   Q 330 70, 360 110 
                   L 390 140 
                   Q 440 160, 480 170 
                   L 550 180 
                   Q 570 210, 540 230 
                   L 490 240 
                   Q 470 270, 450 300 
                   L 430 360 
                   Q 410 420, 370 470 
                   L 330 540 
                   Q 290 600, 260 630 
                   L 245 610 
                   Q 210 520, 180 440 
                   L 150 370 
                   Q 120 340, 100 300 
                   L 90 250 
                   Q 110 210, 140 180 
                   L 160 110 Z"
                fill="#F3F4F1"
                stroke="#D1D5DB"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Northern / Himalayan extension */}
              <path
                d="M 200 65 Q 230 25, 270 40 Q 300 60, 280 80 Z"
                fill="#EAECE6"
                stroke="#D1D5DB"
                strokeWidth="1"
              />
              {/* Gujarat / Kathiawar Peninsula */}
              <path
                d="M 100 280 Q 70 290, 80 320 Q 110 330, 125 305 Z"
                fill="#EAECE6"
                stroke="#D1D5DB"
                strokeWidth="1"
              />
              {/* Southern Tip / Sri Lanka Context */}
              <circle cx="280" cy="635" r="10" fill="#EAECE6" stroke="#D1D5DB" strokeWidth="1" />
            </g>

            {/* City Markers */}
            {filteredCities.map((city) => {
              const { x, y } = projectCoordinates(city.latitude, city.longitude);
              const isSelected = selectedCityId === city.id;
              const isHovered = hoveredCity?.id === city.id;
              const color = getMarkerColor(city.status);

              return (
                <g
                  key={city.id}
                  id={`map-marker-${city.id}`}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => onSelectCity(city)}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  {/* Ping effect for Priority or Existing */}
                  {(city.status === 'Existing' || city.status === 'Priority') && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 16 : 11}
                      fill={color}
                      opacity="0.25"
                      className="animate-ping origin-center"
                    />
                  )}

                  {/* Outer ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 10 : isHovered ? 8 : 6}
                    fill={isSelected ? '#FFFFFF' : color}
                    stroke={isSelected ? color : '#FFFFFF'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter="url(#marker-shadow)"
                  />

                  {/* Inner dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 4 : 2.5}
                    fill={isSelected ? color : '#FFFFFF'}
                  />

                  {/* City Label */}
                  <text
                    x={x + 10}
                    y={y + 4}
                    fontSize={isSelected || isHovered ? '12px' : '10px'}
                    fontWeight={isSelected || isHovered ? '700' : '600'}
                    fill={isSelected ? '#FC3D00' : '#1F2937'}
                    className="select-none pointer-events-none drop-shadow-xs"
                  >
                    {city.city_name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredCity && (
            <div
              className="absolute bottom-3 right-3 bg-neutral-900 text-white rounded-xl p-3 shadow-lg text-xs max-w-xs z-20 pointer-events-none animate-in fade-in duration-100"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-sm text-[#FC3D00]">{hoveredCity.city_name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-800 text-neutral-300">
                  {hoveredCity.tier}
                </span>
              </div>
              <p className="text-neutral-300 text-[11px] line-clamp-2">{hoveredCity.market_notes}</p>
              <div className="mt-2 text-[10px] text-neutral-400 font-medium">
                Click pin to inspect territory →
              </div>
            </div>
          )}
        </div>

        {/* Filtered Cities List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col min-h-[440px] max-h-[540px]">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-black">
              {filteredCities.length} Markets Found
            </span>
            <span className="text-xs text-neutral-500 font-bold uppercase">Select city to inspect</span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 flex-1">
            {filteredCities.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 bg-white rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-sm font-black uppercase text-black">No matching markets found</p>
                <p className="text-xs text-neutral-600 mt-1 font-semibold">
                  Try adjusting the tier, status, or search query.
                </p>
              </div>
            ) : (
              filteredCities.map((city) => {
                const isSelected = selectedCityId === city.id;
                return (
                  <div
                    key={city.id}
                    id={`city-list-card-${city.id}`}
                    onClick={() => onSelectCity(city)}
                    className={`p-4 rounded-2xl border-2 border-black cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FFD100] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5'
                        : 'bg-white hover:bg-neutral-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0 border border-black"
                          style={{ backgroundColor: getMarkerColor(city.status) }}
                        />
                        <h4 className="font-black text-sm uppercase text-black">{city.city_name}</h4>
                        <span className="text-xs text-neutral-600 font-bold uppercase">{city.state}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white border border-black text-black">
                        {city.tier}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-800 mt-2 font-medium line-clamp-2">
                      {city.market_notes}
                    </p>

                    <div className="mt-3 pt-2.5 border-t-2 border-black/20 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-700 font-bold">
                        Model: <strong className="text-black">{city.investment_model}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 font-black uppercase text-black">
                        <span>Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { City } from '../types';
import { X, MapPin, Building2, CheckCircle2, Clock, AlertTriangle, ArrowRight, Store, ShieldCheck } from 'lucide-react';

interface CityDrawerProps {
  city: City | null;
  onClose: () => void;
  onApplyForCity: (cityName: string) => void;
}

export const CityDrawer: React.FC<CityDrawerProps> = ({ city, onClose, onApplyForCity }) => {
  if (!city) return null;

  const getStatusBadge = () => {
    switch (city.status) {
      case 'Existing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FF5C00] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Store className="w-3.5 h-3.5" />
            Existing Store
          </span>
        );
      case 'Priority':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFD100] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Priority Expansion Territory
          </span>
        );
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#00FF66] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Territory Open for Application
          </span>
        );
      case 'Under Evaluation':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#00D1FF] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Clock className="w-3.5 h-3.5" />
            Feasibility Study Active
          </span>
        );
    }
  };

  return (
    <div
      id="city-details-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="city-details-drawer-card"
        className="w-full max-w-lg h-full bg-[#F3F4F6] border-l-2 border-black shadow-2xl flex flex-col p-6 sm:p-8 overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-start justify-between pb-5 border-b-2 border-black">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FFD100] border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {city.tier}
              </span>
              <span className="text-xs text-neutral-600 font-bold uppercase tracking-wider">{city.state}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
              {city.city_name}
            </h2>
          </div>

          <button
            id="city-drawer-close-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 space-y-5 flex-1">
          {/* Status Badge */}
          <div>{getStatusBadge()}</div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1">
                Suggested Model
              </span>
              <span className="text-base sm:text-lg font-black text-black">
                {city.investment_model}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1">
                Store Format
              </span>
              <span className="text-sm sm:text-base font-black text-black line-clamp-2">
                {city.suggested_format}
              </span>
            </div>
          </div>

          {/* Market Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-black">
              Market Intelligence & Catchment
            </h4>
            <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm text-neutral-800 font-medium leading-relaxed space-y-2">
              <p>{city.market_notes}</p>
              {city.description && <p className="text-neutral-500 text-xs font-semibold">{city.description}</p>}
            </div>
          </div>

          {/* Territory Availability Guarantee */}
          <div className="p-5 rounded-2xl bg-[#FFD100]/20 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1.5">
            <div className="flex items-center gap-2 text-black font-black uppercase text-xs">
              <ShieldCheck className="w-4 h-4 text-[#FF5C00]" />
              <span>Territory Exclusivity Policy</span>
            </div>
            <p className="text-xs text-neutral-800 font-medium leading-relaxed">
              Sugartown maintains strict radius and footfall exclusivity per franchised unit to protect unit economics and customer density.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t-2 border-black flex flex-col gap-3">
          <button
            id="apply-for-selected-city-btn"
            onClick={() => onApplyForCity(city.city_name)}
            className="w-full py-4 rounded-full bg-[#FF5C00] hover:bg-[#ff4500] text-white font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Apply for {city.city_name} Territory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-200 border-2 border-transparent hover:border-black transition-all"
          >
            Close & Continue Exploring
          </button>
        </div>
      </div>
    </div>
  );
};

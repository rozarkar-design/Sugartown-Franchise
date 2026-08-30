import React, { useState } from 'react';
import { City } from '../types';
import { IndiaMap } from '../components/IndiaMap';
import { CityDrawer } from '../components/CityDrawer';
import { Disclaimer } from '../components/Disclaimer';
import { MapPin, Sparkles, Building, ArrowRight } from 'lucide-react';

interface IndiaExpansionPageProps {
  cities: City[];
  onNavigate: (path: string, options?: { city?: string }) => void;
}

export const IndiaExpansionPage: React.FC<IndiaExpansionPageProps> = ({ cities, onNavigate }) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
  };

  const handleApplyForCity = (cityName: string) => {
    setSelectedCity(null);
    onNavigate('/inquiry', { city: cityName });
  };

  return (
    <div id="india-expansion-page-container" className="space-y-12 sm:space-y-16 py-8 sm:py-12 pb-24">
      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="bento-pill bg-[#00D1FF] text-black">
          <MapPin className="w-4 h-4" />
          <span>EXPANSION TERRITORY DISCOVERY</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
          Take Sugartown Across India
        </h1>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-2xl mx-auto leading-relaxed">
          Explore approved franchise catchments and priority retail micro-markets across Tier 1, Tier 2, and Tier 3 cities.
        </p>
      </section>

      {/* ---------------------------------------------------- */}
      {/* INTERACTIVE MAP COMPONENT */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IndiaMap
          cities={cities}
          onSelectCity={handleSelectCity}
          selectedCityId={selectedCity?.id}
        />
      </section>

      {/* ---------------------------------------------------- */}
      {/* CITY DRAWER */}
      {/* ---------------------------------------------------- */}
      <CityDrawer
        city={selectedCity}
        onClose={() => setSelectedCity(null)}
        onApplyForCity={handleApplyForCity}
      />

      {/* ---------------------------------------------------- */}
      {/* EXPANSION CRITERIA CARD */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF5C00]" />
            <h3 className="text-xl font-black uppercase text-black">
              Territory Evaluation & Catchment Criteria
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <h5 className="font-black uppercase text-black text-base">1. High Footfall</h5>
              <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                Grade-A shopping mall atriums, cinema corridors, and boutique high streets with weekend footfall exceeding 25,000 visitors.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <h5 className="font-black uppercase text-black text-base">2. Family Demographic</h5>
              <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                Affluent urban catchments with high household disposable income, family evening leisure culture, and celebration gifting demand.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <h5 className="font-black uppercase text-black text-base">3. Territorial Protection</h5>
              <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                Protected exclusivity radius guarantees no competing Sugartown unit can open within your defined catchment zone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Disclaimer type="franchise" />
      </section>
    </div>
  );
};

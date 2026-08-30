import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Minus,
} from 'lucide-react';
import { InvestmentModel, InvestmentComponent } from '../types';
import { formatIndianCurrency } from '../lib/calculator';
import { Disclaimer } from '../components/Disclaimer';

interface InvestmentPageProps {
  investmentModels: InvestmentModel[];
  onNavigate: (path: string, options?: { model?: string }) => void;
  initialSelectedTab?: string;
}

export const InvestmentPage: React.FC<InvestmentPageProps> = ({
  investmentModels,
  onNavigate,
  initialSelectedTab = '25L',
}) => {
  const [activeTab, setActiveTab] = useState<'25L' | '50L' | 'compare'>(
    (initialSelectedTab as any) || '25L'
  );

  const model25 = investmentModels.find((m) => m.code === '25L');
  const model50 = investmentModels.find((m) => m.code === '50L');

  const currentModel = activeTab === '50L' ? model50 : model25;

  const calculateTotal = (model?: InvestmentModel) => {
    if (!model) return 0;
    return model.components.reduce((acc, c) => acc + (c.amount || 0), 0);
  };

  const getStatusBadge = (status: InvestmentComponent['status']) => {
    switch (status) {
      case 'included':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00FF66] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            Included
          </span>
        );
      case 'configurable':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00D1FF] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            Configurable
          </span>
        );
      case 'not_disclosed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            TBD / Agreement
          </span>
        );
    }
  };

  return (
    <div id="investment-page-container" className="space-y-12 sm:space-y-16 py-8 sm:py-12 pb-24">
      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="bento-pill bg-[#FFD100] text-black">
          <Sparkles className="w-4 h-4" />
          <span>CAPITAL & COST BREAKDOWN</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
          Choose Your Sugartown Investment Format
        </h1>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-2xl mx-auto leading-relaxed">
          Transparent itemized capital allocations covering store interior fit-outs, specialized candy heating tables, live theater setups, and initial stock.
        </p>

        {/* Tab Controls */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] gap-1">
            <button
              id="tab-btn-25l"
              onClick={() => setActiveTab('25L')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === '25L'
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              ₹25L (Kiosk)
            </button>
            <button
              id="tab-btn-50l"
              onClick={() => setActiveTab('50L')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === '50L'
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              ₹50L (Flagship)
            </button>
            <button
              id="tab-btn-compare"
              onClick={() => setActiveTab('compare')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'compare'
                  ? 'bg-[#FF5C00] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SINGLE MODEL BREAKDOWN TAB (25L OR 50L) */}
      {/* ---------------------------------------------------- */}
      {activeTab !== 'compare' && currentModel && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
          {/* Summary Banner */}
          <div className="bento-card-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFD100] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {currentModel.tag}
                </span>
                <span className="text-xs text-neutral-300 font-bold uppercase tracking-wider">
                  Store Area: {currentModel.area_sqft}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                {currentModel.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-medium max-w-xl">
                {currentModel.description}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-black text-right shrink-0 w-full md:w-auto shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)]">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1">Total Turnkey Capital</span>
              <span className="text-3xl sm:text-4xl font-black text-black block">
                {formatIndianCurrency(calculateTotal(currentModel))}
              </span>
              <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider block mt-1">
                Sum of itemized components
              </span>
            </div>
          </div>

          {/* Itemized Components Table */}
          <div className="bento-card p-0 overflow-hidden">
            <div className="p-5 sm:p-6 border-b-2 border-black flex items-center justify-between bg-[#F3F4F6]">
              <div>
                <h3 className="text-base font-black uppercase text-black">
                  Itemized Cost Category Breakup
                </h3>
                <p className="text-xs text-neutral-600 font-medium">
                  Detailed architectural, machinery, and licensing line items.
                </p>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-black bg-[#FFD100] px-3 py-1 rounded-full border border-black hidden sm:inline shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Turnkey Verified
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F3F4F6] border-b-2 border-black text-xs font-black text-black uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Cost Category</th>
                    <th className="py-3.5 px-4 sm:px-6">Specifications & Scope</th>
                    <th className="py-3.5 px-4 sm:px-6 text-center">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10 text-neutral-900 font-medium">
                  {currentModel.components.map((comp) => (
                    <tr key={comp.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-black uppercase text-black whitespace-nowrap">
                        {comp.category}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-xs text-neutral-700 max-w-md">
                        <div className="font-bold text-black mb-0.5">{comp.name}</div>
                        {comp.notes && <div>{comp.notes}</div>}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                        {getStatusBadge(comp.status)}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right font-black text-black whitespace-nowrap">
                        {comp.amount > 0 ? formatIndianCurrency(comp.amount) : 'Configurable'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#FFD100] font-black text-black border-t-2 border-black">
                  <tr>
                    <td colSpan={3} className="py-4 px-4 sm:px-6 text-sm uppercase tracking-wider">
                      TOTAL TURNKEY INVESTMENT
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right text-base sm:text-lg font-black">
                      {formatIndianCurrency(calculateTotal(currentModel))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <Disclaimer type="franchise" className="max-w-2xl text-[11px]" />
            <button
              onClick={() => onNavigate('/calculator', { model: currentModel.code })}
              className="bento-btn-primary whitespace-nowrap"
            >
              <span>Calculate ROI for {currentModel.code} Model</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------- */}
      {/* SIDE-BY-SIDE COMPARISON TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'compare' && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
          {/* Desktop Table */}
          <div className="hidden md:block bento-card p-0 overflow-hidden">
            <div className="p-6 border-b-2 border-black bg-[#F3F4F6]">
              <h3 className="text-lg font-black uppercase text-black">
                Format Comparison: ₹25L vs ₹50L
              </h3>
              <p className="text-xs text-neutral-600 font-medium">
                Compare store footprint, live theater scale, and capital requirements.
              </p>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="bg-[#F3F4F6] border-b-2 border-black text-xs font-black text-black uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Parameter</th>
                  <th className="py-4 px-6 text-[#FF5C00]">₹25 Lakh (Kiosk / Express)</th>
                  <th className="py-4 px-6 text-[#FF5C00]">₹50 Lakh (Flagship Lounge)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 text-neutral-800 font-medium">
                <tr>
                  <td className="py-4 px-6 font-black uppercase text-black">Total Investment</td>
                  <td className="py-4 px-6 font-black text-black">
                    {formatIndianCurrency(calculateTotal(model25))}
                  </td>
                  <td className="py-4 px-6 font-black text-black">
                    {formatIndianCurrency(calculateTotal(model50))}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black uppercase text-black">Store Format</td>
                  <td className="py-4 px-6 text-neutral-700">{model25?.store_format}</td>
                  <td className="py-4 px-6 text-neutral-700">{model50?.store_format}</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black uppercase text-black">Store Area (Sq.Ft)</td>
                  <td className="py-4 px-6 text-neutral-700">{model25?.area_sqft}</td>
                  <td className="py-4 px-6 text-neutral-700">{model50?.area_sqft}</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black uppercase text-black">Live Candy Theater</td>
                  <td className="py-4 px-6 text-neutral-700">
                    Signature compact pulling station & heated display
                  </td>
                  <td className="py-4 px-6 text-neutral-700">
                    Grand 360° Amphitheater stage, camera array & live masterclasses
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black uppercase text-black">Ideal Catchment</td>
                  <td className="py-4 px-6 text-neutral-700">
                    Mall central atriums, cinema corridors, transit hubs
                  </td>
                  <td className="py-4 px-6 text-neutral-700">
                    Grade-A destination malls, luxury high streets
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black uppercase text-black">Gifting Pavilion</td>
                  <td className="py-4 px-6 text-neutral-700">Curated jar & box displays</td>
                  <td className="py-4 px-6 text-neutral-700">
                    Dedicated personalized gifting bar with custom monogramming
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black uppercase text-black">Company Operations</td>
                  <td className="py-4 px-6 text-black font-black bg-[#00FF66]/30">100% FOCO Managed</td>
                  <td className="py-4 px-6 text-black font-black bg-[#00FF66]/30">100% FOCO Managed</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Comparison Cards */}
          <div className="md:hidden space-y-4">
            {[model25, model50].filter(Boolean).map((mod) => (
              <div
                key={mod!.id}
                className="bento-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-black bg-[#FFD100] px-3 py-0.5 rounded-full border border-black">{mod!.tag}</span>
                  <span className="text-lg font-black text-black">
                    {formatIndianCurrency(calculateTotal(mod))}
                  </span>
                </div>
                <h4 className="text-base font-black uppercase text-black">{mod!.title}</h4>
                <div className="space-y-1.5 text-xs text-neutral-700 font-medium pt-2 border-t-2 border-black/10">
                  <div>
                    <strong>Format:</strong> {mod!.store_format}
                  </div>
                  <div>
                    <strong>Area:</strong> {mod!.area_sqft}
                  </div>
                  <div>
                    <strong>Management:</strong> 100% Sugartown FOCO Operations
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('/calculator', { model: mod!.code })}
                  className="w-full bento-btn-dark py-2.5 text-xs"
                >
                  <span>Test {mod!.code} in ROI Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

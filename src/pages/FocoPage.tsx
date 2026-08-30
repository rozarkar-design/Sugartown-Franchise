import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Store,
  Layers,
  Sparkles,
  HelpCircle,
  X,
  FileText,
} from 'lucide-react';
import { Disclaimer } from '../components/Disclaimer';

interface FocoPageProps {
  onNavigate: (path: string) => void;
}

export const FocoPage: React.FC<FocoPageProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const focoSteps = [
    {
      step: 1,
      title: 'Invest Capital',
      short: 'Capital Allocation',
      partner: 'Funds the turnkey ₹25L or ₹50L franchise setup and owns the physical store asset.',
      sugartown: 'Delivers audited equipment, architectural specifications, and commercial agreements.',
      details:
        'Franchise Partner commits capital for the turnkey store buildout. The partner holds 100% legal ownership of the store assets, inventory, and territorial franchise license under a 5-year renewable agreement.',
    },
    {
      step: 2,
      title: 'Select Territory',
      short: 'Market Analysis',
      partner: 'Shortlists preferred cities, micro-markets, or specific mall properties.',
      sugartown: 'Conducts footfall feasibility, demographic analytics, and catchment scoring.',
      details:
        'Our expansion team uses proprietary catchment mapping to evaluate mall atriums, cinema corridors, and boutique high streets with high family dwell time and disposable income.',
    },
    {
      step: 3,
      title: 'Approve Location',
      short: 'Site & Lease Lock',
      partner: 'Signs the retail lease with landlord/mall developer with corporate assistance.',
      sugartown: 'Vets commercial terms, negotiates rent benchmarks, and issues site approval.',
      details:
        'Sugartown provides institutional backing to assist in securing Grade-A mall locations at competitive commercial rates with clear exclusivity clauses.',
    },
    {
      step: 4,
      title: 'Build Store',
      short: 'Turnkey Fit-out',
      partner: 'Disburses turnkey fit-out milestone tranches as work progresses.',
      sugartown: 'Executes 100% turnkey interior build, theatrical lighting, POS setup & live stage machinery.',
      details:
        'Our project managers supervise all civil and specialized machinery works, installing food-grade heated candy pulling tables, air scrubbers, and POS hardware within 3 to 4 weeks.',
    },
    {
      step: 5,
      title: 'Launch Store',
      short: 'Grand Opening',
      partner: 'Inaugurates the store and participates in ribbon-cutting celebrations.',
      sugartown: 'Deploys master certified candy artisans, opening marketing blitz, and VIP influencer previews.',
      details:
        'Store opens with a high-energy live theater demonstration campaign, sampling rock candies and driving instant viral reach across local social media channels.',
    },
    {
      step: 6,
      title: 'Operate & Scale',
      short: 'Passive Management',
      partner: 'Monitors real-time store revenue via cloud dashboard and receives monthly earnings.',
      sugartown: 'Manages 100% daily operations: staffing, artisan candy-making, supply chain, and audits.',
      details:
        'Enjoy hands-free business ownership. Sugartown manages staff payroll, raw materials replenishment, and quality compliance while distributing net operating profits directly to your bank account.',
    },
  ];

  return (
    <div id="foco-page-container" className="space-y-16 sm:space-y-24 py-8 sm:py-12 pb-20">
      {/* ---------------------------------------------------- */}
      {/* 01. HERO */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="bento-pill bg-[#FFD100] text-black">
          <ShieldCheck className="w-4 h-4" />
          <span>PASSIVE BUSINESS OWNERSHIP FRAMEWORK</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black uppercase tracking-tight leading-tight">
          The Sugartown FOCO Model
        </h1>

        <p className="text-lg sm:text-2xl font-black uppercase text-[#FF5C00] max-w-2xl mx-auto">
          Franchise Owned. Company Operated.
        </p>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-3xl mx-auto leading-relaxed">
          The FOCO structure combines the financial advantages of franchise ownership with the operational rigor, artisan consistency, and brand stewardship of centralized company management.
        </p>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 02. PARTNER VS SUGARTOWN RESPONSIBILITY MATRIX */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Franchise Partner Card */}
          <div className="bento-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-black text-white border-2 border-black flex items-center justify-center font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Users className="w-7 h-7 text-[#FFD100]" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                  YOUR ROLE
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-black">
                  Franchise Partner
                </h3>
              </div>
            </div>

            <p className="text-sm text-neutral-700 font-medium leading-relaxed">
              As the franchise investor, you provide the capital, hold 100% asset ownership, and participate in business earnings without getting bogged down in daily retail operations.
            </p>

            <ul className="space-y-3.5 text-sm text-neutral-800 font-bold">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
                <span>
                  <strong className="text-black uppercase">Capital Contribution:</strong> Funds the turnkey store buildout (₹25L or ₹50L).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
                <span>
                  <strong className="text-black uppercase">Franchise & Asset Ownership:</strong> Retains 100% legal ownership of store fixtures, machines, and license rights.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
                <span>
                  <strong className="text-black uppercase">Territory Rights:</strong> Secures protected geographical exclusivity in your selected market.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
                <span>
                  <strong className="text-black uppercase">Commercial Responsibilities:</strong> Facilitates property lease execution with landlord and reviews periodic performance.
                </span>
              </li>
            </ul>
          </div>

          {/* Sugartown Management Card */}
          <div className="bento-card-dark space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FF5C00] text-white border-2 border-black flex items-center justify-center font-bold shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#FFD100]">
                  OUR RESPONSIBILITY
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white">
                  Sugartown Corporate
                </h3>
              </div>
            </div>

            <p className="text-sm text-neutral-300 font-medium leading-relaxed">
              Sugartown corporate assumes full fiduciary and operational accountability for running the store efficiently and preserving the brand&apos;s theatrical standards.
            </p>

            <ul className="space-y-3.5 text-sm text-neutral-200 font-bold">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FFD100] mt-1 shrink-0" />
                <span>
                  <strong className="text-white uppercase">Artisan Staffing & Certification:</strong> Complete recruitment, training, and deployment of master candy pullers.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FFD100] mt-1 shrink-0" />
                <span>
                  <strong className="text-white uppercase">Supply Chain & Inventory:</strong> Centralized distribution of food-grade sugar syrups, natural flavors, and custom packaging.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FFD100] mt-1 shrink-0" />
                <span>
                  <strong className="text-white uppercase">Live Theater Showmanship:</strong> Strict SOP compliance for daily entertainment demonstrations and food safety.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FFD100] mt-1 shrink-0" />
                <span>
                  <strong className="text-white uppercase">Marketing & Technology:</strong> Pan-India digital PR, seasonal SKU releases, cloud POS, and monthly audits.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 03. INTERACTIVE 6-STEP FOCO PROCESS */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="bento-pill bg-[#FFD100] text-black">
            JOURNEY TO LAUNCH
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
            Interactive 6-Step FOCO Workflow
          </h2>
          <p className="text-xs sm:text-sm text-neutral-700 font-medium">
            Click on any phase to inspect the partner and company responsibilities.
          </p>
        </div>

        {/* 6-Step Interactive Grid in Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {focoSteps.map((step) => {
            const isExpanded = activeStep === step.step;
            return (
              <div
                key={step.step}
                id={`foco-step-card-${step.step}`}
                onClick={() => setActiveStep(isExpanded ? null : step.step)}
                className={`p-6 rounded-[24px] border-2 border-black transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isExpanded
                    ? 'bg-[#FFD100] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1'
                    : 'bg-white hover:bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-full bg-black text-white border-2 border-black text-xs font-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      0{step.step}
                    </span>
                    <span className="text-xs font-black text-black uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full border border-black">
                      {step.short}
                    </span>
                  </div>

                  <h4 className="text-lg font-black uppercase text-black mb-2">{step.title}</h4>
                  <p className="text-xs text-neutral-800 font-medium leading-relaxed">{step.details}</p>
                </div>

                <div className="pt-4 border-t-2 border-black/20 space-y-2 text-xs font-bold">
                  <div className="text-black">
                    <span className="uppercase">Partner:</span> {step.partner}
                  </div>
                  <div className="text-neutral-900">
                    <span className="text-[#FF5C00] uppercase">Sugartown:</span> {step.sugartown}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 04. FOCO ECONOMICS WATERFALL */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="bento-pill bg-[#00D1FF] text-black">
              FINANCIAL ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
              FOCO Economics Waterfall
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 font-medium">
              Clear, transparent flow of monthly revenue from customer checkout to partner distribution.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3.5">
            {[
              {
                stage: '1. CUSTOMER SALES',
                desc: 'Gross retail sales generated from Live Candy Theater, pick-and-mix jars, lollipops, and corporate gifting.',
                badge: 'Gross Billed (100%)',
                color: 'bg-black text-white',
              },
              {
                stage: '2. RAW MATERIALS & COGS',
                desc: 'Food-grade sugars, natural flavors, colors, artisan sticks, custom glass jars, and branded packaging.',
                badge: 'Material Cost (~38%–40%)',
                color: 'bg-white text-black',
              },
              {
                stage: '3. STORE OPERATING EXPENSES',
                desc: 'Store retail rent, utilities (electricity/water), artisan staff wages, and mall maintenance charges.',
                badge: 'Direct Store OpEx',
                color: 'bg-[#F3F4F6] text-black',
              },
              {
                stage: '4. COMPANY FOCO MANAGEMENT FEE',
                desc: 'Sugartown corporate fee covering continuous chef training, central marketing, POS software, and quality auditing.',
                badge: 'Configurable (~8%)',
                color: 'bg-[#FFD100] text-black font-black',
              },
              {
                stage: '5. NET PARTNER RETURN',
                desc: 'Monthly net operating profit transferred directly to the franchise partner bank account with transparent POS reconciliation.',
                badge: 'Net Partner Earnings',
                color: 'bg-[#00FF66] text-black font-black',
              },
            ].map((flow) => (
              <div
                key={flow.stage}
                className={`p-4 sm:p-5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${flow.color} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
              >
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wide">{flow.stage}</h4>
                  <p className="text-xs font-semibold opacity-90 mt-1 max-w-lg">{flow.desc}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full border-2 border-black bg-white text-black font-black uppercase tracking-wider shrink-0 whitespace-nowrap">
                  {flow.badge}
                </span>
              </div>
            ))}
          </div>

          <Disclaimer type="financial" className="max-w-3xl mx-auto" />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 05. CTA */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h3 className="text-2xl sm:text-4xl font-black uppercase text-black">
          Ready to review the financial models?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/investment')}
            className="bento-btn-primary"
          >
            <span>View ₹25L & ₹50L Investment Formats</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/calculator')}
            className="bento-btn-secondary"
          >
            Open ROI Calculator
          </button>
        </div>
      </section>
    </div>
  );
};

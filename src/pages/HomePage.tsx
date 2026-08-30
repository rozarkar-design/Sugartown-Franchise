import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Store,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Gift,
  Flame,
  Calculator,
  Phone,
} from 'lucide-react';
import { InvestmentModel, City } from '../types';
import { Disclaimer } from '../components/Disclaimer';
import { formatIndianCurrency } from '../lib/calculator';

interface HomePageProps {
  onNavigate: (path: string, options?: { model?: string; city?: string }) => void;
  investmentModels: InvestmentModel[];
  cities: City[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  investmentModels,
  cities,
}) => {
  // Quick mini-calculator preview state
  const [miniRevenue, setMiniRevenue] = useState(1000000);
  const [miniInvestment, setMiniInvestment] = useState(2500000);
  const miniCogs = miniRevenue * 0.4;
  const miniGrossProfit = miniRevenue - miniCogs;
  const miniOpex = 300000;
  const miniFoco = miniRevenue * 0.08;
  const miniOther = 25000;
  const miniMonthlyProfit = miniGrossProfit - miniOpex - miniFoco - miniOther;
  const miniAnnualProfit = miniMonthlyProfit * 12;
  const miniRoi = ((miniAnnualProfit / miniInvestment) * 100).toFixed(1);
  const miniPayback =
    miniMonthlyProfit > 0
      ? (miniInvestment / miniMonthlyProfit).toFixed(1)
      : 'N/A';

  return (
    <div id="home-page-container" className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* ---------------------------------------------------- */}
      {/* 01. HERO BENTO GRID SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="home-hero-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Hero Card (8 Cols) */}
          <div className="lg:col-span-8 bento-card flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD100] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>FRANCHISE ACQUISITION & INVESTMENT PORTAL</span>
              </div>

              {/* Editorial Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-[1.1] uppercase">
                Build the Future of{' '}
                <span className="text-[#FF5C00]">
                  Live Candy Theater
                </span>{' '}
                with Sugartown.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-xl text-neutral-700 font-medium leading-relaxed max-w-2xl">
                Explore a high-margin experiential confectionery franchise powered by the{' '}
                <strong className="text-black font-black uppercase">FOCO model</strong> (Franchise Owned, Company Operated). Turnkey store engineering with 100% centralized company management.
              </p>
            </div>

            {/* CTAs & Below Hero Pillars */}
            <div className="space-y-6 pt-4 border-t-2 border-black/10">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  id="hero-explore-cta"
                  onClick={() => onNavigate('/foco')}
                  className="bento-btn-primary"
                >
                  <span>Explore FOCO Model</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  id="hero-calc-cta"
                  onClick={() => onNavigate('/calculator')}
                  className="bento-btn-secondary"
                >
                  <Calculator className="w-4 h-4 text-[#FF5C00]" />
                  <span>Calculate ROI & Payback</span>
                </button>
              </div>

              {/* Below Hero Pillars Display */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F3F4F6] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xl sm:text-2xl font-black text-black block">₹25L</span>
                  <span className="text-[10px] sm:text-xs text-neutral-600 font-black uppercase tracking-wider">Kiosk Model</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F3F4F6] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xl sm:text-2xl font-black text-black block">₹50L</span>
                  <span className="text-[10px] sm:text-xs text-neutral-600 font-black uppercase tracking-wider">Flagship Lounge</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFD100] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xl sm:text-2xl font-black text-black block">FOCO</span>
                  <span className="text-[10px] sm:text-xs text-black font-black uppercase tracking-wider">Company Run</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#00D1FF] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xl sm:text-2xl font-black text-black block">Pan-India</span>
                  <span className="text-[10px] sm:text-xs text-black font-black uppercase tracking-wider">Expansion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Bento Column (4 Cols): Theater Spotlight Card */}
          <div className="lg:col-span-4 bento-card-dark flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5C00] animate-pulse border border-white" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#FFD100]">
                    LIVE CANDY THEATER
                  </span>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full bg-white text-black font-black uppercase tracking-wider border-2 border-black">
                  PUNE HQ
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-snug mb-3">
                Where Confectionery Becomes an Immersive Show.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
                Sugartown blends handcrafted confectionery with live culinary showmanship, attracting massive organic footfall, high retention, and viral social sharing.
              </p>
            </div>

            {/* Experiential Highlights */}
            <div className="space-y-3 pt-4 border-t-2 border-white/20 text-xs font-bold">
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#FFD100] shrink-0" />
                <span>Live 150°C Sugar Pulling & Artisan Sculpting</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#FFD100] shrink-0" />
                <span>Personalized Monogram & Rock Candies</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#FFD100] shrink-0" />
                <span>High-Margin Corporate & Wedding Gifting</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t-2 border-white/20 text-xs">
              <span className="text-neutral-400 font-bold uppercase tracking-wider">Baner, Pune</span>
              <button
                onClick={() => onNavigate('/contact')}
                className="text-[#FFD100] hover:text-white font-black uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
              >
                <span>Visit HQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 02. BRAND PILLARS: BENTO TRIPLE CARDS */}
      {/* ---------------------------------------------------- */}
      <section id="brand-pillars-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
          <span className="bento-pill bg-[#FFD100] text-black">
            EXPERIENTIAL RETAIL INNOVATION
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
            More Than a Confectionery Store
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 font-medium">
            Sugartown disrupts the traditional sweet sector through three high-margin consumer pillars designed to maximize dwell time and basket size.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Live Candy Theater */}
          <div className="bento-card-interactive space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF5C00] border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Flame className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black uppercase text-black">Live Candy Theater</h3>
            <p className="text-sm text-neutral-700 font-medium leading-relaxed">
              Candy crafted and presented as an interactive live performance. Customers witness raw syrup transformed into intricate artisan rock candies right before their eyes.
            </p>
            <div className="pt-2 text-xs font-black uppercase tracking-wider text-[#FF5C00] flex items-center gap-1">
              <span>Captivates All Age Groups</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Experiential Retail */}
          <div className="bento-card-interactive space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFD100] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black uppercase text-black">Experiential Retail</h3>
            <p className="text-sm text-neutral-700 font-medium leading-relaxed">
              Transform confectionery into entertainment, sensory aroma, and high customer engagement. Creates compelling reasons for repeat mall visits and weekend crowds.
            </p>
            <div className="pt-2 text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
              <span>Destination Footfall Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Premium Gifting */}
          <div className="bento-card-interactive space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00D1FF] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black uppercase text-black">Premium Gifting</h3>
            <p className="text-sm text-neutral-700 font-medium leading-relaxed">
              Create high-ticket B2B and B2C revenue streams through bespoke wedding favors, corporate celebration boxes, festival hampers, and customized monogram confectionery.
            </p>
            <div className="pt-2 text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
              <span>High Average Order Value</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('/foco')}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black hover:text-[#FF5C00] underline underline-offset-4 cursor-pointer"
          >
            <span>Discover the complete Sugartown operating ecosystem</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 03. FOCO SNAPSHOT VISUAL BENTO FLOW */}
      {/* ---------------------------------------------------- */}
      <section id="foco-snapshot-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card-dark space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bento-pill bg-[#FF5C00] text-white">
              THE BUSINESS MODEL
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Franchise Owned. Company Operated.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-medium">
              The partner supplies capital and retains 100% franchise ownership. Sugartown deploys certified candy artisans, supply chain, and daily store operations.
            </p>
          </div>

          {/* Visual Step-by-Step Waterfall Flow in Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
            {[
              {
                step: '01',
                title: 'FRANCHISE PARTNER',
                desc: 'Invests capital & owns unit asset',
                color: 'bg-white text-black',
              },
              {
                step: '02',
                title: 'INVESTMENT',
                desc: 'Turnkey setup in ₹25L or ₹50L',
                color: 'bg-[#FFD100] text-black',
              },
              {
                step: '03',
                title: 'SUGARTOWN STORE',
                desc: 'Live Theater & prime retail build',
                color: 'bg-white text-black',
              },
              {
                step: '04',
                title: 'OPERATIONS',
                desc: '100% managed by Sugartown HQ',
                color: 'bg-[#FF5C00] text-white',
              },
              {
                step: '05',
                title: 'CUSTOMER EXP.',
                desc: 'Theatrical pulling & gifting',
                color: 'bg-[#00D1FF] text-black',
              },
              {
                step: '06',
                title: 'PERFORMANCE',
                desc: 'Automated transparent returns',
                color: 'bg-[#00FF66] text-black',
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)] flex flex-col justify-between ${item.color}`}
              >
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block mb-1">
                    STEP {item.step}
                  </span>
                  <h4 className="text-xs font-black uppercase tracking-wide">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[11px] font-semibold mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-white/20">
            <div className="flex items-center gap-2 text-xs text-neutral-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#FFD100]" />
              <span>Full cloud POS access with daily revenue transparency.</span>
            </div>

            <button
              onClick={() => onNavigate('/foco')}
              className="bento-btn-primary"
            >
              <span>Understand the FOCO Model</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 04. INVESTMENT SNAPSHOT: ₹25L & ₹50L CARDS */}
      {/* ---------------------------------------------------- */}
      <section id="investment-snapshot-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="bento-pill bg-[#00D1FF] text-black">
            STANDARDIZED FORMATS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
            Choose Your Investment Format
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 font-medium">
            Two turnkey business models tailored for high-density retail atriums and destination lifestyle malls.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {investmentModels.map((model) => (
            <div
              key={model.id}
              id={`investment-card-${model.code.toLowerCase()}`}
              className="bento-card flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFD100] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {model.tag}
                  </span>
                  <span className="text-xs text-neutral-600 font-bold uppercase tracking-wider">Area: {model.area_sqft}</span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl sm:text-5xl font-black text-black tracking-tight">
                    {formatIndianCurrency(model.total_investment)}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-500">Turnkey Total</span>
                </div>

                <h3 className="text-xl font-black uppercase text-black mb-2">{model.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed mb-6">
                  {model.description}
                </p>

                {/* Major Cost Categories Preview */}
                <div className="space-y-2 pt-4 border-t-2 border-black/10">
                  <h5 className="text-[11px] font-black uppercase tracking-wider text-neutral-500">
                    Includes Turnkey Package:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-neutral-800">
                    {model.components.slice(0, 6).map((c) => (
                      <div key={c.id} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                        <span className="truncate">{c.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-black/10 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('/investment', { model: model.code })}
                  className="w-full bento-btn-dark"
                >
                  <span>View {model.code} Detailed Breakup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 05. CALCULATOR PREVIEW (BENTO CARD) */}
      {/* ---------------------------------------------------- */}
      <section id="calculator-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="bento-pill bg-[#FFD100] text-black">
              INTERACTIVE FINTECH MODEL
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
              What Could Your Investment Look Like?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 font-medium">
              Test indicative revenue and profit benchmarks. Use our complete calculator for 5-year projections and sensitivity charts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Quick Inputs (5 Cols) */}
            <div className="lg:col-span-5 bg-[#F3F4F6] p-5 sm:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-black block mb-2">
                  Investment Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMiniInvestment(2500000)}
                    className={`py-2.5 px-3 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                      miniInvestment === 2500000
                        ? 'bg-[#FF5C00] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    ₹25L (Kiosk)
                  </button>
                  <button
                    onClick={() => setMiniInvestment(5000000)}
                    className={`py-2.5 px-3 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                      miniInvestment === 5000000
                        ? 'bg-[#FF5C00] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    ₹50L (Flagship)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black mb-1">
                  <span>Indicative Monthly Revenue</span>
                  <span className="text-[#FF5C00] font-black">{formatIndianCurrency(miniRevenue)}</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={3000000}
                  step={50000}
                  value={miniRevenue}
                  onChange={(e) => setMiniRevenue(Number(e.target.value))}
                  className="w-full accent-[#FF5C00] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase mt-1">
                  <span>₹5L/mo</span>
                  <span>₹15L/mo</span>
                  <span>₹30L/mo</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-bold text-neutral-700 space-y-1">
                <div className="flex justify-between">
                  <span>Gross Margin:</span>
                  <strong className="text-black">60% (COGS ~40%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Est. Monthly OpEx:</span>
                  <strong className="text-black">{formatIndianCurrency(miniOpex)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>FOCO Fee:</span>
                  <strong className="text-black">8% of Revenue</strong>
                </div>
              </div>
            </div>

            {/* Quick Results (7 Cols) in Bento Blocks */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1">
                  Monthly Profit
                </span>
                <span className="text-lg sm:text-xl font-black text-black block">
                  {formatIndianCurrency(miniMonthlyProfit)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#00FF66] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-wider text-black block mb-1">
                  Annual Profit
                </span>
                <span className="text-lg sm:text-xl font-black text-black block">
                  {formatIndianCurrency(miniAnnualProfit)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFD100] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-wider text-black block mb-1">
                  Indicative ROI
                </span>
                <span className="text-lg sm:text-xl font-black text-black block">
                  {miniRoi}%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#00D1FF] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-wider text-black block mb-1">
                  Est. Payback
                </span>
                <span className="text-lg sm:text-xl font-black text-black block">
                  {miniPayback} {miniPayback !== 'N/A' ? 'mo' : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-black/10">
            <Disclaimer type="financial" className="max-w-2xl text-[11px]" />
            <button
              onClick={() => onNavigate('/calculator')}
              className="bento-btn-primary whitespace-nowrap shrink-0"
            >
              <span>Open ROI Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 06. INDIA EXPANSION PREVIEW */}
      {/* ---------------------------------------------------- */}
      <section id="india-expansion-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="bento-pill bg-[#FFD100] text-black">
              PAN-INDIA TERRITORIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight mt-2">
              Taking Sugartown Across India
            </h2>
            <p className="text-sm text-neutral-700 font-medium mt-1">
              Active exploration across Tier 1, Tier 2, and Tier 3 high-consumption hubs.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/india-expansion')}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black hover:text-[#FF5C00] cursor-pointer"
          >
            <span>Explore All {cities.length} City Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured City Cards in Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cities.slice(0, 4).map((city) => (
            <div
              key={city.id}
              onClick={() => onNavigate('/india-expansion')}
              className="bento-card-interactive space-y-3 p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFD100] border border-black text-black">
                  {city.tier}
                </span>
                <span
                  className={`text-[11px] font-black uppercase tracking-wider ${
                    city.status === 'Existing'
                      ? 'text-[#FF5C00]'
                      : city.status === 'Priority'
                      ? 'text-blue-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {city.status}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black uppercase text-black">{city.city_name}</h4>
                <span className="text-xs text-neutral-600 font-bold uppercase">{city.state}</span>
              </div>

              <p className="text-xs text-neutral-700 font-medium line-clamp-2">{city.market_notes}</p>

              <div className="pt-2 border-t-2 border-black/10 flex items-center justify-between text-xs font-black uppercase tracking-wider text-black">
                <span>View Territory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 07. FINAL CTA BANNER */}
      {/* ---------------------------------------------------- */}
      <section id="home-final-cta-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card-dark text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="bento-pill bg-[#FF5C00] text-white">
              PARTNER WITH SUGARTOWN
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              Your City Could Be Sugartown&apos;s Next Story.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-medium">
              Submit your inquiry to reserve your exclusive city territory or speak directly with our franchise expansion directors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="final-apply-cta-btn"
              onClick={() => onNavigate('/inquiry')}
              className="bento-btn-primary"
            >
              <span>Apply for Franchise</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('/calculator')}
              className="bento-btn-secondary"
            >
              Calculate Custom ROI
            </button>

            <a
              href="tel:9145448010"
              className="px-6 py-3.5 rounded-full text-white font-black text-xs uppercase tracking-wider border-2 border-white/40 hover:border-white transition-all inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#FFD100]" />
              <span>Call 9145448010</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

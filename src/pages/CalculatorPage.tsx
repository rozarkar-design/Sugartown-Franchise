import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator as CalcIcon,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon,
  DollarSign,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  CalculatorState,
  RoiAssumptions,
  InvestmentModel,
} from '../types';
import {
  calculateFranchiseRoi,
  formatIndianCurrency,
  formatIndianLakhs,
} from '../lib/calculator';
import { Disclaimer } from '../components/Disclaimer';

interface CalculatorPageProps {
  investmentModels: InvestmentModel[];
  assumptions: RoiAssumptions[];
  onNavigate: (path: string, options?: { model?: string }) => void;
  initialModel?: string;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  investmentModels,
  assumptions,
  onNavigate,
  initialModel = '25L',
}) => {
  // Model selection state
  const [selectedModel, setSelectedModel] = useState<'25L' | '50L' | 'custom'>(
    (initialModel as any) || '25L'
  );

  // Active chart view tab
  const [activeChartTab, setActiveChartTab] = useState<'revenue' | 'profit' | 'cumulative' | 'breakdown'>('revenue');

  // Find defaults from database assumptions
  const default25L = assumptions.find((a) => a.model_code === '25L') || {
    default_monthly_revenue: 1000000,
    default_cogs_percent: 40,
    default_operating_expenses: 300000,
    default_foco_percent: 8,
    default_foco_fixed: 0,
    foco_mode: 'percentage' as const,
    default_other_costs: 25000,
    default_annual_growth_percent: 10,
    tax_percent: 0,
  };

  const default50L = assumptions.find((a) => a.model_code === '50L') || {
    default_monthly_revenue: 1800000,
    default_cogs_percent: 38,
    default_operating_expenses: 520000,
    default_foco_percent: 8,
    default_foco_fixed: 0,
    foco_mode: 'percentage' as const,
    default_other_costs: 40000,
    default_annual_growth_percent: 12,
    tax_percent: 0,
  };

  // Main state
  const [calcState, setCalcState] = useState<CalculatorState>({
    investmentModel: selectedModel,
    initialInvestment: selectedModel === '50L' ? 5000000 : 2500000,
    monthlyRevenue: selectedModel === '50L' ? default50L.default_monthly_revenue : default25L.default_monthly_revenue,
    cogsMode: 'percentage',
    cogsPercent: selectedModel === '50L' ? default50L.default_cogs_percent : default25L.default_cogs_percent,
    cogsFixed: 0,
    operatingExpenses: selectedModel === '50L' ? default50L.default_operating_expenses : default25L.default_operating_expenses,
    focoMode: 'percentage',
    focoPercent: selectedModel === '50L' ? default50L.default_foco_percent : default25L.default_foco_percent,
    focoFixed: 0,
    otherCosts: selectedModel === '50L' ? default50L.default_other_costs : default25L.default_other_costs,
    annualGrowth: selectedModel === '50L' ? default50L.default_annual_growth_percent : default25L.default_annual_growth_percent,
    taxPercent: 0,
  });

  // Handle switching preset models
  const handleModelChange = (model: '25L' | '50L' | 'custom') => {
    setSelectedModel(model);
    if (model === '25L') {
      setCalcState({
        investmentModel: '25L',
        initialInvestment: 2500000,
        monthlyRevenue: default25L.default_monthly_revenue,
        cogsMode: 'percentage',
        cogsPercent: default25L.default_cogs_percent,
        cogsFixed: 0,
        operatingExpenses: default25L.default_operating_expenses,
        focoMode: 'percentage',
        focoPercent: default25L.default_foco_percent,
        focoFixed: 0,
        otherCosts: default25L.default_other_costs,
        annualGrowth: default25L.default_annual_growth_percent,
        taxPercent: 0,
      });
    } else if (model === '50L') {
      setCalcState({
        investmentModel: '50L',
        initialInvestment: 5000000,
        monthlyRevenue: default50L.default_monthly_revenue,
        cogsMode: 'percentage',
        cogsPercent: default50L.default_cogs_percent,
        cogsFixed: 0,
        operatingExpenses: default50L.default_operating_expenses,
        focoMode: 'percentage',
        focoPercent: default50L.default_foco_percent,
        focoFixed: 0,
        otherCosts: default50L.default_other_costs,
        annualGrowth: default50L.default_annual_growth_percent,
        taxPercent: 0,
      });
    } else {
      setCalcState((prev) => ({ ...prev, investmentModel: 'custom' }));
    }
  };

  // Perform calculation
  const results = useMemo(() => {
    return calculateFranchiseRoi(calcState);
  }, [calcState]);

  // Donut chart data for monthly cost & profit allocation
  const monthlyCostBreakdownData = useMemo(() => {
    const data = [
      { name: 'COGS / Materials', value: results.monthlyCogs, color: '#64748B' },
      { name: 'Operating Expenses', value: calcState.operatingExpenses, color: '#0284C7' },
      { name: 'FOCO Management Fee', value: results.focoCharge, color: '#D97706' },
      { name: 'Other Costs', value: calcState.otherCosts, color: '#A855F7' },
    ];
    if (results.monthlyOperatingProfit > 0) {
      data.push({
        name: 'Net Partner Profit',
        value: results.monthlyOperatingProfit,
        color: '#FC3D00',
      });
    }
    return data;
  }, [results, calcState]);

  return (
    <div id="roi-calculator-page-container" className="space-y-12 sm:space-y-16 py-8 sm:py-12 pb-24">
      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="bento-pill bg-[#FFD100] text-black">
          <CalcIcon className="w-4 h-4" />
          <span>UNIT ECONOMICS SIMULATOR</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
          Calculate Your Sugartown Potential
        </h1>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-2xl mx-auto leading-relaxed">
          Test variable monthly sales volumes, cost assumptions, and compound 5-year ROI forecasts under the Sugartown FOCO structure.
        </p>

        {/* Model Presets Selector */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] gap-1">
            <button
              id="calc-preset-25l"
              onClick={() => handleModelChange('25L')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                selectedModel === '25L'
                  ? 'bg-[#FF5C00] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              ₹25L Kiosk
            </button>
            <button
              id="calc-preset-50l"
              onClick={() => handleModelChange('50L')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                selectedModel === '50L'
                  ? 'bg-[#FF5C00] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              ₹50L Flagship
            </button>
            <button
              id="calc-preset-custom"
              onClick={() => handleModelChange('custom')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                selectedModel === 'custom'
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              Custom
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* MAIN CALCULATOR GRID: INPUTS (5 Cols) + RESULTS (7 Cols) */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================================================= */}
          {/* INPUTS COLUMN (5 COLS) */}
          {/* ================================================= */}
          <div className="lg:col-span-5 bento-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
              <h3 className="text-base font-black uppercase text-black">
                Operating Parameters
              </h3>
              <button
                onClick={() => handleModelChange(selectedModel)}
                className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1 uppercase"
                title="Reset to official benchmark defaults"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Initial Investment */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black">
                <span>Initial Capital (₹)</span>
                <span className="text-[#FF5C00] font-black">
                  {formatIndianCurrency(calcState.initialInvestment)}
                </span>
              </div>
              <input
                id="input-initial-investment"
                type="number"
                min={500000}
                max={20000000}
                step={100000}
                value={calcState.initialInvestment}
                onChange={(e) =>
                  setCalcState((prev) => ({
                    ...prev,
                    initialInvestment: Number(e.target.value),
                    investmentModel: 'custom',
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            {/* Monthly Revenue Input & Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black">
                <span>Projected Monthly Revenue</span>
                <span className="text-black text-sm font-black bg-[#FFD100] px-2 py-0.5 rounded-md border border-black">
                  {formatIndianCurrency(calcState.monthlyRevenue)}
                </span>
              </div>
              <input
                id="input-monthly-revenue-slider"
                type="range"
                min={300000}
                max={4000000}
                step={50000}
                value={calcState.monthlyRevenue}
                onChange={(e) =>
                  setCalcState((prev) => ({
                    ...prev,
                    monthlyRevenue: Number(e.target.value),
                  }))
                }
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-600 font-bold uppercase">
                <span>₹3L</span>
                <span>₹15L</span>
                <span>₹40L</span>
              </div>
            </div>

            {/* COGS & Gross Margin */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black">
                <span>Cost of Goods Sold (COGS %)</span>
                <span className="text-black font-black">{calcState.cogsPercent}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="input-cogs-percent"
                  type="range"
                  min={25}
                  max={60}
                  step={1}
                  value={calcState.cogsPercent}
                  onChange={(e) =>
                    setCalcState((prev) => ({
                      ...prev,
                      cogsPercent: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-black cursor-pointer"
                />
                <span className="text-xs font-black text-black bg-[#00FF66] px-2 py-0.5 rounded-md border border-black shrink-0">
                  {100 - calcState.cogsPercent}% GM
                </span>
              </div>
              <span className="text-[11px] text-neutral-600 font-bold block">
                Calculated Monthly COGS: {formatIndianCurrency(results.monthlyCogs)}
              </span>
            </div>

            {/* Operating Expenses (OpEx) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black">
                <span>Monthly Store OpEx (₹)</span>
                <span className="text-black font-black">
                  {formatIndianCurrency(calcState.operatingExpenses)}
                </span>
              </div>
              <input
                id="input-operating-expenses"
                type="number"
                min={50000}
                max={1500000}
                step={10000}
                value={calcState.operatingExpenses}
                onChange={(e) =>
                  setCalcState((prev) => ({
                    ...prev,
                    operatingExpenses: Number(e.target.value),
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <span className="text-[11px] text-neutral-600 font-medium block">
                Includes retail lease, utility power, artisan wages, and mall maintenance.
              </span>
            </div>

            {/* FOCO Management Fee */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black">
                <span>FOCO Management Fee (%)</span>
                <span className="text-[#FF5C00] font-black">{calcState.focoPercent}%</span>
              </div>
              <input
                id="input-foco-percent"
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={calcState.focoPercent}
                onChange={(e) =>
                  setCalcState((prev) => ({
                    ...prev,
                    focoPercent: Number(e.target.value),
                  }))
                }
                className="w-full accent-black cursor-pointer"
              />
              <span className="text-[11px] text-neutral-600 font-bold block">
                Monthly FOCO Fee: {formatIndianCurrency(results.focoCharge)}
              </span>
            </div>

            {/* Other Costs & Annual Growth */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-black block">
                  Other Costs (₹)
                </label>
                <input
                  id="input-other-costs"
                  type="number"
                  min={0}
                  max={200000}
                  step={5000}
                  value={calcState.otherCosts}
                  onChange={(e) =>
                    setCalcState((prev) => ({
                      ...prev,
                      otherCosts: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-black block">
                  Growth Rate (%)
                </label>
                <input
                  id="input-annual-growth"
                  type="number"
                  min={0}
                  max={50}
                  step={1}
                  value={calcState.annualGrowth}
                  onChange={(e) =>
                    setCalcState((prev) => ({
                      ...prev,
                      annualGrowth: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* RESULTS & CHARTS COLUMN (7 COLS) */}
          {/* ================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top 4 Metric Result Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Monthly Profit */}
              <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                  Est. Monthly Profit
                </span>
                <span
                  className={`text-lg sm:text-xl font-black block ${
                    results.monthlyOperatingProfit > 0
                      ? 'text-black'
                      : 'text-rose-600'
                  }`}
                >
                  {formatIndianCurrency(results.monthlyOperatingProfit)}
                </span>
                <span className="text-[10px] text-black font-bold uppercase tracking-wider block">
                  {results.grossMarginPercent}% Gross Margin
                </span>
              </div>

              {/* Annual Profit */}
              <div className="p-4 rounded-2xl bg-[#00FF66] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800 block">
                  Est. Annual Profit
                </span>
                <span
                  className={`text-lg sm:text-xl font-black block text-black`}
                >
                  {formatIndianCurrency(results.annualOperatingProfit)}
                </span>
                <span className="text-[10px] text-neutral-900 font-bold uppercase tracking-wider block">
                  Rev: {formatIndianLakhs(results.annualRevenue)}/yr
                </span>
              </div>

              {/* Indicative ROI */}
              <div className="p-4 rounded-2xl bg-[#FFD100] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800 block">
                  Indicative ROI
                </span>
                <span
                  className={`text-lg sm:text-xl font-black block text-black`}
                >
                  {results.roiPercent}%
                </span>
                <span className="text-[10px] text-neutral-800 font-bold uppercase tracking-wider block">Annualized</span>
              </div>

              {/* Payback Months */}
              <div className="p-4 rounded-2xl bg-[#00D1FF] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800 block">
                  Est. Payback
                </span>
                <span className="text-lg sm:text-xl font-black text-black block">
                  {results.paybackMonths !== null ? `${results.paybackMonths} mo` : 'N/A'}
                </span>
                <span className="text-[10px] text-neutral-900 font-bold uppercase tracking-wider block">
                  {results.paybackMonths !== null
                    ? `~${(results.paybackMonths / 12).toFixed(1)} yrs`
                    : 'Unattainable'}
                </span>
              </div>
            </div>

            {/* Payback Warning Alert if operating profit <= 0 */}
            {results.paybackMonths === null && (
              <div className="p-4 rounded-2xl bg-[#FFD100] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-black shrink-0" />
                <span>
                  <strong>Notice:</strong> Payback period unavailable under current assumptions because monthly operating profit is negative or zero. Adjust revenue or reduce expenses.
                </span>
              </div>
            )}

            {/* Interactive Charts Card */}
            <div className="bento-card space-y-4">
              {/* Chart Tab Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black/10">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveChartTab('revenue')}
                    className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                      activeChartTab === 'revenue'
                        ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    5-Yr Revenue
                  </button>
                  <button
                    onClick={() => setActiveChartTab('profit')}
                    className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                      activeChartTab === 'profit'
                        ? 'bg-[#00FF66] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    Annual Profit
                  </button>
                  <button
                    onClick={() => setActiveChartTab('cumulative')}
                    className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                      activeChartTab === 'cumulative'
                        ? 'bg-[#00D1FF] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    Cumulative Return
                  </button>
                  <button
                    onClick={() => setActiveChartTab('breakdown')}
                    className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                      activeChartTab === 'breakdown'
                        ? 'bg-[#FFD100] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    Cost Distribution
                  </button>
                </div>
                <span className="text-[11px] text-neutral-600 font-bold uppercase">Simulation Engine</span>
              </div>

              {/* Chart Visualizations */}
              <div className="h-64 sm:h-72 w-full pt-2">
                {/* Chart 1: Revenue Line */}
                {activeChartTab === 'revenue' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.projections} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tickFormatter={(yr) => `Yr ${yr}`} fontSize={11} stroke="#000000" fontWeight="bold" />
                      <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} fontSize={11} stroke="#000000" fontWeight="bold" />
                      <Tooltip formatter={(val: any) => [formatIndianCurrency(Number(val)), 'Annual Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#FF5C00" strokeWidth={4} dot={{ r: 6, fill: '#000000', stroke: '#FF5C00', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {/* Chart 2: Profit Bar */}
                {activeChartTab === 'profit' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.projections} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tickFormatter={(yr) => `Yr ${yr}`} fontSize={11} stroke="#000000" fontWeight="bold" />
                      <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} fontSize={11} stroke="#000000" fontWeight="bold" />
                      <Tooltip formatter={(val: any) => [formatIndianCurrency(Number(val)), 'Annual Operating Profit']} />
                      <Bar dataKey="operatingProfit" fill="#00FF66" stroke="#000000" strokeWidth={2} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {/* Chart 3: Cumulative Line */}
                {activeChartTab === 'cumulative' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.projections} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tickFormatter={(yr) => `Yr ${yr}`} fontSize={11} stroke="#000000" fontWeight="bold" />
                      <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} fontSize={11} stroke="#000000" fontWeight="bold" />
                      <Tooltip formatter={(val: any) => [formatIndianCurrency(Number(val)), 'Cumulative Profit']} />
                      <Line type="monotone" dataKey="cumulativeProfit" stroke="#00D1FF" strokeWidth={4} dot={{ r: 6, fill: '#000000', stroke: '#00D1FF', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {/* Chart 4: Monthly Cost Breakdown Donut */}
                {activeChartTab === 'breakdown' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={monthlyCostBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="#000000"
                        strokeWidth={2}
                      >
                        {monthlyCostBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: any) => formatIndianCurrency(Number(val))} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* 5-Year Projection Summary Table */}
            <div className="bento-card p-0 overflow-hidden">
              <div className="p-4 bg-[#F3F4F6] border-b-2 border-black flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-black">
                  5-Year Compound Financial Projection
                </h4>
                <span className="text-[11px] text-black font-bold uppercase bg-[#FFD100] px-2.5 py-0.5 rounded-full border border-black">
                  Growth: {calcState.annualGrowth}% p.a.
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead className="bg-[#F3F4F6] border-b-2 border-black text-black font-black uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Year</th>
                      <th className="py-2.5 px-4 text-right">Annual Revenue</th>
                      <th className="py-2.5 px-4 text-right">Annual Profit</th>
                      <th className="py-2.5 px-4 text-right">Cumulative Return</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black/10 text-neutral-900">
                    {results.projections.map((proj) => (
                      <tr key={proj.year} className="hover:bg-neutral-50">
                        <td className="py-2.5 px-4 font-black uppercase text-black">Year {proj.year}</td>
                        <td className="py-2.5 px-4 text-right font-bold">
                          {formatIndianCurrency(proj.revenue)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-black text-emerald-800">
                          {formatIndianCurrency(proj.operatingProfit)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-black text-black">
                          {formatIndianCurrency(proj.cumulativeProfit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 03. LEAD CAPTURE TRANSITION SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card-dark flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bento-pill bg-[#FF5C00] text-white">
              NEXT STEP IN DISCOVERY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              Want to discuss this opportunity with Sugartown?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-medium max-w-xl">
              Connect with our franchise expansion directors to explore approved city locations, commercial lease options, and site viability.
            </p>
          </div>

          <button
            id="talk-to-franchise-team-btn"
            onClick={() =>
              onNavigate('/inquiry', {
                model:
                  selectedModel === '50L'
                    ? 'Flagship Experiential Lounge (₹50L)'
                    : 'Express Kiosk & High-Street Boutique (₹25L)',
              })
            }
            className="bento-btn-primary whitespace-nowrap shrink-0"
          >
            <span>Talk to Franchise Team</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Financial Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Disclaimer type="financial" />
      </section>
    </div>
  );
};

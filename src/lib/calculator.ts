import { CalculatorState, CalculationResult, YearlyProjection } from '../types';

export function calculateFranchiseRoi(state: CalculatorState): CalculationResult {
  const revenue = Math.max(0, state.monthlyRevenue || 0);
  const investment = Math.max(1, state.initialInvestment || 1);

  // 1. COGS
  let monthlyCogs = 0;
  if (state.cogsMode === 'percentage') {
    monthlyCogs = revenue * ((state.cogsPercent || 0) / 100);
  } else {
    monthlyCogs = Math.max(0, state.cogsFixed || 0);
  }

  // 2. Gross Profit & Margin
  const grossProfit = Math.max(0, revenue - monthlyCogs);
  const grossMarginPercent = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  // 3. FOCO / Management Fee
  let focoCharge = 0;
  if (state.focoMode === 'percentage') {
    focoCharge = revenue * ((state.focoPercent || 0) / 100);
  } else {
    focoCharge = Math.max(0, state.focoFixed || 0);
  }

  // 4. Monthly Operating Profit
  const opex = Math.max(0, state.operatingExpenses || 0);
  const other = Math.max(0, state.otherCosts || 0);
  const monthlyOperatingProfit = grossProfit - opex - focoCharge - other;

  // 5. Annual Figures
  const annualRevenue = revenue * 12;
  const annualOperatingProfit = monthlyOperatingProfit * 12;

  // 6. ROI %
  const roiPercent = investment > 0 ? (annualOperatingProfit / investment) * 100 : 0;

  // 7. Payback Period in Months
  let paybackMonths: number | null = null;
  let paybackNote: string | undefined = undefined;

  if (monthlyOperatingProfit <= 0) {
    paybackMonths = null;
    paybackNote = 'Payback period unavailable under current assumptions.';
  } else {
    const rawMonths = investment / monthlyOperatingProfit;
    paybackMonths = Math.round(rawMonths * 10) / 10;
  }

  // 8. 5-Year Projection
  const growthRate = (state.annualGrowth || 0) / 100;
  const projections: YearlyProjection[] = [];
  let cumulativeProfit = 0;

  for (let year = 1; year <= 5; year++) {
    const yearMultiplier = Math.pow(1 + growthRate, year - 1);
    const yrRevenue = annualRevenue * yearMultiplier;
    
    // Scale COGS and FOCO with revenue
    const yrCogs = state.cogsMode === 'percentage'
      ? yrRevenue * ((state.cogsPercent || 0) / 100)
      : monthlyCogs * 12 * Math.pow(1 + growthRate * 0.5, year - 1);
    
    const yrGrossProfit = Math.max(0, yrRevenue - yrCogs);
    
    // Assume moderate 4% annual inflation on fixed operating expenses
    const opexMultiplier = Math.pow(1 + 0.04, year - 1);
    const yrOpex = opex * 12 * opexMultiplier;
    
    const yrFoco = state.focoMode === 'percentage'
      ? yrRevenue * ((state.focoPercent || 0) / 100)
      : focoCharge * 12;
    
    const yrOther = other * 12 * opexMultiplier;
    const yrOperatingProfit = yrGrossProfit - yrOpex - yrFoco - yrOther;
    
    cumulativeProfit += yrOperatingProfit;

    projections.push({
      year,
      revenue: Math.round(yrRevenue),
      cogs: Math.round(yrCogs),
      grossProfit: Math.round(yrGrossProfit),
      operatingExpenses: Math.round(yrOpex),
      focoCharge: Math.round(yrFoco),
      otherCosts: Math.round(yrOther),
      operatingProfit: Math.round(yrOperatingProfit),
      cumulativeProfit: Math.round(cumulativeProfit),
      roi: Math.round(((yrOperatingProfit / investment) * 100) * 10) / 10,
    });
  }

  return {
    monthlyRevenue: Math.round(revenue),
    monthlyCogs: Math.round(monthlyCogs),
    grossProfit: Math.round(grossProfit),
    grossMarginPercent: Math.round(grossMarginPercent * 10) / 10,
    focoCharge: Math.round(focoCharge),
    monthlyOperatingProfit: Math.round(monthlyOperatingProfit),
    annualOperatingProfit: Math.round(annualOperatingProfit),
    annualRevenue: Math.round(annualRevenue),
    roiPercent: Math.round(roiPercent * 10) / 10,
    paybackMonths,
    paybackNote,
    projections,
  };
}

export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const abs = Math.abs(Math.round(amount));

  // If in Lakhs/Crores shorthand
  const str = abs.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatIndianLakhs(amount: number): string {
  const lakhs = amount / 100000;
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return `₹${cr.toFixed(2)} Cr`;
  }
  return `₹${lakhs.toFixed(1)} Lakh`;
}

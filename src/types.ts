export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'follow_up'
  | 'site_evaluation'
  | 'approved'
  | 'converted'
  | 'lost';

export type LoiStatus =
  | 'submitted'
  | 'under_review'
  | 'customized_terms_sent'
  | 'investor_approved'
  | 'investor_countered'
  | 'territory_reserved'
  | 'agreement_sent'
  | 'approved'
  | 'rejected'
  | 'due_diligence'
  | 'site_allocated'
  | 'declined';

export interface FranchiseLoi {
  id: string;
  loi_number: string;
  // Investor Personal & Entity Details
  full_name: string;
  entity_type: 'individual' | 'sole_proprietorship' | 'llp' | 'private_limited' | 'partnership';
  entity_name?: string;
  pan_number?: string;
  aadhaar_or_id?: string;
  email: string;
  phone: string;
  whatsapp: string;
  current_address: string;
  current_city: string;
  current_state: string;
  pin_code?: string;
  profession_background: string;
  existing_business_details?: string;

  // Franchise & Commercial Preferences
  investment_model: string; // '25L' | '50L' | 'custom'
  investment_amount_committed: number; // e.g. 2500000 or 5000000
  target_city: string;
  target_state: string;
  preferred_location: string;
  site_status: 'owned' | 'leased' | 'identifying' | 'request_hq_selection';
  proposed_carpet_area_sqft?: number;
  source_of_funds: 'self_liquid' | 'partnership' | 'bank_loan' | 'family_office';
  target_launch_timeline: '30_days' | '45_days' | '60_days' | '90_days';

  // Declarations & Acceptance
  accepts_foco_model: boolean;
  accepts_confidentiality_nda: boolean;
  accepts_commercial_terms: boolean;
  territory_exclusivity_requested?: boolean;
  signatory_name: string;
  signatory_title?: string;
  submission_date: string;
  ip_address?: string;

  // Customized Terms & Conditions by HQ
  custom_terms?: string[];
  custom_terms_notes?: string;
  custom_royalty_percentage?: number;
  custom_foco_payout_terms?: string;
  territory_exclusivity_days?: number;
  special_rebates_or_support?: string;

  // Revisions & Modification Tracking
  revision_number?: number;
  modified_at?: string;
  modified_by?: string;

  // Investor Approval & Resubmission Tracking
  investor_approval_status?: 'pending' | 'approved' | 'counter_requested';
  investor_approved_at?: string;
  investor_approval_notes?: string;
  investor_signature_name?: string;
  investor_approval_ip?: string;

  // Internal CRM & Admin Tracking
  status: LoiStatus;
  admin_notes?: string;
  assigned_manager?: string;
  site_evaluation_date?: string;
  agreement_draft_sent?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  full_name: string;
  mobile?: string;
  phone?: string;
  email: string;
  city?: string;
  current_city?: string;
  state?: string;
  profession?: string;
  investment_capacity?: string;
  investment_budget?: string;
  preferred_city: string;
  preferred_state?: string;
  business_experience?: boolean;
  background_experience?: string;
  location_details?: string;
  launch_timeline?: string;
  business_type?: string;
  experience_years?: number;
  preferred_format?: string;
  message?: string;
  whatsapp?: string;
  consent: boolean;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  status: any;
  assigned_to?: string;
  internal_notes?: string;
  notes?: LeadNote[];
  created_at: string;
  updated_at?: string;
}

export type FranchiseLead = Lead;

export interface LeadNote {
  id: string;
  lead_id: string;
  author: string;
  note: string;
  created_at: string;
}

export interface InvestmentModel {
  id: string;
  code: '25L' | '50L';
  title: string;
  tag: string;
  total_investment: number;
  store_format: string;
  area_sqft: string;
  display_order: number;
  description: string;
  active: boolean;
  components: InvestmentComponent[];
  created_at?: string;
  updated_at?: string;
}

export type ComponentStatus = 'included' | 'configurable' | 'not_disclosed';

export interface InvestmentComponent {
  id: string;
  model_id: string;
  category: string;
  name: string;
  amount: number;
  percentage?: number;
  display_order: number;
  status: ComponentStatus;
  notes?: string;
}

export interface RoiAssumptions {
  id: string;
  model_id: string;
  model_code: '25L' | '50L' | 'custom';
  default_monthly_revenue: number;
  default_cogs_percent: number;
  default_operating_expenses: number;
  default_foco_percent: number;
  default_foco_fixed: number;
  foco_mode: 'percentage' | 'fixed';
  default_other_costs: number;
  default_annual_growth_percent: number;
  tax_percent: number;
  updated_at: string;
  updated_by: string;
}

export type CityTier = 'Tier 1' | 'Tier 2' | 'Tier 3';
export type CityStatus = 'Available' | 'Priority' | 'Under Evaluation' | 'Existing';

export interface City {
  id: string;
  city_name: string;
  state: string;
  tier: CityTier;
  latitude: number;
  longitude: number;
  status: CityStatus;
  priority: number;
  investment_model: string;
  market_notes: string;
  suggested_format: string;
  territory_available: boolean;
  description?: string;
  store_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RoadmapStep {
  id: string;
  step_number: number;
  title: string;
  phase: string;
  description: string;
  expected_action: string;
  partner_responsibility: string;
  sugartown_responsibility: string;
  estimated_duration?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: 'Franchise' | 'FOCO' | 'Investment' | 'ROI' | 'Operations' | 'Territory' | 'Setup' | 'Support';
  display_order: number;
  published: boolean;
}

export interface ResourceDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  file_url: string;
  version: string;
  is_public: boolean;
  file_size?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'franchise_manager';
  last_login?: string;
}

export interface SiteSettings {
  company_name: string;
  phone: string;
  email: string;
  website: string;
  office_address: string;
  brand_color: string;
  whatsapp_number: string;
  notification_email: string;
}

export interface CalculatorState {
  investmentModel: '25L' | '50L' | 'custom';
  initialInvestment: number;
  monthlyRevenue: number;
  cogsMode: 'percentage' | 'fixed';
  cogsPercent: number;
  cogsFixed: number;
  operatingExpenses: number;
  focoMode: 'percentage' | 'fixed';
  focoPercent: number;
  focoFixed: number;
  otherCosts: number;
  annualGrowth: number;
  taxPercent: number;
}

export interface YearlyProjection {
  year: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  focoCharge: number;
  otherCosts: number;
  operatingProfit: number;
  cumulativeProfit: number;
  roi: number;
}

export interface CalculationResult {
  monthlyRevenue: number;
  monthlyCogs: number;
  grossProfit: number;
  grossMarginPercent: number;
  focoCharge: number;
  monthlyOperatingProfit: number;
  annualOperatingProfit: number;
  annualRevenue: number;
  roiPercent: number;
  paybackMonths: number | null; // null if operatingProfit <= 0
  paybackNote?: string;
  projections: YearlyProjection[];
}

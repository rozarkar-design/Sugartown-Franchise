import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  User,
  Clock,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { submitFranchiseInquiry } from '../lib/api';
import { Disclaimer } from '../components/Disclaimer';

interface InquiryPageProps {
  initialCity?: string;
  initialModel?: string;
  onSuccess: (leadId: string, leadData: any) => void;
}

export const InquiryPage: React.FC<InquiryPageProps> = ({
  initialCity = '',
  initialModel = '',
  onSuccess,
}) => {
  // Form State with localStorage persistence
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    sameAsPhone: true,
    current_city: '',
    preferred_city: initialCity || '',
    preferred_state: '',
    investment_budget: initialModel || 'Express Kiosk & High-Street Boutique (₹25L)',
    location_details: 'Looking for Prime Space with Sugartown HQ Guidance',
    launch_timeline: '1-3 Months',
    background_experience: 'Investor / Business Owner',
    message: '',
    consent: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const draft = localStorage.getItem('sugartown_inquiry_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          preferred_city: initialCity || parsed.preferred_city || prev.preferred_city,
          investment_budget: initialModel || parsed.investment_budget || prev.investment_budget,
        }));
      }
    } catch (e) {
      // Ignore draft read errors
    }
  }, [initialCity, initialModel]);

  // Auto-save draft on changes
  useEffect(() => {
    try {
      localStorage.setItem('sugartown_inquiry_draft', JSON.stringify(formData));
    } catch (e) {
      // Ignore quota errors
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePhone = (phoneStr: string) => {
    const cleaned = phoneStr.replace(/\D/g, '');
    return cleaned.length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.full_name.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!formData.preferred_city.trim()) {
      setErrorMessage('Please specify your preferred city or territory.');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('Please confirm your consent to be contacted regarding franchise details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFranchiseInquiry({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        mobile: formData.phone.trim(),
        whatsapp: formData.sameAsPhone ? formData.phone.trim() : formData.whatsapp.trim(),
        current_city: formData.current_city.trim(),
        city: formData.current_city.trim(),
        preferred_city: formData.preferred_city.trim(),
        preferred_state: formData.preferred_state.trim(),
        state: formData.preferred_state.trim(),
        investment_budget: formData.investment_budget,
        investment_capacity: formData.investment_budget,
        preferred_format: formData.investment_budget,
        location_details: formData.location_details,
        launch_timeline: formData.launch_timeline,
        background_experience: formData.background_experience,
        profession: formData.background_experience,
        business_experience: true,
        message: formData.message.trim(),
        consent: Boolean(formData.consent),
        source: 'Website Franchise Portal',
      });

      if (result && (result.success || result.leadId || result.lead_id)) {
        // Clear draft
        localStorage.removeItem('sugartown_inquiry_draft');
        onSuccess(result.leadId || result.lead_id || `lead-${Date.now()}`, formData);
      } else {
        setErrorMessage(result?.message || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="inquiry-page-container" className="space-y-12 py-8 sm:py-12 pb-24">
      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="bento-pill bg-[#FF5C00] text-white">
          <Sparkles className="w-4 h-4" />
          <span>OFFICIAL FRANCHISE INQUIRY</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
          Apply for a Sugartown Franchise
        </h1>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-xl mx-auto leading-relaxed">
          Submit your application to reserve territory exclusivity and receive confidential FOCO documentation.
        </p>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FORM CONTAINER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <form
          id="franchise-inquiry-form"
          onSubmit={handleSubmit}
          className="bento-card space-y-8"
        >
          {/* Error notification banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-[#FFD100] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black text-xs sm:text-sm font-bold flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SECTION 1: Personal & Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-black/10">
              <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center">1</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Investor Contact Details</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Full Legal Name <span className="text-[#FF5C00]">*</span>
                </label>
                <input
                  id="input-full-name"
                  type="text"
                  name="full_name"
                  required
                  placeholder="e.g. Rahul Deshmukh"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Email Address <span className="text-[#FF5C00]">*</span>
                </label>
                <input
                  id="input-email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Mobile Number (India / Intl) <span className="text-[#FF5C00]">*</span>
                </label>
                <input
                  id="input-phone"
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Current Residential City
                </label>
                <input
                  id="input-current-city"
                  type="text"
                  name="current_city"
                  placeholder="e.g. Pune / Mumbai / Bangalore"
                  value={formData.current_city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            {/* WhatsApp toggle */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-black cursor-pointer">
                <input
                  type="checkbox"
                  name="sameAsPhone"
                  checked={formData.sameAsPhone}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-2 border-black text-black focus:ring-0 accent-black"
                />
                <span>WhatsApp number is the same as mobile number</span>
              </label>

              {!formData.sameAsPhone && (
                <div className="mt-3 space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-black block">WhatsApp Number</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="e.g. 9876543210"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Territory & Investment Preferences */}
          <div className="space-y-4 pt-4 border-t-2 border-black/10">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-black/10">
              <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center">2</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Target Territory & Capital Allocation</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Preferred Franchise City <span className="text-[#FF5C00]">*</span>
                </label>
                <input
                  id="input-preferred-city"
                  type="text"
                  name="preferred_city"
                  required
                  placeholder="e.g. Pune, Mumbai, Ahmedabad, Indore..."
                  value={formData.preferred_city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Preferred State / Region
                </label>
                <input
                  id="input-preferred-state"
                  type="text"
                  name="preferred_state"
                  placeholder="e.g. Maharashtra, Gujarat, Karnataka..."
                  value={formData.preferred_state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Preferred Investment Format <span className="text-[#FF5C00]">*</span>
                </label>
                <select
                  id="select-investment-budget"
                  name="investment_budget"
                  value={formData.investment_budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="Express Kiosk & High-Street Boutique (₹25L)">
                    Express Kiosk & High-Street Boutique (₹25 Lakh)
                  </option>
                  <option value="Flagship Experiential Lounge (₹50L)">
                    Flagship Experiential Lounge (₹50 Lakh)
                  </option>
                  <option value="Multi-Unit / Master Territory (₹1Cr+)">
                    Multi-Unit / Regional Master Territory (₹1 Cr+)
                  </option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Proposed Location / Commercial Space Status
                </label>
                <select
                  id="select-location-details"
                  name="location_details"
                  value={formData.location_details}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="Looking for Prime Space with Sugartown HQ Guidance">
                    Looking for Prime Space with Sugartown HQ Guidance
                  </option>
                  <option value="Prime Mall Atrium Space Shortlisted">
                    Prime Mall Atrium Space Shortlisted
                  </option>
                  <option value="Own / Rented High-Street Retail Commercial Property">
                    Own / Rented High-Street Retail Commercial Property
                  </option>
                  <option value="Airport / Transit Hub Commercial Access">
                    Airport / Transit Hub Commercial Access
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Investor Background & Timeline */}
          <div className="space-y-4 pt-4 border-t-2 border-black/10">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-black/10">
              <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center">3</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Background & Readiness</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Launch Timeline Readiness
                </label>
                <select
                  id="select-launch-timeline"
                  name="launch_timeline"
                  value={formData.launch_timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="Immediate (1 Month)">Immediate (Within 30 Days)</option>
                  <option value="1-3 Months">1 - 3 Months (Standard)</option>
                  <option value="3-6 Months">3 - 6 Months</option>
                  <option value="Exploring / Long Term">Exploring for Next Fiscal</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Professional / Business Background
                </label>
                <select
                  id="select-background-experience"
                  name="background_experience"
                  value={formData.background_experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="Investor / Business Owner">Investor / Business Owner</option>
                  <option value="Retail / F&B Franchisee">Existing Retail / F&B Franchisee</option>
                  <option value="Corporate Executive / Professional">
                    Corporate Executive / Senior Professional
                  </option>
                  <option value="Commercial Real Estate Landlord">
                    Commercial Real Estate Landlord
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Additional Comments or Specific Catchment Notes
                </label>
                <textarea
                  id="textarea-message"
                  name="message"
                  rows={3}
                  placeholder="Share details regarding your preferred mall, city micro-market, or initial questions..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 text-xs font-bold text-neutral-800 cursor-pointer">
              <input
                id="checkbox-consent"
                type="checkbox"
                name="consent"
                required
                checked={formData.consent}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-2 border-black text-black accent-black"
              />
              <span className="leading-relaxed">
                I agree to be contacted by Sugartown Retail Private Limited regarding franchise acquisition, FOCO agreements, and site evaluations.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t-2 border-black/10">
            <button
              id="submit-franchise-inquiry-btn"
              type="submit"
              disabled={isSubmitting}
              className="bento-btn-primary w-full py-4 text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Transmitting Qualified Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Qualified Franchise Inquiry</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-[11px] text-neutral-600 font-bold uppercase text-center mt-3">
              Your inquiry will be reviewed by the Sugartown Expansion Committee within 48 business hours.
            </p>
          </div>
        </form>
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <Disclaimer type="franchise" />
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  FileText,
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
  Award,
  Sparkles,
  ArrowRight,
  Printer,
  ChevronRight,
  Eye,
  CheckSquare,
  Square,
  Download,
  Share2,
  Search,
  MessageSquare,
  RefreshCw,
  Sliders,
  Check,
  AlertTriangle,
  ArrowLeft,
  X,
} from 'lucide-react';
import {
  submitFranchiseLoi,
  fetchLoiById,
  approveCustomizedLoi,
  counterCustomizedLoi,
} from '../lib/api';
import { LoiDocumentPreview } from '../components/LoiDocumentPreview';
import { FranchiseLoi } from '../types';

interface LoiPageProps {
  initialCity?: string;
  initialModel?: string;
  onNavigate: (path: string) => void;
}

export const LoiPage: React.FC<LoiPageProps> = ({
  initialCity = '',
  initialModel = '',
  onNavigate,
}) => {
  // Form State with localStorage Persistence
  const [formData, setFormData] = useState({
    full_name: '',
    entity_type: 'individual' as const,
    entity_name: '',
    pan_number: '',
    aadhaar_or_id: '',
    email: '',
    phone: '',
    whatsapp: '',
    sameAsPhone: true,
    current_address: '',
    current_city: '',
    current_state: '',
    pin_code: '',
    profession_background: 'Business Owner & Commercial Investor',
    existing_business_details: '',

    // Franchise Details
    investment_model: initialModel || 'Express Kiosk & High-Street Boutique (₹25L)',
    investment_amount_committed: initialModel?.includes('50') ? 5000000 : 2500000,
    target_city: initialCity || '',
    target_state: '',
    preferred_location: '',
    site_status: 'identifying' as const,
    proposed_carpet_area_sqft: initialModel?.includes('50') ? 500 : 200,
    source_of_funds: 'self_liquid' as const,
    target_launch_timeline: '45_days' as const,

    // Legal Declarations
    accepts_foco_model: true,
    accepts_confidentiality_nda: true,
    accepts_commercial_terms: true,
    territory_exclusivity_requested: true,
    signatory_name: '',
    signatory_title: 'Principal Investor',
  });

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [previewMode, setPreviewMode] = useState<'split' | 'form' | 'doc'>('split');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedLoi, setSubmittedLoi] = useState<FranchiseLoi | null>(null);

  // Existing LOI / Customized Terms Review State
  const [lookupRefInput, setLookupRefInput] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [reviewedLoi, setReviewedLoi] = useState<FranchiseLoi | null>(null);
  const [showLookupModal, setShowLookupModal] = useState(false);

  // Investor Approval / Counter State
  const [investorSignatoryName, setInvestorSignatoryName] = useState('');
  const [investorApprovalNotes, setInvestorApprovalNotes] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [approvalSuccessMsg, setApprovalSuccessMsg] = useState<string | null>(null);

  // Counter proposal state
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterNotes, setCounterNotes] = useState('');
  const [isCountering, setIsCountering] = useState(false);
  const [counterSuccessMsg, setCounterSuccessMsg] = useState<string | null>(null);

  // Check URL params on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const loiIdParam = params.get('id') || params.get('loi') || params.get('ref');
      if (loiIdParam) {
        setIsLookingUp(true);
        fetchLoiById(loiIdParam)
          .then((loi) => {
            setReviewedLoi(loi);
            setInvestorSignatoryName(loi.signatory_name || loi.full_name || '');
          })
          .catch((err) => {
            setLookupError(err.message || 'Could not load requested LOI record.');
          })
          .finally(() => setIsLookingUp(false));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const draft = localStorage.getItem('sugartown_loi_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          target_city: initialCity || parsed.target_city || prev.target_city,
          investment_model: initialModel || parsed.investment_model || prev.investment_model,
        }));
      }
    } catch (e) {
      // Ignore draft read errors
    }
  }, [initialCity, initialModel]);

  // Auto-save draft on changes
  useEffect(() => {
    try {
      localStorage.setItem('sugartown_loi_draft', JSON.stringify(formData));
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
    } else if (name === 'investment_model') {
      let amount = 2500000;
      let sqft = 200;
      if (value.includes('50') || value.includes('Flagship')) {
        amount = 5000000;
        sqft = 500;
      }
      setFormData((prev) => ({
        ...prev,
        investment_model: value,
        investment_amount_committed: amount,
        proposed_carpet_area_sqft: sqft,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === 'full_name' && !prev.signatory_name ? { signatory_name: value } : {}),
      }));
    }
  };

  const handleLookupLoi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupRefInput.trim()) return;
    setIsLookingUp(true);
    setLookupError(null);
    try {
      const loi = await fetchLoiById(lookupRefInput.trim());
      setReviewedLoi(loi);
      setInvestorSignatoryName(loi.signatory_name || loi.full_name || '');
      setShowLookupModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setLookupError(err.message || 'No LOI found matching this Reference Number or ID.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleApproveCustomizedTerms = async () => {
    if (!reviewedLoi) return;
    if (!investorSignatoryName.trim()) {
      alert('Please confirm your full legal name as authorized signatory.');
      return;
    }
    setIsApproving(true);
    setApprovalSuccessMsg(null);
    try {
      const res = await approveCustomizedLoi(reviewedLoi.id, {
        signatory_name: investorSignatoryName.trim(),
        approval_notes: investorApprovalNotes.trim(),
      });
      setReviewedLoi(res.loi);
      setApprovalSuccessMsg('Customized terms approved and resubmitted successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Failed to approve customized terms.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleCounterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewedLoi || !counterNotes.trim()) return;
    setIsCountering(true);
    try {
      const res = await counterCustomizedLoi(reviewedLoi.id, {
        notes: counterNotes.trim(),
        requested_by: investorSignatoryName || reviewedLoi.full_name,
      });
      setReviewedLoi(res.loi);
      setCounterSuccessMsg('Your modification request has been submitted to Sugartown Corporate Committee.');
      setShowCounterModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit counter modifications.');
    } finally {
      setIsCountering(false);
    }
  };

  const validatePhone = (phoneStr: string) => {
    const cleaned = phoneStr.replace(/\D/g, '');
    return cleaned.length >= 10;
  };

  const handleStepValidation = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.full_name.trim()) {
        setErrorMessage('Please enter your full legal name.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return false;
      }
      if (!validatePhone(formData.phone)) {
        setErrorMessage('Please enter a valid 10-digit mobile phone number.');
        return false;
      }
      if (!formData.current_city.trim()) {
        setErrorMessage('Please enter your current city of residence / business.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.target_city.trim()) {
        setErrorMessage('Please specify your desired target city / territory for the franchise.');
        return false;
      }
      if (!formData.preferred_location.trim()) {
        setErrorMessage('Please specify your preferred mall or high-street location (or enter "HQ Site Assistance Required").');
        return false;
      }
    } else if (step === 3) {
      if (!formData.accepts_foco_model || !formData.accepts_confidentiality_nda || !formData.accepts_commercial_terms) {
        setErrorMessage('You must confirm and accept the FOCO operational terms, confidentiality agreement, and declarations.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (handleStepValidation(activeStep)) {
      setActiveStep((prev) => Math.min(4, prev + 1) as any);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handleSubmitLoi = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Final Validations
    if (!formData.full_name.trim()) {
      setErrorMessage('Please enter your full legal name.');
      setActiveStep(1);
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid official email address.');
      setActiveStep(1);
      return;
    }
    if (!validatePhone(formData.phone)) {
      setErrorMessage('Please provide a valid 10-digit phone number.');
      setActiveStep(1);
      return;
    }
    if (!formData.target_city.trim()) {
      setErrorMessage('Target city is required.');
      setActiveStep(2);
      return;
    }
    if (!formData.accepts_foco_model || !formData.accepts_confidentiality_nda || !formData.accepts_commercial_terms) {
      setErrorMessage('You must confirm all mandatory legal declarations.');
      setActiveStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitFranchiseLoi({
        ...formData,
        phone: formData.phone,
        whatsapp: formData.sameAsPhone ? formData.phone : (formData.whatsapp || formData.phone),
        signatory_name: formData.signatory_name || formData.full_name,
      });

      setSubmittedLoi(response.loi);
      localStorage.removeItem('sugartown_loi_draft');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Failed to submit Letter of Intent. Please check your inputs or call +91 91454 48010.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // REVIEW & APPROVE CUSTOMIZED LOI VIEW (INVESTOR WORKSPACE)
  // =========================================================================
  if (reviewedLoi) {
    const isCustomizedTerms = Boolean(
      (reviewedLoi.revision_number && reviewedLoi.revision_number > 1) ||
      (reviewedLoi.custom_terms && reviewedLoi.custom_terms.length > 0) ||
      reviewedLoi.custom_terms_notes ||
      reviewedLoi.custom_royalty_percentage ||
      reviewedLoi.special_rebates_or_support ||
      reviewedLoi.status === 'customized_terms_sent'
    );

    const isAlreadyApproved =
      reviewedLoi.investor_approval_status === 'approved' ||
      reviewedLoi.status === 'investor_approved' ||
      reviewedLoi.status === 'approved';

    return (
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              setReviewedLoi(null);
              setApprovalSuccessMsg(null);
              setCounterSuccessMsg(null);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Submit New LOI Application</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-black bg-[#FFF8E7] px-3 py-1.5 rounded-xl border-2 border-black">
              LOI Ref: {reviewedLoi.loi_number}
            </span>
            {reviewedLoi.revision_number && (
              <span className="text-xs font-black uppercase bg-purple-100 text-purple-900 px-3 py-1.5 rounded-xl border-2 border-purple-400">
                Revision #{reviewedLoi.revision_number}
              </span>
            )}
          </div>
        </div>

        {/* Success / Notification Alerts */}
        {approvalSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex items-center gap-3 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">
                Approval & Resubmission Successful!
              </p>
              <p className="text-xs font-medium mt-0.5">{approvalSuccessMsg}</p>
            </div>
          </div>
        )}

        {counterSuccessMsg && (
          <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-500 text-blue-950 flex items-center gap-3 shadow-[3px_3px_0px_0px_rgba(59,130,246,0.3)]">
            <MessageSquare className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">
                Counter Clarifications Dispatched
              </p>
              <p className="text-xs font-medium mt-0.5">{counterSuccessMsg}</p>
            </div>
          </div>
        )}

        {/* Customized Terms Banner (If corporate sent modified terms) */}
        {isCustomizedTerms && (
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-3 border-purple-600 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(147,51,234,0.4)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b-2 border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-200 text-purple-900">
                      Corporate Revision #{reviewedLoi.revision_number || 1}
                    </span>
                    <span className="text-xs font-bold text-purple-900">
                      From: {reviewedLoi.modified_by || 'Sugartown Allotment Committee'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-black mt-0.5">
                    Customized Terms & Special Commercial Covenants
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black ${
                    isAlreadyApproved
                      ? 'bg-emerald-400 text-black'
                      : reviewedLoi.status === 'investor_countered'
                      ? 'bg-amber-300 text-black'
                      : 'bg-[#FFD100] text-black animate-bounce'
                  }`}
                >
                  {isAlreadyApproved
                    ? 'Terms Approved & Locked'
                    : reviewedLoi.status === 'investor_countered'
                    ? 'Awaiting HQ Response to Counter'
                    : 'Action Required: Review & Resubmit'}
                </span>
              </div>
            </div>

            {/* Committee Executive Notes */}
            {reviewedLoi.custom_terms_notes && (
              <div className="my-4 p-4 rounded-2xl bg-white border-2 border-purple-300 shadow-[2px_2px_0px_0px_rgba(147,51,234,0.2)]">
                <p className="text-[11px] font-black uppercase text-purple-900 tracking-wider mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>HQ Committee Letter & Modification Rationale:</span>
                </p>
                <p className="text-xs sm:text-sm text-neutral-800 italic leading-relaxed">
                  "{reviewedLoi.custom_terms_notes}"
                </p>
              </div>
            )}

            {/* Custom Commercial Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
              <div className="p-3.5 rounded-2xl bg-white border-2 border-purple-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                  Territory Exclusivity
                </span>
                <strong className="text-sm font-black text-purple-900 block mt-0.5">
                  {reviewedLoi.territory_exclusivity_days || 30} Days Lock-in
                </strong>
                <span className="text-[10px] text-neutral-500">Reserved for {reviewedLoi.target_city}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-2 border-purple-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                  Tailored Partner Payout
                </span>
                <strong className="text-sm font-black text-purple-900 block mt-0.5">
                  {reviewedLoi.custom_royalty_percentage !== undefined
                    ? `${reviewedLoi.custom_royalty_percentage}% Net Profit Remittance`
                    : 'Standard FOCO Framework'}
                </strong>
                <span className="text-[10px] text-neutral-500">Monthly direct transfer</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-2 border-purple-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] sm:col-span-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                  Grants & Special Support
                </span>
                <strong className="text-xs font-black text-emerald-800 block mt-0.5">
                  {reviewedLoi.special_rebates_or_support || 'Standard Fit-out & Launch Package'}
                </strong>
              </div>
            </div>

            {/* Custom Clauses List */}
            {reviewedLoi.custom_terms && reviewedLoi.custom_terms.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-purple-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 mb-2">
                  Agreed Modified Clauses (Section 3 of LOI):
                </h4>
                <ul className="space-y-2 text-xs text-neutral-800">
                  {reviewedLoi.custom_terms.map((clause, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 border border-purple-300">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-purple-950">Clause 3.{idx + 1}:</strong> {clause}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Investor Action Box (If not yet approved) */}
            {!isAlreadyApproved && (
              <div className="mt-6 pt-6 border-t-2 border-purple-300 bg-white/90 rounded-2xl p-5 border-2 border-purple-400 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Investor Action: Approve & Resubmit or Request Clarifications</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                      Signatory Full Legal Name *
                    </label>
                    <input
                      type="text"
                      value={investorSignatoryName}
                      onChange={(e) => setInvestorSignatoryName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-xs bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-2 focus:ring-[#FF5C00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                      Investor Comments / Acceptance Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={investorApprovalNotes}
                      onChange={(e) => setInvestorApprovalNotes(e.target.value)}
                      placeholder="e.g. Terms accepted. Ready for site evaluation."
                      className="w-full p-2.5 rounded-xl border-2 border-black font-medium text-xs bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-2 focus:ring-[#FF5C00]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCounterModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Request Further Clarifications / Counter</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApproveCustomizedTerms}
                    disabled={isApproving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    {isApproving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Recording Digital Approval...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Approve Customized Terms & Resubmit LOI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Document Preview Component */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black uppercase tracking-wider text-black flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF5C00]" />
              <span>Full Stamped Legal LOI Document</span>
            </h3>
            <span className="text-xs font-mono font-bold text-neutral-500">
              Ref: {reviewedLoi.loi_number}
            </span>
          </div>

          <LoiDocumentPreview
            loi={reviewedLoi}
            isConfirmed={true}
            referenceNumber={reviewedLoi.loi_number}
          />
        </div>

        {/* Counter Proposal Modal */}
        {showCounterModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border-3 border-black rounded-3xl p-6 w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-200">
                <h3 className="text-base font-black uppercase tracking-wider text-black flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Request Modification / Counter Clarifications</span>
                </h3>
                <button
                  onClick={() => setShowCounterModal(false)}
                  className="p-1 rounded-lg border border-black hover:bg-neutral-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-600">
                Enter your notes or proposed changes regarding the customized commercial terms. The Sugartown Allotment Committee will review and respond with an updated draft.
              </p>

              <form onSubmit={handleCounterSubmit} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  value={counterNotes}
                  onChange={(e) => setCounterNotes(e.target.value)}
                  placeholder="e.g. We request 60 days exclusivity instead of 45 days, as the target mall lease requires 3 weeks for municipal board clearance..."
                  className="w-full p-3 rounded-2xl border-2 border-black font-medium text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCounterModal(false)}
                    className="px-4 py-2 rounded-xl border-2 border-black font-black uppercase text-xs hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCountering}
                    className="bento-btn-primary py-2 px-5 text-xs inline-flex items-center gap-1.5"
                  >
                    {isCountering ? 'Sending...' : 'Send Clarification Request to HQ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // SUBMISSION SUCCESS CONFIRMATION VIEW
  // =========================================================================
  if (submittedLoi) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Success Header Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-black rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500 border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-emerald-300 text-xs font-black uppercase tracking-wider text-emerald-800 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>LOI Formal Record Stamped</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-black uppercase">
                Letter of Intent Confirmed!
              </h1>
              <p className="text-sm sm:text-base text-neutral-700 mt-2 max-w-3xl">
                Thank you, <strong>{submittedLoi.full_name}</strong>. Your formal Letter of Intent for the{' '}
                <strong>{submittedLoi.target_city}</strong> territory has been officially recorded under Document Reference{' '}
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-black text-black">
                  {submittedLoi.loi_number}
                </span>
                . Our corporate franchise allotment committee is initiating the 48-hour preliminary feasibility audit.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-8 pt-6 border-t-2 border-emerald-200 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFD100] hover:bg-[#ffe14c] text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Official LOI</span>
            </button>

            <a
              href="tel:9145448010"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <Phone className="w-4 h-4 text-[#FF5C00]" />
              <span>Direct Desk: +91 91454 48010</span>
            </a>

            <button
              onClick={() => onNavigate('/calculator')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Review ROI Projections</span>
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5C00] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all ml-auto"
            >
              <span>Back to Portal Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 45-Day Onboarding Roadmap Box */}
        <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
          <h2 className="text-lg font-black uppercase tracking-wider text-black flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#FF5C00]" />
            <span>Next Steps in Your Franchise Launch Timeline</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#FFFDF7] border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black uppercase bg-[#FFD100] px-2 py-0.5 rounded border border-black">
                Within 48 Hours
              </span>
              <h3 className="font-bold text-xs uppercase mt-2 text-black">1. Preliminary Due Diligence</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Franchise Director review of KYC, committed capital, and territory availability in {submittedLoi.target_city}.
              </p>
            </div>

            <div className="bg-[#FFFDF7] border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black uppercase bg-neutral-200 px-2 py-0.5 rounded border border-black">
                Days 3 – 7
              </span>
              <h3 className="font-bold text-xs uppercase mt-2 text-black">2. Video Discovery & Site Audit</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Commercial presentation, P&L breakdown, and technical evaluation of {submittedLoi.preferred_location}.
              </p>
            </div>

            <div className="bg-[#FFFDF7] border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black uppercase bg-neutral-200 px-2 py-0.5 rounded border border-black">
                Days 8 – 14
              </span>
              <h3 className="font-bold text-xs uppercase mt-2 text-black">3. Master Agreement Execution</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Formal legal agreement signing, escrow account allocation, and architectural 3D fit-out commencement.
              </p>
            </div>

            <div className="bg-[#FFFDF7] border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-400">
                Days 15 – 45
              </span>
              <h3 className="font-bold text-xs uppercase mt-2 text-black">4. Turnkey Store Grand Opening</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Candy Theater equipment install, master candy craftsmen deployment, inventory stock-up, and launch!
              </p>
            </div>
          </div>
        </div>

        {/* Full Official Document View */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF5C00]" />
              <span>Stamped Standard LOI Document</span>
            </h2>
            <span className="text-xs font-mono font-bold text-neutral-500">
              Ref: {submittedLoi.loi_number}
            </span>
          </div>
          <LoiDocumentPreview
            loi={submittedLoi}
            isConfirmed={true}
            referenceNumber={submittedLoi.loi_number}
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN INTERACTIVE LOI FORM & LIVE PREVIEW BUILDER
  // =========================================================================
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD100] border-2 border-black text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Official Franchise Commitment Portal</span>
          </div>

          <button
            type="button"
            onClick={() => setShowLookupModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Review / Track Existing LOI</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-black uppercase">
              Franchise Standard Letter of Intent (LOI)
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 max-w-3xl">
              Submit your formal Letter of Intent to secure territory exclusivity for a 100% turnkey, company-operated 
              <strong> Sugartown Live Candy Theater & Retail Boutique</strong> in your target city.
            </p>
          </div>

          {/* View Mode Switcher (Large Screens) */}
          <div className="hidden lg:flex items-center bg-white border-2 border-black rounded-2xl p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => setPreviewMode('split')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                previewMode === 'split' ? 'bg-[#FFD100] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Split View (Form + Draft)
            </button>
            <button
              onClick={() => setPreviewMode('form')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                previewMode === 'form' ? 'bg-[#FFD100] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Form Only
            </button>
            <button
              onClick={() => setPreviewMode('doc')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                previewMode === 'doc' ? 'bg-[#FFD100] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Document Preview
            </button>
          </div>
        </div>
      </div>

      {/* LOI Lookup Modal */}
      {showLookupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl p-6 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-200">
              <h3 className="text-base font-black uppercase tracking-wider text-black flex items-center gap-2">
                <Search className="w-4 h-4 text-[#FF5C00]" />
                <span>Track & Review LOI Status</span>
              </h3>
              <button
                onClick={() => {
                  setShowLookupModal(false);
                  setLookupError(null);
                }}
                className="p-1 rounded-lg border border-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Enter your official LOI Reference Number (e.g., <code className="font-bold font-mono">ST-LOI-2026-XXXX</code>) or LOI Record ID to review customized terms from Sugartown HQ and give your digital approval.
            </p>

            <form onSubmit={handleLookupLoi} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                  Document Reference Number / ID *
                </label>
                <input
                  type="text"
                  required
                  value={lookupRefInput}
                  onChange={(e) => setLookupRefInput(e.target.value)}
                  placeholder="e.g. ST-LOI-2026-1049"
                  className="w-full p-2.5 rounded-xl border-2 border-black font-mono font-bold text-xs bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-2 focus:ring-[#FF5C00]"
                />
              </div>

              {lookupError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-400 text-rose-900 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{lookupError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLookupModal(false)}
                  className="px-4 py-2 rounded-xl border-2 border-black font-black uppercase text-xs hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLookingUp}
                  className="bento-btn-primary py-2 px-5 text-xs inline-flex items-center gap-1.5"
                >
                  {isLookingUp ? 'Fetching...' : 'Retrieve LOI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step Navigation Tabs */}
      <div className="bg-white border-2 border-black rounded-3xl p-3 sm:p-4 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { step: 1, label: '1. Investor Profile', desc: 'Identity & Entity' },
            { step: 2, label: '2. Territory & Scope', desc: 'Format & Location' },
            { step: 3, label: '3. Legal Undertakings', desc: 'FOCO Terms & NDA' },
            { step: 4, label: '4. Sign & Confirm', desc: 'Digital Signature' },
          ].map((item) => {
            const isActive = activeStep === item.step;
            const isCompleted = activeStep > item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  if (item.step < activeStep || handleStepValidation(activeStep)) {
                    setActiveStep(item.step as any);
                  }
                }}
                className={`p-3 rounded-2xl text-left border-2 transition-all ${
                  isActive
                    ? 'bg-[#FF5C00] text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:border-black'
                    : 'bg-neutral-50 text-neutral-700 border-transparent hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider">{item.label}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-500 text-red-900 flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-bold">{errorMessage}</div>
        </div>
      )}

      {/* Form & Live Preview Layout */}
      <div className={`grid gap-8 ${previewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Left Side: Step Form */}
        {(previewMode === 'split' || previewMode === 'form') && (
          <div className={previewMode === 'split' ? 'lg:col-span-6' : 'max-w-3xl mx-auto w-full'}>
            <form onSubmit={handleSubmitLoi} className="space-y-6">
              {/* STEP 1: INVESTOR PROFILE */}
              {activeStep === 1 && (
                <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5">
                  <div className="border-b-2 border-neutral-200 pb-3">
                    <h2 className="text-lg font-black uppercase tracking-wide text-black flex items-center gap-2">
                      <User className="w-5 h-5 text-[#FF5C00]" />
                      <span>Step 1: Applicant & Investor Profile</span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Legal identification details for drafting the official LOI and background verification.
                    </p>
                  </div>

                  {/* Full Legal Name */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                      Full Legal Name (as per PAN / Passport) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Mehra"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-bold text-black"
                    />
                  </div>

                  {/* Constitution / Entity Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Constitution / Entity Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="entity_type"
                        value={formData.entity_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-xs sm:text-sm font-bold text-black"
                      >
                        <option value="individual">Individual / Sole Investor</option>
                        <option value="sole_proprietorship">Sole Proprietorship</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="private_limited">Private Limited Company</option>
                        <option value="partnership">Registered Partnership Firm</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Registered Entity Name (if applicable)
                      </label>
                      <input
                        type="text"
                        name="entity_name"
                        value={formData.entity_name}
                        onChange={handleChange}
                        placeholder="e.g. Mehra Hospitality LLP"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-bold text-black"
                      />
                    </div>
                  </div>

                  {/* Mobile & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Mobile Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 98220 19482"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-mono font-bold text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Official Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rajesh.mehra@gmail.com"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-bold text-black"
                      />
                    </div>
                  </div>

                  {/* PAN & Current Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        PAN Number (Optional/For LOI Draft)
                      </label>
                      <input
                        type="text"
                        name="pan_number"
                        value={formData.pan_number}
                        onChange={handleChange}
                        placeholder="e.g. AABCM1982K"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-mono uppercase font-bold text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Current City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="current_city"
                        value={formData.current_city}
                        onChange={handleChange}
                        placeholder="e.g. Pune / Mumbai / Bengaluru"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-bold text-black"
                      />
                    </div>
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                      Residential / Corporate Address
                    </label>
                    <input
                      type="text"
                      name="current_address"
                      value={formData.current_address}
                      onChange={handleChange}
                      placeholder="e.g. B-402, Clover Highlands, NIBM Road, Pune 411048"
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-bold text-black"
                    />
                  </div>

                  {/* Profession Background */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                      Professional Background & Business Experience
                    </label>
                    <textarea
                      name="profession_background"
                      rows={2}
                      value={formData.profession_background}
                      onChange={handleChange}
                      placeholder="e.g. F&B operator with 2 existing retail stores and commercial property portfolio."
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-xs sm:text-sm font-medium text-black"
                    />
                  </div>

                  {/* Next Step CTA */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5C00] hover:bg-[#ff4500] text-white text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      <span>Proceed to Territory & Scope</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TERRITORY & SCOPE */}
              {activeStep === 2 && (
                <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5">
                  <div className="border-b-2 border-neutral-200 pb-3">
                    <h2 className="text-lg font-black uppercase tracking-wide text-black flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#FF5C00]" />
                      <span>Step 2: Franchise Scope, Location & Financials</span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Choose your preferred store format and specify target territory for exclusive reservation.
                    </p>
                  </div>

                  {/* Model Selection Radios */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-2">
                      Select Franchise Model Format <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() =>
                          handleChange({
                            target: {
                              name: 'investment_model',
                              value: 'Express Kiosk & High-Street Boutique (₹25L)',
                            },
                          } as any)
                        }
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.investment_model.includes('25')
                            ? 'bg-[#FFF8E7] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-neutral-50 border-neutral-300 hover:border-black'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-black">Express Kiosk (₹25L)</span>
                          <span className="text-[10px] font-bold bg-[#FFD100] px-2 py-0.5 rounded border border-black text-black">
                            150 – 250 sq.ft
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1.5 font-medium">
                          Ideal for prime mall atriums and high-street boutiques. Live candy theater unit + pick & mix.
                        </p>
                        <p className="text-xs font-black text-emerald-700 mt-2">
                          Committed: ₹25,00,000 + GST
                        </p>
                      </div>

                      <div
                        onClick={() =>
                          handleChange({
                            target: {
                              name: 'investment_model',
                              value: 'Flagship Live Candy Theater & Experience Store (₹50L)',
                            },
                          } as any)
                        }
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.investment_model.includes('50')
                            ? 'bg-[#FFF8E7] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-neutral-50 border-neutral-300 hover:border-black'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-black">Flagship Store (₹50L)</span>
                          <span className="text-[10px] font-bold bg-[#FF5C00] text-white px-2 py-0.5 rounded border border-black">
                            400 – 800 sq.ft
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1.5 font-medium">
                          Full theatrical master candy kitchen, experiential tasting lounge, and premium gifting salon.
                        </p>
                        <p className="text-xs font-black text-emerald-700 mt-2">
                          Committed: ₹50,00,000 + GST
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Target City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Target City / Territory <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="target_city"
                        value={formData.target_city}
                        onChange={handleChange}
                        placeholder="e.g. Pune, Bengaluru, Ahmedabad"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-bold text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Target State
                      </label>
                      <input
                        type="text"
                        name="target_state"
                        value={formData.target_state}
                        onChange={handleChange}
                        placeholder="e.g. Maharashtra, Karnataka"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-bold text-black"
                      />
                    </div>
                  </div>

                  {/* Preferred Location & Premises Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Preferred Location / Mall <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="preferred_location"
                        value={formData.preferred_location}
                        onChange={handleChange}
                        placeholder="e.g. Phoenix Marketcity, Nexus Mall, or Seeking HQ Guidance"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-xs sm:text-sm font-bold text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Premises Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="site_status"
                        value={formData.site_status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-xs sm:text-sm font-bold text-black"
                      >
                        <option value="identifying">Under Evaluation / Identifying with HQ</option>
                        <option value="owned">Self-Owned Commercial Space</option>
                        <option value="leased">Leased / Letter of Intent with Mall</option>
                        <option value="request_hq_selection">Requesting 100% HQ Site Selection</option>
                      </select>
                    </div>
                  </div>

                  {/* Source of Funds & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Source of Capital <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="source_of_funds"
                        value={formData.source_of_funds}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-xs sm:text-sm font-bold text-black"
                      >
                        <option value="self_liquid">Self Liquid Funds / Savings</option>
                        <option value="family_office">Family Office / Private Capital</option>
                        <option value="partnership">Investment Syndicate / Partners</option>
                        <option value="bank_loan">Bank Debt / Commercial Loan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Target Launch Timeline <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="target_launch_timeline"
                        value={formData.target_launch_timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-xs sm:text-sm font-bold text-black"
                      >
                        <option value="30_days">Immediate (30 Days)</option>
                        <option value="45_days">Standard Launch (45 Days)</option>
                        <option value="60_days">Next 60 Days</option>
                        <option value="90_days">Within Next Quarter (90 Days)</option>
                      </select>
                    </div>
                  </div>

                  {/* Nav Buttons */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5C00] hover:bg-[#ff4500] text-white text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      <span>Proceed to Legal Undertakings</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: LEGAL UNDERTAKINGS & FOCO ACCEPTANCE */}
              {activeStep === 3 && (
                <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5">
                  <div className="border-b-2 border-neutral-200 pb-3">
                    <h2 className="text-lg font-black uppercase tracking-wide text-black flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#FF5C00]" />
                      <span>Step 3: Standard Undertakings & Declarations</span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Acceptance of Sugartown Retail FOCO operational policies and non-disclosure obligations.
                    </p>
                  </div>

                  {/* FOCO Framework Declaration */}
                  <div
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, accepts_foco_model: !prev.accepts_foco_model }))
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3.5 transition-all ${
                      formData.accepts_foco_model
                        ? 'bg-emerald-50 border-emerald-500 shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]'
                        : 'bg-neutral-50 border-neutral-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {formData.accepts_foco_model ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="text-xs text-neutral-800">
                      <p className="font-black uppercase text-black">
                        1. Acceptance of Turnkey FOCO Framework <span className="text-red-500">*</span>
                      </p>
                      <p className="mt-1 leading-relaxed">
                        I confirm that store operations, staffing, master candy craftsmen deployment, central supply 
                        of raw materials, and POS billing will be 100% operated by Sugartown Retail Private Limited.
                      </p>
                    </div>
                  </div>

                  {/* NDA & Confidentiality Declaration */}
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        accepts_confidentiality_nda: !prev.accepts_confidentiality_nda,
                      }))
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3.5 transition-all ${
                      formData.accepts_confidentiality_nda
                        ? 'bg-emerald-50 border-emerald-500 shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]'
                        : 'bg-neutral-50 border-neutral-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {formData.accepts_confidentiality_nda ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="text-xs text-neutral-800">
                      <p className="font-black uppercase text-black">
                        2. Non-Disclosure & Confidentiality (NDA) <span className="text-red-500">*</span>
                      </p>
                      <p className="mt-1 leading-relaxed">
                        I agree to maintain strict confidentiality regarding unit economics, margin splits, recipes, 
                        and architectural designs shared during discovery calls and site inspections.
                      </p>
                    </div>
                  </div>

                  {/* Commercial Terms Undertaking */}
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        accepts_commercial_terms: !prev.accepts_commercial_terms,
                      }))
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3.5 transition-all ${
                      formData.accepts_commercial_terms
                        ? 'bg-emerald-50 border-emerald-500 shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]'
                        : 'bg-neutral-50 border-neutral-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {formData.accepts_commercial_terms ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="text-xs text-neutral-800">
                      <p className="font-black uppercase text-black">
                        3. Financial Availability & Good Faith Intent <span className="text-red-500">*</span>
                      </p>
                      <p className="mt-1 leading-relaxed">
                        I confirm having ready availability of unencumbered liquid capital matching the committed{' '}
                        <strong>₹{(formData.investment_amount_committed / 100000).toFixed(0)} Lakhs</strong> to fund the fit-out 
                        upon site verification and master agreement execution.
                      </p>
                    </div>
                  </div>

                  {/* Territory Hold Request */}
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        territory_exclusivity_requested: !prev.territory_exclusivity_requested,
                      }))
                    }
                    className="p-4 rounded-2xl border-2 border-neutral-300 bg-neutral-50 cursor-pointer flex items-start gap-3.5"
                  >
                    <div className="mt-0.5">
                      {formData.territory_exclusivity_requested ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="text-xs text-neutral-800">
                      <p className="font-black uppercase text-black">
                        4. Request 30-Day Territory Hold for {formData.target_city || 'Target City'}
                      </p>
                      <p className="mt-1 leading-relaxed text-neutral-600">
                        Request Sugartown Expansion Desk to prioritize and temporarily place a 30-day inquiry hold on the proposed mall/high-street location.
                      </p>
                    </div>
                  </div>

                  {/* Nav Buttons */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5C00] hover:bg-[#ff4500] text-white text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      <span>Proceed to Sign & Submit</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SIGN & CONFIRM SUBMIT */}
              {activeStep === 4 && (
                <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5">
                  <div className="border-b-2 border-neutral-200 pb-3">
                    <h2 className="text-lg font-black uppercase tracking-wide text-black flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#FF5C00]" />
                      <span>Step 4: Digital E-Signature & Confirmation</span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Affix your digital confirmation to formally register this standard Letter of Intent with Sugartown Retail HQ.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-[#FFFDF7] border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs space-y-2">
                    <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                      <span className="font-bold text-neutral-500">Applicant:</span>
                      <span className="font-black text-black">{formData.full_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                      <span className="font-bold text-neutral-500">Target Territory:</span>
                      <span className="font-black text-[#FF5C00]">{formData.target_city}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                      <span className="font-bold text-neutral-500">Investment Model:</span>
                      <span className="font-bold text-black">{formData.investment_model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-neutral-500">Committed Capital:</span>
                      <span className="font-black text-emerald-700">
                        ₹{(formData.investment_amount_committed / 100000).toFixed(2)} Lakhs
                      </span>
                    </div>
                  </div>

                  {/* Digital Signature Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Signatory Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="signatory_name"
                        value={formData.signatory_name}
                        onChange={handleChange}
                        placeholder="e.g. Rajesh Mehra"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-bold text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1">
                        Designation / Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="signatory_title"
                        value={formData.signatory_title}
                        onChange={handleChange}
                        placeholder="e.g. Principal Investor / Managing Partner"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border-2 border-black focus:bg-white focus:outline-none text-sm font-bold text-black"
                      />
                    </div>
                  </div>

                  {/* Digital Stamp Simulation */}
                  <div className="p-4 rounded-2xl border-2 border-dashed border-neutral-400 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono font-bold text-black uppercase">
                        Digital Verification Timestamp
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {new Date().toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                      Ready to Stamp
                    </div>
                  </div>

                  {/* Submission Buttons */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FF5C00] hover:bg-[#ff4500] text-white text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Registering Official LOI...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit & Confirm LOI</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Right Side: Live Legal LOI Preview */}
        {(previewMode === 'split' || previewMode === 'doc') && (
          <div className={previewMode === 'split' ? 'lg:col-span-6' : 'w-full'}>
            <div className="sticky top-24">
              <LoiDocumentPreview loi={formData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

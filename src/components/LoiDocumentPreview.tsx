import React, { useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Award,
  Stamp,
} from 'lucide-react';
import { FranchiseLoi } from '../types';

interface LoiDocumentPreviewProps {
  loi: Partial<FranchiseLoi>;
  isConfirmed?: boolean;
  referenceNumber?: string;
  onPrint?: () => void;
}

export const LoiDocumentPreview: React.FC<LoiDocumentPreviewProps> = ({
  loi,
  isConfirmed = false,
  referenceNumber,
  onPrint,
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const displayRefNumber =
    referenceNumber || loi.loi_number || `ST-LOI-${new Date().getFullYear()}-DRAFT`;
  const submissionDateStr = loi.submission_date
    ? new Date(loi.submission_date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

  const formattedAmount = loi.investment_amount_committed
    ? `₹${(loi.investment_amount_committed / 100000).toFixed(2)} Lakhs (INR ${loi.investment_amount_committed.toLocaleString('en-IN')}/-)`
    : '₹25.00 Lakhs (INR 25,00,000/-)';

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    window.print();
  };

  const handleCopyText = () => {
    if (!documentRef.current) return;
    const text = documentRef.current.innerText;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCustomized = Boolean(
    loi.revision_number && loi.revision_number > 1 ||
    (loi.custom_terms && loi.custom_terms.length > 0) ||
    loi.custom_terms_notes ||
    loi.custom_royalty_percentage ||
    loi.special_rebates_or_support
  );

  const isInvestorApproved =
    loi.investor_approval_status === 'approved' ||
    loi.status === 'investor_approved' ||
    loi.status === 'approved';

  const modifiedDateStr = loi.modified_at
    ? new Date(loi.modified_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const investorApprovedDateStr = loi.investor_approved_at
    ? new Date(loi.investor_approved_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-white rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      {/* Top Document Action Bar */}
      <div className="bg-[#FFF8E7] border-b-2 border-black p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF5C00] border-2 border-black flex items-center justify-center text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-black font-mono">
                {displayRefNumber}
              </span>
              {loi.revision_number && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-400">
                  Revision #{loi.revision_number}
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  isInvestorApproved
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                    : loi.status === 'customized_terms_sent'
                    ? 'bg-blue-100 text-blue-900 border-blue-400 animate-pulse'
                    : isConfirmed
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                    : 'bg-amber-100 text-amber-900 border-amber-400'
                }`}
              >
                {isInvestorApproved
                  ? 'Investor Approved & Resubmitted'
                  : loi.status === 'customized_terms_sent'
                  ? 'Customized Terms Dispatched'
                  : isConfirmed
                  ? 'Official LOI Recorded'
                  : 'Live Document Preview'}
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 font-bold">
              Sugartown Retail Standard Franchise LOI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            title="Copy Text to Clipboard"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFD100] hover:bg-[#ffe14c] text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Formal LOI Legal Document Layout */}
      <div
        ref={documentRef}
        id="official-loi-document"
        className="p-6 sm:p-10 font-serif text-neutral-900 leading-relaxed text-sm bg-white print:p-0 print:border-none print:shadow-none"
      >
        {/* Corporate Header */}
        <div className="border-b-2 border-neutral-300 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#FF5C00] flex items-center justify-center text-white font-sans font-black text-lg border border-black">
                  S
                </div>
                <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight uppercase text-black">
                  SUGARTOWN RETAIL PRIVATE LIMITED
                </h1>
              </div>
              <p className="text-[11px] font-sans text-neutral-600 font-bold uppercase tracking-wider">
                Corporate Identification No. (CIN): U47215PN2025PTC243386 • ROC Pune
              </p>
              <p className="text-[11px] font-sans text-neutral-600">
                Registered Office: 702, Workflow, Icon Tower, Laxminagar, Baner, Pune 411045, Maharashtra, India
              </p>
              <p className="text-[11px] font-sans text-neutral-600">
                Official Franchise Desk: info@sugartown.in | +91 91454 48010 | www.sugartownindia.com
              </p>
            </div>

            <div className="text-left sm:text-right font-sans">
              <div className="inline-block bg-neutral-100 border border-neutral-300 rounded-lg p-2.5 text-left">
                <p className="text-[10px] font-bold text-neutral-500 uppercase">Document Reference</p>
                <p className="text-xs font-mono font-black text-black">{displayRefNumber}</p>
                <p className="text-[10px] font-bold text-neutral-500 uppercase mt-1">Date of Intent</p>
                <p className="text-xs font-mono font-bold text-black">{submissionDateStr}</p>
                {loi.revision_number && (
                  <>
                    <p className="text-[10px] font-bold text-purple-700 uppercase mt-1">Custom Revision</p>
                    <p className="text-xs font-mono font-bold text-purple-900">
                      Rev #{loi.revision_number} {modifiedDateStr ? `(${modifiedDateStr})` : ''}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-6">
          <h2 className="text-lg sm:text-xl font-bold font-sans uppercase tracking-wide text-black underline decoration-2 underline-offset-4">
            STANDARD FRANCHISE LETTER OF INTENT (LOI)
          </h2>
          <p className="text-xs font-sans text-neutral-600 mt-1 italic font-medium">
            {isCustomized
              ? '(Revised Commercial Terms & Customized Operational Covenant Stamped by Sugartown HQ)'
              : '(Expression of Interest & Commercial Commitment for Franchise-Owned Company-Operated FOCO Store)'}
          </p>
        </div>

        {/* Addressed To */}
        <div className="mb-6 font-sans text-xs">
          <p className="font-bold text-black">TO,</p>
          <p className="font-bold text-black">THE BOARD OF DIRECTORS / FRANCHISE ALLOTMENT COMMITTEE</p>
          <p className="text-neutral-700">SUGARTOWN RETAIL PRIVATE LIMITED</p>
          <p className="text-neutral-700">Pune, Maharashtra - 411045</p>
        </div>

        {/* Recital / Preamble */}
        <div className="space-y-4 text-xs sm:text-sm text-neutral-800 text-justify">
          <p>
            <strong>DEAR SIR/MADAM,</strong>
          </p>
          <p>
            I / We, the undersigned Applicant (hereinafter referred to as the <strong>"Prospective Franchisee / Investor"</strong>), 
            hereby formally submit this <strong>Letter of Intent (LOI)</strong> to express our firm commercial intent and financial capacity 
            to set up, fund, and own a <strong>Sugartown Live Candy Theater & Retail Store</strong> under the 100% 
            <strong> Franchise-Owned, Company-Operated (FOCO)</strong> model, subject to final mutual execution of the Master Franchise Agreement 
            and site feasibility verification.
          </p>

          {/* Section 1: Investor Profile */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-4 font-sans text-xs">
            <h3 className="font-bold uppercase tracking-wider text-black text-xs mb-2.5 pb-1 border-b border-neutral-300">
              1. APPLICANT & INVESTOR PROFILE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span className="text-neutral-500 font-bold">Full Legal Name: </span>
                <span className="font-bold text-black">{loi.full_name || '[Applicant Full Name]'}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">Constitution / Entity: </span>
                <span className="font-bold text-black capitalize">
                  {loi.entity_type ? loi.entity_type.replace('_', ' ') : 'Individual'}
                  {loi.entity_name ? ` (${loi.entity_name})` : ''}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">PAN / Tax ID: </span>
                <span className="font-mono font-bold text-black">{loi.pan_number || 'Declared in KYC'}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">Mobile & WhatsApp: </span>
                <span className="font-mono font-bold text-black">{loi.phone || '[Mobile Number]'}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">Official Email: </span>
                <span className="font-mono font-bold text-black">{loi.email || '[Official Email]'}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">Current City & State: </span>
                <span className="font-bold text-black">
                  {loi.current_city || '[City]'}, {loi.current_state || '[State]'}
                  {loi.pin_code ? ` - ${loi.pin_code}` : ''}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-neutral-500 font-bold">Residential / Reg. Address: </span>
                <span className="text-neutral-900">
                  {loi.current_address || '[Complete Registered Postal Address]'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-neutral-500 font-bold">Professional Background: </span>
                <span className="text-neutral-900">
                  {loi.profession_background || 'Business Owner / Professional Investor'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Franchise Commercial Terms */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-4 font-sans text-xs">
            <h3 className="font-bold uppercase tracking-wider text-black text-xs mb-2.5 pb-1 border-b border-neutral-300">
              2. PROPOSED FRANCHISE SCOPE & FINANCIAL COMMITMENT
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span className="text-neutral-500 font-bold">Target City / Territory: </span>
                <span className="font-bold text-[#FF5C00]">{loi.target_city || '[Target City]'}</span>
                {loi.target_state ? ` (${loi.target_state})` : ''}
              </div>
              <div>
                <span className="text-neutral-500 font-bold">Selected Store Format: </span>
                <span className="font-bold text-black">
                  {loi.investment_model || 'Express Kiosk & High-Street Boutique (₹25L)'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">Committed Capital: </span>
                <span className="font-bold text-emerald-700">{formattedAmount}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">Source of Investment: </span>
                <span className="font-bold text-black capitalize">
                  {loi.source_of_funds ? loi.source_of_funds.replace('_', ' ') : 'Self Liquid Capital'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-neutral-500 font-bold">Preferred Location / Mall: </span>
                <span className="font-bold text-black">
                  {loi.preferred_location || 'Prime Mall / High-Street (HQ Assisted)'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">Premises Status: </span>
                <span className="font-bold text-black capitalize">
                  {loi.site_status ? loi.site_status.replace('_', ' ') : 'Under Evaluation with HQ'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">Target Launch Timeline: </span>
                <span className="font-bold text-black">
                  {loi.target_launch_timeline ? loi.target_launch_timeline.replace('_', ' ') : '45 Days'}
                </span>
              </div>
              {loi.proposed_carpet_area_sqft && (
                <div>
                  <span className="text-neutral-500 font-bold">Proposed Carpet Area: </span>
                  <span className="font-bold text-black">{loi.proposed_carpet_area_sqft} sq.ft</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Customized Terms & Special Conditions (Rendered if HQ modified terms) */}
          {isCustomized && (
            <div className="bg-[#F8F5FF] border-2 border-purple-400 rounded-2xl p-4.5 my-4 font-sans text-xs shadow-[2px_2px_0px_0px_rgba(147,51,234,0.3)]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-purple-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
                  <h3 className="font-black uppercase tracking-wider text-purple-950 text-xs">
                    3. SPECIAL CUSTOMIZED TERMS & OPERATIONAL COVENANTS (HQ REVISION #{loi.revision_number || 1})
                  </h3>
                </div>
                {modifiedDateStr && (
                  <span className="text-[10px] font-bold text-purple-700">
                    Modified on {modifiedDateStr}
                  </span>
                )}
              </div>

              {loi.custom_terms_notes && (
                <div className="mb-3 p-3 bg-white rounded-xl border border-purple-200">
                  <p className="text-[10px] font-black uppercase text-purple-800 tracking-wider mb-1">
                    Corporate Committee Executive Remarks:
                  </p>
                  <p className="text-xs text-neutral-800 italic leading-relaxed">
                    "{loi.custom_terms_notes}"
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {loi.territory_exclusivity_days && (
                  <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                      Territory Exclusivity Window:
                    </span>
                    <span className="text-xs font-black text-purple-900">
                      {loi.territory_exclusivity_days} Days Lock-in from LOI Execution
                    </span>
                  </div>
                )}
                {loi.custom_royalty_percentage !== undefined && (
                  <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                      Tailored FOCO Payout / Margin:
                    </span>
                    <span className="text-xs font-black text-purple-900">
                      {loi.custom_royalty_percentage}% Net Profit Remittance to Partner
                    </span>
                  </div>
                )}
                {loi.special_rebates_or_support && (
                  <div className="p-2.5 bg-white rounded-xl border border-purple-100 sm:col-span-2">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                      Corporate Grants & Capex Support:
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      {loi.special_rebates_or_support}
                    </span>
                  </div>
                )}
                {loi.custom_foco_payout_terms && (
                  <div className="p-2.5 bg-white rounded-xl border border-purple-100 sm:col-span-2">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                      Payout & Remittance Schedule:
                    </span>
                    <span className="text-xs font-bold text-neutral-800">
                      {loi.custom_foco_payout_terms}
                    </span>
                  </div>
                )}
              </div>

              {loi.custom_terms && loi.custom_terms.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-black uppercase text-purple-900 tracking-wider">
                    Additional Agreed Clauses:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-neutral-800">
                    {loi.custom_terms.map((clause, idx) => (
                      <li key={idx} className="leading-normal">
                        <strong className="text-purple-950">Clause 3.{idx + 1}:</strong> {clause}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Key Legal Recitals */}
          <div className="space-y-3 pt-2">
            <h4 className="font-sans font-bold uppercase text-xs text-black tracking-wider">
              {isCustomized ? '4. STANDARD UNDERTAKINGS & FOCO FRAMEWORK ACCEPTANCE' : '3. STANDARD UNDERTAKINGS & FOCO FRAMEWORK ACCEPTANCE'}
            </h4>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-800">
              <li>
                <strong>Turnkey Company-Operated Model (FOCO):</strong> The Applicant acknowledges and agrees that the store operations, 
                staff recruitment, Live Candy Theater master candy craftsmen, billing software (POS), supply chain inventory, and visual 
                merchandising shall be 100% managed and supervised by Sugartown Retail Private Limited to maintain brand standards.
              </li>
              <li>
                <strong>Financial Capacity & Readiness:</strong> The Applicant confirms having immediate availability of unencumbered liquid funds 
                matching the committed investment amount to proceed with store fit-out and lease registration upon approval.
              </li>
              <li>
                <strong>Confidentiality & Non-Disclosure (NDA):</strong> All proprietary financial metrics, store architectural designs, unit economics, 
                recipes, and commercial terms disclosed by Sugartown shall remain strictly confidential and shall not be divulged to any third party.
              </li>
              <li>
                <strong>Territory Reservation & Validity:</strong> This LOI serves as a formal request for territory reservation for a period of 
                <strong> {loi.territory_exclusivity_days || 30} (Thirty) Days</strong> from the date of submission. Final exclusivity is subject to mutual execution of the Franchise Agreement.
              </li>
              <li>
                <strong>Non-Binding Intent:</strong> This document represents a genuine expression of commercial intent in good faith and does not constitute 
                a final legal partnership until the formal Franchise Agreement is executed between both parties.
              </li>
            </ol>
          </div>

          {/* Signature Blocks */}
          <div className="mt-8 pt-6 border-t-2 border-neutral-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans">
              {/* Applicant / Investor Signature */}
              <div className={`border rounded-xl p-4 ${isInvestorApproved ? 'bg-emerald-50/60 border-emerald-300' : 'bg-neutral-50 border-neutral-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    {isInvestorApproved ? 'APPROVED & COUNTER-SIGNED BY INVESTOR' : 'SUBMITTED & CONFIRMED BY APPLICANT'}
                  </p>
                  {isInvestorApproved && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-600 text-white">
                      Accepted & Approved
                    </span>
                  )}
                </div>
                <div className="min-h-[50px] flex items-center">
                  <span className="font-serif italic text-lg sm:text-xl font-bold text-blue-900">
                    {loi.investor_signature_name || loi.signatory_name || loi.full_name || 'Digital E-Signature'}
                  </span>
                </div>
                <div className="border-t border-neutral-300 pt-2 text-xs">
                  <p className="font-bold text-black">{loi.full_name || '[Applicant Name]'}</p>
                  <p className="text-neutral-600">{loi.signatory_title || 'Principal Investor'}</p>
                  <p className="text-[10px] text-neutral-500 font-mono mt-1">
                    {isInvestorApproved && investorApprovedDateStr
                      ? `Digitally Approved & Resubmitted on ${investorApprovedDateStr}`
                      : `Digitally Confirmed & Stamped on ${submissionDateStr}`}
                  </p>
                  {loi.investor_approval_notes && (
                    <p className="text-[10px] text-emerald-800 font-sans mt-1 bg-emerald-100 p-1.5 rounded">
                      Investor Remark: "{loi.investor_approval_notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Sugartown Corporate Authorization */}
              <div className={`border rounded-xl p-4 ${isCustomized ? 'bg-purple-50/50 border-purple-300' : 'bg-neutral-50 border-neutral-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    FOR SUGARTOWN RETAIL PRIVATE LIMITED
                  </p>
                  {isCustomized && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-700 text-white">
                      HQ Certified
                    </span>
                  )}
                </div>
                <div className="min-h-[50px] flex items-center justify-between">
                  <div>
                    <span className="font-serif italic text-sm font-bold text-neutral-800 block">
                      {loi.modified_by || 'Corporate Allotment Board'}
                    </span>
                    <span className="text-[10px] font-sans text-neutral-500 font-bold">
                      Digital Corporate Authorization
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-purple-600 border-dashed flex items-center justify-center text-[9px] font-black text-purple-700 uppercase text-center bg-purple-100">
                    HQ Seal
                  </div>
                </div>
                <div className="border-t border-neutral-300 pt-2 text-xs">
                  <p className="font-bold text-black">Authorized Signatory / Expansion Board</p>
                  <p className="text-neutral-600">Franchise Allotment Division (Pune HQ)</p>
                  <p className="text-[10px] text-neutral-500 font-mono mt-1">
                    CIN: U47215PN2025PTC243386
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

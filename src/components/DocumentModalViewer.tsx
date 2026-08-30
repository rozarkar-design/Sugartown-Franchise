import React, { useState } from 'react';
import { OfficialCompanyDocument } from '../data/companyDocuments';
import {
  X,
  Download,
  Printer,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Building,
  FileCheck,
  QrCode,
  Calendar,
  MapPin,
  Lock,
  Sparkles,
} from 'lucide-react';

interface DocumentModalViewerProps {
  document: OfficialCompanyDocument | null;
  onClose: () => void;
}

export const DocumentModalViewer: React.FC<DocumentModalViewerProps> = ({
  document,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(document.documentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate downloadable JSON / Text summary certificate
  const handleDownloadSummary = () => {
    const textContent = `
================================================================================
SUGARTOWN RETAIL PRIVATE LIMITED
OFFICIAL REGULATORY & CORPORATE COMPLIANCE CERTIFICATE
================================================================================

DOCUMENT: ${document.title}
CATEGORY: ${document.category}
REGISTRATION NUMBER: ${document.documentNumber} (${document.documentNumberLabel})
ISSUING AUTHORITY: ${document.issuingAuthority}
GOVERNING BODY: ${document.governingBody}
DATE OF ISSUE: ${document.dateOfIssue}
VALIDITY: ${document.validUntil || 'Perpetual'}
STATUS: ${document.status}

REGISTERED CORPORATE ADDRESS:
Office 101, 1st Floor, Navkar Commerce Centre,
Chinchwadgaon, Pune City, Pune - 411033, Maharashtra, India

SUMMARY OF REGISTRATION DETAILS:
${document.keyDetails.map((k) => `• ${k.label}: ${k.value}`).join('\n')}

VERIFICATION NOTE:
${document.summaryNote}

OFFICIAL GOVERNMENT VERIFICATION PORTAL:
${document.governmentPortalUrl} (${document.portalName})

--------------------------------------------------------------------------------
This document record is issued by Sugartown Retail Private Limited for prospective
franchise partners, commercial mall developers, and regulatory verifications.
Timestamp: ${new Date().toISOString()}
================================================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.id}-${document.documentNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="document-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id={`document-modal-${document.id}`}
        className="w-full max-w-3xl bg-white rounded-[28px] border-3 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 my-auto max-h-[92vh] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-black/15 flex-shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF5C00] text-white border-2 border-black">
                {document.category}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-500">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{document.status}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-black tracking-tight mt-1">
              {document.title}
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              {document.governingBody}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-black hover:bg-neutral-100 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all flex-shrink-0"
            title="Close document viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Certificate Body */}
        <div className="overflow-y-auto pr-1 space-y-5 flex-1 print:overflow-visible">
          {/* Certificate Digital Box Display */}
          <div className="p-5 sm:p-7 rounded-[22px] bg-gradient-to-b from-[#FFFDF9] to-[#FFF9F2] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden space-y-5">
            {/* Watermark Emblem */}
            <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none">
              <div className="w-64 h-64 rounded-full border-8 border-black flex items-center justify-center font-black text-9xl">
                S
              </div>
            </div>

            {/* Certificate Top Header */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-black/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD100] border-2 border-black text-[11px] font-black text-black">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>GOVERNMENT OF INDIA REGULATORY RECORD</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-black pt-1">
                {document.issuingAuthority}
              </h3>
              <p className="text-xs text-neutral-600 font-bold uppercase tracking-wider">
                {document.governingBody}
              </p>
            </div>

            {/* Document ID Highlight Bar */}
            <div className="p-3.5 rounded-xl bg-white border-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block">
                  {document.documentNumberLabel}
                </span>
                <span className="font-mono text-base sm:text-lg font-black text-black tracking-wide select-all">
                  {document.documentNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyNumber}
                className="py-1.5 px-3 rounded-lg border-2 border-black bg-neutral-100 hover:bg-[#FFD100] text-xs font-black text-black flex items-center gap-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied ID' : 'Copy Number'}</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed bg-white/70 p-3.5 rounded-xl border border-black/15">
              {document.description}
            </p>

            {/* Key Field Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {document.keyDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-black/20 space-y-0.5"
                >
                  <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider block">
                    {detail.label}
                  </span>
                  <span className="text-xs font-bold text-black leading-snug block">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Dates & Validity Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-neutral-100 border border-black/20">
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Date of Issue</span>
                <span className="text-xs font-black text-black">{document.dateOfIssue}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-100 border border-black/20">
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Validity</span>
                <span className="text-xs font-black text-black">{document.validUntil || 'Permanent'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-100 border border-black/20">
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Compliance</span>
                <span className="text-xs font-black text-emerald-700">100% Verified</span>
              </div>
            </div>

            {/* Footer Seal & Note */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-300 flex items-start gap-2 text-[11px] text-amber-900 font-medium">
              <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Legal Authenticity:</strong> {document.summaryNote}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-3 border-t-2 border-black/15 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <a
            href={document.governmentPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-black text-neutral-800 hover:text-black flex items-center gap-1.5 underline underline-offset-2"
          >
            <span>Verify on {document.portalName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="bento-btn-secondary py-2 px-3 text-xs"
              title="Print Document / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadSummary}
              className="bento-btn-primary py-2 px-4 text-xs"
              title="Download text certificate"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

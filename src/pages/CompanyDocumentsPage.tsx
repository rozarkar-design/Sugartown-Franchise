import React, { useState, useMemo } from 'react';
import {
  OFFICIAL_COMPANY_DOCUMENTS,
  OfficialCompanyDocument,
} from '../data/companyDocuments';
import { DocumentModalViewer } from '../components/DocumentModalViewer';
import {
  FileText,
  ShieldCheck,
  Download,
  ExternalLink,
  Eye,
  Search,
  CheckCircle2,
  Building,
  Award,
  FileCheck2,
  Copy,
  Check,
  Lock,
  Sparkles,
  ArrowRight,
  Printer,
  FolderArchive,
  Layers,
} from 'lucide-react';

interface CompanyDocumentsPageProps {
  onNavigate: (path: string) => void;
}

export const CompanyDocumentsPage: React.FC<CompanyDocumentsPageProps> = ({
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDoc, setActiveDoc] = useState<OfficialCompanyDocument | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Incorporation & MCA',
    'Food Safety & FSSAI',
    'Startup & MSME',
    'Tax & Compliance',
    'Trade & IEC',
    'Constitutional',
  ];

  const filteredDocuments = useMemo(() => {
    return OFFICIAL_COMPANY_DOCUMENTS.filter((doc) => {
      const matchCategory =
        selectedCategory === 'All' || doc.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        doc.title.toLowerCase().includes(query) ||
        doc.shortTitle.toLowerCase().includes(query) ||
        doc.documentNumber.toLowerCase().includes(query) ||
        doc.issuingAuthority.toLowerCase().includes(query) ||
        doc.governingBody.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadMasterDossier = () => {
    const dossierText = `
================================================================================
SUGARTOWN RETAIL PRIVATE LIMITED
OFFICIAL CORPORATE CREDENTIALS & COMPLIANCE DOSSIER
================================================================================
Company Name: SUGARTOWN RETAIL PRIVATE LIMITED
CIN: U47215PN2025PTC243386
Date of Incorporation: 26th June 2025
ROC: ROC Pune, Maharashtra
Registered Office: Office 101, 1st Floor, Navkar Commerce Centre, Chinchwadgaon,
                   Pune - 411033, Maharashtra, India
Corporate Office: Flat 702, Workflo Icon Tower, Baner, Pune - 411045
Email: info@sugartown.in / sugartownretail@gmail.com
Phone / WhatsApp: +91 91454 48010
Official Website: www.sugartownindia.com
Dossier Generated: ${new Date().toISOString()}

--------------------------------------------------------------------------------
1. STATUTORY & REGULATORY REGISTRATIONS SUMMARY
--------------------------------------------------------------------------------
${OFFICIAL_COMPANY_DOCUMENTS.map(
  (doc, index) => `
[${index + 1}] ${doc.title.toUpperCase()}
• Category: ${doc.category}
• Reg/Doc Number: ${doc.documentNumber} (${doc.documentNumberLabel})
• Issuing Authority: ${doc.issuingAuthority}
• Governing Body: ${doc.governingBody}
• Date of Issue: ${doc.dateOfIssue}
• Validity: ${doc.validUntil || 'Perpetual'}
• Status: ${doc.status}
• Description: ${doc.description}
• Verification Link: ${doc.governmentPortalUrl}
`
).join('\n--------------------------------------------------------------------------------\n')}

================================================================================
CORPORATE GOVERNANCE & LEGAL ASSURANCE:
All documents listed above are registered with the respective statutory ministries
and authorities of the Government of India and Government of Maharashtra.
Prospective franchise partners, mall leasing directors, and institutional vendors
may verify authenticity on respective public portals.
================================================================================
    `.trim();

    const blob = new Blob([dossierText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sugartown-Corporate-Credentials-Dossier-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="company-documents-page"
      className="space-y-12 sm:space-y-16 py-8 sm:py-12 pb-24"
    >
      {/* ---------------------------------------------------- */}
      {/* HEADER SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD100] border-2 border-black text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>STATUTORY REGISTRATIONS & VERIFIED CREDENTIALS</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black uppercase tracking-tight leading-tight">
            Company Documents & Compliance
          </h1>
          <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-3xl mx-auto leading-relaxed">
            Sugartown Retail Private Limited is fully incorporated and licensed under the Ministry of Corporate Affairs, FSSAI, DPIIT Startup India, and the Income Tax Department. Review and download official compliance certificates below.
          </p>
        </div>

        {/* Corporate Trust Badges Bento Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-2">
          <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left space-y-1">
            <span className="text-[10px] font-black uppercase text-neutral-500 block">MCA Incorporation</span>
            <div className="text-sm sm:text-base font-black text-black">CIN U47215PN...</div>
            <span className="text-[11px] font-bold text-emerald-700 block">ROC Pune • Active</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left space-y-1">
            <span className="text-[10px] font-black uppercase text-neutral-500 block">Food Safety License</span>
            <div className="text-sm sm:text-base font-black text-black">FSSAI Certified</div>
            <span className="text-[11px] font-bold text-emerald-700 block">Valid Upto 2031 (5 Yrs)</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left space-y-1">
            <span className="text-[10px] font-black uppercase text-neutral-500 block">Govt Recognition</span>
            <div className="text-sm sm:text-base font-black text-black">Startup India</div>
            <span className="text-[11px] font-bold text-emerald-700 block">DPIIT Recognized</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left space-y-1">
            <span className="text-[10px] font-black uppercase text-neutral-500 block">MSME & Trade</span>
            <div className="text-sm sm:text-base font-black text-black">Udyam & IEC</div>
            <span className="text-[11px] font-bold text-emerald-700 block">Micro Manufacturing</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SEARCH & FILTER CONTROLS */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="company-docs-search-input"
              type="text"
              placeholder="Search by document name, CIN, PAN, FSSAI number, or authority..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black text-xs sm:text-sm font-bold text-black placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
            />
          </div>

          {/* Master Download Action */}
          <button
            id="download-master-dossier-btn"
            onClick={handleDownloadMasterDossier}
            className="bento-btn-primary py-2.5 px-4 text-xs flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FolderArchive className="w-4 h-4" />
            <span>Download All Credentials Dossier</span>
          </button>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const count =
              cat === 'All'
                ? OFFICIAL_COMPANY_DOCUMENTS.length
                : OFFICIAL_COMPANY_DOCUMENTS.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-4 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#FFD100] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-neutral-700 hover:text-black border-2 border-black/20 hover:border-black'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* DOCUMENTS GRID */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDocuments.length === 0 ? (
          <div className="bento-card text-center py-16 space-y-4">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="text-xl font-black uppercase text-black">No Documents Found</h3>
            <p className="text-xs text-neutral-600">
              No statutory documents matched your filter "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bento-btn-secondary text-xs py-2 px-4 inline-block"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                id={`company-doc-card-${doc.id}`}
                className="bento-card flex flex-col justify-between space-y-4 group hover:border-black transition-all"
              >
                <div className="space-y-3.5">
                  {/* Category & Status Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF5C00] text-white border border-black">
                      {doc.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{doc.status}</span>
                    </span>
                  </div>

                  {/* Title & Authority */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-black uppercase tracking-tight text-black leading-snug">
                      {doc.shortTitle}
                    </h3>
                    <p className="text-xs text-neutral-600 font-semibold">
                      {doc.issuingAuthority}
                    </p>
                  </div>

                  {/* Number Copy Box */}
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-black/15 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase text-neutral-500 block truncate">
                        {doc.documentNumberLabel}
                      </span>
                      <span className="font-mono text-xs font-black text-black block truncate">
                        {doc.documentNumber}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(doc.id, doc.documentNumber)}
                      className="p-1.5 rounded-lg border border-black bg-white hover:bg-[#FFD100] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-colors flex-shrink-0"
                      title="Copy document number"
                    >
                      {copiedId === doc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-700 font-medium leading-relaxed line-clamp-3">
                    {doc.description}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-neutral-500">
                    Issued: {doc.dateOfIssue}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDoc(doc)}
                      className="bento-btn-secondary py-1.5 px-2.5 text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => setActiveDoc(doc)}
                      className="bento-btn-primary py-1.5 px-3 text-xs flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* GOVERNMENT VERIFICATION DIRECTORY */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-[28px] bg-white border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5C00]">
              PUBLIC REPOSITORY & PORTAL VERIFICATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black">
              Direct Government Verification Links
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 font-medium">
              You can independently verify all Sugartown corporate credentials on official statutory portals by quoting the respective registration numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://www.mca.gov.in/mcafoportal/showCheckCompanyName.do"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border-2 border-black bg-[#F8FAFC] hover:bg-[#FFD100] transition-colors group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-500 block">MCA Portal</span>
                <span className="text-sm font-black text-black block">Verify CIN U47215PN...</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black text-neutral-800">
                <span>mca.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://foscos.fssai.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border-2 border-black bg-[#F8FAFC] hover:bg-[#FFD100] transition-colors group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-500 block">FSSAI FoSCoS</span>
                <span className="text-sm font-black text-black block">Verify Reg 2152608...</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black text-neutral-800">
                <span>foscos.fssai.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://udyamregistration.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border-2 border-black bg-[#F8FAFC] hover:bg-[#FFD100] transition-colors group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-500 block">MSME Udyam</span>
                <span className="text-sm font-black text-black block">Verify UDYAM-MH-26...</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black text-neutral-800">
                <span>udyamregistration.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://dgft.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border-2 border-black bg-[#F8FAFC] hover:bg-[#FFD100] transition-colors group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-500 block">DGFT Trade</span>
                <span className="text-sm font-black text-black block">Verify IEC ABQCS595...</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black text-neutral-800">
                <span>dgft.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FRANCHISE PARTNERSHIP CTA */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-[32px] bg-[#FF5C00] border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white text-black font-black text-xs uppercase border border-black">
              Ready to Partner With Us?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Launch Your Own Sugartown Live Candy Theater
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-medium max-w-xl">
              100% compliant FOCO model with turnkey equipment, corporate operations, and full legal transparency.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <button
              onClick={() => onNavigate('/inquiry')}
              className="w-full sm:w-auto py-3 px-6 rounded-2xl border-2 border-black bg-[#FFD100] text-black font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-white active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Apply For Franchise</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/calculator')}
              className="w-full sm:w-auto py-3 px-6 rounded-2xl border-2 border-black bg-white text-black font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 active:translate-y-0.5 transition-all"
            >
              <span>Calculate ROI</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal Document Viewer */}
      <DocumentModalViewer
        document={activeDoc}
        onClose={() => setActiveDoc(null)}
      />
    </div>
  );
};

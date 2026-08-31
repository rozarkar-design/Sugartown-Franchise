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
  Building2,
  Award,
  Copy,
  Check,
  ArrowRight,
  FolderArchive,
  Layers,
  LayoutGrid,
  Table,
  Globe2,
  Utensils,
  Receipt,
  Scale,
} from 'lucide-react';

interface CompanyDocumentsPageProps {
  onNavigate: (path: string) => void;
}

type ViewMode = 'categorized' | 'grid' | 'table';

export const CompanyDocumentsPage: React.FC<CompanyDocumentsPageProps> = ({
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('categorized');
  const [activeDoc, setActiveDoc] = useState<OfficialCompanyDocument | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categoryList = [
    { id: 'All', label: 'All Documents', icon: Layers },
    { id: 'Incorporation & MCA', label: 'Incorporation & MCA', icon: Building2 },
    { id: 'Food Safety & FSSAI', label: 'Food Safety & FSSAI', icon: Utensils },
    { id: 'Startup & MSME', label: 'Startup India & MSME', icon: Award },
    { id: 'Tax & Compliance', label: 'Tax & Direct TDS', icon: Receipt },
    { id: 'Trade & IEC', label: 'Trade & Foreign Import', icon: Globe2 },
    { id: 'Constitutional', label: 'Constitutional (MOA/AOA)', icon: Scale },
  ];

  // Helper icon for documents
  const getDocIcon = (category: string) => {
    switch (category) {
      case 'Incorporation & MCA':
        return <Building2 className="w-5 h-5 text-[#FF5C00]" />;
      case 'Food Safety & FSSAI':
        return <Utensils className="w-5 h-5 text-emerald-600" />;
      case 'Startup & MSME':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'Tax & Compliance':
        return <Receipt className="w-5 h-5 text-blue-600" />;
      case 'Trade & IEC':
        return <Globe2 className="w-5 h-5 text-indigo-600" />;
      case 'Constitutional':
        return <Scale className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-neutral-700" />;
    }
  };

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

  // Grouped documents for Categorized View
  const groupedCategories = useMemo(() => {
    const categoriesOrder = [
      {
        name: 'Incorporation & MCA',
        title: 'Ministry of Corporate Affairs & ROC Records',
        description: 'Statutory certificate of incorporation, corporate identity number (CIN), and active MCA status.',
        icon: Building2,
      },
      {
        name: 'Food Safety & FSSAI',
        title: 'Food Safety & Standards Authority of India (FSSAI)',
        description: 'Statutory 5-year food manufacturing and retail license under Category 05 (Confectionery).',
        icon: Utensils,
      },
      {
        name: 'Startup & MSME',
        title: 'DPIIT Startup India & Ministry of MSME Recognitions',
        description: 'Official Government of India national startup recognition and Udyam manufacturing credentials.',
        icon: Award,
      },
      {
        name: 'Tax & Compliance',
        title: 'Direct Taxation & Financial Registrations',
        description: 'Income Tax Department verified e-PAN and TAN allotment certificates.',
        icon: Receipt,
      },
      {
        name: 'Trade & IEC',
        title: 'Directorate General of Foreign Trade (DGFT)',
        description: 'Statutory Importer-Exporter Code for international machinery and specialty confectionery trade.',
        icon: Globe2,
      },
      {
        name: 'Constitutional',
        title: 'Constitutional Charters (e-MOA & e-AOA)',
        description: 'Memorandum and Articles of Association registered with the Central Registration Centre.',
        icon: Scale,
      },
    ];

    return categoriesOrder
      .map((cat) => {
        const docs = filteredDocuments.filter((d) => d.category === cat.name);
        return {
          ...cat,
          docs,
        };
      })
      .filter((cat) => cat.docs.length > 0);
  }, [filteredDocuments]);

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
      className="space-y-10 sm:space-y-14 py-8 sm:py-12 pb-24"
    >
      {/* ---------------------------------------------------- */}
      {/* HEADER & HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD100] border-2 border-black text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>STATUTORY COMPLIANCE & CORPORATE CREDENTIALS REGISTRY</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black uppercase tracking-tight leading-tight">
            Company Documents & Compliance
          </h1>
          <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-3xl mx-auto leading-relaxed">
            Sugartown Retail Private Limited is 100% compliant with the Ministry of Corporate Affairs, FSSAI Food Safety, DPIIT Startup India, and the Income Tax Department. Review certificates and verify authenticity below.
          </p>
        </div>

        {/* Master Corporate Entity Strip */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-black/10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5C00] border-2 border-black flex items-center justify-center text-white font-black text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                S
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                  Corporate Entity Profile
                </span>
                <h2 className="text-base sm:text-xl font-black text-black uppercase tracking-tight">
                  SUGARTOWN RETAIL PRIVATE LIMITED
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-neutral-600 mt-0.5">
                  <span>CIN: U47215PN2025PTC243386</span>
                  <span className="text-neutral-300">•</span>
                  <span>ROC Pune (Maharashtra)</span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-emerald-700 font-black">Status: ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="submit-loi-banner-btn"
                onClick={() => onNavigate('/loi')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFD100] hover:bg-[#ffe14c] text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#FF5C00]" />
                <span>Fill Franchise LOI Online</span>
              </button>

              <button
                id="download-master-dossier-btn"
                onClick={handleDownloadMasterDossier}
                className="bento-btn-primary py-2.5 px-4 text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap"
              >
                <FolderArchive className="w-4 h-4" />
                <span>Download Compliance Dossier</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-neutral-50 border-2 border-black/15 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">MCA Incorporation</span>
              <div className="text-xs sm:text-sm font-black text-black truncate">26th June 2025</div>
              <span className="text-[10px] font-bold text-emerald-700 block">Form INC-11</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 border-2 border-black/15 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">FSSAI Food License</span>
              <div className="text-xs sm:text-sm font-black text-black truncate">21526082001908</div>
              <span className="text-[10px] font-bold text-emerald-700 block">Valid Upto 2031 (5 Yrs)</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 border-2 border-black/15 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">DPIIT Startup India</span>
              <div className="text-xs sm:text-sm font-black text-black truncate">DIPP270712</div>
              <span className="text-[10px] font-bold text-emerald-700 block">Valid Upto 2035 (10 Yrs)</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 border-2 border-black/15 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">MSME & Foreign Trade</span>
              <div className="text-xs sm:text-sm font-black text-black truncate">Udyam & IEC Active</div>
              <span className="text-[10px] font-bold text-emerald-700 block">Micro Manufacturing</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* STRUCTURED CONTROLS BAR: SEARCH, TABS & VIEW TOGGLE */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Top Control Strip */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="company-docs-search-input"
              type="text"
              placeholder="Search by document title, CIN, PAN, FSSAI, SRN, or ministry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-xl border-2 border-black text-xs sm:text-sm font-bold text-black placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-400 hover:text-black"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Controls: Result Count & View Mode Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
            <span className="text-xs font-bold text-neutral-600">
              Showing <span className="font-black text-black">{filteredDocuments.length}</span> of{' '}
              <span className="font-black text-black">{OFFICIAL_COMPANY_DOCUMENTS.length}</span> Records
            </span>

            {/* View Mode Toggle Buttons */}
            <div className="inline-flex items-center p-1 rounded-xl bg-neutral-100 border-2 border-black gap-1">
              <button
                onClick={() => setViewMode('categorized')}
                className={`p-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 transition-all ${
                  viewMode === 'categorized'
                    ? 'bg-[#FFD100] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-neutral-600 hover:text-black'
                }`}
                title="Grouped by Regulatory Category"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sections</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#FFD100] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-neutral-600 hover:text-black'
                }`}
                title="Unified 3-Column Bento Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#FFD100] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-neutral-600 hover:text-black'
                }`}
                title="Corporate Audit Ledger View"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Tabs Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryList.map((cat) => {
            const active = selectedCategory === cat.id;
            const count =
              cat.id === 'All'
                ? OFFICIAL_COMPANY_DOCUMENTS.length
                : OFFICIAL_COMPANY_DOCUMENTS.filter((d) => d.category === cat.id).length;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-3.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                  active
                    ? 'bg-[#FFD100] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-neutral-700 hover:text-black border-2 border-black/20 hover:border-black'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    active ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700'
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
      {/* DOCUMENTS DISPLAY AREA */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDocuments.length === 0 ? (
          <div className="bento-card text-center py-16 space-y-4">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="text-xl font-black uppercase text-black">No Statutory Records Found</h3>
            <p className="text-xs text-neutral-600 max-w-md mx-auto">
              No government records matched your search query "{searchQuery}". Try searching with CIN, PAN, FSSAI, or document title.
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
        ) : viewMode === 'categorized' && selectedCategory === 'All' ? (
          /* ==================================================== */
          /* CATEGORIZED SECTIONS VIEW (ORGANIZED BY MINISTRY) */
          /* ==================================================== */
          <div className="space-y-12">
            {groupedCategories.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div key={group.name} className="space-y-5">
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-black">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#FFD100] border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <GroupIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black">
                          {group.title}
                        </h2>
                        <p className="text-xs text-neutral-600 font-medium">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black text-neutral-500 uppercase px-3 py-1 bg-neutral-100 rounded-full border border-black/15 self-start sm:self-auto">
                      {group.docs.length} {group.docs.length === 1 ? 'Record' : 'Records'}
                    </span>
                  </div>

                  {/* Documents Grid in this Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.docs.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        doc={doc}
                        copiedId={copiedId}
                        onCopy={handleCopy}
                        onInspect={setActiveDoc}
                        getDocIcon={getDocIcon}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewMode === 'grid' || (viewMode === 'categorized' && selectedCategory !== 'All') ? (
          /* ==================================================== */
          /* UNIFIED GRID VIEW */
          /* ==================================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                copiedId={copiedId}
                onCopy={handleCopy}
                onInspect={setActiveDoc}
                getDocIcon={getDocIcon}
              />
            ))}
          </div>
        ) : (
          /* ==================================================== */
          /* AUDIT TABLE / LEDGER VIEW */
          /* ==================================================== */
          <div className="bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="p-4 sm:p-5 border-b-2 border-black bg-neutral-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black uppercase text-black">
                  Statutory Compliance Audit Register
                </h3>
                <p className="text-xs text-neutral-600 font-medium">
                  Official registry of all statutory licenses, filings, and government credentials.
                </p>
              </div>
              <button
                onClick={handleDownloadMasterDossier}
                className="bento-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white border-b-2 border-black text-black font-black uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Registration No.</th>
                    <th className="py-3 px-4">Issuing Authority</th>
                    <th className="py-3 px-4">Date of Issue</th>
                    <th className="py-3 px-4">Validity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 font-medium">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-black">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-neutral-100 border border-black/20 flex-shrink-0">
                            {getDocIcon(doc.category)}
                          </span>
                          <span className="font-black text-black uppercase tracking-tight">
                            {doc.shortTitle}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-100 border border-black/20 text-neutral-800">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-black">
                        <div className="flex items-center gap-1.5">
                          <span>{doc.documentNumber}</span>
                          <button
                            onClick={() => handleCopy(doc.id, doc.documentNumber)}
                            className="p-1 text-neutral-400 hover:text-black"
                            title="Copy number"
                          >
                            {copiedId === doc.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700 max-w-[200px] truncate" title={doc.issuingAuthority}>
                        {doc.issuingAuthority}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-neutral-600">
                        {doc.dateOfIssue}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-black">
                        {doc.validUntil || 'Perpetual'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{doc.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveDoc(doc)}
                            className="bento-btn-secondary py-1 px-2.5 text-[11px] flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>
                          <a
                            href={doc.governmentPortalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-black hover:bg-[#FFD100] text-black"
                            title={`Verify on ${doc.portalName}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* GOVERNMENT VERIFICATION REPOSITORY */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-[28px] bg-white border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5C00]">
              PUBLIC VERIFICATION DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black">
              Direct Statutory Portal Verification
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 font-medium">
              You can independently authenticate any Sugartown registration number on the official Government of India public portals:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://www.mca.gov.in/mcafoportal/showCheckCompanyName.do"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border-2 border-black bg-[#F8FAFC] hover:bg-[#FFD100] transition-all group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-neutral-500">MCA Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-sm font-black text-black block">Verify CIN & Master Data</span>
                <p className="text-[11px] text-neutral-600 font-mono">CIN: U47215PN2025PTC243386</p>
              </div>
              <span className="text-xs font-black text-neutral-800 underline underline-offset-2">
                mca.gov.in
              </span>
            </a>

            <a
              href="https://foscos.fssai.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border-2 border-black bg-[#F8FAFC] hover:bg-[#FFD100] transition-all group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-neutral-500">FSSAI FoSCoS</span>
                  <ExternalLink className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-sm font-black text-black block">Verify Food License</span>
                <p className="text-[11px] text-neutral-600 font-mono">Reg: 21526082001908</p>
              </div>
              <span className="text-xs font-black text-neutral-800 underline underline-offset-2">
                foscos.fssai.gov.in
              </span>
            </a>

            <a
              href="https://udyamregistration.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border-2 border-black bg-[#F8FAFC] hover:bg-[#FFD100] transition-all group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-neutral-500">MSME Udyam</span>
                  <ExternalLink className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-sm font-black text-black block">Verify MSME Status</span>
                <p className="text-[11px] text-neutral-600 font-mono">UDYAM-MH-26-0960597</p>
              </div>
              <span className="text-xs font-black text-neutral-800 underline underline-offset-2">
                udyamregistration.gov.in
              </span>
            </a>

            <a
              href="https://dgft.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border-2 border-black bg-[#F8FAFC] hover:bg-[#FFD100] transition-all group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-neutral-500">DGFT Trade</span>
                  <ExternalLink className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-sm font-black text-black block">Verify Importer-Exporter IEC</span>
                <p className="text-[11px] text-neutral-600 font-mono">IEC: ABQCS5950B</p>
              </div>
              <span className="text-xs font-black text-neutral-800 underline underline-offset-2">
                dgft.gov.in
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FRANCHISE APPLICATION BANNER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-[32px] bg-[#FF5C00] border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white text-black font-black text-xs uppercase border border-black">
              FOCO Franchise Model
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Partner with an MCA & FSSAI Certified Brand
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-medium max-w-xl">
              100% turnkey corporate store operations with audited financials, centralized supply chain, and high ROI.
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

/* ==================================================== */
/* SUB-COMPONENT: UNIFIED EQUAL-HEIGHT DOCUMENT CARD */
/* ==================================================== */
interface DocumentCardProps {
  doc: OfficialCompanyDocument;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
  onInspect: (doc: OfficialCompanyDocument) => void;
  getDocIcon: (category: string) => React.ReactNode;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  copiedId,
  onCopy,
  onInspect,
  getDocIcon,
}) => {
  return (
    <div
      id={`company-doc-card-${doc.id}`}
      className="bento-card flex flex-col justify-between space-y-4 group hover:border-black transition-all bg-white"
    >
      <div className="space-y-3.5">
        {/* Category & Status Pill Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-lg bg-neutral-100 border border-black/15">
              {getDocIcon(doc.category)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF5C00] text-white border border-black">
              {doc.category}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span className="truncate max-w-[120px]">{doc.status}</span>
          </span>
        </div>

        {/* Title & Authority */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-black leading-snug">
            {doc.shortTitle}
          </h3>
          <p className="text-xs text-neutral-600 font-semibold line-clamp-1" title={doc.issuingAuthority}>
            {doc.issuingAuthority}
          </p>
        </div>

        {/* Monospace Reg Number Copy Box */}
        <div className="p-2.5 rounded-xl bg-neutral-50 border-2 border-black/15 flex items-center justify-between gap-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-black uppercase text-neutral-500 block truncate">
              {doc.documentNumberLabel}
            </span>
            <span className="font-mono text-xs font-black text-black block truncate select-all">
              {doc.documentNumber}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onCopy(doc.id, doc.documentNumber)}
            className="py-1 px-2 rounded-lg border border-black bg-white hover:bg-[#FFD100] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-colors flex items-center gap-1 text-[11px] font-black flex-shrink-0"
            title="Copy document number"
          >
            {copiedId === doc.id ? (
              <>
                <Check className="w-3 h-3 text-emerald-700" />
                <span className="text-emerald-800 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-700 font-medium leading-relaxed line-clamp-3">
          {doc.description}
        </p>

        {/* Attributes Mini Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2 rounded-lg bg-neutral-50 border border-black/10">
            <span className="text-[9px] font-black uppercase text-neutral-500 block">Issued</span>
            <span className="font-bold text-black truncate block">{doc.dateOfIssue}</span>
          </div>
          <div className="p-2 rounded-lg bg-neutral-50 border border-black/10">
            <span className="text-[9px] font-black uppercase text-neutral-500 block">Validity</span>
            <span className="font-bold text-black truncate block">{doc.validUntil || 'Perpetual'}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between gap-2">
        <a
          href={doc.governmentPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-black text-neutral-700 hover:text-black flex items-center gap-1 underline underline-offset-2 truncate"
          title={`Verify on ${doc.portalName}`}
        >
          <span>{doc.portalName}</span>
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onInspect(doc)}
            className="bento-btn-secondary py-1.5 px-2.5 text-xs flex items-center gap-1"
            title="Inspect full details & certificate"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect</span>
          </button>

          <button
            onClick={() => onInspect(doc)}
            className="bento-btn-primary py-1.5 px-3 text-xs flex items-center gap-1"
            title="Download certificate"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

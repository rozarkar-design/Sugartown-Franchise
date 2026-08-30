import React, { useState } from 'react';
import { ResourceDocument } from '../types';
import {
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  Eye,
  ShieldCheck,
  X,
} from 'lucide-react';

interface ResourcesPageProps {
  documents: ResourceDocument[];
  onNavigate: (path: string) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ documents, onNavigate }) => {
  const [activeDoc, setActiveDoc] = useState<ResourceDocument | null>(null);

  return (
    <div id="resources-page-container" className="space-y-12 sm:space-y-16 py-8 sm:py-12 pb-24">
      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="bento-pill bg-[#FFD100] text-black">
          <FileText className="w-4 h-4" />
          <span>OFFICIAL DOCUMENTATION</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
          Sugartown Resource Center
        </h1>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-2xl mx-auto leading-relaxed">
          Access official franchise information memoranda, FOCO governance guidelines, unit economics models, and expansion roadmaps.
        </p>

        <div className="pt-2">
          <button
            id="resources-go-to-company-docs-btn"
            onClick={() => onNavigate('/company-documents')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FFD100] border-2 border-black text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors active:translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#FF5C00]" />
            <span>Looking for MCA Incorporation, FSSAI & Startup India Certificates? View Company Documents</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* DOCUMENTS GRID */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              id={`resource-doc-card-${doc.id}`}
              className="bento-card flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-black bg-[#FF5C00] text-white">
                    {doc.category}
                  </span>
                  <span className="text-[11px] font-mono text-black font-bold">
                    {doc.version}
                  </span>
                </div>

                <h3 className="text-base font-black uppercase tracking-tight text-black leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-black/10 flex items-center justify-between">
                <span className="text-[11px] text-neutral-600 font-mono font-bold">
                  {doc.file_size || 'PDF Document'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveDoc(doc)}
                    className="bento-btn-secondary py-1.5 px-3 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bento-btn-primary py-1.5 px-3 text-xs"
                  >
                    <span>Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Document Detail / Viewer Modal */}
      {activeDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveDoc(null)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-[28px] border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b-2 border-black/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black bg-[#00FF66] text-black">
                  {activeDoc.category}
                </span>
                <h3 className="text-xl font-black uppercase text-black mt-2">
                  {activeDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="p-1.5 text-black hover:bg-neutral-100 rounded-full border-2 border-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed">
              <p>{activeDoc.description}</p>
              <div className="p-4 rounded-2xl bg-[#F3F4F6] border-2 border-black text-xs space-y-1.5">
                <div>
                  <strong className="text-black uppercase font-black">Version:</strong> {activeDoc.version}
                </div>
                <div>
                  <strong className="text-black uppercase font-black">Publish Authority:</strong> Sugartown Retail Private Limited
                </div>
                <div>
                  <strong className="text-black uppercase font-black">Confidentiality:</strong> Authorized for prospective franchise partners
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => setActiveDoc(null)}
                className="w-full sm:w-auto bento-btn-secondary"
              >
                Close
              </button>
              <a
                href={activeDoc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bento-btn-primary"
              >
                <span>View Google Drive Document</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

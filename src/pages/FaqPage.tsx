import React, { useState, useMemo } from 'react';
import { Faq } from '../types';
import { HelpCircle, Search, ChevronDown, ChevronUp, Sparkles, X, ArrowRight } from 'lucide-react';

interface FaqPageProps {
  faqs: Faq[];
  onNavigate: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ faqs, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true,
  });

  const categories = ['All', 'FOCO', 'Investment', 'ROI', 'Franchise', 'Operations', 'Territory', 'Setup', 'Support'];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div id="faq-page-container" className="space-y-12 sm:space-y-16 py-8 sm:py-12 pb-24">
      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="bento-pill bg-[#00FF66] text-black">
          <HelpCircle className="w-4 h-4" />
          <span>KNOWLEDGE BASE & FAQ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
          Frequently Asked Questions
        </h1>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-2xl mx-auto leading-relaxed">
          Comprehensive answers covering our FOCO operations, turnkey investment formats, financial projections, and site approvals.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input
            id="faq-search-input"
            type="text"
            placeholder="Search questions on FOCO, returns, operations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-2 border-black text-sm font-bold bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FAQ ACCORDION LIST */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bento-card">
            <p className="text-sm font-black uppercase text-black">No questions matched your search</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 bento-btn-primary py-2 px-4 text-xs"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = Boolean(openFaqIds[faq.id]);
            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className={`rounded-[24px] border-2 border-black transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <div
                  onClick={() => toggleFaq(faq.id)}
                  className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black bg-[#FFD100] text-black">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-black leading-snug pt-1">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="p-1 rounded-lg text-black mt-1 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#FF5C00]" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed border-t-2 border-black/10 animate-in fade-in duration-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Still Have Questions CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
        <div className="bento-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black uppercase text-white">
              Have a specific franchise query?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-medium">
              Speak directly with our expansion committee or submit a qualified application.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('/inquiry')}
              className="bento-btn-primary"
            >
              Submit Inquiry
            </button>
            <a
              href="tel:9145448010"
              className="bento-btn-secondary"
            >
              Call 9145448010
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

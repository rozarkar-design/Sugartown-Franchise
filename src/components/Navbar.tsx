import React, { useState, useEffect } from 'react';
import {
  Phone,
  ArrowRight,
  Shield,
  HelpCircle,
  Menu,
  X,
  Sparkles,
  Building2,
  FileText,
  Calculator,
  Layers,
  MapPin,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Primary navigation links for top tier (neat, focused brand navigation)
  const mainNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'FOCO Model', path: '/foco' },
    { label: 'Investment Plans', path: '/investment' },
    { label: 'India Expansion', path: '/india-expansion' },
    { label: 'Store Roadmap', path: '/roadmap' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact HQ', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = Boolean(currentPath && currentPath.startsWith('/admin'));
  const isFaqActive = currentPath === '/faq';
  const isCalculatorActive = currentPath === '/calculator';
  const isLoiActive = currentPath === '/loi';
  const isDocsActive = currentPath === '/company-documents';

  return (
    <header
      id="main-navbar-container"
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
          : 'bg-white'
      }`}
    >
      {/* ==================================================== */}
      {/* TOP TIER: BRAND LOGO + MAIN NAVIGATION MENU */}
      {/* ==================================================== */}
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
            {/* Brand Logo */}
            <div
              id="brand-logo-btn"
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FF5C00] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                <span className="font-black text-xl sm:text-2xl tracking-tighter">S</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-lg sm:text-xl font-display tracking-tight text-black uppercase">
                    SUGARTOWN
                  </span>
                  <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#FFD100] border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black">
                    FOCO
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-neutral-500 tracking-wider uppercase hidden sm:block">
                  Live Candy Theater & Retail
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Cleanly Centered/Spaced) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-wrap justify-end">
              {mainNavLinks.map((link) => {
                const active = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleNavClick(link.path)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      active
                        ? 'text-black bg-[#FFD100] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'text-neutral-700 hover:text-black hover:bg-neutral-100 border-2 border-transparent hover:border-black'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-black bg-[#FFD100] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:scale-95"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* SECOND TIER (ACTION STRIP): HELPLINE, APPLY, ROI CALCULATOR, LOI, COMPANY DOCS, FAQ, ADMIN & PUNE HQ */}
      {/* ==================================================== */}
      <div className="bg-[#FFFDF7] border-b-2 border-black py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto no-scrollbar py-0.5">
          {/* Action Cluster - Always on one unified horizontal line */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap min-w-max">
            {/* Official Phone Helpline Button */}
            <a
              id="sub-header-call-btn"
              href="tel:9145448010"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-neutral-50 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex-shrink-0"
              title="Call Sugartown Corporate Franchise Desk"
            >
              <div className="w-4 h-4 rounded-full bg-[#FF5C00] flex items-center justify-center text-white flex-shrink-0">
                <Phone className="w-2.5 h-2.5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-neutral-500 font-bold hidden md:inline">Desk:</span>
                <span className="font-mono font-bold tracking-tight text-[11px] sm:text-xs">+91 91454 48010</span>
              </div>
            </a>

            {/* Apply for Franchise Button - Prominent Action CTA */}
            <button
              id="sub-header-apply-cta"
              onClick={() => handleNavClick('/inquiry')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 rounded-full bg-[#FF5C00] hover:bg-[#ff4500] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <span>Apply for Franchise</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* ROI Calculator Button */}
            <button
              id="sub-header-calculator-btn"
              onClick={() => handleNavClick('/calculator')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isCalculatorActive
                  ? 'bg-[#FFD100] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-neutral-50 text-neutral-800 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'
              }`}
            >
              <Calculator className="w-3 h-3 text-[#FF5C00]" />
              <span>ROI Calculator</span>
            </button>

            {/* Standard LOI Button */}
            <button
              id="sub-header-loi-btn"
              onClick={() => handleNavClick('/loi')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isLoiActive
                  ? 'bg-[#FFD100] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-neutral-50 text-neutral-800 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'
              }`}
            >
              <FileText className="w-3 h-3 text-[#FF5C00]" />
              <span>Standard LOI</span>
            </button>

            {/* Company Docs Button */}
            <button
              id="sub-header-docs-btn"
              onClick={() => handleNavClick('/company-documents')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isDocsActive
                  ? 'bg-[#FFD100] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-neutral-50 text-neutral-800 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'
              }`}
            >
              <Building2 className="w-3 h-3 text-[#FF5C00]" />
              <span>Company Docs</span>
            </button>

            {/* Quick FAQ Button */}
            <button
              id="sub-header-faq-btn"
              onClick={() => handleNavClick('/faq')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isFaqActive
                  ? 'bg-[#FFD100] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-neutral-50 text-neutral-800 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'
              }`}
            >
              <HelpCircle className="w-3 h-3 text-[#FF5C00]" />
              <span>FAQ</span>
            </button>

            {/* Admin Portal Button */}
            <button
              id="sub-header-admin-btn"
              onClick={() => handleNavClick('/admin')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isAdminRoute
                  ? 'bg-[#00D1FF] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-neutral-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
              title="Corporate Admin Portal & Lead Management"
            >
              <Shield className="w-3 h-3 text-black" />
              <span>Admin</span>
            </button>

            {/* Pune Headquarter Status Pill - Always in one line next to Admin button */}
            <div
              id="sub-header-pune-hq-btn"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] sm:text-[11px] font-bold text-emerald-900 shadow-xs whitespace-nowrap flex-shrink-0"
              title="Sugartown Corporate Office & Support Desk"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
              <span>Pune HQ (9 AM - 8 PM IST)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MOBILE FULL NAVIGATION DRAWER */}
      {/* ==================================================== */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-b-2 border-black bg-white px-4 pt-3 pb-6 space-y-3 shadow-[0_8px_0_0_rgba(0,0,0,1)] max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-1.5">
            {mainNavLinks.map((link) => {
              const active = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-colors border-2 ${
                    active
                      ? 'text-black bg-[#FFD100] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-black border-transparent hover:border-black hover:bg-neutral-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Mobile Actions: ROI Calculator, Standard LOI, Company Docs */}
            <button
              onClick={() => handleNavClick('/calculator')}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider border-2 flex items-center gap-2 ${
                isCalculatorActive
                  ? 'text-black bg-[#FFD100] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black border-transparent hover:border-black hover:bg-neutral-50'
              }`}
            >
              <Calculator className="w-4 h-4 text-[#FF5C00]" />
              <span>ROI Calculator</span>
            </button>

            <button
              onClick={() => handleNavClick('/loi')}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider border-2 flex items-center gap-2 ${
                isLoiActive
                  ? 'text-black bg-[#FFD100] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black border-transparent hover:border-black hover:bg-neutral-50'
              }`}
            >
              <FileText className="w-4 h-4 text-[#FF5C00]" />
              <span>Standard LOI</span>
            </button>

            <button
              onClick={() => handleNavClick('/company-documents')}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider border-2 flex items-center gap-2 ${
                isDocsActive
                  ? 'text-black bg-[#FFD100] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black border-transparent hover:border-black hover:bg-neutral-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#FF5C00]" />
              <span>Company Documents</span>
            </button>

            <button
              onClick={() => handleNavClick('/faq')}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider border-2 flex items-center gap-2 ${
                isFaqActive
                  ? 'text-black bg-[#FFD100] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black border-transparent hover:border-black hover:bg-neutral-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-[#FF5C00]" />
              <span>FAQ & Answers</span>
            </button>

            <button
              onClick={() => handleNavClick('/admin')}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider text-black border-2 flex items-center gap-2 ${
                isAdminRoute
                  ? 'bg-[#00D1FF] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'border-transparent hover:border-black hover:bg-neutral-50'
              }`}
            >
              <Shield className="w-4 h-4 text-black" />
              <span>Admin Portal</span>
            </button>
          </div>

          <div className="pt-3 border-t-2 border-black flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('/inquiry')}
              className="w-full py-3 rounded-full bg-[#FF5C00] text-white text-center font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <span>Apply for Franchise</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:9145448010"
              className="w-full py-2.5 rounded-full bg-white text-black text-center font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#FF5C00]" />
              <span>Call Helpline: +91 91454 48010</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

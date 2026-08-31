import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Menu,
  X,
  Phone,
  ArrowRight,
  Shield,
  ChevronDown,
  MapPin,
  FileText,
  Milestone,
  HelpCircle,
  Building2,
  FolderDown,
} from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close "More" dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary desktop navigation links (carefully curated to fit desktop screens seamlessly)
  const primaryNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'FOCO Model', path: '/foco' },
    { label: 'Investment', path: '/investment' },
    { label: 'ROI Calc', fullLabel: 'ROI Calculator', path: '/calculator' },
    { label: 'Expansion', fullLabel: 'India Expansion', path: '/india-expansion' },
    { label: 'Company Docs', path: '/company-documents' },
    { label: 'FAQ', path: '/faq' },
  ];

  // Secondary items in the "More" dropdown
  const secondaryNavLinks = [
    {
      label: 'Store Roadmap',
      description: '45-day turnkey launch schedule & milestones',
      path: '/roadmap',
      icon: Milestone,
    },
    {
      label: 'Resources & Pitch Deck',
      description: 'Franchise prospectus & brand assets',
      path: '/resources',
      icon: FolderDown,
    },
    {
      label: 'Contact & Pune HQ',
      description: 'Corporate office location & visit schedule',
      path: '/contact',
      icon: MapPin,
    },
  ];

  // Full list for mobile drawer
  const mobileNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'FOCO Model', path: '/foco' },
    { label: 'Investment Plans', path: '/investment' },
    { label: 'ROI Calculator', path: '/calculator' },
    { label: 'India Expansion', path: '/india-expansion' },
    { label: 'Company Docs & Compliance', path: '/company-documents' },
    { label: 'Store Roadmap (45 Days)', path: '/roadmap' },
    { label: 'Resources & Downloads', path: '/resources' },
    { label: 'FAQ & Questions', path: '/faq' },
    { label: 'Contact & Pune HQ', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMoreActive =
    currentPath === '/roadmap' ||
    currentPath === '/resources' ||
    currentPath === '/contact';

  const isAdminRoute = Boolean(currentPath && currentPath.startsWith('/admin'));

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b-2 border-black ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_0_0_rgba(0,0,0,0.08)]'
          : 'bg-white'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2">
          {/* ---------------------------------------------------- */}
          {/* BRAND LOGO */}
          {/* ---------------------------------------------------- */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FF5C00] border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              <span className="font-black text-xl sm:text-2xl tracking-tighter">S</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-lg sm:text-xl xl:text-2xl tracking-tight text-black uppercase">
                  SUGARTOWN
                </span>
                <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#FFD100] border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black">
                  FOCO
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-neutral-500 tracking-wider uppercase hidden md:block">
                Live Candy Theater & Retail
              </span>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* DESKTOP STREAMLINED NAVIGATION LINKS */}
          {/* ---------------------------------------------------- */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-shrink-1">
            {primaryNavLinks.map((link) => {
              const active = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    active
                      ? 'text-black bg-[#FFD100] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-100 border-2 border-transparent hover:border-black'
                  }`}
                >
                  <span className="hidden xl:inline">{link.fullLabel || link.label}</span>
                  <span className="xl:hidden">{link.label}</span>
                </button>
              );
            })}

            {/* "More ▾" Interactive Dropdown */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                id="nav-more-dropdown-btn"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 whitespace-nowrap ${
                  isMoreActive || moreDropdownOpen
                    ? 'text-black bg-[#FFD100] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-100 border-2 border-transparent hover:border-black'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Popover */}
              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-black/10">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                      Explore Sugartown
                    </span>
                  </div>

                  {secondaryNavLinks.map((item) => {
                    const active = currentPath === item.path;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                          active
                            ? 'bg-[#FFD100] border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg border border-black/20 ${
                            active ? 'bg-black text-white' : 'bg-neutral-50 text-neutral-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-black uppercase block tracking-tight text-black">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-neutral-600 font-medium block truncate">
                            {item.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* ---------------------------------------------------- */}
          {/* RIGHT ACTION CLUSTER: PHONE, APPLY CTA, ADMIN */}
          {/* ---------------------------------------------------- */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-2.5 flex-shrink-0">
            {/* Phone Call Quick Dial Pill */}
            <a
              id="header-call-btn"
              href="tel:9145448010"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all whitespace-nowrap"
              title="Call Franchise Hotline: +91 91454 48010"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF5C00] flex-shrink-0" />
              <span className="font-mono font-bold tracking-tight">9145448010</span>
            </a>

            {/* Primary Apply CTA Button */}
            <button
              id="header-apply-cta"
              onClick={() => handleNavClick('/inquiry')}
              className="inline-flex items-center gap-1.5 px-4 xl:px-5 py-2 rounded-full bg-[#FF5C00] hover:bg-[#ff4500] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Admin Shield Icon Button */}
            <button
              id="header-admin-btn"
              onClick={() => handleNavClick('/admin')}
              className={`p-2 rounded-full border-2 border-black text-black transition-all ${
                isAdminRoute
                  ? 'bg-[#00D1FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
              title="Corporate Admin Portal"
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* ---------------------------------------------------- */}
          {/* MOBILE TOGGLE & ACTION BUTTONS */}
          {/* ---------------------------------------------------- */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              id="mobile-call-icon-btn"
              onClick={() => window.open('tel:9145448010')}
              className="p-2 rounded-xl text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Call Franchise Helpdesk"
            >
              <Phone className="w-4 h-4 text-[#FF5C00]" />
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-black bg-[#FFD100] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MOBILE FULL NAVIGATION DRAWER */}
      {/* ---------------------------------------------------- */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-b-2 border-black bg-white px-4 pt-3 pb-6 space-y-3 shadow-[0_8px_0_0_rgba(0,0,0,1)] max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-1.5">
            {mobileNavLinks.map((link) => {
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
              <span>Call Hotline: +91 91454 48010</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

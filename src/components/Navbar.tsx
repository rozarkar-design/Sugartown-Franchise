import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Phone, ArrowRight, Shield } from 'lucide-react';

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

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'FOCO Model', path: '/foco' },
    { label: 'Investment', path: '/investment' },
    { label: 'ROI Calculator', path: '/calculator' },
    { label: 'India Expansion', path: '/india-expansion' },
    { label: 'Roadmap', path: '/roadmap' },
    { label: 'Resources', path: '/resources' },
    { label: 'FAQ', path: '/faq' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FF5C00] border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              <span className="font-black text-2xl tracking-tighter">S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-black uppercase">
                  SUGARTOWN
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFD100] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
                  FOCO
                </span>
              </div>
              <span className="text-[10px] font-black text-neutral-500 tracking-widest uppercase hidden xs:block">
                Live Candy Theater & Retail
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
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

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              id="header-call-btn"
              href="tel:9145448010"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              title="Call Franchise Team"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF5C00]" />
              <span>9145448010</span>
            </a>

            <button
              id="header-apply-cta"
              onClick={() => handleNavClick('/inquiry')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5C00] hover:bg-[#ff4500] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            >
              <span>Apply</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="header-admin-btn"
              onClick={() => handleNavClick('/admin')}
              className={`p-2.5 rounded-full border-2 border-black text-black transition-all ${
                isAdminRoute
                  ? 'bg-[#00D1FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
              title="Corporate Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              id="mobile-call-icon-btn"
              onClick={() => window.open('tel:9145448010')}
              className="p-2.5 rounded-2xl text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Call Franchise Helpdesk"
            >
              <Phone className="w-4 h-4 text-[#FF5C00]" />
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-black bg-[#FFD100] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden border-b-2 border-black bg-white px-4 pt-3 pb-6 space-y-3 shadow-[0_8px_0_0_rgba(0,0,0,1)]">
          <div className="grid grid-cols-1 gap-1.5">
            {navLinks.map((link) => {
              const active = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-colors border-2 ${
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
              onClick={() => handleNavClick('/contact')}
              className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-black uppercase tracking-wider text-black border-2 border-transparent hover:border-black hover:bg-neutral-50"
            >
              Contact & Pune HQ
            </button>
            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-black uppercase tracking-wider text-black border-2 border-transparent hover:border-black hover:bg-neutral-50 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-black" />
              <span>Admin Portal</span>
            </button>
          </div>

          <div className="pt-3 border-t-2 border-black flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('/inquiry')}
              className="w-full py-3.5 rounded-full bg-[#FF5C00] text-white text-center font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <span>Apply for Franchise</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:9145448010"
              className="w-full py-3 rounded-full bg-white text-black text-center font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#FF5C00]" />
              <span>Call Franchise Desk: 9145448010</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

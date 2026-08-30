import React from 'react';
import { Phone, Mail, Globe, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-black text-white pt-16 pb-24 sm:pb-16 border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b-2 border-neutral-800">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5C00] border-2 border-white flex items-center justify-center text-white font-black text-2xl shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                S
              </div>
              <div>
                <span className="font-black text-2xl text-white tracking-tight uppercase block">
                  SUGARTOWN
                </span>
                <span className="text-xs text-[#FFD100] font-black uppercase tracking-wider">
                  Sugartown Retail Private Limited
                </span>
              </div>
            </div>

            <p className="text-neutral-300 text-sm leading-relaxed max-w-md font-medium">
              Pioneering India&apos;s Live Candy Theater & Experiential Retail. We engineer high-yield, company-operated confectionery destinations combining theatrical confectionery production with high-margin retail and bespoke gifting.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-black font-black uppercase text-[10px] border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5C00]" />
                FOCO Model Certified
              </span>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FFD100] text-black font-black uppercase text-[10px] border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)]">
                ₹25L & ₹50L Turnkey Models
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#FFD100]">
              Franchise Portal
            </h4>
            <ul className="space-y-2 text-sm font-bold text-neutral-300">
              <li>
                <button
                  onClick={() => handleNav('/foco')}
                  className="hover:text-[#FF5C00] transition-colors"
                >
                  The FOCO Model
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/investment')}
                  className="hover:text-[#FF5C00] transition-colors"
                >
                  ₹25L & ₹50L Formats
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/calculator')}
                  className="hover:text-[#FF5C00] transition-colors"
                >
                  ROI & Payback Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/india-expansion')}
                  className="hover:text-[#FF5C00] transition-colors"
                >
                  India Expansion Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/roadmap')}
                  className="hover:text-[#FF5C00] transition-colors"
                >
                  10-Step Launch Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#00D1FF]">
              Resources & Legal
            </h4>
            <ul className="space-y-2 text-sm font-bold text-neutral-300">
              <li>
                <button
                  onClick={() => handleNav('/company-documents')}
                  className="hover:text-[#FFD100] text-white font-black transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FFD100]" />
                  <span>Company Documents & Legal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/resources')}
                  className="hover:text-[#FF5C00] transition-colors"
                >
                  Franchise Documents
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/faq')}
                  className="hover:text-[#FF5C00] transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/inquiry')}
                  className="hover:text-[#FFD100] transition-colors text-[#FF5C00]"
                >
                  Submit Inquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/contact')}
                  className="hover:text-[#FF5C00] transition-colors"
                >
                  Corporate Contacts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/admin')}
                  className="hover:text-white text-neutral-500 transition-colors"
                >
                  Admin Access
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate Office & Direct Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              Headquarters
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-neutral-300 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF5C00] mt-1 shrink-0" />
                <span>
                  702, Workflow, Icon Tower, Laxminagar, Baner, Pune 411045, Maharashtra, India.
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFD100] shrink-0" />
                <a
                  href="tel:9145448010"
                  className="hover:text-[#FF5C00] font-black text-white transition-colors"
                >
                  9145448010
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00D1FF] shrink-0" />
                <a
                  href="mailto:info@sugartown.in"
                  className="hover:text-[#FF5C00] transition-colors"
                >
                  info@sugartown.in
                </a>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Globe className="w-4 h-4 text-[#00FF66] shrink-0" />
                <a
                  href="http://www.sugartownindia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white text-neutral-200 font-bold transition-colors"
                >
                  <span>www.sugartownindia.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Bottom Note */}
        <div className="pt-8 space-y-4 text-xs text-neutral-400 leading-relaxed">
          <p>
            <strong className="text-white">Regulatory & Commercial Notice:</strong> Indicative investment figures, projected returns, gross margins, and payback periods on this platform are for informational and feasibility exploration purposes only. Actual financial outcomes are contingent on store micro-catchment, footfall density, lease commercials, market dynamics, and the definitive terms executed in the Sugartown Franchise Owned Company Operated Agreement. Sugartown Retail Private Limited makes no warranties of guaranteed profitability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-neutral-800 text-neutral-400 font-bold">
            <div>
              © {currentYear} Sugartown Retail Private Limited. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-xs uppercase tracking-wider">
              <button onClick={() => handleNav('/contact')} className="hover:text-white">
                Privacy Policy
              </button>
              <button onClick={() => handleNav('/contact')} className="hover:text-white">
                Terms of Participation
              </button>
              <a
                href="http://www.sugartownindia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF5C00] inline-flex items-center gap-1 text-white"
              >
                <span>Brand Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

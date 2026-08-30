import React from 'react';
import { Calculator, ArrowRight, Phone } from 'lucide-react';

interface MobileBottomBarProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ currentPath = '/', onNavigate }) => {
  // Hide on admin routes
  if (currentPath && currentPath.startsWith('/admin')) {
    return null;
  }

  const isContactOrInquiry = currentPath === '/inquiry' || currentPath === '/contact';

  return (
    <div
      id="mobile-sticky-bottom-bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-black px-4 py-3 shadow-[0_-4px_0_0_rgba(0,0,0,0.1)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
        {isContactOrInquiry ? (
          <>
            <a
              id="mobile-bottom-call-btn"
              href="tel:9145448010"
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full border-2 border-black bg-white text-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF5C00]" />
              <span>Call 9145448010</span>
            </a>
            <button
              id="mobile-bottom-inquiry-btn"
              onClick={() => {
                if (currentPath !== '/inquiry') {
                  onNavigate('/inquiry');
                } else {
                  // Scroll to form submit
                  const submitBtn = document.getElementById('inquiry-form-submit-btn') || document.getElementById('inquiry-form-container');
                  submitBtn?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full bg-[#FF5C00] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>{currentPath === '/inquiry' ? 'Fill Form' : 'Apply Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <button
              id="mobile-bottom-calc-btn"
              onClick={() => {
                onNavigate('/calculator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full border-2 border-black bg-[#FFD100] text-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Calculator className="w-3.5 h-3.5 text-black" />
              <span>ROI Calc</span>
            </button>
            <button
              id="mobile-bottom-apply-btn"
              onClick={() => {
                onNavigate('/inquiry');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full bg-[#FF5C00] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

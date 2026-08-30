import React from 'react';
import {
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ThankYouPageProps {
  leadId?: string;
  leadData?: any;
  onNavigate: (path: string) => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  leadId = 'ST-LEAD-' + Math.floor(100000 + Math.random() * 900000),
  leadData,
  onNavigate,
}) => {
  return (
    <div id="thank-you-page-container" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-10">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-[22px] bg-[#00FF66] text-black border-2 border-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="bento-pill bg-[#00FF66] text-black">
          APPLICATION CONFIRMED
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase text-black tracking-tight">
          Thank You for Your Interest in Sugartown
        </h1>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-lg mx-auto">
          Your franchise inquiry has been securely registered in our system. A franchise director will connect with you within 48 business hours.
        </p>

        {/* Lead Reference Box */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-black text-black text-xs font-mono font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span>Application Reference ID:</span>
          <span className="text-[#FF5C00]">{leadId}</span>
        </div>
      </div>

      {/* What Happens Next Card */}
      <div className="bento-card space-y-6">
        <h3 className="text-base sm:text-lg font-black uppercase text-black flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF5C00]" />
          <span>What Happens Next</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-full bg-black text-white border border-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div className="text-xs sm:text-sm">
              <strong className="text-black font-black uppercase block mb-0.5">Application & Territory Audit</strong>
              <span className="text-neutral-700 font-medium">
                Our expansion committee will review city territory availability and catchment exclusivity parameters for {leadData?.preferred_city || 'your selected city'}.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-full bg-black text-white border border-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div className="text-xs sm:text-sm">
              <strong className="text-black font-black uppercase block mb-0.5">Confidential Discovery Discussion</strong>
              <span className="text-neutral-700 font-medium">
                We will schedule an introductory discussion to share detailed FOCO draft agreements, site criteria, and unit financial models.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-full bg-black text-white border border-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div className="text-xs sm:text-sm">
              <strong className="text-black font-black uppercase block mb-0.5">Pune HQ Experience Tour</strong>
              <span className="text-neutral-700 font-medium">
                You are invited to experience Live Candy Theater firsthand at our corporate headquarters in Baner, Pune.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="tel:9145448010"
          className="bento-btn-primary justify-center py-3.5"
        >
          <Phone className="w-4 h-4" />
          <span>Call Desk: 9145448010</span>
        </a>

        <button
          onClick={() => onNavigate('/calculator')}
          className="bento-btn-secondary justify-center py-3.5"
        >
          <Calculator className="w-4 h-4 text-[#FF5C00]" />
          <span>Simulate More ROI Scenarios</span>
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={() => onNavigate('/')}
          className="text-xs font-black uppercase tracking-wider text-black hover:underline inline-flex items-center gap-1.5"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

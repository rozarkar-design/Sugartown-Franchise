import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

interface DisclaimerProps {
  type?: 'financial' | 'franchise' | 'general';
  className?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  type = 'financial',
  className = '',
}) => {
  return (
    <div
      id={`disclaimer-${type}`}
      className={`rounded-2xl border-2 border-black bg-[#FFD100]/15 p-4 sm:p-5 text-black text-xs sm:text-sm leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0 text-[#FF5C00]">
          {type === 'financial' ? (
            <AlertCircle className="w-5 h-5 text-black" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-black" />
          )}
        </div>
        <div>
          <span className="font-black text-black uppercase tracking-wider block mb-1">
            {type === 'financial'
              ? 'Financial Performance & Feasibility Disclaimer'
              : 'Franchise Allocation & Terms Disclaimer'}
          </span>
          <p className="font-medium text-neutral-800">
            {type === 'financial'
              ? 'Illustrative projections only. Actual business performance may vary based on location, footfall, pricing, product mix, operating expenses, market conditions, execution and final commercial terms. Indicative ROI and payback figures are not guaranteed.'
              : 'Franchise availability, investment structure, territory rights, operating responsibilities and commercial terms are subject to evaluation, approval and the final franchise agreement executed with Sugartown Retail Private Limited.'}
          </p>
        </div>
      </div>
    </div>
  );
};

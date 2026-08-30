import React, { useState } from 'react';
import { RoadmapStep } from '../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Building,
  UserCheck,
} from 'lucide-react';

interface RoadmapPageProps {
  roadmapSteps: RoadmapStep[];
  onNavigate: (path: string) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ roadmapSteps, onNavigate }) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(roadmapSteps[0]?.id || 'step-1');

  return (
    <div id="roadmap-page-container" className="space-y-12 sm:space-y-16 py-8 sm:py-12 pb-24">
      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="bento-pill bg-[#00D1FF] text-black">
          <Sparkles className="w-4 h-4" />
          <span>ONBOARDING TIMELINE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
          Your Roadmap to Sugartown
        </h1>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-2xl mx-auto leading-relaxed">
          From initial inquiry to grand launch and passive monthly scaling: our structured 10-step franchise onboarding journey.
        </p>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 10-STEP TIMELINE LIST */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {roadmapSteps.map((step) => {
          const isExpanded = expandedStep === step.id;
          return (
            <div
              key={step.id}
              id={`roadmap-step-${step.step_number}`}
              className={`rounded-[24px] border-2 border-black transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-black text-sm shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      isExpanded
                        ? 'bg-[#FF5C00] text-white'
                        : 'bg-[#FFD100] text-black'
                    }`}
                  >
                    {step.step_number < 10 ? `0${step.step_number}` : step.step_number}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-black bg-neutral-100 text-black">
                        {step.phase}
                      </span>
                      {step.estimated_duration && (
                        <span className="text-xs text-neutral-600 font-bold uppercase hidden sm:inline">
                          ~ {step.estimated_duration}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-black mt-1">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <div className="text-black">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-[#FF5C00]" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Collapsible Content Body */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t-2 border-black/10 space-y-4 text-xs sm:text-sm text-neutral-800 animate-in fade-in duration-150">
                  <p className="leading-relaxed text-neutral-700 font-medium">{step.description}</p>

                  <div className="p-4 rounded-xl bg-[#F3F4F6] border-2 border-black text-xs font-bold">
                    <span className="font-black uppercase tracking-wider text-black block mb-0.5">Expected Milestone:</span>
                    <span className="text-neutral-800">{step.expected_action}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                      <div className="flex items-center gap-1.5 text-black font-black uppercase">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span>Partner Responsibility:</span>
                      </div>
                      <p className="text-neutral-700 font-medium">{step.partner_responsibility}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                      <div className="flex items-center gap-1.5 text-[#FF5C00] font-black uppercase">
                        <Building className="w-4 h-4 text-[#FF5C00]" />
                        <span>Sugartown Delivery:</span>
                      </div>
                      <p className="text-neutral-700 font-medium">{step.sugartown_responsibility}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6">
        <div className="bento-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white">
              Begin Step 01: Inquiry Submission
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-medium max-w-lg">
              Takes under 2 minutes. Our team will review territory availability in your preferred city within 48 hours.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/inquiry')}
            className="bento-btn-primary shrink-0 whitespace-nowrap"
          >
            <span>Start Inquiry Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

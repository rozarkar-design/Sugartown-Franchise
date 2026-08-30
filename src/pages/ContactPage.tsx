import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Sparkles,
  ArrowRight,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div id="contact-page-container" className="space-y-12 sm:space-y-16 py-8 sm:py-12 pb-24">
      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="bento-pill bg-[#FFD100] text-black">
          <Building2 className="w-4 h-4" />
          <span>CORPORATE HEADQUARTERS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
          Connect with Sugartown Corporate
        </h1>

        <p className="text-sm sm:text-base text-neutral-700 font-medium max-w-2xl mx-auto leading-relaxed">
          Reach out to our franchise expansion committee, schedule a live candy theater discovery visit, or discuss multi-unit city territories.
        </p>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CONTACT DETAILS CARDS */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Baner Pune HQ Info */}
          <div className="bento-card flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5C00] text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 block">
                    REGISTERED OFFICE
                  </span>
                  <h3 className="text-lg sm:text-xl font-black uppercase text-black">
                    Sugartown Retail Pvt Ltd
                  </h3>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-800 font-medium">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#FF5C00] mt-1 shrink-0" />
                  <div>
                    <strong className="block text-black font-black uppercase text-xs">Baner HQ Address:</strong>
                    <span>702, Workflow, Icon Tower, Laxminagar, Baner, Pune 411045, Maharashtra, India.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#FF5C00] mt-1 shrink-0" />
                  <div>
                    <strong className="block text-black font-black uppercase text-xs">Franchise Desk Phone:</strong>
                    <a href="tel:9145448010" className="hover:text-[#FF5C00] font-black text-black">
                      +91 9145448010 / 9145448010
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#FF5C00] mt-1 shrink-0" />
                  <div>
                    <strong className="block text-black font-black uppercase text-xs">Official Email:</strong>
                    <a href="mailto:info@sugartown.in" className="hover:text-[#FF5C00] font-bold text-black">
                      info@sugartown.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-[#FF5C00] mt-1 shrink-0" />
                  <div>
                    <strong className="block text-black font-black uppercase text-xs">Official Website:</strong>
                    <a
                      href="https://www.sugartownindia.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#FF5C00] font-bold text-black"
                    >
                      www.sugartownindia.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#FF5C00] mt-1 shrink-0" />
                  <div>
                    <strong className="block text-black font-black uppercase text-xs">Corporate Hours:</strong>
                    <span>Monday – Saturday: 10:00 AM – 7:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-black/10">
              <button
                onClick={() => onNavigate('/inquiry')}
                className="bento-btn-primary w-full justify-center"
              >
                <span>Apply for Franchise Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Brand Experience Visit & Quick FAQ */}
          <div className="bento-card-dark flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="bento-pill bg-[#FF5C00] text-white">
                LIVE CANDY THEATER
              </div>

              <h3 className="text-2xl font-black uppercase text-white leading-tight">
                Visit Pune HQ & Flagship Theater
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
                We encourage serious prospective franchise partners to taste our artisan confectionery, inspect the live candy-pulling tables, and meet our operations leadership in person.
              </p>

              <div className="p-5 rounded-2xl bg-neutral-900 border-2 border-neutral-700 space-y-2 text-xs">
                <strong className="text-white block font-black uppercase tracking-wider">What to expect on your discovery visit:</strong>
                <ul className="space-y-2 text-neutral-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                    <span>Live 150°C sugar artisan pull demonstration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                    <span>POS software & sales audit walk-through</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                    <span>Review of FOCO agreements & exclusive territory maps</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase">Direct Inquiries:</span>
              <a
                href="tel:9145448010"
                className="text-xs font-black text-[#FFD100] hover:underline inline-flex items-center gap-1 uppercase"
              >
                <span>Call +91 9145448010</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

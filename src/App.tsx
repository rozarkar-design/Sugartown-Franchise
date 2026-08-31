import React, { useState, useEffect } from 'react';
import {
  InvestmentModel,
  RoiAssumptions,
  City,
  Faq,
  ResourceDocument,
  RoadmapStep,
  SiteSettings,
} from './types';
import { fetchAllData } from './lib/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';

// Page components
import { HomePage } from './pages/HomePage';
import { FocoPage } from './pages/FocoPage';
import { InvestmentPage } from './pages/InvestmentPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { IndiaExpansionPage } from './pages/IndiaExpansionPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { CompanyDocumentsPage } from './pages/CompanyDocumentsPage';
import { FaqPage } from './pages/FaqPage';
import { InquiryPage } from './pages/InquiryPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { LoiPage } from './pages/LoiPage';

export function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname === '/' ? '/' : window.location.pathname;
  });
  const [routeOptions, setRouteOptions] = useState<{ model?: string; city?: string }>({});
  const [submittedLeadInfo, setSubmittedLeadInfo] = useState<{ leadId: string; leadData: any } | null>(null);

  // Global Data State
  const [loading, setLoading] = useState<boolean>(true);
  const [investmentModels, setInvestmentModels] = useState<InvestmentModel[]>([]);
  const [assumptions, setAssumptions] = useState<RoiAssumptions[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [documents, setDocuments] = useState<ResourceDocument[]>([]);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Load backend database state
  const loadDatabase = async () => {
    try {
      const data = await fetchAllData();
      setInvestmentModels(data.investmentModels || []);
      setAssumptions(data.assumptions || []);
      setCities(data.cities || []);
      setFaqs(data.faqs || []);
      setDocuments(data.documents || []);
      setRoadmapSteps(data.roadmapSteps || []);
      setSiteSettings(data.siteSettings || null);
    } catch (e) {
      console.error('Failed to bootstrap database:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Router navigation helper
  const navigateTo = (path: string, options?: { model?: string; city?: string }) => {
    if (options) {
      setRouteOptions(options);
    }
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      // In some sandbox iframes history pushState is restricted
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Inquiry success handler
  const handleInquirySuccess = (leadId: string, leadData: any) => {
    setSubmittedLeadInfo({ leadId, leadData });
    navigateTo('/thank-you');
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-[#F3F4F6] text-[#1A1A1A] font-sans antialiased selection:bg-[#FF5C00] selection:text-white">
      {/* Global Navigation Bar */}
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />

      {/* Main Page Body */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-10 h-10 border-3 border-[#FC3D00]/20 border-t-[#FC3D00] rounded-full animate-spin" />
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Initializing Sugartown Franchise Platform...
            </p>
          </div>
        ) : (
          <>
            {currentPath === '/' && (
              <HomePage
                onNavigate={navigateTo}
                investmentModels={investmentModels}
                cities={cities}
              />
            )}

            {currentPath === '/foco' && <FocoPage onNavigate={navigateTo} />}

            {currentPath === '/investment' && (
              <InvestmentPage
                investmentModels={investmentModels}
                onNavigate={navigateTo}
                initialSelectedTab={routeOptions.model}
              />
            )}

            {currentPath === '/calculator' && (
              <CalculatorPage
                investmentModels={investmentModels}
                assumptions={assumptions}
                onNavigate={navigateTo}
                initialModel={routeOptions.model}
              />
            )}

            {currentPath === '/india-expansion' && (
              <IndiaExpansionPage cities={cities} onNavigate={navigateTo} />
            )}

            {currentPath === '/roadmap' && (
              <RoadmapPage roadmapSteps={roadmapSteps} onNavigate={navigateTo} />
            )}

            {currentPath === '/resources' && (
              <ResourcesPage documents={documents} onNavigate={navigateTo} />
            )}

            {(currentPath === '/company-documents' || currentPath === '/documents') && (
              <CompanyDocumentsPage onNavigate={navigateTo} />
            )}

            {currentPath === '/faq' && <FaqPage faqs={faqs} onNavigate={navigateTo} />}

            {currentPath === '/inquiry' && (
              <InquiryPage
                initialCity={routeOptions.city}
                initialModel={routeOptions.model}
                onSuccess={handleInquirySuccess}
              />
            )}

            {(currentPath === '/loi' || currentPath === '/franchise-loi') && (
              <LoiPage
                initialCity={routeOptions.city}
                initialModel={routeOptions.model}
                onNavigate={navigateTo}
              />
            )}

            {currentPath === '/thank-you' && (
              <ThankYouPage
                leadId={submittedLeadInfo?.leadId}
                leadData={submittedLeadInfo?.leadData}
                onNavigate={navigateTo}
              />
            )}

            {currentPath === '/contact' && <ContactPage onNavigate={navigateTo} />}

            {currentPath === '/admin' && <AdminPage onDataRefreshed={loadDatabase} />}
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Mobile Quick Action Sticky Bar */}
      <MobileBottomBar currentPath={currentPath} onNavigate={navigateTo} />
    </div>
  );
}

export default App;

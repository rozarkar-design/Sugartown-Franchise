import React, { useState, useEffect, useMemo } from 'react';
import {
  FranchiseLead,
  InvestmentModel,
  RoiAssumptions,
  City,
  Faq,
  ResourceDocument,
} from '../types';
import {
  fetchAllData,
  updateLeadStatus,
  updateInvestmentModel,
  updateRoiAssumptions,
  updateCity,
  addCity,
  addFaq,
  updateFaq,
  deleteFaq,
  exportLeadsCsv,
  verifyAdminPin,
  changeAdminPin,
  fetchPinStatus,
  logoutAdmin,
  isSessionValid,
} from '../lib/api';
import {
  Lock,
  LogOut,
  Users,
  Building,
  TrendingUp,
  MapPin,
  HelpCircle,
  FileText,
  Search,
  Download,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Save,
  KeyRound,
  Clock,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { formatIndianCurrency } from '../lib/calculator';

interface AdminPageProps {
  onDataRefreshed?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onDataRefreshed }) => {
  // Authentication & Security State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isSessionValid();
  });
  const [pinCode, setPinCode] = useState<string>('');
  const [isMasked, setIsMasked] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(5);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState<number>(0);

  // PIN Change Modal / Panel State
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [changePinStatus, setChangePinStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<
    'leads' | 'investments' | 'assumptions' | 'cities' | 'faqs' | 'documents' | 'security'
  >('leads');

  // App Data
  const [loading, setLoading] = useState<boolean>(true);
  const [leads, setLeads] = useState<FranchiseLead[]>([]);
  const [investmentModels, setInvestmentModels] = useState<InvestmentModel[]>([]);
  const [assumptions, setAssumptions] = useState<RoiAssumptions[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [documents, setDocuments] = useState<ResourceDocument[]>([]);

  // Leads Filter & Drawer State
  const [leadSearch, setLeadSearch] = useState<string>('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<FranchiseLead | null>(null);
  const [leadNotes, setLeadNotes] = useState<string>('');

  // Modals / Editors
  const [editingModel, setEditingModel] = useState<InvestmentModel | null>(null);
  const [editingAssumptions, setEditingAssumptions] = useState<RoiAssumptions | null>(null);
  const [newCityModal, setNewCityModal] = useState<boolean>(false);
  const [newCityData, setNewCityData] = useState<Partial<City>>({
    city_name: '',
    state: '',
    tier: 'Tier 2',
    status: 'Available',
    investment_model: '₹25L (Kiosk)',
    suggested_format: 'Express High-Footfall Kiosk',
    market_notes: '',
    lat: 19.0,
    lng: 75.0,
  });

  const [faqModal, setFaqModal] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<Partial<Faq>>({
    question: '',
    answer: '',
    category: 'FOCO',
  });

  // Check initial PIN security status
  useEffect(() => {
    fetchPinStatus()
      .then((status) => {
        setIsLocked(status.isLocked);
        setLockoutSecondsRemaining(status.lockoutSecondsRemaining || 0);
        setAttemptsRemaining(status.attemptsRemaining ?? 5);
      })
      .catch(() => {});
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (!isLocked || lockoutSecondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setPinError(null);
          setAttemptsRemaining(5);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lockoutSecondsRemaining]);

  // Load Data
  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await fetchAllData();
      setLeads(data.leads || []);
      setInvestmentModels(data.investmentModels || []);
      setAssumptions(data.assumptions || []);
      setCities(data.cities || []);
      setFaqs(data.faqs || []);
      setDocuments(data.documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAll();
    }
  }, [isAuthenticated]);

  // Handle PIN Authentication
  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinCode.trim() || isAuthenticating || isLocked) return;

    setIsAuthenticating(true);
    setPinError(null);

    try {
      const res = await verifyAdminPin(pinCode.trim());
      if (res.success) {
        setIsAuthenticated(true);
        setPinCode('');
        setPinError(null);
        setAttemptsRemaining(5);
        setIsLocked(false);
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please verify your PIN.';
      setPinError(msg);
      if (err?.isLocked) {
        setIsLocked(true);
        setLockoutSecondsRemaining(err.lockoutSecondsRemaining || 60);
      }
      if (typeof err?.attemptsRemaining === 'number') {
        setAttemptsRemaining(err.attemptsRemaining);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Numpad key press handler
  const handleNumpadPress = (digit: string) => {
    if (isLocked || isAuthenticating) return;
    if (pinCode.length < 8) {
      setPinCode((prev) => prev + digit);
      setPinError(null);
    }
  };

  const handleNumpadBackspace = () => {
    if (isLocked || isAuthenticating) return;
    setPinCode((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  const handleNumpadClear = () => {
    if (isLocked || isAuthenticating) return;
    setPinCode('');
    setPinError(null);
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setPinCode('');
    setPinError(null);
  };

  // Change PIN handler
  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinStatus(null);

    if (!currentPinInput.trim()) {
      setChangePinStatus({ type: 'error', message: 'Please enter your current security PIN.' });
      return;
    }

    if (!newPinInput.trim() || newPinInput.trim().length < 4) {
      setChangePinStatus({ type: 'error', message: 'New PIN must be at least 4 digits or characters.' });
      return;
    }

    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setChangePinStatus({ type: 'error', message: 'New PIN and Confirm PIN do not match.' });
      return;
    }

    setIsChangingPin(true);
    try {
      const res = await changeAdminPin(currentPinInput.trim(), newPinInput.trim());
      setChangePinStatus({ type: 'success', message: res.message || 'Security Access PIN updated successfully!' });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } catch (err: any) {
      setChangePinStatus({ type: 'error', message: err?.message || 'Failed to update PIN.' });
    } finally {
      setIsChangingPin(false);
    }
  };

  // Lead Status Update Handler
  const handleUpdateLead = async (leadId: string, status: FranchiseLead['status'], notes?: string) => {
    try {
      const updated = await updateLeadStatus(leadId, status, notes);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      if (selectedLead?.id === leadId) {
        setSelectedLead(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchStatus = leadStatusFilter === 'All' || l.status === leadStatusFilter;
      const searchTarget = leadSearch.toLowerCase().trim();
      const matchSearch =
        !searchTarget ||
        (l.full_name && l.full_name.toLowerCase().includes(searchTarget)) ||
        (l.email && l.email.toLowerCase().includes(searchTarget)) ||
        ((l.phone || l.mobile || '').includes(searchTarget)) ||
        ((l.preferred_city || l.city || '').toLowerCase().includes(searchTarget)) ||
        (l.id && l.id.toLowerCase().includes(searchTarget));
      return matchStatus && matchSearch;
    });
  }, [leads, leadStatusFilter, leadSearch]);

  // -----------------------------------------------------------------
  // SECURE PIN LOGIN SCREEN
  // -----------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="max-w-md mx-auto my-10 sm:my-16 px-4">
        <div className="bento-card p-6 sm:p-8 space-y-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {/* Header Icon */}
          <div className="relative w-16 h-16 rounded-2xl bg-[#FF5C00] text-white border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Lock className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFD100] border-2 border-black rounded-full flex items-center justify-center">
              <KeyRound className="w-2.5 h-2.5 text-black" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD100] text-black border-2 border-black text-[11px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SECURE ACCESS GATEWAY</span>
            </div>
            <h2 className="text-2xl font-black uppercase text-black tracking-tight">
              Sugartown Management Portal
            </h2>
            <p className="text-xs text-neutral-700 font-medium leading-relaxed">
              Enter your authorized Security PIN to access franchise leads, financial models, and system controls.
            </p>
          </div>

          {/* Security Features Banner */}
          <div className="p-2.5 rounded-xl bg-neutral-100 border border-black/20 flex items-center justify-between text-[11px] font-mono text-neutral-700">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>Brute-Force Shield Active</span>
            </span>
            <span className="font-bold text-black">
              {isLocked ? (
                <span className="text-rose-600 flex items-center gap-1">
                  <Clock className="w-3 h-3 animate-spin" /> {lockoutSecondsRemaining}s Lockout
                </span>
              ) : (
                <span>{attemptsRemaining} Attempts Left</span>
              )}
            </span>
          </div>

          {/* Error / Lockout Banner */}
          {pinError && (
            <div
              id="admin-pin-error-msg"
              className={`p-3 rounded-xl border-2 text-xs font-bold flex items-start gap-2 text-left ${
                isLocked
                  ? 'bg-rose-100 border-rose-600 text-rose-900'
                  : 'bg-amber-50 border-amber-500 text-amber-900'
              }`}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{pinError}</div>
            </div>
          )}

          {/* PIN Form & Display */}
          <form onSubmit={handlePinSubmit} className="space-y-5">
            {/* Visual PIN Slot Display */}
            <div className="space-y-2">
              <div className="relative flex items-center justify-center">
                <input
                  id="admin-pin-input"
                  type={isMasked ? 'password' : 'text'}
                  maxLength={12}
                  disabled={isLocked || isAuthenticating}
                  placeholder="Enter PIN"
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value);
                    setPinError(null);
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-black text-center font-mono text-xl font-black tracking-[0.4em] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] disabled:bg-neutral-200 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setIsMasked(!isMasked)}
                  className="absolute right-3.5 p-1.5 text-neutral-600 hover:text-black rounded-lg transition-colors"
                  title={isMasked ? 'Show PIN digits' : 'Hide PIN digits'}
                >
                  {isMasked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Visual Dots Feedback for Touch */}
              <div className="flex justify-center items-center gap-2 pt-1">
                {[0, 1, 2, 3].map((idx) => {
                  const filled = pinCode.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full border-2 border-black transition-all ${
                        filled ? 'bg-[#FF5C00] scale-110' : 'bg-neutral-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Tactile On-Screen Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  disabled={isLocked || isAuthenticating}
                  onClick={() => handleNumpadPress(digit)}
                  className="py-3 rounded-xl border-2 border-black bg-white hover:bg-[#FFD100] active:translate-y-0.5 font-mono font-black text-lg text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                disabled={isLocked || isAuthenticating || !pinCode}
                onClick={handleNumpadClear}
                className="py-3 rounded-xl border-2 border-black bg-neutral-100 hover:bg-neutral-200 font-mono font-bold text-xs uppercase text-neutral-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={isLocked || isAuthenticating}
                onClick={() => handleNumpadPress('0')}
                className="py-3 rounded-xl border-2 border-black bg-white hover:bg-[#FFD100] font-mono font-black text-lg text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40"
              >
                0
              </button>
              <button
                type="button"
                disabled={isLocked || isAuthenticating || !pinCode}
                onClick={handleNumpadBackspace}
                className="py-3 rounded-xl border-2 border-black bg-neutral-100 hover:bg-neutral-200 font-mono font-bold text-xs uppercase text-neutral-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40 flex items-center justify-center"
                title="Backspace"
              >
                ⌫
              </button>
            </div>

            {/* Authenticate Submit Button */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={isAuthenticating || isLocked || !pinCode.trim()}
              className="bento-btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying PIN...</span>
                </span>
              ) : isLocked ? (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Locked ({lockoutSecondsRemaining}s)</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Security PIN & Enter</span>
                </span>
              )}
            </button>
          </form>

          {/* Quick Demo Shortcuts for Review */}
          <div className="pt-2 border-t border-black/10 space-y-2">
            <p className="text-[11px] text-neutral-600 font-bold">
              Default System Master PINs:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['8010', '2026', 'sugartown'].map((demoPin) => (
                <button
                  key={demoPin}
                  type="button"
                  onClick={() => {
                    if (!isLocked) {
                      setPinCode(demoPin);
                      setPinError(null);
                    }
                  }}
                  className="font-mono text-xs bg-neutral-100 hover:bg-[#FFD100] px-2.5 py-1 rounded-lg border border-black font-bold text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-colors"
                >
                  {demoPin}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // -----------------------------------------------------------------
  return (
    <div id="admin-portal-container" className="space-y-8 py-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-black/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border border-black bg-[#FF5C00] text-white">
              ADMIN
            </span>
            <span className="text-xs text-neutral-700 font-bold uppercase">Sugartown Retail Private Limited</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight mt-1">
            Platform Operations & Lead Hub
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-header-security-btn"
            onClick={() => setActiveTab('security')}
            className={`py-2 px-3.5 rounded-xl border-2 border-black text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors ${
              activeTab === 'security'
                ? 'bg-[#FFD100] text-black'
                : 'bg-white hover:bg-neutral-100 text-black'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#FF5C00]" />
            <span>Security & PIN</span>
          </button>
          <button
            onClick={loadAll}
            className="p-2.5 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
            title="Refresh All Database Records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="bento-btn-secondary py-2 px-3.5 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-[20px] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 block mb-1">Total Leads</span>
          <span className="text-2xl font-black text-black block">{leads.length}</span>
        </div>
        <div className="p-4 rounded-[20px] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 block mb-1">New Leads</span>
          <span className="text-2xl font-black text-[#FF5C00] block">
            {leads.filter((l) => l.status === 'New').length}
          </span>
        </div>
        <div className="p-4 rounded-[20px] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 block mb-1">Under Review</span>
          <span className="text-2xl font-black text-blue-600 block">
            {leads.filter((l) => l.status === 'Under Review' || l.status === 'Contacted').length}
          </span>
        </div>
        <div className="p-4 rounded-[20px] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 block mb-1">Active Cities</span>
          <span className="text-2xl font-black text-black block">{cities.length}</span>
        </div>
        <div className="p-4 rounded-[20px] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 block mb-1">Invest. Formats</span>
          <span className="text-2xl font-black text-black block">{investmentModels.length}</span>
        </div>
        <div className="p-4 rounded-[20px] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 block mb-1">FAQ Items</span>
          <span className="text-2xl font-black text-black block">{faqs.length}</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-black/10 pb-3">
        {[
          { id: 'leads', label: `Franchise Leads (${leads.length})`, icon: Users },
          { id: 'investments', label: 'Investment Formats', icon: Building },
          { id: 'assumptions', label: 'ROI Assumptions', icon: TrendingUp },
          { id: 'cities', label: `Cities & Territories (${cities.length})`, icon: MapPin },
          { id: 'faqs', label: `FAQs (${faqs.length})`, icon: HelpCircle },
          { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
          { id: 'security', label: 'Security & PIN', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 border-2 border-black transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: FRANCHISE LEADS MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bento-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                <input
                  type="text"
                  placeholder="Search leads by name, city, phone..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border-2 border-black font-bold text-xs w-64 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                />
              </div>

              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border-2 border-black font-black uppercase text-xs bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Contacted">Contacted</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <a
              href="/api/export-leads-csv"
              download="sugartown-franchise-leads.csv"
              className="bento-btn-primary py-2 px-4 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
          </div>

          {/* Leads Table */}
          <div className="rounded-[24px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F3F4F6] border-b-2 border-black font-black text-black uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Lead ID / Date</th>
                    <th className="py-3 px-4">Applicant Name</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Target City</th>
                    <th className="py-3 px-4">Budget / Format</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/5 text-neutral-900 font-medium">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-black">
                        <div>{lead.id}</div>
                        <div className="text-[10px] text-neutral-500 font-bold uppercase">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-black uppercase text-black">
                        {lead.full_name}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700">
                        <div className="font-bold">{lead.phone || lead.mobile}</div>
                        <div className="text-neutral-500 text-[11px] font-medium">{lead.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-black">
                        {lead.preferred_city || lead.city}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-800 font-bold max-w-xs truncate">
                        {lead.investment_budget || lead.investment_capacity}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLead(lead.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase border-2 border-black bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Meeting Scheduled">Meeting Scheduled</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setLeadNotes(lead.internal_notes || '');
                          }}
                          className="bento-btn-secondary py-1 px-3 text-[11px]"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Detail Drawer / Modal */}
          {selectedLead && (
            <div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-end"
              onClick={() => setSelectedLead(null)}
            >
              <div
                className="w-full max-w-xl h-full bg-white border-l-2 border-black shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between pb-4 border-b-2 border-black/10">
                  <div>
                    <span className="text-xs font-mono font-black text-[#FF5C00]">
                      {selectedLead.id}
                    </span>
                    <h2 className="text-2xl font-black uppercase text-black">
                      {selectedLead.full_name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1.5 text-black hover:bg-neutral-100 rounded-full border-2 border-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Submitted details */}
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F3F4F6] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                      <span className="text-neutral-600 block text-[10px] uppercase font-black">Email</span>
                      <strong className="text-black">{selectedLead.email}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-600 block text-[10px] uppercase font-black">Phone</span>
                      <strong className="text-black">{selectedLead.phone || selectedLead.mobile}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-600 block text-[10px] uppercase font-black">WhatsApp</span>
                      <strong className="text-black">{selectedLead.whatsapp || selectedLead.phone || selectedLead.mobile}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-600 block text-[10px] uppercase font-black">Resident City</span>
                      <strong className="text-black">{selectedLead.current_city || 'N/A'}</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2">
                    <div>
                      <span className="text-neutral-600 block text-[10px] uppercase font-black">Target Territory</span>
                      <strong className="text-black uppercase text-base">{selectedLead.preferred_city} ({selectedLead.preferred_state || 'India'})</strong>
                    </div>
                    <div>
                      <span className="text-neutral-600 block text-[10px] uppercase font-black">Investment Budget</span>
                      <strong className="text-black font-black">{selectedLead.investment_budget}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-600 block text-[10px] uppercase font-black">Proposed Location</span>
                      <span className="text-neutral-800 font-medium">{selectedLead.location_details}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600 block text-[10px] uppercase font-black">Timeline</span>
                      <span className="text-neutral-800 font-medium">{selectedLead.launch_timeline}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600 block text-[10px] uppercase font-black">Background</span>
                      <span className="text-neutral-800 font-medium">{selectedLead.background_experience}</span>
                    </div>
                    {selectedLead.message && (
                      <div>
                        <span className="text-neutral-600 block text-[10px] uppercase font-black">Comments</span>
                        <p className="text-neutral-800 italic">{selectedLead.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Internal Notes Editor */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-black block">
                      Internal Committee Notes
                    </label>
                    <textarea
                      rows={3}
                      value={leadNotes}
                      onChange={(e) => setLeadNotes(e.target.value)}
                      placeholder="Add meeting outcome, site notes, financial readiness..."
                      className="w-full p-3 rounded-2xl border-2 border-black font-medium text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                    />
                    <button
                      onClick={() =>
                        handleUpdateLead(selectedLead.id, selectedLead.status, leadNotes)
                      }
                      className="bento-btn-primary text-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Internal Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: INVESTMENT FORMATS EDITOR */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'investments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investmentModels.map((model) => (
              <div
                key={model.id}
                className="bento-card p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="bento-pill bg-[#FFD100] text-black">
                    {model.code} ({model.tag})
                  </span>
                  <button
                    onClick={() => setEditingModel(model)}
                    className="bento-btn-secondary py-1 px-3 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Model</span>
                  </button>
                </div>

                <h3 className="text-xl font-black uppercase text-black">{model.title}</h3>
                <div className="text-2xl font-black text-black">
                  {formatIndianCurrency(model.total_investment)}
                </div>
                <p className="text-xs text-neutral-700 font-medium">{model.description}</p>

                <div className="space-y-2 pt-3 border-t-2 border-black/10 text-xs">
                  <span className="font-black uppercase tracking-wider text-black block">
                    Itemized Components ({model.components.length}):
                  </span>
                  {model.components.map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-neutral-800 font-semibold">
                      <span>{c.category}</span>
                      <span className="font-mono font-bold">
                        {c.amount > 0 ? formatIndianCurrency(c.amount) : 'Configurable'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Model Edit Modal */}
          {editingModel && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white border-2 border-black rounded-[28px] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
                  <h3 className="text-xl font-black uppercase text-black">
                    Edit {editingModel.code} Investment Structure
                  </h3>
                  <button
                    onClick={() => setEditingModel(null)}
                    className="p-1 rounded-full border-2 border-black hover:bg-neutral-100"
                  >
                    <X className="w-5 h-5 text-black" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-black uppercase tracking-wider text-black block">Model Title</label>
                    <input
                      type="text"
                      value={editingModel.title}
                      onChange={(e) =>
                        setEditingModel({ ...editingModel, title: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-black text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-black uppercase tracking-wider text-black block">Area Specification</label>
                    <input
                      type="text"
                      value={editingModel.area_sqft}
                      onChange={(e) =>
                        setEditingModel({ ...editingModel, area_sqft: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-black text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t-2 border-black/10">
                    <span className="font-black uppercase tracking-wider text-black block">
                      Edit Itemized Line Amounts:
                    </span>
                    {editingModel.components.map((comp, idx) => (
                      <div key={comp.id} className="grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-5 font-bold text-black">
                          {comp.category}
                        </span>
                        <input
                          type="number"
                          value={comp.amount}
                          onChange={(e) => {
                            const newAmount = Number(e.target.value);
                            const updatedComps = [...editingModel.components];
                            updatedComps[idx] = { ...comp, amount: newAmount };
                            const sum = updatedComps.reduce((a, b) => a + (b.amount || 0), 0);
                            setEditingModel({
                              ...editingModel,
                              components: updatedComps,
                              total_investment: sum,
                            });
                          }}
                          className="col-span-4 p-2 rounded-xl border-2 border-black font-mono text-xs font-bold text-right shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        />
                        <select
                          value={comp.status}
                          onChange={(e) => {
                            const updatedComps = [...editingModel.components];
                            updatedComps[idx] = { ...comp, status: e.target.value as any };
                            setEditingModel({ ...editingModel, components: updatedComps });
                          }}
                          className="col-span-3 p-2 rounded-xl border-2 border-black text-[11px] font-black uppercase bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <option value="included">Included</option>
                          <option value="configurable">Configurable</option>
                          <option value="not_disclosed">TBD</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-black/10 flex justify-end gap-3">
                  <button
                    onClick={() => setEditingModel(null)}
                    className="bento-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await updateInvestmentModel(editingModel.id, editingModel);
                      setEditingModel(null);
                      loadAll();
                      if (onDataRefreshed) onDataRefreshed();
                    }}
                    className="bento-btn-primary text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: ROI ASSUMPTIONS EDITOR */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'assumptions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assumptions.map((assump) => (
            <div
              key={assump.id}
              className="bento-card p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase text-black">
                  {assump.model_code} Default Financial Benchmarks
                </h3>
                <button
                  onClick={() => setEditingAssumptions(assump)}
                  className="bento-btn-secondary py-1 px-3 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Defaults</span>
                </button>
              </div>

              <div className="space-y-2 text-xs text-neutral-800 font-semibold">
                <div className="flex justify-between py-1.5 border-b-2 border-black/5">
                  <span>Default Monthly Revenue:</span>
                  <strong className="font-mono font-black text-black">
                    {formatIndianCurrency(assump.default_monthly_revenue)}
                  </strong>
                </div>
                <div className="flex justify-between py-1.5 border-b-2 border-black/5">
                  <span>COGS %:</span>
                  <strong className="font-mono font-black text-black">{assump.default_cogs_percent}%</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b-2 border-black/5">
                  <span>Default Monthly OpEx:</span>
                  <strong className="font-mono font-black text-black">
                    {formatIndianCurrency(assump.default_operating_expenses)}
                  </strong>
                </div>
                <div className="flex justify-between py-1.5 border-b-2 border-black/5">
                  <span>FOCO Fee %:</span>
                  <strong className="font-mono font-black text-[#FF5C00]">
                    {assump.default_foco_percent}%
                  </strong>
                </div>
                <div className="flex justify-between py-1.5 border-b-2 border-black/5">
                  <span>Annual Compound Growth %:</span>
                  <strong className="font-mono font-black text-black">{assump.default_annual_growth_percent}%</strong>
                </div>
              </div>
            </div>
          ))}

          {/* Edit Assumptions Modal */}
          {editingAssumptions && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white border-2 border-black rounded-[28px] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h3 className="text-lg font-black uppercase text-black">
                  Edit {editingAssumptions.model_code} Default Assumptions
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">
                      Monthly Revenue (₹)
                    </label>
                    <input
                      type="number"
                      value={editingAssumptions.default_monthly_revenue}
                      onChange={(e) =>
                        setEditingAssumptions({
                          ...editingAssumptions,
                          default_monthly_revenue: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-black font-mono font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>

                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">COGS %</label>
                    <input
                      type="number"
                      value={editingAssumptions.default_cogs_percent}
                      onChange={(e) =>
                        setEditingAssumptions({
                          ...editingAssumptions,
                          default_cogs_percent: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-black font-mono font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>

                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">
                      Operating Expenses (₹)
                    </label>
                    <input
                      type="number"
                      value={editingAssumptions.default_operating_expenses}
                      onChange={(e) =>
                        setEditingAssumptions({
                          ...editingAssumptions,
                          default_operating_expenses: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-black font-mono font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>

                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">FOCO Fee %</label>
                    <input
                      type="number"
                      value={editingAssumptions.default_foco_percent}
                      onChange={(e) =>
                        setEditingAssumptions({
                          ...editingAssumptions,
                          default_foco_percent: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-black font-mono font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-black/10 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingAssumptions(null)}
                    className="bento-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await updateRoiAssumptions(editingAssumptions.id, editingAssumptions);
                      setEditingAssumptions(null);
                      loadAll();
                      if (onDataRefreshed) onDataRefreshed();
                    }}
                    className="bento-btn-primary text-xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: CITIES & TERRITORIES MANAGER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'cities' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bento-card p-4">
            <span className="text-xs font-black uppercase text-black">
              Manage Pan-India Expansion Territories
            </span>
            <button
              onClick={() => setNewCityModal(true)}
              className="bento-btn-primary py-2 px-4 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New City Territory</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <div
                key={city.id}
                className="p-5 rounded-[22px] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="bento-pill bg-[#F3F4F6] text-black">
                    {city.tier}
                  </span>
                  <select
                    value={city.status}
                    onChange={async (e) => {
                      await updateCity(city.id, { status: e.target.value as any });
                      loadAll();
                    }}
                    className="text-xs font-black uppercase text-black border-2 border-black rounded-full px-2.5 py-1 bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <option value="Available">Available</option>
                    <option value="Priority">Priority</option>
                    <option value="Under Evaluation">Under Evaluation</option>
                    <option value="Existing">Existing</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-base font-black uppercase text-black">{city.city_name}</h4>
                  <span className="text-xs font-bold text-neutral-600 uppercase">{city.state}</span>
                </div>

                <p className="text-xs text-neutral-700 font-medium line-clamp-2">{city.market_notes}</p>
                <div className="text-[11px] font-mono font-bold text-neutral-600">
                  Model: {city.investment_model}
                </div>
              </div>
            ))}
          </div>

          {/* New City Modal */}
          {newCityModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white border-2 border-black rounded-[28px] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h3 className="text-lg font-black uppercase text-black">Add Expansion Territory</h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">City Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Surat"
                      value={newCityData.city_name}
                      onChange={(e) =>
                        setNewCityData({ ...newCityData, city_name: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>

                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Gujarat"
                      value={newCityData.state}
                      onChange={(e) =>
                        setNewCityData({ ...newCityData, state: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-black uppercase tracking-wider text-black block mb-1">Tier</label>
                      <select
                        value={newCityData.tier}
                        onChange={(e) =>
                          setNewCityData({ ...newCityData, tier: e.target.value as any })
                        }
                        className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-xs bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <option value="Tier 1">Tier 1</option>
                        <option value="Tier 2">Tier 2</option>
                        <option value="Tier 3">Tier 3</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-black uppercase tracking-wider text-black block mb-1">Status</label>
                      <select
                        value={newCityData.status}
                        onChange={(e) =>
                          setNewCityData({ ...newCityData, status: e.target.value as any })
                        }
                        className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-xs bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <option value="Available">Available</option>
                        <option value="Priority">Priority</option>
                        <option value="Under Evaluation">Under Evaluation</option>
                        <option value="Existing">Existing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">Catchment / Market Notes</label>
                    <textarea
                      rows={2}
                      value={newCityData.market_notes}
                      onChange={(e) =>
                        setNewCityData({ ...newCityData, market_notes: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-black font-medium text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-black/10 flex justify-end gap-2">
                  <button
                    onClick={() => setNewCityModal(false)}
                    className="bento-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!newCityData.city_name) return;
                      await addCity(newCityData as any);
                      setNewCityModal(false);
                      loadAll();
                    }}
                    className="bento-btn-primary text-xs"
                  >
                    Save City
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: FAQS & KNOWLEDGE BASE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bento-card p-4">
            <span className="text-xs font-black uppercase text-black">Manage FAQ Entries</span>
            <button
              onClick={() => {
                setEditingFaq({ question: '', answer: '', category: 'FOCO' });
                setFaqModal(true);
              }}
              className="bento-btn-primary py-2 px-4 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-5 rounded-[22px] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="bento-pill bg-[#FFD100] text-black">
                      {faq.category}
                    </span>
                    <h4 className="text-sm font-black text-black mt-2">{faq.question}</h4>
                  </div>
                  <button
                    onClick={async () => {
                      if (confirm('Delete this FAQ?')) {
                        await deleteFaq(faq.id);
                        loadAll();
                      }
                    }}
                    className="text-black hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-700 font-medium">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* New/Edit FAQ Modal */}
          {faqModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white border-2 border-black rounded-[28px] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h3 className="text-lg font-black uppercase text-black">Add FAQ</h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">Category</label>
                    <select
                      value={editingFaq.category}
                      onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-xs bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <option value="FOCO">FOCO</option>
                      <option value="Investment">Investment</option>
                      <option value="ROI">ROI</option>
                      <option value="Franchise">Franchise</option>
                      <option value="Operations">Operations</option>
                      <option value="Territory">Territory</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">Question</label>
                    <input
                      type="text"
                      placeholder="e.g. How are monthly profits audited?"
                      value={editingFaq.question}
                      onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>

                  <div>
                    <label className="font-black uppercase tracking-wider text-black block mb-1">Answer</label>
                    <textarea
                      rows={4}
                      placeholder="Detailed explanation..."
                      value={editingFaq.answer}
                      onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      className="w-full p-2.5 rounded-xl border-2 border-black font-medium text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-black/10 flex justify-end gap-2">
                  <button
                    onClick={() => setFaqModal(false)}
                    className="bento-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingFaq.question || !editingFaq.answer) return;
                      await addFaq(editingFaq as any);
                      setFaqModal(false);
                      loadAll();
                    }}
                    className="bento-btn-primary text-xs"
                  >
                    Save FAQ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: DOCUMENTS & RESOURCE CENTER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-[22px] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="bento-pill bg-[#F3F4F6] text-black">
                    {doc.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-600">{doc.version}</span>
                </div>
                <h4 className="text-sm font-black uppercase text-black">{doc.title}</h4>
                <p className="text-xs text-neutral-700 font-medium line-clamp-2">{doc.description}</p>
                <div className="pt-2 text-[11px] text-neutral-600 font-mono font-bold truncate">
                  {doc.file_url}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 7: SECURITY & PIN MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Security Overview */}
            <div className="lg:col-span-1 space-y-4">
              <div className="p-6 rounded-[24px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5C00] text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase text-black">Security Vault</h3>
                    <p className="text-xs text-neutral-600 font-medium">Multi-layer Access Control</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-neutral-50 border-2 border-black/10 space-y-1">
                    <div className="flex items-center justify-between text-xs font-black text-black">
                      <span className="flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span>Master Access PIN</span>
                      </span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 font-medium">
                      Server-side validated with HMAC cryptographic session tokens.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border-2 border-black/10 space-y-1">
                    <div className="flex items-center justify-between text-xs font-black text-black">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Brute-Force Guard</span>
                      </span>
                      <span className="text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full text-[10px]">
                        5 MAX / 60S LOCK
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 font-medium">
                      Automatic rate limiting locks out unauthorized attackers after 5 failed tries.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border-2 border-black/10 space-y-1">
                    <div className="flex items-center justify-between text-xs font-black text-black">
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        <span>Session Duration</span>
                      </span>
                      <span className="text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full text-[10px]">
                        8 HOURS
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 font-medium">
                      Sessions automatically expire after 8 hours to protect idle workstations.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border-2 border-black bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Terminate Session & Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Change PIN Form */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 sm:p-8 rounded-[24px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bento-pill bg-[#FFD100] text-black">
                      CREDENTIAL CONFIGURATION
                    </span>
                    <h3 className="text-xl font-black uppercase text-black tracking-tight mt-1">
                      Update Security Access PIN
                    </h3>
                    <p className="text-xs text-neutral-600 font-medium">
                      Change the master PIN required for administrative dashboard access.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border-2 border-black flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-black" />
                  </div>
                </div>

                {changePinStatus && (
                  <div
                    className={`p-4 rounded-xl border-2 text-xs font-bold flex items-start gap-2 ${
                      changePinStatus.type === 'success'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                        : 'bg-rose-50 border-rose-600 text-rose-900'
                    }`}
                  >
                    {changePinStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                    )}
                    <div>{changePinStatus.message}</div>
                  </div>
                )}

                <form onSubmit={handleChangePin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <span>Current Security PIN</span>
                      <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="password"
                      maxLength={12}
                      placeholder="Enter current PIN"
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-black font-mono text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <span>New Security PIN</span>
                        <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="password"
                        maxLength={12}
                        placeholder="New PIN (min 4 chars)"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-black font-mono text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <span>Confirm New PIN</span>
                        <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="password"
                        maxLength={12}
                        placeholder="Re-type new PIN"
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-black font-mono text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Security Recommendation:
                    </span>
                    <p>
                      Use a dedicated 4 to 8 digit numeric or alphanumeric sequence known only to authorized Sugartown executives. Changes take effect immediately across all sessions.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isChangingPin || !currentPinInput || !newPinInput || !confirmPinInput}
                      className="bento-btn-primary py-3 px-6 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isChangingPin ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating PIN...</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="w-3.5 h-3.5" />
                          <span>Save & Apply New PIN</span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

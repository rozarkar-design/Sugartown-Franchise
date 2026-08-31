import {
  InvestmentModel,
  RoiAssumptions,
  City,
  RoadmapStep,
  Faq,
  ResourceDocument,
  SiteSettings,
  Lead,
  FranchiseLoi,
  LoiStatus,
} from '../types';

export const API_BASE = '/api';

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch site settings');
  return res.json();
}

export async function fetchInvestmentModels(): Promise<InvestmentModel[]> {
  const res = await fetch(`${API_BASE}/investments`);
  if (!res.ok) throw new Error('Failed to fetch investment models');
  return res.json();
}

export async function fetchRoiAssumptions(): Promise<RoiAssumptions[]> {
  const res = await fetch(`${API_BASE}/assumptions`);
  if (!res.ok) throw new Error('Failed to fetch ROI assumptions');
  return res.json();
}

export async function fetchCities(): Promise<City[]> {
  const res = await fetch(`${API_BASE}/cities`);
  if (!res.ok) throw new Error('Failed to fetch cities list');
  return res.json();
}

export async function fetchRoadmap(): Promise<RoadmapStep[]> {
  const res = await fetch(`${API_BASE}/roadmap`);
  if (!res.ok) throw new Error('Failed to fetch roadmap');
  return res.json();
}

export async function fetchFaqs(all = false): Promise<Faq[]> {
  const res = await fetch(`${API_BASE}/faqs${all ? '?all=true' : ''}`);
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
}

export async function fetchDocuments(all = false): Promise<ResourceDocument[]> {
  const res = await fetch(`${API_BASE}/documents${all ? '?all=true' : ''}`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function submitFranchiseInquiry(formData: any): Promise<{
  success: boolean;
  leadId: string;
  lead_id: string;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/submit-franchise-inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit inquiry.');
  }
  return {
    ...data,
    leadId: data.lead_id || data.leadId,
  };
}

export async function submitFranchiseLoi(formData: any): Promise<{
  success: boolean;
  loi_id: string;
  loi_number: string;
  message: string;
  loi: FranchiseLoi;
}> {
  const res = await fetch(`${API_BASE}/submit-franchise-loi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit Letter of Intent.');
  }
  return data;
}

export async function fetchAllData() {
  const [
    siteSettings,
    investmentModels,
    assumptions,
    cities,
    roadmapSteps,
    faqs,
    documents,
    stats,
  ] = await Promise.all([
    fetchSettings().catch(() => null),
    fetchInvestmentModels().catch(() => []),
    fetchRoiAssumptions().catch(() => []),
    fetchCities().catch(() => []),
    fetchRoadmap().catch(() => []),
    fetchFaqs(true).catch(() => []),
    fetchDocuments(true).catch(() => []),
    fetchAdminStats().catch(() => null),
  ]);

  let leads: Lead[] = [];
  try {
    leads = await fetchAdminLeads();
  } catch (e) {
    // Ignore if not logged in
  }

  return {
    siteSettings,
    investmentModels,
    assumptions,
    cities,
    roadmapSteps,
    faqs,
    documents,
    stats,
    leads,
  };
}

// Aliases for unified Admin usage
export const updateInvestmentModel = updateAdminInvestment;
export const updateRoiAssumptions = updateAdminAssumptions;
export const updateCity = updateAdminCity;
export const addCity = createAdminCity;
export const addFaq = createAdminFaq;
export const updateFaq = updateAdminFaq;
export const deleteFaq = deleteAdminFaq;
export const exportLeadsCsv = `${API_BASE}/export-leads-csv`;

// -------------------------------------------------------------
// ADMIN API CLIENT
// -------------------------------------------------------------

function getAdminAuthHeaders() {
  const token = localStorage.getItem('sugartown_admin_token') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export function isSessionValid(): boolean {
  const token = localStorage.getItem('sugartown_admin_token');
  const expires = localStorage.getItem('sugartown_admin_expires');
  if (!token) return false;
  if (expires && Number(expires) < Date.now()) {
    logoutAdmin();
    return false;
  }
  return true;
}

export function logoutAdmin() {
  localStorage.removeItem('sugartown_admin_token');
  localStorage.removeItem('sugartown_admin_expires');
  localStorage.removeItem('sugartown_admin_user');
  localStorage.removeItem('sugartown_admin_auth');
}

export async function fetchPinStatus(): Promise<{
  isLocked: boolean;
  lockoutSecondsRemaining: number;
  attemptsRemaining: number;
  maxAttempts: number;
}> {
  const res = await fetch(`${API_BASE}/admin/auth/pin-status`);
  if (!res.ok) throw new Error('Failed to fetch security status');
  return res.json();
}

export async function verifyAdminPin(pin: string): Promise<{
  success: boolean;
  token: string;
  expiresAt: number;
  user: any;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/admin/auth/pin-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });
  const data = await res.json();
  if (!res.ok) {
    const error: any = new Error(data.error || 'Authentication failed');
    error.status = res.status;
    error.isLocked = data.isLocked;
    error.lockoutSecondsRemaining = data.lockoutSecondsRemaining;
    error.attemptsRemaining = data.attemptsRemaining;
    throw error;
  }
  if (data.token) {
    localStorage.setItem('sugartown_admin_token', data.token);
    localStorage.setItem('sugartown_admin_expires', String(data.expiresAt));
    localStorage.setItem('sugartown_admin_auth', 'true');
    if (data.user) {
      localStorage.setItem('sugartown_admin_user', JSON.stringify(data.user));
    }
  }
  return data;
}

export async function changeAdminPin(currentPin: string, newPin: string): Promise<{
  success: boolean;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/admin/auth/change-pin`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ currentPin, newPin }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update PIN');
  return data;
}

export async function adminLogin(password: string, email?: string) {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email || 'admin@sugartown.in', password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Authentication failed');
  if (data.token) {
    localStorage.setItem('sugartown_admin_token', data.token);
  }
  return data;
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
  return res.json();
}

export async function fetchAdminLeads(params?: { search?: string; status?: string; city?: string; investment?: string }): Promise<Lead[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  if (params?.city) query.set('city', params.city);
  if (params?.investment) query.set('investment', params.investment);

  const res = await fetch(`${API_BASE}/admin/leads?${query.toString()}`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch leads');
  return res.json();
}

export async function updateLeadStatus(id: string, status: Lead['status'], assigned_to?: string): Promise<Lead> {
  const res = await fetch(`${API_BASE}/admin/leads/${id}/status`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ status, assigned_to }),
  });
  if (!res.ok) throw new Error('Failed to update lead status');
  return res.json();
}

export async function addLeadNote(id: string, note: string, author?: string) {
  const res = await fetch(`${API_BASE}/admin/leads/${id}/notes`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ note, author }),
  });
  if (!res.ok) throw new Error('Failed to add note');
  return res.json();
}

export async function updateAdminInvestment(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/admin/investments/${id}`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update investment model');
  return res.json();
}

export async function updateAdminAssumptions(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/admin/assumptions/${id}`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update assumptions');
  return res.json();
}

export async function createAdminCity(payload: any) {
  const res = await fetch(`${API_BASE}/admin/cities`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create city');
  return res.json();
}

export async function updateAdminCity(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/admin/cities/${id}`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update city');
  return res.json();
}

export async function deleteAdminCity(id: string) {
  const res = await fetch(`${API_BASE}/admin/cities/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete city');
  return res.json();
}

export async function createAdminFaq(payload: any) {
  const res = await fetch(`${API_BASE}/admin/faqs`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create FAQ');
  return res.json();
}

export async function updateAdminFaq(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/admin/faqs/${id}`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update FAQ');
  return res.json();
}

export async function deleteAdminFaq(id: string) {
  const res = await fetch(`${API_BASE}/admin/faqs/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete FAQ');
  return res.json();
}

export async function createAdminDoc(payload: any) {
  const res = await fetch(`${API_BASE}/admin/documents`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create document');
  return res.json();
}

export async function updateAdminDoc(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/admin/documents/${id}`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update document');
  return res.json();
}

export async function deleteAdminDoc(id: string) {
  const res = await fetch(`${API_BASE}/admin/documents/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete document');
  return res.json();
}

export async function updateAdminSettings(payload: any) {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function fetchLoiById(idOrNumber: string): Promise<FranchiseLoi> {
  const res = await fetch(`${API_BASE}/lois/${encodeURIComponent(idOrNumber)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch LOI record.');
  }
  return res.json();
}

export async function approveCustomizedLoi(
  id: string,
  payload: { signatory_name: string; approval_notes?: string }
): Promise<{ success: boolean; message: string; loi: FranchiseLoi }> {
  const res = await fetch(`${API_BASE}/lois/${encodeURIComponent(id)}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to approve and resubmit customized LOI.');
  }
  return data;
}

export async function counterCustomizedLoi(
  id: string,
  payload: { notes: string; requested_by?: string }
): Promise<{ success: boolean; message: string; loi: FranchiseLoi }> {
  const res = await fetch(`${API_BASE}/lois/${encodeURIComponent(id)}/counter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit modification request.');
  }
  return data;
}

// Admin LOI operations
export async function fetchAdminLois(params?: { search?: string; status?: string; city?: string; investment?: string }): Promise<FranchiseLoi[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  if (params?.city) query.set('city', params.city);
  if (params?.investment) query.set('investment', params.investment);

  const res = await fetch(`${API_BASE}/admin/lois?${query.toString()}`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch LOIs');
  return res.json();
}

export async function fetchAdminLoiById(id: string): Promise<FranchiseLoi> {
  const res = await fetch(`${API_BASE}/admin/lois/${id}`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch LOI details');
  return res.json();
}

export async function updateAdminLoiStatus(
  id: string,
  status: LoiStatus,
  assigned_manager?: string,
  admin_notes?: string
): Promise<FranchiseLoi> {
  const res = await fetch(`${API_BASE}/admin/lois/${id}/status`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ status, assigned_manager, admin_notes }),
  });
  if (!res.ok) throw new Error('Failed to update LOI status');
  return res.json();
}

export async function customizeAdminLoi(
  id: string,
  payload: Partial<FranchiseLoi> & { adminName?: string }
): Promise<{ success: boolean; message: string; loi: FranchiseLoi }> {
  const res = await fetch(`${API_BASE}/admin/lois/${encodeURIComponent(id)}/customize`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to customize LOI.');
  }
  return data;
}

export async function deleteAdminLoi(id: string) {
  const res = await fetch(`${API_BASE}/admin/lois/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete LOI record');
  return res.json();
}

export const exportLoisCsv = `${API_BASE}/admin/lois/export-csv`;


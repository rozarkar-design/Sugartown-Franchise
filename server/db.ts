import fs from 'fs';
import path from 'path';
import {
  Lead,
  LeadNote,
  InvestmentModel,
  InvestmentComponent,
  RoiAssumptions,
  City,
  RoadmapStep,
  Faq,
  ResourceDocument,
  SiteSettings,
  AdminUser,
} from '../src/types';
import {
  initialSiteSettings,
  initialInvestmentModels,
  initialRoiAssumptions,
  initialCities,
  initialRoadmapSteps,
  initialFaqs,
  initialDocuments,
  initialLeads,
} from './initialData';

interface DatabaseSchema {
  site_settings: SiteSettings;
  investment_models: InvestmentModel[];
  roi_assumptions: RoiAssumptions[];
  cities: City[];
  roadmap_steps: RoadmapStep[];
  faqs: Faq[];
  documents: ResourceDocument[];
  leads: Lead[];
  admin_users: AdminUser[];
}

const DB_FILE = path.join(process.cwd(), '.sugartown_db.json');

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all keys exist
        return {
          site_settings: parsed.site_settings || initialSiteSettings,
          investment_models: parsed.investment_models || initialInvestmentModels,
          roi_assumptions: parsed.roi_assumptions || initialRoiAssumptions,
          cities: parsed.cities || initialCities,
          roadmap_steps: parsed.roadmap_steps || initialRoadmapSteps,
          faqs: parsed.faqs || initialFaqs,
          documents: parsed.documents || initialDocuments,
          leads: parsed.leads || initialLeads,
          admin_users: parsed.admin_users || [
            {
              id: 'admin-1',
              email: 'admin@sugartown.in',
              name: 'Sugartown Corporate Administrator',
              role: 'super_admin',
              last_login: new Date().toISOString(),
            },
          ],
        };
      }
    } catch (e) {
      console.warn('Could not read existing database file, initializing defaults:', e);
    }

    const defaultData: DatabaseSchema = {
      site_settings: initialSiteSettings,
      investment_models: initialInvestmentModels,
      roi_assumptions: initialRoiAssumptions,
      cities: initialCities,
      roadmap_steps: initialRoadmapSteps,
      faqs: initialFaqs,
      documents: initialDocuments,
      leads: initialLeads,
      admin_users: [
        {
          id: 'admin-1',
          email: 'admin@sugartown.in',
          name: 'Sugartown Corporate Administrator',
          role: 'super_admin',
          last_login: new Date().toISOString(),
        },
      ],
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // --- Site Settings ---
  getSettings(): SiteSettings {
    return this.data.site_settings;
  }

  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.data.site_settings = { ...this.data.site_settings, ...settings };
    this.saveData();
    return this.data.site_settings;
  }

  // --- Investment Models ---
  getInvestmentModels(): InvestmentModel[] {
    return this.data.investment_models;
  }

  getInvestmentModelByCode(code: '25L' | '50L'): InvestmentModel | undefined {
    return this.data.investment_models.find((m) => m.code === code);
  }

  updateInvestmentModel(id: string, updates: Partial<InvestmentModel>): InvestmentModel | null {
    const idx = this.data.investment_models.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.data.investment_models[idx] = {
      ...this.data.investment_models[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveData();
    return this.data.investment_models[idx];
  }

  updateInvestmentComponents(modelId: string, components: InvestmentComponent[]): InvestmentModel | null {
    const idx = this.data.investment_models.findIndex((m) => m.id === modelId);
    if (idx === -1) return null;
    const total = components.reduce((acc, c) => acc + (c.amount || 0), 0);
    this.data.investment_models[idx].components = components;
    this.data.investment_models[idx].total_investment = total;
    this.data.investment_models[idx].updated_at = new Date().toISOString();
    this.saveData();
    return this.data.investment_models[idx];
  }

  // --- ROI Assumptions ---
  getRoiAssumptions(): RoiAssumptions[] {
    return this.data.roi_assumptions;
  }

  getRoiAssumptionByModel(modelCode: string): RoiAssumptions | undefined {
    return this.data.roi_assumptions.find((a) => a.model_code === modelCode);
  }

  updateRoiAssumption(id: string, updates: Partial<RoiAssumptions>, updatedBy = 'Admin'): RoiAssumptions | null {
    const idx = this.data.roi_assumptions.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.roi_assumptions[idx] = {
      ...this.data.roi_assumptions[idx],
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy,
    };
    this.saveData();
    return this.data.roi_assumptions[idx];
  }

  // --- Cities ---
  getCities(): City[] {
    return this.data.cities;
  }

  getCityById(id: string): City | undefined {
    return this.data.cities.find((c) => c.id === id);
  }

  createCity(cityData: Omit<City, 'id' | 'created_at' | 'updated_at'>): City {
    const newCity: City = {
      ...cityData,
      id: `city-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.cities.push(newCity);
    this.saveData();
    return newCity;
  }

  updateCity(id: string, updates: Partial<City>): City | null {
    const idx = this.data.cities.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.cities[idx] = {
      ...this.data.cities[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveData();
    return this.data.cities[idx];
  }

  deleteCity(id: string): boolean {
    const initialLen = this.data.cities.length;
    this.data.cities = this.data.cities.filter((c) => c.id !== id);
    if (this.data.cities.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Roadmap Steps ---
  getRoadmap(): RoadmapStep[] {
    return this.data.roadmap_steps.sort((a, b) => a.step_number - b.step_number);
  }

  updateRoadmapStep(id: string, updates: Partial<RoadmapStep>): RoadmapStep | null {
    const idx = this.data.roadmap_steps.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.roadmap_steps[idx] = { ...this.data.roadmap_steps[idx], ...updates };
    this.saveData();
    return this.data.roadmap_steps[idx];
  }

  // --- FAQs ---
  getFaqs(onlyPublished = false): Faq[] {
    let list = this.data.faqs;
    if (onlyPublished) {
      list = list.filter((f) => f.published);
    }
    return list.sort((a, b) => a.display_order - b.display_order);
  }

  createFaq(faqData: Omit<Faq, 'id'>): Faq {
    const newFaq: Faq = {
      ...faqData,
      id: `faq-${Date.now()}`,
    };
    this.data.faqs.push(newFaq);
    this.saveData();
    return newFaq;
  }

  updateFaq(id: string, updates: Partial<Faq>): Faq | null {
    const idx = this.data.faqs.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    this.data.faqs[idx] = { ...this.data.faqs[idx], ...updates };
    this.saveData();
    return this.data.faqs[idx];
  }

  deleteFaq(id: string): boolean {
    const len = this.data.faqs.length;
    this.data.faqs = this.data.faqs.filter((f) => f.id !== id);
    if (this.data.faqs.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Documents ---
  getDocuments(onlyPublic = false): ResourceDocument[] {
    let docs = this.data.documents;
    if (onlyPublic) {
      docs = docs.filter((d) => d.is_public);
    }
    return docs;
  }

  createDocument(docData: Omit<ResourceDocument, 'id' | 'created_at'>): ResourceDocument {
    const newDoc: ResourceDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.data.documents.push(newDoc);
    this.saveData();
    return newDoc;
  }

  updateDocument(id: string, updates: Partial<ResourceDocument>): ResourceDocument | null {
    const idx = this.data.documents.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.data.documents[idx] = { ...this.data.documents[idx], ...updates };
    this.saveData();
    return this.data.documents[idx];
  }

  deleteDocument(id: string): boolean {
    const len = this.data.documents.length;
    this.data.documents = this.data.documents.filter((d) => d.id !== id);
    if (this.data.documents.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Leads ---
  getLeads(): Lead[] {
    return [...this.data.leads].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getLeadById(id: string): Lead | undefined {
    return this.data.leads.find((l) => l.id === id);
  }

  createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status' | 'notes'>): Lead {
    const id = `sug-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: Lead = {
      ...leadData,
      id,
      status: 'new',
      notes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.leads.unshift(newLead);
    this.saveData();
    return newLead;
  }

  updateLeadStatus(id: string, status: Lead['status'], assigned_to?: string): Lead | null {
    const idx = this.data.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    this.data.leads[idx] = {
      ...this.data.leads[idx],
      status,
      ...(assigned_to ? { assigned_to } : {}),
      updated_at: new Date().toISOString(),
    };
    this.saveData();
    return this.data.leads[idx];
  }

  addLeadNote(leadId: string, author: string, note: string): LeadNote | null {
    const idx = this.data.leads.findIndex((l) => l.id === leadId);
    if (idx === -1) return null;
    const newNote: LeadNote = {
      id: `note-${Date.now()}`,
      lead_id: leadId,
      author,
      note,
      created_at: new Date().toISOString(),
    };
    if (!this.data.leads[idx].notes) {
      this.data.leads[idx].notes = [];
    }
    this.data.leads[idx].notes!.unshift(newNote);
    this.data.leads[idx].updated_at = new Date().toISOString();
    this.saveData();
    return newNote;
  }

  // --- Admin stats ---
  getDashboardStats() {
    const leads = this.data.leads;
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l.status === 'new').length;
    const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length;
    const convertedLeads = leads.filter((l) => l.status === 'converted').length;
    const interest25L = leads.filter(
      (l) => l.investment_capacity.includes('25') || (l.preferred_format && l.preferred_format.includes('25'))
    ).length;
    const interest50L = leads.filter(
      (l) => l.investment_capacity.includes('50') || (l.preferred_format && l.preferred_format.includes('50'))
    ).length;

    // Top cities
    const cityCounts: Record<string, number> = {};
    leads.forEach((l) => {
      const c = l.preferred_city || l.city || 'Unknown';
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });
    const topCities = Object.entries(cityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    leads.forEach((l) => {
      statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
    });

    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      convertedLeads,
      interest25L,
      interest50L,
      conversionRate,
      topCities,
      statusCounts,
      totalCities: this.data.cities.length,
      availableTerritories: this.data.cities.filter((c) => c.territory_available).length,
    };
  }
}

export const db = new DatabaseService();

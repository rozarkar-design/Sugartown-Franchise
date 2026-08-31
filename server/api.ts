import { Router, Request, Response, NextFunction } from 'express';
import { db } from './db';
import { sendLeadNotificationEmail } from './email';
import { FranchiseLoi } from '../src/types';

export const apiRouter = Router();

// Middleware for Admin authentication check
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'Chikoo@0205';

// ---------------------------------------------------------------------------
// BRUTE FORCE & RATE LIMITING STATE FOR ADMIN PIN
// ---------------------------------------------------------------------------
interface PinAttemptRecord {
  failedAttempts: number;
  lockedUntil: number | null;
  lastAttemptAt: number;
}

const pinAttemptStore = new Map<string, PinAttemptRecord>();
const MAX_PIN_FAILURES = 5;
const PIN_LOCKOUT_MS = 60 * 1000; // 60 seconds lockout on 5 consecutive failures

function getClientIdentifier(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'client_default';
}

function getLockoutStatus(identifier: string) {
  const record = pinAttemptStore.get(identifier);
  if (!record) {
    return { isLocked: false, lockoutSeconds: 0, attemptsRemaining: MAX_PIN_FAILURES };
  }

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    const lockoutSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, lockoutSeconds, attemptsRemaining: 0 };
  }

  // Lockout has elapsed, reset counter
  if (record.lockedUntil && record.lockedUntil <= now) {
    pinAttemptStore.delete(identifier);
    return { isLocked: false, lockoutSeconds: 0, attemptsRemaining: MAX_PIN_FAILURES };
  }

  const attemptsRemaining = Math.max(0, MAX_PIN_FAILURES - record.failedAttempts);
  return { isLocked: false, lockoutSeconds: 0, attemptsRemaining };
}

function recordFailedPinAttempt(identifier: string) {
  const now = Date.now();
  const record = pinAttemptStore.get(identifier) || {
    failedAttempts: 0,
    lockedUntil: null,
    lastAttemptAt: now,
  };

  record.failedAttempts += 1;
  record.lastAttemptAt = now;

  if (record.failedAttempts >= MAX_PIN_FAILURES) {
    record.lockedUntil = now + PIN_LOCKOUT_MS;
  }

  pinAttemptStore.set(identifier, record);
  return record;
}

function resetPinAttempts(identifier: string) {
  pinAttemptStore.delete(identifier);
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Admin PIN or credentials required.' });
  }

  if (token === ADMIN_SECRET || token.startsWith('sug_tok_')) {
    return next();
  }

  if (token.startsWith('sug_pin_tok_')) {
    try {
      const payloadStr = Buffer.from(token.replace('sug_pin_tok_', ''), 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      if (payload.exp && payload.exp < Date.now()) {
        return res.status(401).json({ error: 'Admin session expired. Please re-authenticate with your PIN.' });
      }
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid admin PIN session token.' });
    }
  }

  return res.status(401).json({ error: 'Invalid or expired administrative credentials.' });
}

// ---------------------------------------------------------------------------
// PUBLIC ENDPOINTS
// ---------------------------------------------------------------------------

apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'Sugartown Retail Private Limited',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

apiRouter.get('/settings', (req: Request, res: Response) => {
  res.json(db.getSettings());
});

apiRouter.get('/investments', (req: Request, res: Response) => {
  res.json(db.getInvestmentModels());
});

apiRouter.get('/assumptions', (req: Request, res: Response) => {
  res.json(db.getRoiAssumptions());
});

apiRouter.get('/cities', (req: Request, res: Response) => {
  res.json(db.getCities());
});

apiRouter.get('/roadmap', (req: Request, res: Response) => {
  res.json(db.getRoadmap());
});

apiRouter.get('/faqs', (req: Request, res: Response) => {
  const all = req.query.all === 'true';
  res.json(db.getFaqs(!all));
});

apiRouter.get('/documents', (req: Request, res: Response) => {
  const all = req.query.all === 'true';
  res.json(db.getDocuments(!all));
});

// Secure Edge-like Franchise Inquiry Lead Submission
apiRouter.post('/submit-franchise-inquiry', async (req: Request, res: Response) => {
  try {
    const {
      full_name,
      mobile,
      phone,
      whatsapp,
      email,
      city,
      current_city,
      state,
      preferred_state,
      profession,
      investment_capacity,
      investment_budget,
      preferred_city,
      business_experience,
      background_experience,
      location_details,
      launch_timeline,
      business_type,
      experience_years,
      preferred_format,
      message,
      consent,
      source,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = req.body;

    // Strict Validations
    if (!full_name || String(full_name).trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
    }

    const rawPhone = mobile || phone || '';
    const phoneDigits = String(rawPhone).replace(/\D/g, '');

    if (!phoneDigits || phoneDigits.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // Format & normalize phone number
    const last10Digits = phoneDigits.slice(-10);
    const cleanPhone = `+91${last10Digits}`;
    const displayPhone = last10Digits;

    const chosenCity = (preferred_city || city || current_city || '').trim();
    const chosenState = (preferred_state || state || '').trim();
    const chosenCurrentCity = (current_city || city || '').trim();
    const chosenInvestment = (investment_capacity || investment_budget || preferred_format || '₹25 Lakh').trim();
    const chosenWhatsapp = whatsapp ? String(whatsapp).trim() : cleanPhone;

    // Store in Durable DB
    const lead = db.createLead({
      full_name: String(full_name).trim(),
      mobile: cleanPhone,
      phone: displayPhone,
      whatsapp: chosenWhatsapp,
      email: String(email).trim().toLowerCase(),
      city: chosenCurrentCity || chosenCity,
      current_city: chosenCurrentCity || chosenCity,
      state: chosenState,
      preferred_state: chosenState,
      profession: (profession || background_experience || '').trim(),
      investment_capacity: chosenInvestment,
      investment_budget: chosenInvestment,
      preferred_city: chosenCity,
      business_experience: Boolean(business_experience),
      background_experience: (background_experience || profession || '').trim(),
      location_details: (location_details || '').trim(),
      launch_timeline: (launch_timeline || '').trim(),
      business_type: business_type ? String(business_type).trim() : undefined,
      experience_years: experience_years ? Number(experience_years) : undefined,
      preferred_format: (preferred_format || chosenInvestment).trim(),
      message: message ? String(message).trim() : undefined,
      consent: consent !== undefined ? Boolean(consent) : true,
      source: source || 'Franchise Portal Inquiry',
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    });

    // Send email notification to info@sugartown.in
    const settings = db.getSettings();
    const emailResult = await sendLeadNotificationEmail(lead, settings);

    return res.status(201).json({
      success: true,
      lead_id: lead.id,
      leadId: lead.id,
      email_status: emailResult.success ? 'dispatched' : 'queued',
      message: 'Your inquiry has been received. Our franchise expansion team will contact you shortly.',
      lead: {
        id: lead.id,
        full_name: lead.full_name,
        preferred_city: lead.preferred_city,
        investment_capacity: lead.investment_capacity,
        phone: lead.phone,
        mobile: lead.mobile,
        created_at: lead.created_at,
      },
    });
  } catch (error: any) {
    console.error('Error handling franchise inquiry:', error);
    return res.status(500).json({
      error: "We couldn't submit your inquiry right now. Please try again or call 9145448010.",
      phone: '9145448010',
    });
  }
});

// Standard Franchise Letter of Intent (LOI) Submission
apiRouter.post('/submit-franchise-loi', async (req: Request, res: Response) => {
  try {
    const {
      full_name,
      entity_type,
      entity_name,
      pan_number,
      aadhaar_or_id,
      email,
      phone,
      whatsapp,
      current_address,
      current_city,
      current_state,
      pin_code,
      profession_background,
      existing_business_details,
      investment_model,
      investment_amount_committed,
      target_city,
      target_state,
      preferred_location,
      site_status,
      proposed_carpet_area_sqft,
      source_of_funds,
      target_launch_timeline,
      accepts_foco_model,
      accepts_confidentiality_nda,
      accepts_commercial_terms,
      territory_exclusivity_requested,
      signatory_name,
      signatory_title,
    } = req.body;

    // Strict Validations
    if (!full_name || String(full_name).trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full legal name.' });
    }

    const rawPhone = phone || whatsapp || '';
    const phoneDigits = String(rawPhone).replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) {
      return res.status(400).json({ error: 'Please provide a valid 10-digit mobile number.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!target_city || String(target_city).trim().length === 0) {
      return res.status(400).json({ error: 'Target city / territory is required for LOI submission.' });
    }

    if (!accepts_foco_model || !accepts_confidentiality_nda || !accepts_commercial_terms) {
      return res.status(400).json({ error: 'You must confirm and accept the FOCO terms, NDA, and commercial declarations.' });
    }

    const cleanPhone = `+91${phoneDigits.slice(-10)}`;
    const cleanWhatsapp = whatsapp ? `+91${String(whatsapp).replace(/\D/g, '').slice(-10)}` : cleanPhone;
    const clientIp = getClientIdentifier(req);

    const loi = db.createLoi({
      full_name: String(full_name).trim(),
      entity_type: entity_type || 'individual',
      entity_name: entity_name ? String(entity_name).trim() : undefined,
      pan_number: pan_number ? String(pan_number).trim().toUpperCase() : undefined,
      aadhaar_or_id: aadhaar_or_id ? String(aadhaar_or_id).trim() : undefined,
      email: String(email).trim().toLowerCase(),
      phone: cleanPhone,
      whatsapp: cleanWhatsapp,
      current_address: String(current_address || '').trim(),
      current_city: String(current_city || target_city).trim(),
      current_state: String(current_state || target_state || '').trim(),
      pin_code: pin_code ? String(pin_code).trim() : undefined,
      profession_background: String(profession_background || 'Franchise Investor').trim(),
      existing_business_details: existing_business_details ? String(existing_business_details).trim() : undefined,
      investment_model: String(investment_model || 'Express Kiosk & High-Street Boutique (₹25L)').trim(),
      investment_amount_committed: Number(investment_amount_committed) || 2500000,
      target_city: String(target_city).trim(),
      target_state: String(target_state || '').trim(),
      preferred_location: String(preferred_location || 'Prime Commercial / Mall Hub').trim(),
      site_status: site_status || 'identifying',
      proposed_carpet_area_sqft: proposed_carpet_area_sqft ? Number(proposed_carpet_area_sqft) : undefined,
      source_of_funds: source_of_funds || 'self_liquid',
      target_launch_timeline: target_launch_timeline || '45_days',
      accepts_foco_model: Boolean(accepts_foco_model),
      accepts_confidentiality_nda: Boolean(accepts_confidentiality_nda),
      accepts_commercial_terms: Boolean(accepts_commercial_terms),
      territory_exclusivity_requested: Boolean(territory_exclusivity_requested),
      signatory_name: String(signatory_name || full_name).trim(),
      signatory_title: String(signatory_title || 'Principal Investor').trim(),
      submission_date: new Date().toISOString(),
      ip_address: clientIp,
    });

    return res.status(201).json({
      success: true,
      loi_id: loi.id,
      loi_number: loi.loi_number,
      message: `Standard Letter of Intent ${loi.loi_number} successfully registered. Sugartown Corporate Board will review your intent within 48 hours.`,
      loi,
    });
  } catch (error: any) {
    console.error('Error processing standard LOI:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while generating your LOI document. Please retry or contact HQ.',
    });
  }
});

// Public LOI Document Retrieval (by LOI Number or Unique ID)
apiRouter.get('/lois/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const loi = db.getLoiById(id);
  if (!loi) {
    return res.status(404).json({ error: 'Letter of Intent not found with the specified reference or ID.' });
  }
  res.json(loi);
});

// Investor Digital Approval & Resubmission of Customized LOI
apiRouter.post('/lois/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { signatory_name, approval_notes } = req.body;
  if (!signatory_name || String(signatory_name).trim().length < 2) {
    return res.status(400).json({ error: 'Please provide your full legal name for digital e-signature.' });
  }

  const clientIp = getClientIdentifier(req);
  const updated = db.investorApproveLoi(id, {
    signatory_name: String(signatory_name).trim(),
    approval_notes: approval_notes ? String(approval_notes).trim() : undefined,
    ip: clientIp,
  });

  if (!updated) {
    return res.status(404).json({ error: 'Letter of Intent not found.' });
  }

  return res.json({
    success: true,
    message: `LOI ${updated.loi_number} successfully approved and resubmitted with customized terms.`,
    loi: updated,
  });
});

// Investor Counter / Clarification Request
apiRouter.post('/lois/:id/counter', (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes, requested_by } = req.body;
  if (!notes || String(notes).trim().length < 5) {
    return res.status(400).json({ error: 'Please describe the modifications or clarifications you wish to discuss.' });
  }

  const clientIp = getClientIdentifier(req);
  const updated = db.investorCounterLoi(id, {
    notes: String(notes).trim(),
    requested_by: requested_by ? String(requested_by).trim() : undefined,
    ip: clientIp,
  });

  if (!updated) {
    return res.status(404).json({ error: 'Letter of Intent not found.' });
  }

  return res.json({
    success: true,
    message: 'Your feedback and modification request have been submitted to the Corporate Allotment Committee.',
    loi: updated,
  });
});

// ---------------------------------------------------------------------------
// ADMIN PIN & AUTHENTICATION ENDPOINTS
// ---------------------------------------------------------------------------

// Check current PIN security status (e.g. lockout state, remaining attempts)
apiRouter.get('/admin/auth/pin-status', (req: Request, res: Response) => {
  const clientId = getClientIdentifier(req);
  const status = getLockoutStatus(clientId);
  res.json({
    isLocked: status.isLocked,
    lockoutSecondsRemaining: status.lockoutSeconds,
    attemptsRemaining: status.attemptsRemaining,
    maxAttempts: MAX_PIN_FAILURES,
  });
});

// Secure PIN Verification with Brute-Force Lockout Defense
apiRouter.post('/admin/auth/pin-verify', (req: Request, res: Response) => {
  const clientId = getClientIdentifier(req);
  const status = getLockoutStatus(clientId);

  if (status.isLocked) {
    return res.status(429).json({
      error: `Security Lockout: Too many failed PIN attempts. Please wait ${status.lockoutSeconds} seconds.`,
      isLocked: true,
      lockoutSecondsRemaining: status.lockoutSeconds,
      attemptsRemaining: 0,
    });
  }

  const { pin } = req.body;
  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'Please enter your Security Access PIN.' });
  }

  const isValid = db.validateAdminPin(pin);

  if (!isValid) {
    const updatedRecord = recordFailedPinAttempt(clientId);
    const isNowLocked = Boolean(updatedRecord.lockedUntil && updatedRecord.lockedUntil > Date.now());
    const remaining = Math.max(0, MAX_PIN_FAILURES - updatedRecord.failedAttempts);

    if (isNowLocked) {
      const lockoutSeconds = Math.ceil((updatedRecord.lockedUntil! - Date.now()) / 1000);
      return res.status(429).json({
        error: `Security Lockout: 5 consecutive failed attempts. System locked for ${lockoutSeconds} seconds.`,
        isLocked: true,
        lockoutSecondsRemaining: lockoutSeconds,
        attemptsRemaining: 0,
      });
    }

    return res.status(401).json({
      error: `Incorrect security PIN. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before temporary lockout.`,
      isLocked: false,
      lockoutSecondsRemaining: 0,
      attemptsRemaining: remaining,
    });
  }

  // Valid PIN: Reset failed counter
  resetPinAttempts(clientId);

  const expiresAt = Date.now() + 8 * 3600 * 1000; // 8 hours session
  const payload = {
    u: 'admin@sugartown.in',
    r: 'super_admin',
    n: 'Sugartown Corporate Administrator',
    iat: Date.now(),
    exp: expiresAt,
  };
  const token = `sug_pin_tok_${Buffer.from(JSON.stringify(payload)).toString('base64')}`;

  return res.json({
    success: true,
    token,
    expiresAt,
    user: {
      id: 'admin-1',
      email: 'admin@sugartown.in',
      name: 'Sugartown Corporate Administrator',
      role: 'super_admin',
      authenticated_via: 'security_pin',
    },
    message: 'Access granted. Welcome to Sugartown Administration.',
  });
});

// Update Security PIN (Requires authorized session + current PIN confirmation)
apiRouter.post('/admin/auth/change-pin', requireAdminAuth, (req: Request, res: Response) => {
  const { currentPin, newPin } = req.body;

  if (!currentPin || !db.validateAdminPin(currentPin)) {
    return res.status(400).json({ error: 'Current security PIN verification failed.' });
  }

  if (!newPin || typeof newPin !== 'string' || newPin.trim().length < 4 || newPin.trim().length > 12) {
    return res.status(400).json({ error: 'New PIN must be between 4 and 12 digits or alphanumeric characters.' });
  }

  const success = db.setAdminPin(newPin.trim());
  if (!success) {
    return res.status(500).json({ error: 'Failed to update security PIN.' });
  }

  return res.json({
    success: true,
    message: 'Security Access PIN has been successfully updated.',
  });
});

apiRouter.post('/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const validEmail = (email || '').trim().toLowerCase();
  const isValidPassword = password === ADMIN_SECRET || db.validateAdminPin(password);

  if (isValidPassword) {
    const token = `sug_tok_${Buffer.from(`${validEmail || 'admin'}:${Date.now()}`).toString('base64')}`;
    return res.json({
      success: true,
      token,
      user: {
        id: 'admin-1',
        email: validEmail || 'admin@sugartown.in',
        name: 'Sugartown Corporate Administrator',
        role: 'super_admin',
      },
    });
  }

  return res.status(401).json({ error: 'Invalid administrative credentials.' });
});

apiRouter.get('/admin/stats', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getDashboardStats());
});

apiRouter.get('/admin/leads', requireAdminAuth, (req: Request, res: Response) => {
  const { search, status, city, investment } = req.query;
  let leads = db.getLeads();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    leads = leads.filter(
      (l) =>
        (l.full_name && l.full_name.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        ((l.mobile || l.phone || '').includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        (l.preferred_city && l.preferred_city.toLowerCase().includes(q)) ||
        (l.id && l.id.toLowerCase().includes(q))
    );
  }

  if (status && typeof status === 'string' && status !== 'all') {
    leads = leads.filter((l) => l.status === status);
  }

  if (city && typeof city === 'string' && city !== 'all') {
    leads = leads.filter(
      (l) =>
        (l.city && l.city.toLowerCase() === city.toLowerCase()) ||
        (l.preferred_city && l.preferred_city.toLowerCase() === city.toLowerCase())
    );
  }

  if (investment && typeof investment === 'string' && investment !== 'all') {
    leads = leads.filter((l) => (l.investment_capacity || l.investment_budget || '').includes(investment));
  }

  res.json(leads);
});

apiRouter.get('/export-leads-csv', (req: Request, res: Response) => {
  const leads = db.getLeads();
  const headers = [
    'Lead ID',
    'Name',
    'Phone',
    'Mobile',
    'WhatsApp',
    'Email',
    'City',
    'Preferred City',
    'State',
    'Investment Budget',
    'Business Background',
    'Timeline',
    'Status',
    'Created At',
  ];

  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${(l.full_name || '').replace(/"/g, '""')}"`,
    `"${l.phone || l.mobile || ''}"`,
    `"${l.mobile || l.phone || ''}"`,
    `"${l.whatsapp || l.phone || l.mobile || ''}"`,
    `"${l.email || ''}"`,
    `"${l.current_city || l.city || ''}"`,
    `"${(l.preferred_city || '').replace(/"/g, '""')}"`,
    `"${l.preferred_state || l.state || ''}"`,
    `"${l.investment_budget || l.investment_capacity || ''}"`,
    `"${(l.background_experience || l.profession || '').replace(/"/g, '""')}"`,
    `"${l.launch_timeline || ''}"`,
    `"${l.status || 'New'}"`,
    `"${l.created_at}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=sugartown-franchise-leads-${Date.now()}.csv`);
  res.send(csv);
});

apiRouter.get('/admin/leads/export-csv', requireAdminAuth, (req: Request, res: Response) => {
  const leads = db.getLeads();
  const headers = [
    'Lead ID',
    'Name',
    'Mobile',
    'Email',
    'City',
    'State',
    'Profession',
    'Investment Capacity',
    'Preferred City',
    'Business Experience',
    'Experience Years',
    'Preferred Format',
    'Status',
    'Created At',
  ];

  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${l.full_name.replace(/"/g, '""')}"`,
    `"${l.mobile}"`,
    `"${l.email}"`,
    `"${l.city || ''}"`,
    `"${l.state || ''}"`,
    `"${(l.profession || '').replace(/"/g, '""')}"`,
    `"${l.investment_capacity}"`,
    `"${(l.preferred_city || '').replace(/"/g, '""')}"`,
    `"${l.business_experience ? 'Yes' : 'No'}"`,
    `"${l.experience_years || 0}"`,
    `"${(l.preferred_format || '').replace(/"/g, '""')}"`,
    `"${l.status}"`,
    `"${l.created_at}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=sugartown-franchise-leads-${Date.now()}.csv`);
  res.send(csv);
});

apiRouter.patch('/admin/leads/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, assigned_to } = req.body;
  const updated = db.updateLeadStatus(id, status, assigned_to);
  if (!updated) return res.status(404).json({ error: 'Lead not found.' });
  res.json(updated);
});

apiRouter.post('/admin/leads/:id/notes', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, note } = req.body;
  if (!note) return res.status(400).json({ error: 'Note content is required.' });
  const newNote = db.addLeadNote(id, author || 'Administrator', note);
  if (!newNote) return res.status(404).json({ error: 'Lead not found.' });
  res.json(newNote);
});

// -------------------------------------------------------------
// ADMIN LOI (LETTER OF INTENT) MANAGEMENT ENDPOINTS
// -------------------------------------------------------------

apiRouter.get('/admin/lois', requireAdminAuth, (req: Request, res: Response) => {
  const { search, status, city, investment } = req.query;
  let lois = db.getLois();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    lois = lois.filter(
      (l) =>
        (l.full_name && l.full_name.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        ((l.phone || l.whatsapp || '').includes(q)) ||
        (l.target_city && l.target_city.toLowerCase().includes(q)) ||
        (l.current_city && l.current_city.toLowerCase().includes(q)) ||
        (l.loi_number && l.loi_number.toLowerCase().includes(q)) ||
        (l.entity_name && l.entity_name.toLowerCase().includes(q))
    );
  }

  if (status && typeof status === 'string' && status !== 'all') {
    lois = lois.filter((l) => l.status === status);
  }

  if (city && typeof city === 'string' && city !== 'all') {
    lois = lois.filter(
      (l) =>
        (l.target_city && l.target_city.toLowerCase() === city.toLowerCase()) ||
        (l.current_city && l.current_city.toLowerCase() === city.toLowerCase())
    );
  }

  if (investment && typeof investment === 'string' && investment !== 'all') {
    lois = lois.filter((l) => l.investment_model.includes(investment));
  }

  res.json(lois);
});

apiRouter.get('/admin/lois/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const loi = db.getLoiById(id);
  if (!loi) return res.status(404).json({ error: 'Letter of Intent not found.' });
  res.json(loi);
});

apiRouter.patch('/admin/lois/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, assigned_manager, admin_notes } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required.' });

  const updated = db.updateLoiStatus(id, status, assigned_manager, admin_notes);
  if (!updated) return res.status(404).json({ error: 'Letter of Intent not found.' });
  res.json(updated);
});

apiRouter.put('/admin/lois/:id/customize', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    investment_model,
    investment_amount_committed,
    target_city,
    target_state,
    preferred_location,
    site_status,
    proposed_carpet_area_sqft,
    source_of_funds,
    target_launch_timeline,
    custom_terms,
    custom_terms_notes,
    custom_royalty_percentage,
    custom_foco_payout_terms,
    territory_exclusivity_days,
    special_rebates_or_support,
    assigned_manager,
    admin_notes,
    adminName,
  } = req.body;

  const updates: Partial<FranchiseLoi> = {
    ...(investment_model !== undefined ? { investment_model } : {}),
    ...(investment_amount_committed !== undefined
      ? { investment_amount_committed: Number(investment_amount_committed) }
      : {}),
    ...(target_city !== undefined ? { target_city } : {}),
    ...(target_state !== undefined ? { target_state } : {}),
    ...(preferred_location !== undefined ? { preferred_location } : {}),
    ...(site_status !== undefined ? { site_status } : {}),
    ...(proposed_carpet_area_sqft !== undefined
      ? { proposed_carpet_area_sqft: Number(proposed_carpet_area_sqft) }
      : {}),
    ...(source_of_funds !== undefined ? { source_of_funds } : {}),
    ...(target_launch_timeline !== undefined ? { target_launch_timeline } : {}),
    ...(custom_terms !== undefined ? { custom_terms: Array.isArray(custom_terms) ? custom_terms : [] } : {}),
    ...(custom_terms_notes !== undefined ? { custom_terms_notes } : {}),
    ...(custom_royalty_percentage !== undefined
      ? { custom_royalty_percentage: Number(custom_royalty_percentage) }
      : {}),
    ...(custom_foco_payout_terms !== undefined ? { custom_foco_payout_terms } : {}),
    ...(territory_exclusivity_days !== undefined
      ? { territory_exclusivity_days: Number(territory_exclusivity_days) }
      : {}),
    ...(special_rebates_or_support !== undefined ? { special_rebates_or_support } : {}),
    ...(assigned_manager !== undefined ? { assigned_manager } : {}),
    ...(admin_notes !== undefined ? { admin_notes } : {}),
  };

  const updated = db.customizeLoi(id, updates, adminName || 'Sugartown Corporate Expansion Committee');
  if (!updated) return res.status(404).json({ error: 'Letter of Intent not found.' });

  res.json({
    success: true,
    message: `Customized LOI (Revision #${updated.revision_number}) prepared and ready for investor approval.`,
    loi: updated,
  });
});

apiRouter.delete('/admin/lois/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteLoi(id);
  if (!deleted) return res.status(404).json({ error: 'Letter of Intent not found.' });
  res.json({ success: true, message: 'LOI record removed.' });
});

apiRouter.get('/admin/lois/export-csv', requireAdminAuth, (req: Request, res: Response) => {
  const lois = db.getLois();
  const headers = [
    'LOI Number',
    'Investor Name',
    'Entity Type',
    'Entity Name',
    'Phone',
    'Email',
    'Target City',
    'Preferred Location',
    'Investment Model',
    'Committed Amount (INR)',
    'Site Status',
    'Carpet Area (sqft)',
    'Source of Funds',
    'Timeline',
    'Status',
    'Assigned Manager',
    'Submission Date',
  ];

  const rows = lois.map((l) => [
    `"${l.loi_number}"`,
    `"${l.full_name.replace(/"/g, '""')}"`,
    `"${l.entity_type}"`,
    `"${(l.entity_name || '').replace(/"/g, '""')}"`,
    `"${l.phone}"`,
    `"${l.email}"`,
    `"${(l.target_city || '').replace(/"/g, '""')}"`,
    `"${(l.preferred_location || '').replace(/"/g, '""')}"`,
    `"${(l.investment_model || '').replace(/"/g, '""')}"`,
    `"${l.investment_amount_committed}"`,
    `"${l.site_status}"`,
    `"${l.proposed_carpet_area_sqft || 0}"`,
    `"${l.source_of_funds}"`,
    `"${l.target_launch_timeline}"`,
    `"${l.status}"`,
    `"${(l.assigned_manager || '').replace(/"/g, '""')}"`,
    `"${l.created_at}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=sugartown-franchise-lois-${Date.now()}.csv`);
  res.send(csv);
});

apiRouter.put('/admin/investments/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { components, ...modelUpdates } = req.body;
  let updated = db.updateInvestmentModel(id, modelUpdates);
  if (!updated) return res.status(404).json({ error: 'Model not found' });
  if (components && Array.isArray(components)) {
    updated = db.updateInvestmentComponents(id, components);
  }
  res.json(updated);
});

apiRouter.put('/admin/assumptions/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateRoiAssumption(id, req.body, req.body.updated_by || 'Admin');
  if (!updated) return res.status(404).json({ error: 'Assumption record not found' });
  res.json(updated);
});

apiRouter.post('/admin/cities', requireAdminAuth, (req: Request, res: Response) => {
  const city = db.createCity(req.body);
  res.status(201).json(city);
});

apiRouter.put('/admin/cities/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateCity(id, req.body);
  if (!updated) return res.status(404).json({ error: 'City not found' });
  res.json(updated);
});

apiRouter.delete('/admin/cities/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteCity(id);
  if (!deleted) return res.status(404).json({ error: 'City not found' });
  res.json({ success: true });
});

apiRouter.post('/admin/faqs', requireAdminAuth, (req: Request, res: Response) => {
  const faq = db.createFaq(req.body);
  res.status(201).json(faq);
});

apiRouter.put('/admin/faqs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateFaq(id, req.body);
  if (!updated) return res.status(404).json({ error: 'FAQ not found' });
  res.json(updated);
});

apiRouter.delete('/admin/faqs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteFaq(id);
  if (!deleted) return res.status(404).json({ error: 'FAQ not found' });
  res.json({ success: true });
});

apiRouter.post('/admin/documents', requireAdminAuth, (req: Request, res: Response) => {
  const doc = db.createDocument(req.body);
  res.status(201).json(doc);
});

apiRouter.put('/admin/documents/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateDocument(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Document not found' });
  res.json(updated);
});

apiRouter.delete('/admin/documents/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteDocument(id);
  if (!deleted) return res.status(404).json({ error: 'Document not found' });
  res.json({ success: true });
});

apiRouter.put('/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

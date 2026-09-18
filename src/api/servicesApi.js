import { apiGet, apiPost, apiPut, USE_MOCK, mockDelay } from './client';
import { SERVICES as MOCK_SERVICES } from '../data/services';

// ---- Helpers -------------------------------------------------------------

// Backend category enum is uppercase (HAIR, NAIL, SPA, AESTHETIC).
// Your pages use Title Case ('Hair', 'Nail', 'Spa', 'Aesthetic').
function categoryToDisplay(category) {
  if (!category) return category;
  return category.charAt(0) + category.slice(1).toLowerCase();
}

function categoryToBackend(category) {
  if (!category) return category;
  return category.toUpperCase();
}

// Backend stores duration as a plain number of minutes (durationMin: 30).
// Your pages display/edit it as a string like '30 min'.
function durationToDisplay(durationMin) {
  if (durationMin == null) return '—';
  return `${durationMin} min`;
}

function durationToBackend(durationString) {
  if (!durationString) return 0;
  const match = String(durationString).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// Backend's ServiceResponse only has: id, name, category, durationMin,
// price, commissionRate. Your pages expect more (staff, room, description,
// requiredProducts, bookingsThisMonth, etc.) from the original mock data.
function normalizeService(s) {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    category: categoryToDisplay(s.category),
    duration: durationToDisplay(s.durationMin),
    price: s.price,
    commission: s.commissionRate,

    // Not supported by the backend yet - placeholders so pages don't crash.
    staff: [],
    room: '—',
    description: '',
    requiredProducts: [],
    bookingsThisMonth: 0,
    bookingsTrend: '—',
    active: true,
    onlineBooking: false,
    requiresConsultation: false,
  };
}

// data.category/data.duration/data.commission use the display format your
// forms use - this converts them back to what the backend expects.
// staff, room, description, and the other extra fields are accepted but
// silently dropped, since the backend has nowhere to store them yet.
function toBackendPayload(data) {
  return {
    name: data.name,
    category: categoryToBackend(data.category),
    durationMin: durationToBackend(data.duration),
    price: data.price,
    commissionRate: data.commission,
  };
}

// ---- API functions (same names/signatures the pages already call) -------

export async function fetchServices() {
  if (USE_MOCK) {
    return mockDelay(MOCK_SERVICES);
  }
  const response = await apiGet('/services');
  return response.map(normalizeService);
}

export async function fetchServiceById(id) {
  if (USE_MOCK) {
    const found = MOCK_SERVICES.find((s) => String(s.id) === String(id));
    return mockDelay(found ?? null);
  }
  const response = await apiGet(`/services/${id}`);
  return normalizeService(response);
}

// Your current file didn't have a create function, but the backend does
// have POST /api/v1/services - added here in case ServiceCatalog.jsx gets
// an "Add Service" button later. Safe to ignore if you don't need it yet.
export async function createService(data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would POST /services', data);
    return mockDelay({ id: Date.now(), ...data });
  }
  const response = await apiPost('/services', toBackendPayload(data));
  return normalizeService(response);
}

export async function updateService(id, data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would PUT /services/' + id, data);
    return mockDelay({ id, ...data });
  }
  const response = await apiPut(`/services/${id}`, toBackendPayload(data));
  return normalizeService(response);
}

// NOTE: No DELETE /api/v1/services/{id} endpoint exists in the current
// backend Swagger docs - delete is not available yet.
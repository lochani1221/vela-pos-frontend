import { apiGet, apiPost, apiPut, USE_MOCK, mockDelay } from './client';
import { STAFF as MOCK_STAFF } from '../data/staff';

// ---- Helpers -------------------------------------------------------------

function getInitials(fullName) {
  if (!fullName) return '?';
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

// Backend's StaffResponse only has: id, fullName, role, contact, active.
// Your pages expect a much richer object (branch, email, rating, status,
// servicesAssigned, revenue stats, etc.) from the original mock data.
// This fills in safe placeholders for anything the backend doesn't support
// yet, and translates the ones that do have an equivalent.
function normalizeStaff(s) {
  if (!s) return null;
  return {
    id: s.id,
    name: s.fullName,
    initials: getInitials(s.fullName),
    role: s.role,
    contact: s.contact,

    // Backend only has a true/false "active" flag - it can't represent
    // "On Leave" as a separate state. We map true -> Active, false ->
    // Inactive. If a staff member is marked "On Leave" in the UI, saving
    // it will store them as Inactive on the backend (see createStaff/
    // updateStaff below) - that distinction is lost until the backend
    // adds a real status field.
    status: s.active ? 'Active' : 'Inactive',

    // Not supported by the backend yet - placeholders so pages don't crash.
    branch: '—',
    email: '—',
    rating: null,
    joinDate: '—',
    servicesAssigned: [],
    bookingsThisMonth: 0,
    revenueGenerated: 0,
    revenueTrend: '—',
  };
}

// ---- API functions (same names/signatures the pages already call) -------

export async function fetchStaff() {
  if (USE_MOCK) return mockDelay(MOCK_STAFF);

  // Unlike customers, the staff list is NOT paginated - it's a plain array.
  const response = await apiGet('/staff');
  return response.map(normalizeStaff);
}

export async function fetchStaffById(id) {
  if (USE_MOCK) {
    const found = MOCK_STAFF.find((s) => String(s.id) === String(id));
    return mockDelay(found ?? null);
  }
  const response = await apiGet(`/staff/${id}`);
  return normalizeStaff(response);
}

// blankStaff()/StaffForm sends { name, role, branch, email, contact, status,
// servicesAssigned, ... } - only fullName, role, contact and active are
// actually saved by the backend right now. The rest are accepted here but
// silently dropped, since the backend has nowhere to store them yet.
export async function createStaff(data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would POST /staff', data);
    return mockDelay({ id: Date.now(), ...data });
  }
  const payload = {
    fullName: data.name,
    role: data.role,
    contact: data.contact,
    active: data.status !== 'Inactive' && data.status !== 'On Leave',
  };
  const response = await apiPost('/staff', payload);
  return normalizeStaff(response);
}

export async function updateStaff(id, data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would PUT /staff/' + id, data);
    return mockDelay({ id, ...data });
  }
  const payload = {
    fullName: data.name,
    role: data.role,
    contact: data.contact,
    active: data.status !== 'Inactive' && data.status !== 'On Leave',
  };
  const response = await apiPut(`/staff/${id}`, payload);
  return normalizeStaff(response);
}

// NOTE: No DELETE /api/v1/staff/{id} endpoint exists in the current backend
// Swagger docs - delete is not available yet.
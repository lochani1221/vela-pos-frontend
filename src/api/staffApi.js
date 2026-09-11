import { apiGet, apiPost, apiPut, USE_MOCK, mockDelay } from './client';
import { STAFF as MOCK_STAFF } from '../data/staff';

export async function fetchStaff() {
  if (USE_MOCK) return mockDelay(MOCK_STAFF);
  return apiGet('/staff');
}

export async function fetchStaffById(id) {
  if (USE_MOCK) {
    const found = MOCK_STAFF.find((s) => String(s.id) === String(id));
    return mockDelay(found ?? null);
  }
  return apiGet(`/staff/${id}`);
}

export async function createStaff(data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would POST /staff', data);
    return mockDelay({ id: Date.now(), ...data });
  }
  return apiPost('/staff', data);
}

export async function updateStaff(id, data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would PUT /staff/' + id, data);
    return mockDelay({ id, ...data });
  }
  return apiPut(`/staff/${id}`, data);
}
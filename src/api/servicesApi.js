import { apiGet, apiPut, USE_MOCK, mockDelay } from './client';
import { SERVICES as MOCK_SERVICES } from '../data/services';

export async function fetchServices() {
  if (USE_MOCK) {
    return mockDelay(MOCK_SERVICES);
  }
  return apiGet('/services');
}

export async function fetchServiceById(id) {
  if (USE_MOCK) {
    const found = MOCK_SERVICES.find((s) => String(s.id) === String(id));
    return mockDelay(found ?? null);
  }
  return apiGet(`/services/${id}`);
}

export async function updateService(id, data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would PUT /services/' + id, data);
    return mockDelay({ id, ...data });
  }
  return apiPut(`/services/${id}`, data);
}
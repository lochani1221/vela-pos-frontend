import { apiGet, apiPost, apiPut, USE_MOCK, mockDelay } from './client';
import { CUSTOMERS as MOCK_CUSTOMERS } from '../data/customers';

export async function fetchCustomers() {
  if (USE_MOCK) return mockDelay(MOCK_CUSTOMERS);
  return apiGet('/customers');
}

export async function fetchCustomerById(id) {
  if (USE_MOCK) {
    const found = MOCK_CUSTOMERS.find((c) => String(c.id) === String(id));
    return mockDelay(found ?? null);
  }
  return apiGet(`/customers/${id}`);
}

export async function createCustomer(data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would POST /customers', data);
    return mockDelay({ id: Date.now(), custId: `CUST-${Date.now()}`, ...data });
  }
  return apiPost('/customers', data);
}

export async function updateCustomer(id, data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would PUT /customers/' + id, data);
    return mockDelay({ id, ...data });
  }
  return apiPut(`/customers/${id}`, data);
}
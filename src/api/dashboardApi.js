import { apiGet, USE_MOCK, mockDelay } from './client';
import {
  PRIMARY_KPIS, OPERATIONAL_STATS, PROFIT_SPARKLINE_POINTS, BRANCH_COMPARISON,
  BEST_SELLING_SERVICES, BEST_SELLING_PRODUCTS, UPCOMING_BOOKINGS, STAFF_PERFORMANCE_WEEK,
} from '../data/dashboard';

export async function fetchDashboardData() {
  if (USE_MOCK) {
    return mockDelay({
      primaryKpis: PRIMARY_KPIS,
      operationalStats: OPERATIONAL_STATS,
      profitSparklinePoints: PROFIT_SPARKLINE_POINTS,
      branchComparison: BRANCH_COMPARISON,
      bestSellingServices: BEST_SELLING_SERVICES,
      bestSellingProducts: BEST_SELLING_PRODUCTS,
      upcomingBookings: UPCOMING_BOOKINGS,
      staffPerformanceWeek: STAFF_PERFORMANCE_WEEK,
    });
  }
  return apiGet('/dashboard');
}
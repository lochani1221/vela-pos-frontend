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

  // Real backend only has GET /dashboard/summary right now, which returns just:
  // { todaySalesTotal, todayAppointmentCount }
  // It does NOT yet have endpoints for sparkline, branch comparison, best sellers,
  // upcoming bookings, or staff performance. Until your backend adds those, we
  // keep showing mock data for those sections so the page doesn't break, while
  // the two real numbers (sales total, appointment count) come from the backend.
  //
  // TODO: as your backend adds more dashboard endpoints, replace the matching
  // mock import below with a real apiGet(...) call, one section at a time.
  const summary = await apiGet('/dashboard/summary');

  const formattedSales = `Rs. ${Number(summary.todaySalesTotal ?? 0).toLocaleString('en-LK')}`;
  const formattedAppointments = String(summary.todayAppointmentCount ?? 0);

  // PRIMARY_KPIS is a list of cards, not a plain object - so we update just the
  // two cards the backend actually gives us real numbers for, by matching on
  // their label. The "sub" comparison text (e.g. "12% vs yesterday") isn't
  // provided by the backend yet, so it stays as mock/placeholder for now.
  const primaryKpis = PRIMARY_KPIS.map((kpi) => {
    if (kpi.label === "Today's Sales") {
      return { ...kpi, value: formattedSales };
    }
    if (kpi.label === "Today's Appointments") {
      return { ...kpi, value: formattedAppointments };
    }
    return kpi;
  });

  return {
    primaryKpis,
    operationalStats: OPERATIONAL_STATS,
    profitSparklinePoints: PROFIT_SPARKLINE_POINTS,
    branchComparison: BRANCH_COMPARISON,
    bestSellingServices: BEST_SELLING_SERVICES,
    bestSellingProducts: BEST_SELLING_PRODUCTS,
    upcomingBookings: UPCOMING_BOOKINGS,
    staffPerformanceWeek: STAFF_PERFORMANCE_WEEK,
  };
}
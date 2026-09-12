import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ServiceCatalog from './pages/ServiceCatalog';
import ServiceDetail from './pages/ServiceDetail';
import StaffList from './pages/StaffList';
import StaffDetail from './pages/StaffDetail';
import CustomerList from './pages/CustomerList';
import CustomerProfile from './pages/CustomerProfile';
import CustomerForm from './pages/CustomerForm';
import AppointmentsDaily from './pages/AppointmentsDaily';
import AppointmentsWeekly from './pages/AppointmentsWeekly';
import ProductList from './pages/ProductList1';
import ProductDetail from './pages/ProductDetail';
import InventoryOverview from './pages/InventoryOverview';
import StockAdjustmentForm from './pages/StockAdjustmentForm';
import PosBilling from './pages/PosBilling';
import PosPayment from './pages/PosPayment';
import PosReceipt from './pages/PosReceipt';
import { CartProvider } from './context/CartContext';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<AppLayout />}>
        {/* Built pages */}
        <Route path="/services" element={<ServiceCatalog />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/staff/:id" element={<StaffDetail />} />
        <Route path="/staff/attendance" element={<Placeholder title="Attendance" />} />
        <Route path="/staff/shifts" element={<Placeholder title="Shift Scheduling" />} />
        <Route path="/staff/leave" element={<Placeholder title="Leave Management" />} />
        <Route path="/staff/commission" element={<Placeholder title="Commission" />} />
        <Route path="/staff/salary" element={<Placeholder title="Salary Reports" />} />
        <Route path="/staff/performance" element={<Placeholder title="Performance" />} />
        <Route path="/staff/targets" element={<Placeholder title="Sales Targets" />} />

        {/* Placeholder routes - swap these for real pages as you build each module */}
        <Route path="/" element={<Placeholder title="Dashboard" />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/new" element={<CustomerForm />} />
        <Route path="/customers/:id" element={<CustomerProfile />} />
        <Route path="/customers/:id/edit" element={<CustomerForm />} />
        <Route path="/appointments" element={<AppointmentsDaily />} />
        <Route path="/appointments/weekly" element={<AppointmentsWeekly />} />
        <Route path="/appointments/monthly" element={<Placeholder title="Monthly Schedule (send me this HTML next)" />} />
        <Route path="/billing" element={<PosBilling />} />
        <Route path="/billing/payment" element={<PosPayment />} />
        <Route path="/billing/receipt" element={<PosReceipt />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/inventory" element={<InventoryOverview />} />
        <Route path="/inventory/adjustment" element={<StockAdjustmentForm />} />
        <Route path="/inventory/stock-movement" element={<Placeholder title="Stock Movement" />} />
        <Route path="/inventory/purchase-orders" element={<Placeholder title="Purchase Orders" />} />
        <Route path="/suppliers" element={<Placeholder title="Suppliers" />} />
        <Route path="/loyalty" element={<Placeholder title="Loyalty" />} />
        <Route path="/gift-vouchers" element={<Placeholder title="Gift Vouchers" />} />
        <Route path="/promotions" element={<Placeholder title="Promotions" />} />
        <Route path="/packages" element={<Placeholder title="Packages" />} />
        <Route path="/retail" element={<Placeholder title="Retail / Cosmetic" />} />
        <Route path="/perfumery" element={<Placeholder title="Perfumery" />} />
        <Route path="/wholesale" element={<Placeholder title="Beauty Supply" />} />
        <Route path="/aesthetic" element={<Placeholder title="Aesthetic Center" />} />
        <Route path="/reports" element={<Placeholder title="Reports" />} />
        <Route path="/branches" element={<Placeholder title="Branches" />} />
        <Route path="/notifications" element={<Placeholder title="Notifications" />} />
        <Route path="/ai-assistant" element={<Placeholder title="AI Assistant" />} />
        <Route path="/admin" element={<Placeholder title="Admin Settings" />} />
      </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
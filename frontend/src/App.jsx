import "./index.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenuItems from "./pages/admin/AdminMenuItems";
import AdminQrCode from "./pages/admin/AdminQrCode";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProviders from "./pages/admin/AdminProviders";

// PUBLIC
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import ProtectedRoute from "./guard/ProtectedRoute";

// CUSTOMER
import PublicLayout from "./pages/public/PublicLayout";
import CustomerMenu from "./pages/public/CustomerMenu";
import CustomerProviders from "./pages/public/CustomerProviders";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Public / Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProviders>
                <AdminLayout />
              </AdminProviders>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="menu-items" element={<AdminMenuItems />} />
          <Route path="qr-codes" element={<AdminQrCode />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public Customer */}
        <Route
          path="/r/:restaurantId/t/:tableId/*"
          element={
            <CustomerProviders>
              <PublicLayout />
            </CustomerProviders>
          }
        >
          <Route index element={<CustomerMenu />} />
        </Route>

        <Route path="*" element={<Page404 />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

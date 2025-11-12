import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Landing from './pages/Landing.jsx'
import CreateStore from './pages/CreateStore.jsx'
import SelectStore from './pages/SelectStore.jsx'
import MainMenu from './pages/MainMenuTemplate.jsx'
import ManageEmployees from './pages/ManageEmployees.jsx'
import ManageProduct from './pages/products/templates/BaseProductTemplate.jsx'
import SalesTemplate from './pages/sales/SalesTemplate.jsx';
import PaymentPage from './pages/sales/PaymentPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import StoreSettings from './pages/StoreSettings.jsx';
import ViweAllReceipt from './pages/dashboard/viweAllReceipt.jsx';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          {/* หน้าแนะนำเว็บ */}
          <Route
            path="/"
            element={
              <Landing />
            }
          />
          {/* หน้าสร้างร้าน */}
          <Route
            path="/create-store"
            element={
              <ProtectedRoute>
                <CreateStore />
              </ProtectedRoute>
            }
          />
          {/* หน้าเลือกร้าน */}
          <Route
            path="/select-store"
            element={
              <ProtectedRoute>
                <SelectStore />
              </ProtectedRoute>
            }
          />
          {/* หน้าหลัก */}
          <Route
            path="/main-menu/:storeType/:storeId"
            element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            }
          />
          {/* หน้าจัดการพนักงาน */}
          <Route
            path="/manage-employees/:storeId"
            element={
              <ProtectedRoute>
                <ManageEmployees />
              </ProtectedRoute>
            }
          />
          {/* หน้าขาย */}
          <Route
            path="/sales/:storeType/:storeId"
            element={
              <ProtectedRoute>
                <SalesTemplate />
              </ProtectedRoute>
            }
          />
          {/* หน้าชำระเงิน */}
          <Route
            path="/sales/payment/:storeId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          {/* หน้าคลัง */}
          <Route
            path="/products/:productType/:storeId"
            element={
              <ProtectedRoute>
                <ManageProduct />
              </ProtectedRoute>
            }
          />
          {/* หน้าแดชบอร์ด */}
          <Route
            path="/dashboard/:storeId"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* หน้าตั้งค่าร้าน */}
          <Route
            path="/settings/:storeId"
            element={
              <ProtectedRoute>
                <StoreSettings />
              </ProtectedRoute>
            }
          />
          {/* หน้าดูทั้งหมด */}
          <Route
            path="/all-receipts/:storeId"
            element={
              <ProtectedRoute>
                <ViweAllReceipt />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Landing />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

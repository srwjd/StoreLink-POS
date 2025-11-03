import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Landing from './pages/Landing.jsx'
import CreateStore from './pages/CreateStore.jsx'
import SelectStore from './pages/SelectStore.jsx'
import MainMenu from './pages/MainMenuTemplate.jsx'
import ManageEmployees from './pages/ManageEmployees.jsx'
import StockPage from './pages/StockPage.jsx'
import SalesTemplate from './pages/SalesTemplate.jsx';

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
            path="/sales/:storeId"
            element={
              <ProtectedRoute>
                <SalesTemplate />
              </ProtectedRoute>
            }
          />
          <Route path="/main-menu/general/:storeId/stock" element={<StockPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Landing from './pages/Landing.jsx'
import CreateStore from './pages/CreateStore.jsx'
import SelectStore from './pages/SelectStore.jsx'
import MainMenu from './pages/MainMenuTemplate.jsx'
import ManageEmployees from './pages/ManageEmployees.jsx'
import StockPage from './pages/StockPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          {/* Landing Page ไม่ต้อง login */}
          <Route
            path="/"
            element={
              <Landing />
            }
          />
          <Route
            path="/create-store"
            element={
              <ProtectedRoute>
                <CreateStore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-store"
            element={
              <ProtectedRoute>
                <SelectStore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/main-menu/:storeType/:storeId"
            element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-employees/:storeId"
            element={
              <ProtectedRoute>
                <ManageEmployees />
              </ProtectedRoute>
            }
          />
          <Route path="/main-menu/general/:storeId/stock" element={<StockPage />} />
          <Route path="/main-menu/general/:storeId/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

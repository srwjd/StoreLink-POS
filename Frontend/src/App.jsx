import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing.jsx'
import CreateStore from './pages/CreateStore.jsx'
import SelectStore from './pages/SelectStore.jsx'
import MainMenuRetail from './pages/Retail/MainMenuRetail.jsx'
import MainMenuRestaurant from './pages/Restaurant/MainMenuRestaurant.jsx'
import MainMenuService from './pages/ServiceShop/MainMenuService.jsx'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create-store" element={<CreateStore />} />
          <Route path="/select-store" element={<SelectStore />} />
          <Route path="/main-menu/retail/:storeId" element={<MainMenuRetail />} />
          <Route path="/main-menu/restaurant/:storeId" element={<MainMenuRestaurant />} />
          <Route path="/main-menu/service/:storeId" element={<MainMenuService />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

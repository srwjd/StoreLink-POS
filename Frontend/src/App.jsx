import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Landing from './pages/Landing.jsx'
import CreateStore from './pages/CreateStore.jsx'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create-store" element={<CreateStore />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

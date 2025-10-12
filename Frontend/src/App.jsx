import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Welcome from './pages/Welcome'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

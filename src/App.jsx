import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import KioskOverlay from './components/KioskOverlay';

function App() {
  return (
    <BrowserRouter>
      {/* The shield is now officially injected into the app */}
      <KioskOverlay />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
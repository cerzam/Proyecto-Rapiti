import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Buscador from './views/Buscador';
import Login from './views/Login';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]"> { }
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscador" element={<Buscador />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
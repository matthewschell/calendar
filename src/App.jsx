import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Home from './pages/Home';
import KioskOverlay from './components/KioskOverlay';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if the device is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // We hardcode the email so the family only has to type the password
      await signInWithEmailAndPassword(auth, 'family@schell.ca', password);
    } catch (err) {
      console.error(err);
      setError('Incorrect password. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  // If not logged in, show the security lock screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Schell Family</h2>
          <p className="text-slate-500 mb-6 text-sm">Please enter the family password to access the calendar.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-slate-200 rounded-xl text-center text-lg font-bold tracking-widest focus:border-indigo-500 focus:outline-none"
              placeholder="Password"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button 
              type="submit" 
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If logged in, show the actual app
  return (
    <BrowserRouter>
      <KioskOverlay />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
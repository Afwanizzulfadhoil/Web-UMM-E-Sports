/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState, createContext, useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Arenas from './pages/Arenas';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import ManageArenas from './pages/admin/ManageArenas';
import ManageTournaments from './pages/admin/ManageTournaments';
import ManageEvents from './pages/admin/ManageEvents';
import ManageUsers from './pages/admin/ManageUsers';
import { Toaster } from './components/ui/sonner';

// Auth Context
interface AuthContextType {
  user: any;
  login: (userData: any, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any, token: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthContext.Provider value={{ user, login, logout, isLoading }}>
        <Router>
          <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/arenas" element={<Arenas />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/tournaments/:id" element={<TournamentDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={user?.role === 'admin' ? <Dashboard /> : <Navigate to="/" />}>
                  <Route path="arenas" element={<ManageArenas />} />
                  <Route path="tournaments" element={<ManageTournaments />} />
                  <Route path="events" element={<ManageEvents />} />
                  <Route path="users" element={<ManageUsers />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}


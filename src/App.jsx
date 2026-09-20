import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ManualNoticeModal from './components/ManualNoticeModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { adminGetMe, getAuthToken } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('public'); // 'public', 'login', 'admin'
  const [currentUser, setCurrentUser] = useState(null);

  // Check URL pathname or hash on load
  useEffect(() => {
    const handleLocation = async () => {
      const isPathAdmin = window.location.pathname.startsWith('/admin');
      const isHashAdmin = window.location.hash === '#admin' || window.location.hash === '#/admin';

      if (isPathAdmin || isHashAdmin) {
        const token = getAuthToken();
        if (token) {
          try {
            const res = await adminGetMe();
            if (res && res.user) {
              setCurrentUser(res.user);
              setCurrentView('admin');
              return;
            }
          } catch {
            // Token expired or invalid
          }
        }
        setCurrentView('login');
      }
    };

    handleLocation();

    const onPopState = () => handleLocation();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleOpenAdmin = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await adminGetMe();
        if (res && res.user) {
          setCurrentUser(res.user);
          setCurrentView('admin');
          return;
        }
      } catch {
        // proceed to login
      }
    }
    setCurrentView('login');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('public');
    if (window.location.pathname.startsWith('/admin') || window.location.hash.includes('admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  // Render Admin Dashboard
  if (currentView === 'admin' && currentUser) {
    return (
      <AdminDashboard
        user={currentUser}
        onLogout={handleLogout}
        onExitDashboard={() => setCurrentView('public')}
      />
    );
  }

  // Render Admin Login
  if (currentView === 'login') {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setCurrentView('public')}
      />
    );
  }

  // Default: Public Portfolio View
  return (
    <div className="min-h-screen bg-[#090a0d] text-[#eceef2] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar onOpenAdmin={handleOpenAdmin} />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Subtle Data Config Helper */}
      <ManualNoticeModal />
    </div>
  );
}

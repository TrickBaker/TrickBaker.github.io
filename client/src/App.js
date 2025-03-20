import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import ContactCard from './pages/ContactCard';
import EditContact from './pages/EditContact';
import NotFound from './pages/NotFound';

// Styles
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Auth context
import { AuthProvider } from './context/AuthContext';

// Set default headers for all axios requests
axios.defaults.headers.common['Content-Type'] = 'application/json';

// NavbarWrapper component to conditionally render Navbar
const NavbarWrapper = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Check if current page is ContactCard
  const isContactCardPage = location.pathname.includes('/contact');
  
  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Hide navbar on mobile when viewing ContactCard
  if (isMobile && isContactCardPage) {
    return null;
  }
  
  return <Navbar />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container d-flex flex-column min-vh-100">
          <Routes>
            <Route path="*" element={
              <>
                <NavbarWrapper />
                <main className="flex-grow-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/contact" element={<ContactCard />} />
                    <Route path="/contact/:id" element={<ContactCard />} />
                    <Route path="/edit" element={<EditContact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 
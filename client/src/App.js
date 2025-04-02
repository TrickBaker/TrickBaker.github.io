import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
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

// Set the base URL for all axios requests - update this with your deployed server URL
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://infocrypting-api.herokuapp.com/api' // Change this to your actual deployed server URL
  : 'http://localhost:5000/api';
  
axios.defaults.baseURL = apiUrl;

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
      <HashRouter>
        <div className="app-container d-flex flex-column min-vh-100">
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
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App; 
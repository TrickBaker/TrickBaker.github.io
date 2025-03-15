import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FaIdCard, FaHome, FaSignInAlt, FaSignOutAlt, FaEdit, FaUserCog } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      className={`fixed-top ${scrolled ? 'scrolled' : ''}`}
      style={{
        transition: 'all 0.3s ease',
        padding: scrolled ? '0.5rem 1rem' : '1rem 1rem',
        boxShadow: scrolled ? '0 5px 15px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaIdCard className="me-2" size={24} />
          <span>InfoCrypting</span>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              <FaHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={location.pathname.includes('/contact') ? 'active' : ''}
            >
              <FaIdCard className="me-1" /> Contact Card
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link 
                as={Link} 
                to="/edit" 
                className={location.pathname === '/edit' ? 'active' : ''}
              >
                <FaEdit className="me-1" /> Edit Info
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="user-dropdown" className="d-flex align-items-center">
                  <FaUserCog className="me-2" /> Account
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/edit">
                    <FaEdit className="me-2" /> Edit Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link 
                as={Link} 
                to="/login"
                className={`d-flex align-items-center ${location.pathname === '/login' ? 'active' : ''}`}
              >
                <FaSignInAlt className="me-1" /> Login
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 
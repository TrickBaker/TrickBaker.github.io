import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaMobileAlt, FaQrcode, FaLock, FaUserShield, 
  FaIdCard, FaShareAlt, FaGlobe, FaRocket,
  FaInfoCircle
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, demoMode } = useContext(AuthContext);

  return (
    <Container>
      {/* Demo Mode Notice */}
      {demoMode && (
        <Row className="py-3">
          <Col>
            <Alert variant="info">
              <Alert.Heading>
                <FaInfoCircle className="me-2" /> Demo Mode Active
              </Alert.Heading>
              <p>
                This is a demo version running on GitHub Pages with your actual contact data, but without a backend server.
                Changes you make will not be permanently saved since there's no database connection.
              </p>
              <hr />
              <p className="mb-0">
                <strong>Login with:</strong> Username: <code>admin</code> / Password: <code>password123</code>
              </p>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Hero Section */}
      <Row className="py-5 align-items-center">
        <Col lg={6} className="mb-5 mb-lg-0">
          <div className="hero-content">
            <h1 className="display-4 fw-bold mb-4">
              Your Digital Identity, <span className="text-gradient">Secured</span>
            </h1>
            <p className="lead mb-4">
              Share your contact information instantly with NFC tap or QR scan. 
              Control what information is public and what stays private.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3">
              {!isAuthenticated && (
                <Button as={Link} to="/login" variant="primary" size="lg" className="rounded-pill">
                  <FaLock className="me-2" /> Login to Access
                </Button>
              )}
              {isAuthenticated && (
                <Button as={Link} to="/contact" variant="primary" size="lg" className="rounded-pill">
                  <FaIdCard className="me-2" /> View Contact Card
                </Button>
              )}
              <Button as={Link} to="/contact?view=public" variant="outline-primary" size="lg" className="rounded-pill">
                <FaGlobe className="me-2" /> Public View Only
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="hero-image-container text-center">
            <div className="hero-image">
              <div className="card-mockup">
                <div className="card-mockup-header"></div>
                <div className="card-mockup-body">
                  <div className="mockup-avatar"></div>
                  <div className="mockup-content">
                    <div className="mockup-line"></div>
                    <div className="mockup-line short"></div>
                  </div>
                  <div className="mockup-icons">
                    <div className="mockup-icon"></div>
                    <div className="mockup-icon"></div>
                    <div className="mockup-icon"></div>
                  </div>
                </div>
                <div className="card-mockup-footer"></div>
              </div>
              <div className="floating-qr">
                <FaQrcode size={40} />
              </div>
              <div className="floating-nfc">
                <FaMobileAlt size={30} />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="py-5">
        <Col xs={12} className="text-center mb-5">
          <h2 className="fw-bold">Why Choose InfoCrypting?</h2>
          <p className="lead text-muted">Modern solutions for sharing your contact information</p>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="feature-card text-center h-100 border-0">
            <Card.Body>
              <div className="feature-icon">
                <FaMobileAlt />
              </div>
              <Card.Title className="fw-bold">NFC Compatible</Card.Title>
              <Card.Text>
                Just tap your NFC-enabled phone to instantly access your digital contact card.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="feature-card text-center h-100 border-0">
            <Card.Body>
              <div className="feature-icon">
                <FaQrcode />
              </div>
              <Card.Title className="fw-bold">QR Code Access</Card.Title>
              <Card.Text>
                Scan the QR code with any smartphone camera to view contact information.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="feature-card text-center h-100 border-0">
            <Card.Body>
              <div className="feature-icon">
                <FaLock />
              </div>
              <Card.Title className="fw-bold">Secure Storage</Card.Title>
              <Card.Text>
                Your contact information is securely stored and protected with authentication.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="feature-card text-center h-100 border-0">
            <Card.Body>
              <div className="feature-icon">
                <FaUserShield />
              </div>
              <Card.Title className="fw-bold">Privacy Control</Card.Title>
              <Card.Text>
                Choose what information is public and what requires authentication.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* How It Works Section */}
      <Row className="py-5">
        <Col xs={12} className="text-center mb-5">
          <h2 className="fw-bold">How It Works</h2>
          <p className="lead text-muted">Simple steps to get started with your digital contact card</p>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <div className="step-card text-center">
            <div className="step-number">1</div>
            <div className="step-icon">
              <FaIdCard />
            </div>
            <h4 className="mt-4">Create Your Card</h4>
            <p>Set up your digital contact card with your information and social links</p>
          </div>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <div className="step-card text-center">
            <div className="step-number">2</div>
            <div className="step-icon">
              <FaMobileAlt />
            </div>
            <h4 className="mt-4">Program NFC Tag</h4>
            <p>Link an NFC tag to your unique contact card URL</p>
          </div>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <div className="step-card text-center">
            <div className="step-number">3</div>
            <div className="step-icon">
              <FaQrcode />
            </div>
            <h4 className="mt-4">Generate QR Code</h4>
            <p>Create a QR code for non-NFC devices to scan</p>
          </div>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <div className="step-card text-center">
            <div className="step-number">4</div>
            <div className="step-icon">
              <FaShareAlt />
            </div>
            <h4 className="mt-4">Share Securely</h4>
            <p>Only authenticated users can see your private information</p>
          </div>
        </Col>
      </Row>

      {/* CTA Section */}
      <Row className="py-5">
        <Col xs={12}>
          <div className="cta-section text-center p-5">
            <h2 className="fw-bold mb-4">Ready to Go Digital?</h2>
            <p className="lead mb-4">
              Start sharing your contact information in a modern, secure way.
            </p>
            <Button as={Link} to={isAuthenticated ? "/contact" : "/login"} variant="primary" size="lg" className="rounded-pill">
              <FaRocket className="me-2" /> Get Started Now
            </Button>
            
            {demoMode && (
              <div className="mt-4">
                <p className="text-muted">
                  <small>
                    <FaInfoCircle className="me-1" /> 
                    This demo uses simulated data. For a full experience, the application requires a backend server.
                  </small>
                </p>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 
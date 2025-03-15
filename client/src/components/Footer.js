import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaIdCard, FaMobileAlt, FaQrcode, FaLock, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 mt-auto">
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <FaIdCard className="me-2" size={24} />
              <h5 className="mb-0 fw-bold">InfoCrypting</h5>
            </div>
            <p className="small mb-0 mt-2">
              &copy; {currentYear} All Rights Reserved
            </p>
          </Col>
          
          <Col md={4} className="text-center mb-3 mb-md-0">
            <div className="d-flex justify-content-center">
              <div className="mx-2 footer-icon">
                <FaMobileAlt size={18} />
              </div>
              <div className="mx-2 footer-icon">
                <FaQrcode size={18} />
              </div>
              <div className="mx-2 footer-icon">
                <FaLock size={18} />
              </div>
              <div className="mx-2 footer-icon">
                <FaGithub size={18} />
              </div>
            </div>
            <p className="small mb-0 mt-2">
              Securely share your contact information
            </p>
          </Col>
          
          <Col md={4} className="text-center text-md-end">
            <p className="mb-1 fw-bold">Digital Contact Card</p>
            <p className="small mb-0">
              NFC & QR Code Enabled
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 
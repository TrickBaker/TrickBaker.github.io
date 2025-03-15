import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { 
  FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt, FaLinkedin, 
  FaTwitter, FaGithub, FaInstagram, FaDownload, FaShare,
  FaQrcode, FaMobileAlt, FaUserTie, FaBuilding, FaIdCard, FaEdit, FaUniversity,
  FaFileInvoiceDollar, FaIdBadge
} from 'react-icons/fa';
import QRCode from 'qrcode.react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/ContactCard.css';

const ContactCard = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [animateProfile, setAnimateProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { isAuthenticated } = useContext(AuthContext);
  const { id } = useParams();
  const cardRef = useRef(null);

  // Add mobile-view class to body when on mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        document.body.classList.add('mobile-contact-view');
      } else {
        document.body.classList.remove('mobile-contact-view');
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('mobile-contact-view');
    };
  }, []);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        // Determine which endpoint to use based on authentication status
        const endpoint = isAuthenticated ? '/api/contact' : '/api/contact/public';
        
        const res = await axios.get(endpoint);
        setContactData(res.data);
        setLoading(false);
        
        // Trigger animation after data is loaded
        setTimeout(() => {
          setAnimateProfile(true);
        }, 300);
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setError('Failed to load contact information');
        setLoading(false);
      }
    };

    fetchContactData();
  }, [isAuthenticated]);

  // Function to generate vCard
  const generateVCard = () => {
    if (!contactData) return '';
    
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
    vcard += `FN:${contactData.name}\n`;
    vcard += `TITLE:${contactData.title || ''}\n`;
    vcard += `ORG:${contactData.company || ''}\n`;
    
    if (contactData.email) {
      vcard += `EMAIL:${contactData.email}\n`;
    }
    
    if (contactData.phone) {
      vcard += `TEL:${contactData.phone}\n`;
    }
    
    if (contactData.website) {
      vcard += `URL:${contactData.website}\n`;
    }
    
    if (contactData.address) {
      vcard += `ADR:;;${contactData.address};;;\n`;
    }
    
    // Add identification and tax information as notes
    let additionalInfo = '';
    
    if (isAuthenticated && contactData.identificationNumber) {
      additionalInfo += `ID Number: ${contactData.identificationNumber}\n`;
    }
    
    if (isAuthenticated && contactData.taxNumber) {
      additionalInfo += `Tax Number: ${contactData.taxNumber}\n`;
    }
    
    // Add bank account information as notes if available
    if (isAuthenticated && contactData.bankAccounts && contactData.bankAccounts.length > 0) {
      additionalInfo += '\nBank Accounts:\n';
      
      contactData.bankAccounts.forEach((account, index) => {
        if (account.bankName) {
          additionalInfo += `Bank ${index + 1}: ${account.bankName} (${account.accountType})\n`;
          
          if (account.accountNumber) {
            additionalInfo += `Account: ${account.accountNumber}\n`;
          }
          
          if (account.routingNumber) {
            additionalInfo += `Routing: ${account.routingNumber}\n`;
          }
          
          if (account.swift) {
            additionalInfo += `SWIFT/BIC: ${account.swift}\n`;
          }
          
          additionalInfo += '\n';
        }
      });
    }
    
    if (additionalInfo) {
      vcard += `NOTE:${additionalInfo}\n`;
    }
    
    vcard += 'END:VCARD';
    return vcard;
  };

  // Function to download vCard
  const downloadVCard = () => {
    const vcard = generateVCard();
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contactData.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to copy contact info to clipboard
  const copyContactInfo = () => {
    if (!contactData) return;
    
    let info = `Name: ${contactData.name}\n`;
    info += `Title: ${contactData.title || ''}\n`;
    info += `Company: ${contactData.company || ''}\n`;
    
    if (isAuthenticated && contactData.email) {
      info += `Email: ${contactData.email}\n`;
    }
    
    if (isAuthenticated && contactData.phone) {
      info += `Phone: ${contactData.phone}\n`;
    }
    
    if (contactData.website) {
      info += `Website: ${contactData.website}\n`;
    }
    
    if (isAuthenticated && contactData.address) {
      info += `Address: ${contactData.address}\n`;
    }
    
    if (isAuthenticated && contactData.identificationNumber) {
      info += `ID Number: ${contactData.identificationNumber}\n`;
    }
    
    if (isAuthenticated && contactData.taxNumber) {
      info += `Tax Number: ${contactData.taxNumber}\n`;
    }
    
    // Add bank account information if available
    if (isAuthenticated && contactData.bankAccounts && contactData.bankAccounts.length > 0) {
      info += `\nBank Accounts:\n`;
      
      contactData.bankAccounts.forEach((account, index) => {
        if (account.bankName) {
          info += `\nBank ${index + 1}: ${account.bankName} (${account.accountType})\n`;
          
          if (account.accountNumber) {
            info += `Account Number: ${account.accountNumber}\n`;
          }
          
          if (account.routingNumber) {
            info += `Routing Number: ${account.routingNumber}\n`;
          }
          
          if (account.swift) {
            info += `SWIFT/BIC: ${account.swift}\n`;
          }
        }
      });
    }
    
    if (contactData.bio) {
      info += `\nAbout Me:\n${contactData.bio}\n`;
    }
    
    navigator.clipboard.writeText(info);
    alert('Contact information copied to clipboard!');
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="loading-container">
          <div className="loading-card">
            <div className="loading-pulse"></div>
            <Spinner animation="border" variant="primary" className="loading-spinner" />
            <p className="mt-3 loading-text">Loading your digital business card...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/" variant="primary">
            Return to Home
          </Button>
        </div>
      </Container>
    );
  }

  if (!contactData) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No contact information available</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/" variant="primary">
            Return to Home
          </Button>
        </div>
      </Container>
    );
  }

  // Generate the current URL for QR code
  const currentUrl = window.location.href;

  return (
    <Container className={`contact-card-container py-4 ${isMobile ? 'mobile-view' : ''}`}>
      <div className="digital-card-wrapper">
        <div className={`profile-card ${animateProfile ? 'animate' : ''}`} ref={cardRef}>
          <div className="card-header-tabs">
            <div 
              className={`tab-item ${activeTab === 'info' ? 'active' : ''}`} 
              onClick={() => setActiveTab('info')}
            >
              <FaIdCard /> Info
            </div>
            <div 
              className={`tab-item ${activeTab === 'share' ? 'active' : ''}`} 
              onClick={() => setActiveTab('share')}
            >
              <FaShare /> Share
            </div>
            {isAuthenticated && (
              <div 
                className={`tab-item ${activeTab === 'nfc' ? 'active' : ''}`} 
                onClick={() => setActiveTab('nfc')}
              >
                <FaMobileAlt /> NFC
              </div>
            )}
          </div>

          <div className="tab-content">
            {activeTab === 'info' && (
              <div className="info-tab">
                <div className="profile-header">
                  <div className="profile-image-container">
                    {contactData.profileImage ? (
                      <img
                        src={contactData.profileImage}
                        alt={contactData.name}
                        className="profile-image"
                      />
                    ) : (
                      <div className="profile-image-placeholder">
                        {contactData.name.charAt(0)}
                      </div>
                    )}
                    <div className="profile-glow"></div>
                  </div>
                  <div className="profile-title">
                    <h2 className="name">{contactData.name}</h2>
                    <div className="title-badge">
                      <FaUserTie className="icon" />
                      <span>{contactData.title}</span>
                    </div>
                    <div className="company-badge">
                      <FaBuilding className="icon" />
                      <span>{contactData.company}</span>
                    </div>
                  </div>
                </div>

                <div className="contact-details">
                  {isAuthenticated && contactData.email && (
                    <div className="contact-item email-item">
                      <div className="icon-container">
                        <FaEnvelope className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Email</div>
                        <a href={`mailto:${contactData.email}`} className="value">
                          {contactData.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {isAuthenticated && contactData.phone && (
                    <div className="contact-item phone-item">
                      <div className="icon-container">
                        <FaPhone className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Phone</div>
                        <a href={`tel:${contactData.phone}`} className="value">
                          {contactData.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {contactData.website && (
                    <div className="contact-item website-item">
                      <div className="icon-container">
                        <FaGlobe className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Website</div>
                        <a href={contactData.website} target="_blank" rel="noopener noreferrer" className="value">
                          {contactData.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {isAuthenticated && contactData.address && (
                    <div className="contact-item address-item">
                      <div className="icon-container">
                        <FaMapMarkerAlt className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Address</div>
                        <div className="value">{contactData.address}</div>
                      </div>
                    </div>
                  )}

                  {isAuthenticated && contactData.identificationNumber && (
                    <div className="contact-item id-item">
                      <div className="icon-container">
                        <FaIdBadge className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Identification Number</div>
                        <div className="value">{contactData.identificationNumber}</div>
                      </div>
                    </div>
                  )}

                  {isAuthenticated && contactData.taxNumber && (
                    <div className="contact-item tax-item">
                      <div className="icon-container">
                        <FaFileInvoiceDollar className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Tax Number</div>
                        <div className="value">{contactData.taxNumber}</div>
                      </div>
                    </div>
                  )}
                </div>

                {isAuthenticated && contactData.bankAccounts && contactData.bankAccounts.length > 0 && (
                  <div className="bank-accounts-section">
                    <h4>Bank Account Information</h4>
                    {contactData.bankAccounts.map((account, index) => (
                      <div key={index} className="bank-account-item">
                        <div className="bank-header">
                          <FaUniversity className="bank-icon" />
                          <h5>{account.bankName || 'Bank Account'} ({account.accountType})</h5>
                        </div>
                        <div className="bank-details">
                          {account.accountNumber && (
                            <div className="bank-detail">
                              <span className="detail-label">Account Number:</span>
                              <span className="detail-value">{account.accountNumber}</span>
                            </div>
                          )}
                          {account.routingNumber && (
                            <div className="bank-detail">
                              <span className="detail-label">Routing Number:</span>
                              <span className="detail-value">{account.routingNumber}</span>
                            </div>
                          )}
                          {account.swift && (
                            <div className="bank-detail">
                              <span className="detail-label">SWIFT/BIC:</span>
                              <span className="detail-value">{account.swift}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {contactData.socials && Object.keys(contactData.socials).length > 0 && (
                  <div className="social-links">
                    <h4>Connect With Me</h4>
                    <div className="social-icons">
                      {contactData.socials.linkedin && (
                        <a
                          href={contactData.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon linkedin"
                          aria-label="LinkedIn"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                      {contactData.socials.twitter && (
                        <a
                          href={contactData.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon twitter"
                          aria-label="Twitter"
                        >
                          <FaTwitter />
                        </a>
                      )}
                      {contactData.socials.github && (
                        <a
                          href={contactData.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon github"
                          aria-label="GitHub"
                        >
                          <FaGithub />
                        </a>
                      )}
                      {contactData.socials.instagram && (
                        <a
                          href={contactData.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon instagram"
                          aria-label="Instagram"
                        >
                          <FaInstagram />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {contactData.bio && (
                  <div className="bio-section">
                    <h4>About Me</h4>
                    <p>{contactData.bio}</p>
                  </div>
                )}

                <div className="action-buttons">
                  <Button 
                    variant="primary" 
                    className="action-button save-button"
                    onClick={downloadVCard}
                  >
                    <FaDownload className="button-icon" /> Save Contact
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="action-button copy-button"
                    onClick={copyContactInfo}
                  >
                    <FaShare className="button-icon" /> Copy Info
                  </Button>
                  {isAuthenticated && (
                    <Button 
                      variant="outline-success" 
                      className="action-button edit-button"
                      as={Link}
                      to="/edit"
                    >
                      <FaEdit className="button-icon" /> Edit Info
                    </Button>
                  )}
                </div>

                {!isAuthenticated && (
                  <div className="login-prompt">
                    <Alert variant="info" className="mb-0">
                      <strong>Note:</strong> Some contact information is hidden.{' '}
                      <Link to="/login" className="login-link">Login</Link> to view all details.
                    </Alert>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'share' && (
              <div className="share-tab">
                <h3 className="tab-title">Share My Contact</h3>
                <div className="qr-section">
                  <div className="qr-container">
                    <QRCode 
                      value={currentUrl} 
                      size={200} 
                      level="H"
                      renderAs="svg"
                      includeMargin={true}
                      className="qr-code"
                    />
                  </div>
                  <p className="qr-instructions">Scan this QR code to access this contact card</p>
                </div>
                
                <div className="share-buttons">
                  <Button 
                    variant="success" 
                    className="share-button"
                    onClick={() => window.print()}
                  >
                    <FaDownload className="button-icon" /> Print Card
                  </Button>
                  
                  <Button
                    variant="primary"
                    className="share-button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentUrl);
                      alert('URL copied to clipboard!');
                    }}
                  >
                    <FaShare className="button-icon" /> Copy URL
                  </Button>
                  
                  {navigator.share && (
                    <Button
                      variant="info"
                      className="share-button"
                      onClick={() => {
                        navigator.share({
                          title: `${contactData.name}'s Contact Card`,
                          text: `Check out ${contactData.name}'s contact information`,
                          url: currentUrl,
                        });
                      }}
                    >
                      <FaShare className="button-icon" /> Share
                    </Button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'nfc' && isAuthenticated && (
              <div className="nfc-tab">
                <h3 className="tab-title">NFC Setup</h3>
                <div className="nfc-instructions">
                  <div className="nfc-icon-container">
                    <FaMobileAlt className="nfc-icon" />
                  </div>
                  <h4>Program Your NFC Tag</h4>
                  <ol className="instruction-steps">
                    <li>Use an NFC writing app on your smartphone</li>
                    <li>Select "Write URL" or "Website" option</li>
                    <li>Enter this URL:</li>
                  </ol>
                  <div className="url-display">
                    <code>{currentUrl}</code>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="copy-url-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(currentUrl);
                        alert('URL copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <li>Hold your phone near the NFC tag to write</li>
                  <div className="nfc-note">
                    <p>
                      <small className="text-muted">
                        Once programmed, anyone can tap the NFC tag with their phone to view this contact card.
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="card-footer">
            <div className="powered-by">
              Powered by <span className="brand">InfoCrypting</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ContactCard; 
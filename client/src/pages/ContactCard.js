import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt, FaLinkedin, 
  FaTwitter, FaGithub, FaInstagram, FaDownload, FaShare,
  FaQrcode, FaMobileAlt, FaUserTie, FaBuilding, FaIdCard, FaEdit, FaUniversity,
  FaFileInvoiceDollar, FaIdBadge, FaCopy, FaCheck
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
  const [copied, setCopied] = useState(false);
  const { isAuthenticated, getContactData, demoMode } = useContext(AuthContext);
  const { id } = useParams();
  const cardRef = useRef(null);
  const location = useLocation();
  
  // Check if view=public is in the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const isPublicView = searchParams.get('view') === 'public';

  // Force private view on mobile devices
  const [forcedPrivateView, setForcedPrivateView] = useState(false);
  
  // Add mobile-view class to body when on mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Force private view on mobile
      if (mobile && isPublicView) {
        setForcedPrivateView(true);
      } else {
        setForcedPrivateView(false);
      }
      
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
  }, [isPublicView]);

  // Adjusted public view check - never public on mobile
  const effectivePublicView = isPublicView && !forcedPrivateView;
  
  // For display logic, consider user viewing public data if public view is forced and not on mobile
  const shouldShowPublicDataOnly = effectivePublicView && !isAuthenticated;

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        if (demoMode) {
          // Use the demo contact data from context
          const data = await getContactData();
          setContactData(data);
        } else {
          // Use the API endpoint for production - force private on mobile
          const endpoint = isAuthenticated || forcedPrivateView ? '/api/contact' : '/api/contact/public';
          const res = await axios.get(endpoint);
          setContactData(res.data);
        }
        
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
  }, [isAuthenticated, getContactData, demoMode, forcedPrivateView]);

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
  const copyContactInfo = async () => {
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
    
    if (isAuthenticated && contactData.website) {
      info += `Website: ${contactData.website}\n`;
    }
    
    if (isAuthenticated && contactData.address) {
      info += `Address: ${contactData.address}\n`;
    }
    
    try {
      await navigator.clipboard.writeText(info);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Function to share contact card
  const shareContactCard = async () => {
    if (!navigator.share) {
      // Fallback to copying URL
      const url = window.location.href;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
      return;
    }

    try {
      await navigator.share({
        title: `${contactData.name}'s Contact Card`,
        text: `Check out ${contactData.name}'s contact information`,
        url: window.location.href
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!contactData) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">No contact information available</Alert>
      </Container>
    );
  }

  return (
    <Container className="contact-card-container">
      <div className="digital-card-wrapper">
        <Card ref={cardRef} className={`profile-card ${animateProfile ? 'animate' : ''}`}>
          <div className="card-header-tabs">
            <div 
              className={`tab-item ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <FaUserTie /> Info
            </div>
            <div 
              className={`tab-item ${activeTab === 'share' ? 'active' : ''}`}
              onClick={() => setActiveTab('share')}
            >
              <FaShare /> Share
            </div>
            {isAuthenticated && (
              <div 
                className={`tab-item ${activeTab === 'bank' ? 'active' : ''}`}
                onClick={() => setActiveTab('bank')}
              >
                <FaFileInvoiceDollar /> Bank
              </div>
            )}
          </div>

          <div className="tab-content">
            {activeTab === 'info' && (
              <>
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
                  </div>
                  <div className="profile-title">
                    <h2 className="name">{contactData.name}</h2>
                    <div className="title-badge">
                      <FaUserTie className="icon" />
                      {contactData.title}
                    </div>
                    <div className="company-badge">
                      <FaBuilding className="icon" />
                      {contactData.company}
                    </div>
                  </div>
                </div>

                <ListGroup className="contact-details">
                  {isAuthenticated && contactData.email && (
                    <ListGroup.Item className="contact-item email-item">
                      <div className="icon-container">
                        <FaEnvelope className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Email</div>
                        <a href={`mailto:${contactData.email}`} className="value">
                          {contactData.email}
                        </a>
                      </div>
                    </ListGroup.Item>
                  )}

                  {isAuthenticated && contactData.phone && (
                    <ListGroup.Item className="contact-item phone-item">
                      <div className="icon-container">
                        <FaPhone className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Phone</div>
                        <a href={`tel:${contactData.phone}`} className="value">
                          {contactData.phone}
                        </a>
                      </div>
                    </ListGroup.Item>
                  )}

                  {contactData.website && (
                    <ListGroup.Item className="contact-item website-item">
                      <div className="icon-container">
                        <FaGlobe className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Website</div>
                        <a href={contactData.website} target="_blank" rel="noopener noreferrer" className="value">
                          {contactData.website}
                        </a>
                      </div>
                    </ListGroup.Item>
                  )}

                  {contactData.address && (
                    <ListGroup.Item className="contact-item address-item">
                      <div className="icon-container">
                        <FaMapMarkerAlt className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Address</div>
                        <div className="value">{contactData.address}</div>
                      </div>
                    </ListGroup.Item>
                  )}

                  {isAuthenticated && contactData.identificationNumber && (
                    <ListGroup.Item className="contact-item id-item">
                      <div className="icon-container">
                        <FaIdCard className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">ID Number</div>
                        <div className="value">{contactData.identificationNumber}</div>
                      </div>
                    </ListGroup.Item>
                  )}

                  {isAuthenticated && contactData.taxNumber && (
                    <ListGroup.Item className="contact-item tax-item">
                      <div className="icon-container">
                        <FaFileInvoiceDollar className="contact-icon" />
                      </div>
                      <div className="contact-info">
                        <div className="label">Tax Number</div>
                        <div className="value">{contactData.taxNumber}</div>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>

                {contactData.bio && (
                  <div className="bio-section">
                    <h4>About</h4>
                    <p>{contactData.bio}</p>
                  </div>
                )}

                {contactData.socialLinks && (
                  <div className="social-links">
                    <h4>Social Media</h4>
                    <div className="social-icons">
                      {contactData.socialLinks.linkedin && (
                        <a 
                          href={contactData.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-icon linkedin"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                      {contactData.socialLinks.twitter && (
                        <a 
                          href={contactData.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-icon twitter"
                        >
                          <FaTwitter />
                        </a>
                      )}
                      {contactData.socialLinks.github && (
                        <a 
                          href={contactData.socialLinks.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-icon github"
                        >
                          <FaGithub />
                        </a>
                      )}
                      {contactData.socialLinks.instagram && (
                        <a 
                          href={contactData.socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-icon instagram"
                        >
                          <FaInstagram />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="action-buttons">
                  <Button 
                    variant="primary" 
                    className="action-button"
                    onClick={copyContactInfo}
                  >
                    {copied ? <FaCheck /> : <FaCopy />}
                    {copied ? 'Copied!' : 'Copy Contact'}
                  </Button>
                  <Button 
                    variant="success" 
                    className="action-button"
                    onClick={downloadVCard}
                  >
                    <FaDownload />
                    Download vCard
                  </Button>
                </div>
              </>
            )}

            {activeTab === 'share' && (
              <div className="share-tab">
                <div className="qr-section">
                  <h4>Scan QR Code</h4>
                  <div className="qr-container">
                    <QRCode 
                      value={window.location.href} 
                      size={200} 
                      level="H"
                      includeMargin={true}
                      className="qr-code"
                    />
                  </div>
                  <p className="qr-instructions">
                    Scan this QR code with your smartphone to view the contact card
                  </p>
                </div>

                <div className="share-buttons">
                  <Button 
                    variant="primary" 
                    className="share-button"
                    onClick={shareContactCard}
                  >
                    <FaShare />
                    Share Contact Card
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'bank' && isAuthenticated && (
              <div className="bank-accounts-section">
                <h4>Bank Accounts</h4>
                {contactData.bankAccounts && contactData.bankAccounts.map((account, index) => (
                  <div key={index} className="bank-account-item">
                    <div className="bank-header">
                      <FaUniversity className="bank-icon" />
                      <h5>{account.bankName}</h5>
                    </div>
                    <div className="bank-details">
                      <div className="bank-detail">
                        <span className="detail-label">Account Type:</span>
                        <span className="detail-value">{account.accountType}</span>
                      </div>
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
          </div>

          <div className="card-footer">
            <div className="powered-by">
              Powered by <span className="brand">InfoCrypting</span>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default ContactCard; 